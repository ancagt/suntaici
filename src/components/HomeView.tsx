import { ArrowRight, ArrowUpRight, Check, LocateFixed, ShieldCheck } from 'lucide-react'
import { PlacesPanel } from './PlacesPanel'
import { PostCard } from './PostCard'
import type { Place, Post } from '../types'
import { useLanguage } from '../LanguageContext'

type HomeViewProps = {
  active: boolean
  checkedInAt: Date | null
  posts: Post[]
  places: Place[]
  locationLabel: string
  locating: boolean
  onCheckIn: () => void
  onNavigateCommunity: () => void
  onFindLocation: () => void
  onLike: (id: number) => void
}

export function HomeView({ active, checkedInAt, posts, places, locationLabel, locating, onCheckIn, onNavigateCommunity, onFindLocation, onLike }: HomeViewProps) {
  const { language, t } = useLanguage()
  const checkinTime = checkedInAt?.toLocaleTimeString(language === 'ro' ? 'ro-RO' : 'en-GB', { hour: '2-digit', minute: '2-digit' })
  return <div hidden={!active}>
    <section className="welcome-row">
      <div><div className="eyebrow"><span className="live-dot" /> {t('home.eyebrow')}</div><h1>{t('home.titleStart')} <em>{t('home.titleEnd')}</em></h1><p className="welcome-copy">{t('home.copy')}</p></div>
      <button className="checkin-button" onClick={onCheckIn}><Check size={17} /> {t('home.safeNow')}</button>
    </section>
    <section className="checkin-banner" aria-label={t('home.checkinRegion')}>
      <div className="banner-icon"><ShieldCheck size={23} /></div>
      <div className="banner-copy"><span className="banner-kicker">{t('home.dailyCheckin')}</span><h2>{checkedInAt ? t('home.checkedTitle') : t('home.checkinTitle')}</h2><p>{checkedInAt ? `${t('home.lastCheckin')} ${checkinTime}.` : t('home.oneTap')} <span>{t('home.emergencyReminder')}</span></p></div>
      <button className="banner-button" onClick={onCheckIn}>{checkedInAt ? t('home.checkinAgain') : t('home.checkin')} <ArrowRight size={16} /></button><div className="banner-decoration" aria-hidden="true">S</div>
    </section>
    <div className="section-heading"><div><span className="eyebrow">{t('home.communityEyebrow')}</span><h2>{t('home.aroundCircle')}</h2></div><button className="text-link" onClick={onNavigateCommunity}>{t('home.seeAll')} <ArrowUpRight size={15} /></button></div>
    <div className="post-grid">{posts.slice(0, 2).map((post) => <PostCard key={post.id} post={post} onLike={() => onLike(post.id)} />)}</div>
    <div className="section-heading services-heading"><div><span className="eyebrow">{t('home.aroundYou')}</span><h2>{t('home.places')}</h2></div><button className="text-link" onClick={onFindLocation}><LocateFixed size={15} /> {locating ? t('home.findingLocation') : t('home.useLocation')}</button></div>
    <PlacesPanel places={places} locationLabel={locationLabel} />
  </div>
}
