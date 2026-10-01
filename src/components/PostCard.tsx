import { ArrowUpRight, Heart, MapPin, Menu, MessageCircle, Shirt } from 'lucide-react'
import type { Post } from '../types'
import { useLanguage } from '../LanguageContext'

export function PostCard({ post, onLike }: { post: Post; onLike: () => void }) {
  const { t } = useLanguage()
  const description = post.id === 1 ? t('post.maraDescription') : post.id === 2 ? t('post.ioanaDescription') : post.description
  const outfit = post.id === 1 ? t('post.maraOutfit') : post.id === 2 ? t('post.ioanaOutfit') : post.outfit
  const time = post.id === 1 ? t('post.maraTime') : post.id === 2 ? t('post.ioanaTime') : post.time === 'just now' ? t('post.justNow') : post.time
  const location = post.id === 1 ? t('post.maraLocation') : post.id === 2 ? t('post.ioanaLocation') : post.location
  return <article className="post-card">
    <div className="post-photo-wrap"><img className="post-photo" src={post.image} alt={`${post.name}'s outfit check-in`} /><span className="photo-tag"><MapPin size={12} /> {t('post.nearYou')}</span></div>
    <div className="post-content">
      <div className="post-person"><div className={`post-avatar ${post.name === 'You' ? 'your-avatar' : ''}`}>{post.name === 'You' ? 'AM' : post.name.split(' ').map((part) => part[0]).join('')}</div><div><strong>{post.name === 'You' ? t('post.you') : post.name}</strong><span>{time} <i>·</i> {location}</span></div><button className="quiet-icon more-button" aria-label={t('post.moreOptions')}><Menu size={16} /></button></div>
      <p className="post-description">{description}</p>
      <div className="outfit-detail"><Shirt size={14} /><span>{outfit}</span></div>
      <div className="post-actions"><button className={post.liked ? 'liked' : ''} onClick={onLike}><Heart size={16} fill={post.liked ? 'currentColor' : 'none'} /> {post.likes} <span>{t('post.support')}</span></button><button><MessageCircle size={16} /> <span>{t('post.kindNote')}</span></button><button className="share-post" aria-label={t('post.share')}><ArrowUpRight size={16} /></button></div>
    </div>
  </article>
}
