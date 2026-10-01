import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  Camera,
  Check,
  ChevronDown,
  Clock3,
  FileText,
  Heart,
  HeartHandshake,
  Home,
  ImagePlus,
  LocateFixed,
  LockKeyhole,
  MapPin,
  Menu,
  MessageCircle,
  Navigation,
  Phone,
  Pill,
  Plus,
  ShieldAlert,
  ShieldCheck,
  Shirt,
  Siren,
  Sparkles,
  Trash2,
  UserRound,
  UserRoundPlus,
  UsersRound,
  X,
} from 'lucide-react'
import './App.css'

type View = 'home' | 'community' | 'profile' | 'report'
type ReportTab = 'incident' | 'domestic' | 'journal' | 'learn'
type IncidentSubject = 'For me' | 'For someone I know' | "I don't know them"
type Coordinates = { lat: number; lng: number }
type EvidencePhoto = { id: string; name: string; url: string; size: number }
type IncidentReport = {
  id: number
  reportFor: IncidentSubject
  category: string
  description: string
  victimDescription: string
  personDescription: string
  clothing: string
  place: string
  pin: Coordinates | null
  createdAt: string
}
type DomesticRecord = {
  id: number
  relationship: string
  description: string
  evidenceCount: number
  photos: EvidencePhoto[]
  createdAt: string
}
type JournalEntry = { id: number; note: string; createdAt: string }
type Place = {
  id: string
  category: 'Police' | 'Hospital' | 'Clinic' | 'Pharmacy'
  name: string
  address: string
  distance: string
  query: string
}
type Post = {
  id: number
  name: string
  time: string
  location: string
  description: string
  outfit: string
  image: string
  likes: number
  liked: boolean
}
type Contact = { name: string; relationship: string; phone: string }

const samplePlaces: Place[] = [
  { id: 'police', category: 'Police', name: 'Secția 1 Poliție București', address: 'Strada Ion Neculce 6', distance: '0.8 km', query: 'police station' },
  { id: 'hospital', category: 'Hospital', name: 'Spitalul Universitar de Urgență', address: 'Splaiul Independenței 169', distance: '1.4 km', query: 'hospital' },
  { id: 'clinic', category: 'Clinic', name: 'Spitalul Clinic Filantropia', address: 'Bulevardul Ion Mihalache 11', distance: '2.1 km', query: 'gynecology clinic' },
  { id: 'pharmacy', category: 'Pharmacy', name: 'Farmacie (exemplu)', address: 'Calea Victoriei, București', distance: '0.7 km', query: 'pharmacy' },
]

const starterPosts: Post[] = [
  {
    id: 1,
    name: 'Mara Ionescu',
    time: '12 min ago',
    location: 'Bucharest · Aviatorilor',
    description: 'Heading to a late study session. Walking the well-lit route and sharing my look in case we cross paths.',
    outfit: 'Olive trench · cream knit · black loafers · canvas tote',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85',
    likes: 18,
    liked: false,
  },
  {
    id: 2,
    name: 'Ioana Popa',
    time: '38 min ago',
    location: 'Bucharest · Cotroceni',
    description: 'Quick check-in before I catch the tram home. My sister has my live route.',
    outfit: 'Denim jacket · red scarf · white trainers',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=85',
    likes: 12,
    liked: false,
  },
]

const emergencyNumbers = [
  { number: '112', label: 'Emergency services', detail: 'Police · ambulance · fire' },
  { number: '0800 500 333', label: 'Domestic violence helpline', detail: 'Free, national ANES line' },
]

const abuseArticles = [
  { title: 'Financial abuse', type: 'Money and independence', summary: 'A person may control access to money, work, housing, benefits, or create debt in someone else’s name to limit their choices.', sign: 'You may be prevented from seeing accounts, required to account for every purchase, or pressured to hand over income.', support: 'If safe, consider talking with a specialist advocate from a device the other person cannot access.' },
  { title: 'Physical abuse', type: 'Safety and bodily autonomy', summary: 'Physical abuse includes intentional force or threats of force that cause injury, pain, fear, or restrict movement.', sign: 'It can include hitting, pushing, restraint, blocking someone from leaving, or damaging belongings to intimidate.', support: 'If you are in immediate danger, call 112 when it is safe to do so. You deserve care without blame.' },
  { title: 'Sexual abuse', type: 'Consent', summary: 'Sexual contact or activity without freely given consent is abuse. Consent can be withdrawn at any time and is not implied by a relationship.', sign: 'Pressure, threats, unwanted touching, or taking advantage when someone cannot consent are not consent.', support: 'You can seek medical or emotional support whether or not you choose to report what happened.' },
  { title: 'Emotional and psychological abuse', type: 'Dignity and wellbeing', summary: 'Repeated humiliation, intimidation, threats, isolation, or blame can be used to undermine someone’s confidence and autonomy.', sign: 'You might feel afraid to disagree, cut off from people you trust, or constantly responsible for another person’s reactions.', support: 'A trusted person or domestic-violence advocate can help you think through options at your pace.' },
  { title: 'Digital abuse and stalking', type: 'Privacy and control', summary: 'Technology can be used to monitor, threaten, impersonate, or repeatedly contact someone without their consent.', sign: 'Examples include account access without permission, location tracking, repeated unwanted messages, or sharing private images.', support: 'Use a safer device if possible before changing accounts or settings. Sudden changes can sometimes be noticed.' },
  { title: 'Coercive control', type: 'Patterns of control', summary: 'A repeated pattern of controlling behaviour can take away freedom, even when there is no physical assault.', sign: 'This can involve isolation, monitoring, threats, control of money, or dictating everyday choices.', support: 'You do not need to decide on a label before asking for support or making a safety plan.' },
]

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^0-9+]/g, '')}`
}

function App() {
  const [view, setView] = useState<View>('home')
  const [places, setPlaces] = useState(samplePlaces)
  const [posts, setPosts] = useState(starterPosts)
  const [outfit, setOutfit] = useState('')
  const [photo, setPhoto] = useState('')
  const [notice, setNotice] = useState('')
  const [checkedInAt, setCheckedInAt] = useState<Date | null>(null)
  const [locationLabel, setLocationLabel] = useState('Bucharest, Romania')
  const [locating, setLocating] = useState(false)
  const [contact, setContact] = useState<Contact>({ name: 'Andreea Marin', relationship: 'Sister', phone: '+40 721 555 014' })
  const [addingContact, setAddingContact] = useState(false)
  const [contactDraft, setContactDraft] = useState<Contact>({ name: '', relationship: '', phone: '' })
  const [profile, setProfile] = useState({ height: '168', weight: '60', marks: 'Small crescent tattoo on left wrist' })
  const [profilePicture, setProfilePicture] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=180&q=80')
  const [reportTab, setReportTab] = useState<ReportTab>('incident')
  const [reportFor, setReportFor] = useState<IncidentSubject>('For me')
  const [incidentCategory, setIncidentCategory] = useState('Sexual harassment')
  const [incidentDescription, setIncidentDescription] = useState('')
  const [victimDescription, setVictimDescription] = useState('')
  const [personDescription, setPersonDescription] = useState('')
  const [clothingDescription, setClothingDescription] = useState('')
  const [incidentPlace, setIncidentPlace] = useState('')
  const [incidentPin, setIncidentPin] = useState<Coordinates | null>(null)
  const [incidentReports, setIncidentReports] = useState<IncidentReport[]>([])
  const [domesticRelationship, setDomesticRelationship] = useState('Relationship / partner violence')
  const [domesticDescription, setDomesticDescription] = useState('')
  const [evidencePhotos, setEvidencePhotos] = useState<EvidencePhoto[]>([])
  const [domesticRecords, setDomesticRecords] = useState<DomesticRecord[]>([])
  const [journalDraft, setJournalDraft] = useState('')
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])
  const today = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())

  useEffect(() => {
    fetch('/api/places')
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error('API unavailable'))))
      .then((data: { places: Place[] }) => setPlaces(data.places))
      .catch(() => setPlaces(samplePlaces))
  }, [])

  function checkIn() {
    const now = new Date()
    setCheckedInAt(now)
    setNotice('Check-in updated. Your trusted person has not been notified by this demo.')
    fetch('/api/check-in', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ checkedInAt: now.toISOString() }) }).catch(() => undefined)
    window.setTimeout(() => setNotice(''), 5000)
  }

  function publishCheckIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!outfit.trim() && !photo) return
    const post: Post = {
      id: Date.now(),
      name: 'You',
      time: 'just now',
      location: locationLabel,
      description: 'A new community check-in. I am sharing my current look with the circle.',
      outfit: outfit.trim() || 'Outfit details not added',
      image: photo || 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85',
      likes: 0,
      liked: false,
    }
    setPosts((current) => [post, ...current])
    setOutfit('')
    setPhoto('')
    setView('community')
    setNotice('Your check-in has been added to this demo community feed.')
    window.setTimeout(() => setNotice(''), 4000)
  }

  function findMyLocation() {
    if (!navigator.geolocation) {
      setNotice('Location is not available in this browser.')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocationLabel(`${coords.latitude.toFixed(3)}, ${coords.longitude.toFixed(3)}`)
        setLocating(false)
      },
      () => {
        setNotice('Location permission was not granted. Showing sample Bucharest locations.')
        setLocating(false)
        window.setTimeout(() => setNotice(''), 5000)
      },
      { timeout: 8000, maximumAge: 300000 },
    )
  }

  function addContact(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!contactDraft.name.trim() || !contactDraft.phone.trim()) return
    setContact({ ...contactDraft, name: contactDraft.name.trim(), phone: contactDraft.phone.trim() })
    setContactDraft({ name: '', relationship: '', phone: '' })
    setAddingContact(false)
    setNotice('Trusted contact updated for this demo session.')
    window.setTimeout(() => setNotice(''), 4000)
  }

  function uploadProfilePicture(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setNotice('Choose an image file for your profile photo.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setNotice('Choose an image smaller than 5 MB.')
      return
    }
    if (profilePicture.startsWith('blob:')) URL.revokeObjectURL(profilePicture)
    setProfilePicture(URL.createObjectURL(file))
    setNotice('Profile picture updated for this session.')
    window.setTimeout(() => setNotice(''), 4000)
  }

  function saveIncidentReport(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const report: IncidentReport = {
      id: Date.now(),
      reportFor,
      category: incidentCategory,
      description: incidentDescription.trim(),
      victimDescription: victimDescription.trim(),
      personDescription: personDescription.trim(),
      clothing: clothingDescription.trim(),
      place: incidentPlace.trim(),
      pin: incidentPin,
      createdAt: new Date().toISOString(),
    }
    setIncidentReports((current) => [report, ...current])
    setNotice('Incident report saved privately in this browser session. It was not sent or shared.')
    window.setTimeout(() => setNotice(''), 6000)
  }

  function uploadEvidence(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || [])
    event.target.value = ''
    if (!files.length) return
    const accepted: EvidencePhoto[] = []
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setNotice('Only image files can be added as evidence.')
        continue
      }
      if (file.size > 5 * 1024 * 1024) {
        setNotice('Each evidence photo must be smaller than 5 MB.')
        continue
      }
      if (evidencePhotos.length + accepted.length >= 5) {
        setNotice('You can add up to five evidence photos per report.')
        break
      }
      accepted.push({ id: `${Date.now()}-${accepted.length}`, name: file.name, url: URL.createObjectURL(file), size: file.size })
    }
    if (accepted.length) {
      setEvidencePhotos((current) => [...current, ...accepted])
      setNotice('Evidence photos added. They have not been uploaded or shared.')
    }
    window.setTimeout(() => setNotice(''), 6000)
  }

  function removeEvidencePhoto(photo: EvidencePhoto) {
    URL.revokeObjectURL(photo.url)
    setEvidencePhotos((current) => current.filter((item) => item.id !== photo.id))
  }

  function saveDomesticRecord(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!domesticDescription.trim()) return
    const record: DomesticRecord = {
      id: Date.now(),
      relationship: domesticRelationship,
      description: domesticDescription.trim(),
      evidenceCount: evidencePhotos.length,
      photos: evidencePhotos,
      createdAt: new Date().toISOString(),
    }
    setDomesticRecords((current) => [record, ...current])
    setDomesticDescription('')
    setEvidencePhotos([])
    setNotice('Domestic violence record saved privately in this browser session. It was not sent or shared.')
    window.setTimeout(() => setNotice(''), 6000)
  }

  function saveJournalEntry(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!journalDraft.trim()) return
    setJournalEntries((current) => [{ id: Date.now(), note: journalDraft.trim(), createdAt: new Date().toISOString() }, ...current])
    setJournalDraft('')
    setNotice('Journal note saved in this browser session only.')
    window.setTimeout(() => setNotice(''), 5000)
  }

  function toggleLike(id: number) {
    setPosts((current) => current.map((post) => post.id === id ? { ...post, liked: !post.liked, likes: post.likes + (post.liked ? -1 : 1) } : post))
  }

  const navItems: { id: View; label: string; icon: typeof Home }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'community', label: 'Community', icon: UsersRound },
    { id: 'report', label: 'Report', icon: ShieldAlert },
    { id: 'profile', label: 'My profile', icon: UserRound },
  ]

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#home" onClick={() => setView('home')} aria-label="SuntAici home">
          <span className="brand-mark"><HeartHandshake size={21} strokeWidth={2.2} /></span>
          <span>SuntAici<span className="brand-period">.</span></span>
        </a>
        <div className="side-label">YOUR SPACE</div>
        <nav className="primary-nav" aria-label="Main navigation">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button className={`nav-item ${view === id ? 'active' : ''}`} key={id} onClick={() => setView(id)}>
              <Icon size={18} strokeWidth={1.9} />
              <span>{label}</span>
              {id === 'community' && <span className="nav-count">8</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="circle-note">
            <div className="note-icon"><ShieldCheck size={19} /></div>
            <p>Here for one another.</p>
            <span>Small check-ins make a stronger circle.</span>
          </div>
          <button className="profile-mini" onClick={() => setView('profile')}>
            <img src={profilePicture} alt="Your profile" />
            <span><strong>Alexandra M.</strong><small>View profile</small></span>
            <ChevronDown size={15} />
          </button>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <button className="mobile-brand" onClick={() => setView('home')}><HeartHandshake size={20} /> SuntAici<span>.</span></button>
          <div className="breadcrumb"><span>{today}</span><span className="breadcrumb-dot">/</span><strong>{view === 'home' ? 'Your safety space' : view === 'community' ? 'Women supporting women' : view === 'report' ? 'Private safety tools' : 'Your profile'}</strong></div>
          <div className="top-actions">
            <button className="icon-button notification-button" aria-label="Notifications"><Bell size={18} /><i /></button>
            <button className="header-avatar" onClick={() => setView('profile')} aria-label="Open profile"><img src={profilePicture} alt="" /></button>
          </div>
        </header>

        <main className="page-content">
          {view === 'home' && <>
            <section className="welcome-row">
              <div>
                <div className="eyebrow"><span className="live-dot" /> YOUR CIRCLE IS HERE</div>
                <h1>Safer, <em>together.</em></h1>
                <p className="welcome-copy">A little check-in can make a big difference.</p>
              </div>
              <button className="checkin-button" onClick={checkIn}><Check size={17} /> I’m safe right now</button>
            </section>

            <section className="checkin-banner" aria-label="Safety check-in">
              <div className="banner-icon"><ShieldCheck size={23} /></div>
              <div className="banner-copy">
                <span className="banner-kicker">YOUR DAILY CHECK-IN</span>
                <h2>{checkedInAt ? 'You checked in. Glad you’re here.' : 'Let someone know you’re okay.'}</h2>
                <p>{checkedInAt ? `Last checked in at ${checkedInAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.` : 'One tap updates your status on this device.'} <span>In an emergency, call 112.</span></p>
              </div>
              <button className="banner-button" onClick={checkIn}>{checkedInAt ? 'Check in again' : 'Check in'} <ArrowRight size={16} /></button>
              <div className="banner-decoration" aria-hidden="true">S</div>
            </section>

            <div className="section-heading">
              <div><span className="eyebrow">COMMUNITY CHECK-INS</span><h2>Around your circle</h2></div>
              <button className="text-link" onClick={() => setView('community')}>See all <ArrowUpRight size={15} /></button>
            </div>
            <div className="post-grid">
              {posts.slice(0, 2).map((post) => <PostCard key={post.id} post={post} onLike={() => toggleLike(post.id)} />)}
            </div>

            <div className="section-heading services-heading">
              <div><span className="eyebrow">AROUND YOU</span><h2>Places to know</h2></div>
              <button className="text-link" onClick={findMyLocation}><LocateFixed size={15} /> {locating ? 'Finding you...' : 'Use my location'}</button>
            </div>
            <PlacesPanel places={places} locationLabel={locationLabel} />
          </>}

          {view === 'community' && <>
            <section className="page-title-row">
              <div><div className="eyebrow">A CIRCLE THAT SHOWS UP</div><h1>Women, <em>looking out.</em></h1><p className="welcome-copy">Share your look and a little context with your community.</p></div>
              <span className="member-count"><UsersRound size={16} /> 248 nearby</span>
            </section>
            <form className="composer" onSubmit={publishCheckIn}>
              <div className="composer-heading"><div className="composer-avatar">AM</div><div><strong>Share a check-in</strong><span>Only share what feels right for you.</span></div><Sparkles size={18} className="composer-sparkle" /></div>
              <textarea value={outfit} onChange={(event) => setOutfit(event.target.value)} placeholder="What are you wearing? Add colors, shoes, a bag, or anything that helps your circle recognize you." aria-label="Describe your outfit" />
              {photo && <div className="photo-preview"><img src={photo} alt="Selected outfit preview" /><button type="button" className="remove-photo" aria-label="Remove photo" onClick={() => setPhoto('')}><X size={15} /></button></div>}
              <div className="composer-footer"><label className="attach-button"><Plus size={16} /> Add a selfie<input type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) setPhoto(URL.createObjectURL(file)) }} /></label><span className="privacy-hint"><ShieldCheck size={14} /> Your post is visible to this demo community</span><button className="publish-button" type="submit">Share check-in <ArrowRight size={15} /></button></div>
            </form>
            <div className="section-heading feed-heading"><div><span className="eyebrow">LATEST FROM YOUR CIRCLE</span><h2>Community feed</h2></div><button className="filter-button">Nearby <ChevronDown size={15} /></button></div>
            <div className="community-feed">{posts.map((post) => <PostCard key={post.id} post={post} onLike={() => toggleLike(post.id)} />)}</div>
          </>}

          {view === 'report' && <>
            <section className="page-title-row report-title">
              <div><div className="eyebrow">SAFETY AND SUPPORT</div><h1>Your <em>private space.</em></h1><p className="welcome-copy">Record an incident, keep a journal, or learn about types of abuse.</p></div>
              <span className="session-badge"><LockKeyhole size={14} /> Private session</span>
            </section>
            <div className="report-safety-note"><AlertTriangle size={17} /><p><strong>For your safety:</strong> reports, pins, journal notes, and photos stay in this browser session and are not submitted. Map tiles come from OpenStreetMap, which receives requests for the map area you view. Notes are not password-protected; use a device you trust. If you are in immediate danger, call <a href="tel:112">112</a>.</p></div>
            <div className="report-tabs" role="tablist" aria-label="Private safety tools">
              <button role="tab" aria-selected={reportTab === 'incident'} className={reportTab === 'incident' ? 'active' : ''} onClick={() => setReportTab('incident')}><MapPin size={16} /> Flag abuser</button>
              <button role="tab" aria-selected={reportTab === 'domestic'} className={reportTab === 'domestic' ? 'active' : ''} onClick={() => setReportTab('domestic')}><ShieldAlert size={16} /> Domestic violence</button>
              <button role="tab" aria-selected={reportTab === 'journal'} className={reportTab === 'journal' ? 'active' : ''} onClick={() => setReportTab('journal')}><FileText size={16} /> Private journal</button>
              <button role="tab" aria-selected={reportTab === 'learn'} className={reportTab === 'learn' ? 'active' : ''} onClick={() => setReportTab('learn')}><BookOpen size={16} /> Learn about abuse</button>
            </div>

            {reportTab === 'incident' && <section className="report-panel" role="tabpanel">
              <div className="report-panel-heading"><div><span className="eyebrow">PRIVATE INCIDENT NOTE</span><h2>Report an incident</h2><p>Pin a place and describe what happened. This does not identify or notify anyone.</p></div><span className="private-chip"><LockKeyhole size={12} /> Only on this device</span></div>
              <form className="safety-form" onSubmit={saveIncidentReport}>
                <label>Who is this report for?<select value={reportFor} onChange={(event) => setReportFor(event.target.value as IncidentSubject)}><option>For me</option><option>For someone I know</option><option>I don't know them</option></select></label>
                <label>Type of incident<select value={incidentCategory} onChange={(event) => setIncidentCategory(event.target.value)}><option>Sexual harassment</option><option>Physical violence</option><option>Threats or intimidation</option><option>Stalking or unwanted contact</option><option>Verbal or emotional abuse</option><option>Other</option></select></label>
                <div className="form-two-column"><label>Victim description<textarea value={victimDescription} onChange={(event) => setVictimDescription(event.target.value)} placeholder="Optional description of the person harmed" /></label><label>Abuser description<textarea value={personDescription} onChange={(event) => setPersonDescription(event.target.value)} placeholder="Optional description of the person who caused harm" /></label></div>
                <div className="form-two-column"><label>Clothing or appearance<textarea value={clothingDescription} onChange={(event) => setClothingDescription(event.target.value)} placeholder="Optional clothing, colors, or other details" /></label><label>Action description<textarea required value={incidentDescription} onChange={(event) => setIncidentDescription(event.target.value)} placeholder="What happened? Write only what feels safe to record." /></label></div>
                <label>Place or nearby landmark <input value={incidentPlace} onChange={(event) => setIncidentPlace(event.target.value)} placeholder="Optional address or landmark" /></label>
                <div className="map-picker-heading"><div><strong>Pin the place</strong><span>Click the map to add or move a private pin.</span></div>{incidentPin && <button type="button" className="clear-pin" onClick={() => setIncidentPin(null)}><X size={14} /> Remove pin</button>}</div>
                <IncidentMap pin={incidentPin} onPinChange={setIncidentPin} />
                {incidentPin && <p className="pin-coordinates"><MapPin size={13} /> Pin: {incidentPin.lat.toFixed(5)}, {incidentPin.lng.toFixed(5)}</p>}
                <div className="form-submit-row"><span><LockKeyhole size={14} /> Private note. Nothing is submitted.</span><button className="publish-button" type="submit">Save private note <Check size={15} /></button></div>
              </form>
              {incidentReports.length > 0 && <div className="saved-records"><h3>Saved incident notes <span>{incidentReports.length}</span></h3>{incidentReports.map((report) => <article className="saved-record" key={report.id}><div><strong>{report.category} · {report.reportFor}</strong><time>{new Date(report.createdAt).toLocaleString()}</time></div>{report.victimDescription && <p><strong>Victim:</strong> {report.victimDescription}</p>}{report.personDescription && <p><strong>Abuser:</strong> {report.personDescription}</p>}{report.clothing && <p><strong>Clothing:</strong> {report.clothing}</p>}<p><strong>Action:</strong> {report.description}</p><span>{report.place || (report.pin ? `Pinned location: ${report.pin.lat.toFixed(4)}, ${report.pin.lng.toFixed(4)}` : 'No location added')}</span></article>)}</div>}
            </section>}

            {reportTab === 'domestic' && <section className="report-panel" role="tabpanel">
              <div className="report-panel-heading"><div><span className="eyebrow">PRIVATE RECORD KEEPING</span><h2>Domestic violence notes</h2><p>For family, relationship, or caregiver violence. Add evidence only if it is safe.</p></div><span className="private-chip"><LockKeyhole size={12} /> Only on this device</span></div>
              <form className="safety-form" onSubmit={saveDomesticRecord}>
                <label>Relationship to the person<select value={domesticRelationship} onChange={(event) => setDomesticRelationship(event.target.value)}><option>Relationship / partner violence</option><option>Family violence</option><option>Caregiver violence</option><option>Former partner</option><option>Other</option></select></label>
                <label>What would you like to record?<textarea required value={domesticDescription} onChange={(event) => setDomesticDescription(event.target.value)} placeholder="Add dates, what happened, how it affected you, or questions you want to remember." /></label>
                <div className="evidence-uploader"><div><ImagePlus size={18} /><span><strong>Evidence photos</strong><small>Up to 5 images, 5 MB each. Files remain in this session.</small></span></div><label className="attach-button"><Plus size={15} /> Add photos<input type="file" accept="image/*" multiple onChange={uploadEvidence} /></label></div>
                {evidencePhotos.length > 0 && <div className="evidence-grid">{evidencePhotos.map((item) => <figure className="evidence-photo" key={item.id}><img src={item.url} alt={`Evidence: ${item.name}`} /><figcaption title={item.name}>{item.name}</figcaption><button type="button" className="remove-photo" onClick={() => removeEvidencePhoto(item)} aria-label={`Remove ${item.name}`}><Trash2 size={14} /></button></figure>)}</div>}
                <div className="form-submit-row"><span><LockKeyhole size={14} /> Not uploaded or shared.</span><button className="publish-button" type="submit">Save private record <Check size={15} /></button></div>
              </form>
              {domesticRecords.length > 0 && <div className="saved-records"><h3>Saved domestic violence notes <span>{domesticRecords.length}</span></h3>{domesticRecords.map((record) => <article className="saved-record" key={record.id}><div><strong>{record.relationship}</strong><time>{new Date(record.createdAt).toLocaleString()}</time></div><p>{record.description}</p><span>{record.evidenceCount} evidence {record.evidenceCount === 1 ? 'photo' : 'photos'}</span>{record.photos.length > 0 && <div className="saved-evidence">{record.photos.map((item) => <img key={item.id} src={item.url} alt={`Saved evidence: ${item.name}`} />)}</div>}</article>)}</div>}
            </section>}

            {reportTab === 'journal' && <section className="report-panel" role="tabpanel">
              <div className="report-panel-heading"><div><span className="eyebrow">A SPACE FOR YOUR WORDS</span><h2>Private journal</h2><p>Write what you want to remember, without needing to explain it to anyone.</p></div><span className="private-chip"><LockKeyhole size={12} /> Session only</span></div>
              <form className="safety-form journal-form" onSubmit={saveJournalEntry}><label>Your note<textarea required value={journalDraft} onChange={(event) => setJournalDraft(event.target.value)} placeholder="Write a note to yourself..." /></label><div className="form-submit-row"><span><LockKeyhole size={14} /> Not password-protected or saved after this session.</span><button className="publish-button" type="submit">Save journal note <Check size={15} /></button></div></form>
              {journalEntries.length > 0 ? <div className="journal-entries">{journalEntries.map((entry) => <article className="journal-entry" key={entry.id}><time>{new Date(entry.createdAt).toLocaleString()}</time><p>{entry.note}</p></article>)}</div> : <div className="journal-empty"><FileText size={20} /><p>Your saved notes will appear here for this session.</p></div>}
            </section>}

            {reportTab === 'learn' && <section className="report-panel education-panel" role="tabpanel">
              <div className="report-panel-heading"><div><span className="eyebrow">INFORMATION AND SUPPORT</span><h2>Abuse can take many forms</h2><p>Explore common patterns. You do not need to label an experience before seeking support.</p></div></div>
              <div className="education-grid">{abuseArticles.map((article) => <details className="education-article" key={article.title}><summary><span><small>{article.type}</small><strong>{article.title}</strong></span><ChevronDown size={17} /></summary><p>{article.summary}</p><div><strong>Possible signs</strong><p>{article.sign}</p></div><div><strong>Support option</strong><p>{article.support}</p></div></details>)}</div>
              <div className="support-resources"><Siren size={17} /><p><strong>In immediate danger?</strong> Call <a href="tel:112">112</a>. Romania’s free national domestic violence helpline: <a href="tel:0800500333">0800 500 333</a>.</p></div>
            </section>}
          </>}

          {view === 'profile' && <>
            <section className="page-title-row profile-title">
              <div><div className="eyebrow">YOUR DETAILS, YOUR CHOICE</div><h1>Your <em>profile.</em></h1><p className="welcome-copy">Add details that could help someone identify you if needed.</p></div>
              <span className="session-badge"><ShieldCheck size={15} /> Demo session only</span>
            </section>
            <div className="profile-layout">
              <section className="profile-card">
                <div className="profile-card-heading"><div><span className="eyebrow">IDENTIFYING DETAILS</span><h2>About you</h2></div><button className="quiet-icon" aria-label="Edit profile"><Menu size={17} /></button></div>
                <div className="profile-identity"><div className="profile-photo-control"><img src={profilePicture} alt="Your profile" /><label className="profile-photo-button"><Camera size={13} /> Upload photo<input type="file" accept="image/*" onChange={uploadProfilePicture} /></label></div><div><h3>Alexandra Miron</h3><span>Bucharest, Romania</span></div><span className="verified-tag"><Check size={13} /> You</span></div>
                <div className="profile-fields">
                  <label>Height <div className="input-with-unit"><input type="number" min="80" max="250" value={profile.height} onChange={(event) => setProfile({ ...profile, height: event.target.value })} /><span>cm</span></div></label>
                  <label>Weight <div className="input-with-unit"><input type="number" min="20" max="300" value={profile.weight} onChange={(event) => setProfile({ ...profile, weight: event.target.value })} /><span>kg</span></div></label>
                  <label className="full-field">Identifiable marks <textarea value={profile.marks} onChange={(event) => setProfile({ ...profile, marks: event.target.value })} placeholder="Tattoos, birthmarks, scars..." /></label>
                </div>
                <div className="data-note"><ShieldCheck size={16} /><span>Prototype only: these details stay in this browser session. Do not enter sensitive information in this demo.</span></div>
              </section>
              <section className="profile-card trusted-card">
                <div className="profile-card-heading"><div><span className="eyebrow">YOUR PEOPLE</span><h2>Trusted contact</h2></div><span className="contact-count">01</span></div>
                <div className="trusted-person"><div className="contact-avatar"><Heart size={20} fill="currentColor" /></div><div className="contact-info"><strong>{contact.name}</strong><span>{contact.relationship || 'Trusted person'}</span><a href={`tel:${contact.phone.replace(/[^ -]/g, '')}`}>{contact.phone}</a></div><a className="call-contact" href={phoneHref(contact.phone)} aria-label={`Call ${contact.name}`}><PhoneIcon /></a></div>
                <div className="alert-setting"><div className="alert-setting-icon"><Clock3 size={17} /></div><div><strong>16-hour check-in reminder</strong><p>Reminder preference shown for this demo. No background monitoring or alerts are active.</p></div><span className="toggle-demo" aria-label="Reminder setting preview"><i /></span></div>
                <button className="add-contact-button" onClick={() => setAddingContact((value) => !value)}>{addingContact ? <X size={16} /> : <UserRoundPlus size={16} />}{addingContact ? 'Cancel' : 'Update trusted contact'}</button>
                {addingContact && <form className="contact-form" onSubmit={addContact}><label>Name<input required value={contactDraft.name} onChange={(event) => setContactDraft({ ...contactDraft, name: event.target.value })} placeholder="Full name" /></label><label>Relationship<input value={contactDraft.relationship} onChange={(event) => setContactDraft({ ...contactDraft, relationship: event.target.value })} placeholder="Friend, sister..." /></label><label>Phone number<input required type="tel" value={contactDraft.phone} onChange={(event) => setContactDraft({ ...contactDraft, phone: event.target.value })} placeholder="+40 ..." /></label><button className="publish-button" type="submit">Save for this session <Check size={15} /></button></form>}
              </section>
            </div>
          </>}
        </main>
      </div>

      <aside className="right-rail">
        <div className="rail-heading"><span className="eyebrow">QUICK ACCESS</span><span className="rail-status"><i /> READY</span></div>
        <section className="emergency-panel">
          <div className="emergency-title"><div className="emergency-icon"><Siren size={19} /></div><span>Emergency numbers</span></div>
          <p>For immediate danger, call emergency services.</p>
          {emergencyNumbers.map((item) => <a className={`emergency-number ${item.number === '112' ? 'primary' : ''}`} href={phoneHref(item.number)} key={item.number}><span className="number-copy"><strong>{item.number}</strong><small>{item.label}</small><small className="number-detail">{item.detail}</small></span><span className="call-arrow"><ArrowUpRight size={16} /></span></a>)}
          <div className="emergency-footnote">Save these numbers before you need them.</div>
        </section>

        <section className="trusted-rail">
          <div className="rail-section-title"><span className="eyebrow">YOUR SAFETY NET</span><button className="quiet-icon" onClick={() => setView('profile')} aria-label="Edit trusted contact"><ArrowUpRight size={15} /></button></div>
          <div className="rail-person"><div className="rail-person-avatar">{contact.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div><div><strong>{contact.name}</strong><span>{contact.relationship || 'Trusted person'}</span></div></div>
          <a href={phoneHref(contact.phone)} className="rail-call"><PhoneIcon /> Call your person</a>
          <div className="reminder-line"><Clock3 size={15} /><span>16-hour reminder</span><span className="reminder-off">Demo</span></div>
          <p className="rail-disclaimer">A real inactivity alert needs your permission, an installed app, and a configured notification service.</p>
        </section>

        <section className="safety-tip"><div className="tip-spark"><Sparkles size={17} /></div><span className="eyebrow">A SMALL REMINDER</span><p>Trust your instincts. You never owe anyone a reason to leave.</p><div className="tip-rule" /></section>
        <div className="rail-footer"><a href="tel:112"><Siren size={14} /> In immediate danger? Call 112</a><span>Romania · SuntAici demo</span></div>
      </aside>

      <nav className="mobile-nav" aria-label="Mobile navigation">{navItems.map(({ id, label, icon: Icon }) => <button className={view === id ? 'active' : ''} key={id} onClick={() => setView(id)}><Icon size={19} /><span>{label}</span></button>)}</nav>
      {notice && <div className="toast" role="status"><Check size={16} />{notice}<button onClick={() => setNotice('')} aria-label="Dismiss notice"><X size={15} /></button></div>}
    </div>
  )
}

function IncidentMap({ pin, onPinChange }: { pin: Coordinates | null; onPinChange: (pin: Coordinates) => void }) {
  const elementRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.CircleMarker | null>(null)
  const onPinChangeRef = useRef(onPinChange)

  useEffect(() => {
    onPinChangeRef.current = onPinChange
  }, [onPinChange])

  useEffect(() => {
    if (!elementRef.current) return
    const map = L.map(elementRef.current, { scrollWheelZoom: false }).setView([44.4268, 26.1025], 13)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
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
  }, [])

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
  }, [pin])

  return <div className="incident-map-frame"><div ref={elementRef} className="incident-map" role="application" aria-label="Map picker. Click a location to place a private pin." /><span className="map-picker-hint">Click the map to place a private pin.</span></div>
}

function PostCard({ post, onLike }: { post: Post; onLike: () => void }) {
  return <article className="post-card">
    <div className="post-photo-wrap"><img className="post-photo" src={post.image} alt={`${post.name}'s outfit check-in`} /><span className="photo-tag"><MapPin size={12} /> Near you</span></div>
    <div className="post-content">
      <div className="post-person"><div className={`post-avatar ${post.name === 'You' ? 'your-avatar' : ''}`}>{post.name === 'You' ? 'AM' : post.name.split(' ').map((part) => part[0]).join('')}</div><div><strong>{post.name}</strong><span>{post.time} <i>·</i> {post.location}</span></div><button className="quiet-icon more-button" aria-label="More post options"><Menu size={16} /></button></div>
      <p className="post-description">{post.description}</p>
      <div className="outfit-detail"><Shirt size={14} /><span>{post.outfit}</span></div>
      <div className="post-actions"><button className={post.liked ? 'liked' : ''} onClick={onLike}><Heart size={16} fill={post.liked ? 'currentColor' : 'none'} /> {post.likes} <span>support</span></button><button><MessageCircle size={16} /> <span>Send a kind note</span></button><button className="share-post" aria-label="Share post"><ArrowUpRight size={16} /></button></div>
    </div>
  </article>
}

function PlacesPanel({ places, locationLabel }: { places: Place[]; locationLabel: string }) {
  return <section className="places-panel">
    <div className="map-panel">
      <div className="map-label"><MapPin size={13} /> {locationLabel}</div>
      <div className="map-grid" aria-hidden="true"><div className="map-park park-one" /><div className="map-park park-two" /><div className="map-water" /><div className="map-road road-one" /><div className="map-road road-two" /><div className="map-road road-three" /><div className="map-road road-four" /><span className="map-street street-one">CALEA VICTORIEI</span><span className="map-street street-two">BD. DACIA</span><span className="map-street street-three">STR. ION NECULCE</span><span className="map-marker marker-police"><span><Siren size={14} /></span></span><span className="map-marker marker-hospital"><span><Heart size={14} /></span></span><span className="map-marker marker-clinic"><span><Plus size={15} /></span></span><span className="map-marker marker-pharmacy"><span><Pill size={14} /></span></span><span className="map-you"><i /></span></div>
      <span className="map-caption">Illustrative map · sample locations</span>
    </div>
    <div className="place-list"><div className="place-list-top"><strong>Nearby services</strong><span>Sample results</span></div>
      {places.map((place) => <div className="place-row" key={place.id}><div className={`place-icon ${place.category.toLowerCase()}`}>{place.category === 'Police' ? <Siren size={16} /> : place.category === 'Hospital' ? <Heart size={16} /> : place.category === 'Pharmacy' ? <Pill size={16} /> : <Plus size={17} />}</div><div className="place-info"><strong>{place.name}</strong><span>{place.address}</span></div><div className="place-distance">{place.distance}</div><a className="place-directions" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.query} ${place.name} ${locationLabel}`)}`} target="_blank" rel="noreferrer" aria-label={`Directions to ${place.name}`}><Navigation size={15} /></a></div>)}
      <p className="place-disclaimer">Sample listings only. Confirm opening hours and location before travelling.</p>
    </div>
  </section>
}

function PhoneIcon() {
  return <Phone size={16} />
}

export default App