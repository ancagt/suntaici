import { Home, ShieldAlert, UserRound, UsersRound } from 'lucide-react'
import type { Contact, Profile, View } from './types'
import type { TranslationKey } from './translations'

export const LANGUAGE_STORAGE_KEY = 'suntaici-language'
export const DEFAULT_LANGUAGE = 'en' as const
export const DEFAULT_LOCATION_LABEL = 'Bucharest, Romania'
export const DEFAULT_CONTACT: Contact = { name: 'Andreea Marin', relationship: 'Sister', phone: '+40 721 555 014' }
export const DEFAULT_CONTACT_DRAFT: Contact = { name: '', relationship: '', phone: '' }
export const DEFAULT_PROFILE: Profile = { height: '168', weight: '60', marks: 'Small crescent tattoo on left wrist' }
export const DEFAULT_PROFILE_PICTURE = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=180&q=80'
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024
export const MAX_EVIDENCE_PHOTOS = 5
export const NOTICE_DURATION_MS = 5000
export const LOCATION_OPTIONS = { timeout: 8000, maximumAge: 300000 }
export const MAP_OPTIONS = { latitude: 44.4268, longitude: 26.1025, zoom: 13 }
export const MAP_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
export const NAVIGATION_ITEMS: { id: View; labelKey: 'nav.home' | 'nav.community' | 'nav.report' | 'nav.profile'; icon: typeof Home }[] = [
  { id: 'home', labelKey: 'nav.home', icon: Home },
  { id: 'community', labelKey: 'nav.community', icon: UsersRound },
  { id: 'report', labelKey: 'nav.report', icon: ShieldAlert },
  { id: 'profile', labelKey: 'nav.profile', icon: UserRound },
]
export const INCIDENT_CATEGORY_OPTIONS: { value: string; labelKey: TranslationKey }[] = [
  { value: 'Sexual harassment', labelKey: 'report.sexualHarassment' },
  { value: 'Physical violence', labelKey: 'report.physicalViolence' },
  { value: 'Threats or intimidation', labelKey: 'report.threats' },
  { value: 'Stalking or unwanted contact', labelKey: 'report.stalking' },
  { value: 'Verbal or emotional abuse', labelKey: 'report.verbalAbuse' },
  { value: 'Other', labelKey: 'report.other' },
]
export const DOMESTIC_RELATIONSHIP_OPTIONS: { value: string; labelKey: TranslationKey }[] = [
  { value: 'Relationship / partner violence', labelKey: 'report.partnerViolence' },
  { value: 'Family violence', labelKey: 'report.familyViolence' },
  { value: 'Caregiver violence', labelKey: 'report.caregiverViolence' },
  { value: 'Former partner', labelKey: 'report.formerPartner' },
  { value: 'Other', labelKey: 'report.other' },
]
