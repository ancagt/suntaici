import { createServer } from 'node:http'
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { extname, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const port = Number(process.env.PORT || process.env.API_PORT || 3001)
const distDirectory = resolve(fileURLToPath(new URL('../dist', import.meta.url)))
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
}
const places = [
  { id: 'police', category: 'Police', name: 'Secția 1 Poliție București', address: 'Strada Ion Neculce 6', distance: '0.8 km', query: 'police station' },
  { id: 'hospital', category: 'Hospital', name: 'Spitalul Universitar de Urgență', address: 'Splaiul Independenței 169', distance: '1.4 km', query: 'hospital' },
  { id: 'clinic', category: 'Clinic', name: 'Spitalul Clinic Filantropia', address: 'Bulevardul Ion Mihalache 11', distance: '2.1 km', query: 'gynecology clinic' },
  { id: 'pharmacy', category: 'Pharmacy', name: 'Farmacie (exemplu)', address: 'Calea Victoriei, București', distance: '0.7 km', query: 'pharmacy' },
]

let lastCheckIn = null

function sendJson(response, status, body) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  })
  response.end(JSON.stringify(body))
}

async function sendAppFile(request, response) {
  let pathname
  try {
    pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
  } catch {
    sendJson(response, 400, { error: 'Invalid URL.' })
    return
  }

  const candidate = resolve(distDirectory, `.${pathname}`)
  if (candidate !== distDirectory && !candidate.startsWith(`${distDirectory}${sep}`)) {
    sendJson(response, 404, { error: 'Not found.' })
    return
  }

  let filePath = candidate
  let fileInfo
  try {
    fileInfo = await stat(filePath)
    if (fileInfo.isDirectory()) {
      filePath = resolve(filePath, 'index.html')
      fileInfo = await stat(filePath)
    }
  } catch {
    filePath = resolve(distDirectory, 'index.html')
    try {
      fileInfo = await stat(filePath)
    } catch {
      sendJson(response, 404, { error: 'Application build not found.' })
      return
    }
  }

  if (!fileInfo.isFile()) {
    sendJson(response, 404, { error: 'Not found.' })
    return
  }

  const extension = extname(filePath)
  response.writeHead(200, {
    'Content-Type': contentTypes[extension] || 'application/octet-stream',
    'Cache-Control': extension === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
  })
  if (request.method === 'HEAD') response.end()
  else createReadStream(filePath).pipe(response)
}

const server = createServer((request, response) => {
  if (request.method === 'GET' && request.url === '/api/health') {
    sendJson(response, 200, { ok: true, service: 'suntaici-api' })
    return
  }

  if (request.method === 'GET' && request.url === '/api/places') {
    sendJson(response, 200, { places, source: 'sample-data' })
    return
  }

  if (request.method === 'GET' && request.url === '/api/status') {
    sendJson(response, 200, { lastCheckIn, persisted: false, notificationConfigured: false })
    return
  }

  if (request.method === 'POST' && request.url === '/api/check-in') {
    let body = ''
    request.on('data', (chunk) => {
      body += chunk
      if (body.length > 4096) request.destroy()
    })
    request.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}')
        const checkedInAt = new Date(payload.checkedInAt || Date.now())
        if (Number.isNaN(checkedInAt.getTime())) {
          sendJson(response, 400, { error: 'A valid check-in timestamp is required.' })
          return
        }
        lastCheckIn = checkedInAt.toISOString()
        sendJson(response, 200, { checkedInAt: lastCheckIn, persisted: false, notificationSent: false })
      } catch {
        sendJson(response, 400, { error: 'Request body must be valid JSON.' })
      }
    })
    return
  }

  if (request.url.startsWith('/api/')) {
    sendJson(response, 404, { error: 'Not found.' })
    return
  }

  if (request.method === 'GET' || request.method === 'HEAD') {
    sendAppFile(request, response)
    return
  }

  sendJson(response, 404, { error: 'Not found.' })
})

server.listen(port, () => {
  console.log(`SuntAici API listening on http://localhost:${port}`)
})

server.on('error', (error) => {
  console.error('SuntAici API failed to start:', error.message)
  process.exitCode = 1
})

process.on('SIGTERM', () => server.close())
process.on('SIGINT', () => server.close())