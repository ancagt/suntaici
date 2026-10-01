export type View = 'home' | 'community' | 'profile' | 'report'
export type ReportTab = 'incident' | 'domestic' | 'journal' | 'learn'
export type IncidentSubject = 'For me' | 'For someone I know' | "I don't know them"
export type Coordinates = { lat: number; lng: number }
export type EvidencePhoto = { id: string; name: string; url: string; size: number }
export type IncidentReport = {
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
export type DomesticRecord = {
  id: number
  relationship: string
  description: string
  evidenceCount: number
  photos: EvidencePhoto[]
  createdAt: string
}
export type JournalEntry = { id: number; note: string; createdAt: string }
export type Place = {
  id: string
  category: 'Police' | 'Hospital' | 'Clinic' | 'Pharmacy'
  name: string
  address: string
  distance: string
  query: string
}
export type Post = {
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
export type Contact = { name: string; relationship: string; phone: string }
export type Profile = { height: string; weight: string; marks: string }
