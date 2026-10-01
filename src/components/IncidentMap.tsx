import { useEffect, useRef } from 'react'
import L from 'leaflet'
import { MAP_OPTIONS, MAP_TILE_URL } from '../constants'
import type { Coordinates } from '../types'
import { useLanguage } from '../LanguageContext'

export function IncidentMap({ active, pin, onPinChange }: { active: boolean; pin: Coordinates | null; onPinChange: (pin: Coordinates) => void }) {
  const { t } = useLanguage()
  const elementRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.CircleMarker | null>(null)
  const onPinChangeRef = useRef(onPinChange)

  useEffect(() => {
    onPinChangeRef.current = onPinChange
  }, [onPinChange])

  useEffect(() => {
    if (!active || !elementRef.current) return
    const map = L.map(elementRef.current, { scrollWheelZoom: false }).setView([MAP_OPTIONS.latitude, MAP_OPTIONS.longitude], MAP_OPTIONS.zoom)
    L.tileLayer(MAP_TILE_URL, {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)
    map.on('click', (event: L.LeafletMouseEvent) => {
      onPinChangeRef.current({ lat: event.latlng.lat, lng: event.latlng.lng })
    })
    mapRef.current = map
    window.requestAnimationFrame(() => map.invalidateSize())
    return () => {
      map.remove()
      mapRef.current = null
      markerRef.current = null
    }
  }, [active])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    if (!pin) {
      markerRef.current?.remove()
      markerRef.current = null
      return
    }
    const position: L.LatLngExpression = [pin.lat, pin.lng]
    if (markerRef.current) markerRef.current.setLatLng(position)
    else markerRef.current = L.circleMarker(position, { radius: 9, color: '#fffefa', weight: 3, fillColor: '#d96958', fillOpacity: 1 }).addTo(map)
    map.panTo(position)
  }, [pin, active])

  return <div className="incident-map-frame"><div ref={elementRef} className="incident-map" role="application" aria-label={t('report.mapHint')} /><span className="map-picker-hint">{t('report.mapHint')}</span></div>
}
