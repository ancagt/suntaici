import type { FormEventHandler, Dispatch, SetStateAction } from 'react'
import { ArrowRight, ChevronDown, Plus, ShieldCheck, Sparkles, UsersRound, X } from 'lucide-react'
import { PostCard } from './PostCard'
import type { Post } from '../types'
import { useLanguage } from '../LanguageContext'

type CommunityViewProps = {
  active: boolean
  posts: Post[]
  outfit: string
  photo: string
  setOutfit: Dispatch<SetStateAction<string>>
  setPhoto: Dispatch<SetStateAction<string>>
  onPublish: FormEventHandler<HTMLFormElement>
  onLike: (id: number) => void
}

export function CommunityView({ active, posts, outfit, photo, setOutfit, setPhoto, onPublish, onLike }: CommunityViewProps) {
  const { t } = useLanguage()
  return <div hidden={!active}>
    <section className="page-title-row"><div><div className="eyebrow">{t('community.eyebrow')}</div><h1>{t('community.titleStart')} <em>{t('community.titleEnd')}</em></h1><p className="welcome-copy">{t('community.copy')}</p></div><span className="member-count"><UsersRound size={16} /> 248 {t('community.nearbyMembers')}</span></section>
    <form className="composer" onSubmit={onPublish}>
      <div className="composer-heading"><div className="composer-avatar">AM</div><div><strong>{t('community.shareTitle')}</strong><span>{t('community.shareHint')}</span></div><Sparkles size={18} className="composer-sparkle" /></div>
      <textarea value={outfit} onChange={(event) => setOutfit(event.target.value)} placeholder={t('community.outfitPlaceholder')} aria-label={t('community.describeOutfit')} />
      {photo && <div className="photo-preview"><img src={photo} alt={t('community.selectedPhoto')} /><button type="button" className="remove-photo" aria-label={t('community.removePhoto')} onClick={() => setPhoto('')}><X size={15} /></button></div>}
      <div className="composer-footer"><label className="attach-button"><Plus size={16} /> {t('community.addSelfie')}<input type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) setPhoto(URL.createObjectURL(file)) }} /></label><span className="privacy-hint"><ShieldCheck size={14} /> {t('community.postPrivacy')}</span><button className="publish-button" type="submit">{t('community.share')} <ArrowRight size={15} /></button></div>
    </form>
    <div className="section-heading feed-heading"><div><span className="eyebrow">{t('community.latest')}</span><h2>{t('community.feed')}</h2></div><button className="filter-button">{t('community.nearby')} <ChevronDown size={15} /></button></div>
    <div className="community-feed">{posts.map((post) => <PostCard key={post.id} post={post} onLike={() => onLike(post.id)} />)}</div>
  </div>
}
