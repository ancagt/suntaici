import { useEffect, useState, type FormEvent } from 'react'
import { Check, X } from 'lucide-react'
import staticData from './data.json'
import { DEFAULT_CONTACT, DEFAULT_CONTACT_DRAFT, DEFAULT_LOCATION_LABEL, DEFAULT_PROFILE, DEFAULT_PROFILE_PICTURE, MAX_IMAGE_BYTES, NOTICE_DURATION_MS, LOCATION_OPTIONS } from './constants'
import { CommunityView } from './components/CommunityView'
import { HomeView } from './components/HomeView'
import { MobileNavigation, QuickAccess, Sidebar, Topbar } from './components/AppChrome'
import { ProfileView } from './components/ProfileView'
import { ReportCenter } from './components/ReportCenter'
import type { Contact, Place, Post, Profile, View } from './types'
import { useLanguage } from './LanguageContext'
import { translations } from './translations'
import './App.css'
import 'leaflet/dist/leaflet.css'

function App() {
  const { language, t } = useLanguage()
  const [view, setView] = useState<View>('home')
  const [places, setPlaces] = useState<Place[]>(staticData.places as Place[])
  const [posts, setPosts] = useState<Post[]>(staticData.starterPosts as Post[])
  const [outfit, setOutfit] = useState('')
  const [photo, setPhoto] = useState('')
  const [notice, setNotice] = useState('')
  const [checkedInAt, setCheckedInAt] = useState<Date | null>(null)
  const [locationLabel, setLocationLabel] = useState(DEFAULT_LOCATION_LABEL)
  const [locating, setLocating] = useState(false)
  const [contact, setContact] = useState<Contact>(DEFAULT_CONTACT)
  const [addingContact, setAddingContact] = useState(false)
  const [contactDraft, setContactDraft] = useState<Contact>(DEFAULT_CONTACT_DRAFT)
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE)
  const [profilePicture, setProfilePicture] = useState(DEFAULT_PROFILE_PICTURE)

  useEffect(() => {
    fetch('/api/places')
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error('API unavailable'))))
      .then((data: { places: Place[] }) => setPlaces(data.places))
      .catch(() => setPlaces(staticData.places as Place[]))
  }, [])

  useEffect(() => {
    document.documentElement.lang = language
    document.title = translations[language]['app.title']
  }, [language])

  function notify(message: string) {
    setNotice(message)
    window.setTimeout(() => setNotice(''), NOTICE_DURATION_MS)
  }

  function checkIn() {
    const now = new Date()
    setCheckedInAt(now)
    notify(t('app.checkinNotice'))
    fetch('/api/check-in', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ checkedInAt: now.toISOString() }) }).catch(() => undefined)
  }

  function publishCheckIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!outfit.trim() && !photo) return
    const post: Post = {
      id: Date.now(),
      name: 'You',
      time: t('post.justNow'),
      location: locationLabel === DEFAULT_LOCATION_LABEL ? t('data.bucharest') : locationLabel,
      description: t('post.userDescription'),
      outfit: outfit.trim() || t('post.noOutfitDetails'),
      image: photo || 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85',
      likes: 0,
      liked: false,
    }
    setPosts((current) => [post, ...current])
    setOutfit('')
    setPhoto('')
    setView('community')
    notify(t('app.postNotice'))
  }

  function findMyLocation() {
    if (!navigator.geolocation) {
      notify(t('app.locationUnavailable'))
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocationLabel(`${coords.latitude.toFixed(3)}, ${coords.longitude.toFixed(3)}`)
        setLocating(false)
      },
      () => {
        notify(t('app.locationDenied'))
        setLocating(false)
      },
      LOCATION_OPTIONS,
    )
  }

  function addContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!contactDraft.name.trim() || !contactDraft.phone.trim()) return
    setContact({ ...contactDraft, name: contactDraft.name.trim(), phone: contactDraft.phone.trim() })
    setContactDraft(DEFAULT_CONTACT_DRAFT)
    setAddingContact(false)
    notify(t('app.contactSaved'))
  }

  function uploadProfilePicture(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      notify(t('app.imageOnly'))
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      notify(t('app.imageLimit'))
      return
    }
    if (profilePicture.startsWith('blob:')) URL.revokeObjectURL(profilePicture)
    setProfilePicture(URL.createObjectURL(file))
    notify(t('app.profilePhotoSaved'))
  }

  function toggleLike(id: number) {
    setPosts((current) => current.map((post) => post.id === id ? { ...post, liked: !post.liked, likes: post.likes + (post.liked ? -1 : 1) } : post))
  }

  const displayedLocation = locationLabel === DEFAULT_LOCATION_LABEL ? t('data.bucharest') : locationLabel

  return <div className="app-shell">
    <Sidebar view={view} contact={contact} profilePicture={profilePicture} onNavigate={setView} />
    <div className="workspace">
      <Topbar view={view} contact={contact} profilePicture={profilePicture} onNavigate={setView} />
      <main className="page-content">
        <HomeView active={view === 'home'} checkedInAt={checkedInAt} posts={posts} places={places} locationLabel={displayedLocation} locating={locating} onCheckIn={checkIn} onNavigateCommunity={() => setView('community')} onFindLocation={findMyLocation} onLike={toggleLike} />
        <CommunityView active={view === 'community'} posts={posts} outfit={outfit} photo={photo} setOutfit={setOutfit} setPhoto={setPhoto} onPublish={publishCheckIn} onLike={toggleLike} />
        <ReportCenter active={view === 'report'} notify={notify} />
        <ProfileView active={view === 'profile'} contact={contact} contactDraft={contactDraft} setContactDraft={setContactDraft} addingContact={addingContact} onToggleAddContact={() => setAddingContact((value) => !value)} onAddContact={addContact} profile={profile} setProfile={setProfile} profilePicture={profilePicture} onUploadProfilePicture={uploadProfilePicture} />
      </main>
    </div>
    <QuickAccess contact={contact} onNavigate={setView} />
    <MobileNavigation view={view} onNavigate={setView} />
    {notice && <div className="toast" role="status"><Check size={16} />{notice}<button onClick={() => setNotice('')} aria-label={t('app.dismiss')}><X size={15} /></button></div>}
  </div>
}

export default App
