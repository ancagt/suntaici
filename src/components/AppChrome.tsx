import { ArrowUpRight, Bell, ChevronDown, Clock3, HeartHandshake, Menu, Phone, ShieldAlert, Siren, Sparkles, X } from 'lucide-react'
import staticData from '../data.json'
import { NAVIGATION_ITEMS } from '../constants'
import { useLanguage } from '../LanguageContext'
import type { TranslationKey } from '../translations'
import { LanguageToggle } from './LanguageToggle'
import { useState } from 'react'
import type { Contact, View } from '../types'
import { phoneHref } from '../utils'

type ChromeProps = { view: View; contact: Contact; profilePicture: string; onNavigate: (view: View) => void }

export function Sidebar({ view, contact, profilePicture, onNavigate }: ChromeProps) {
  const { t } = useLanguage()
  return <aside className="sidebar">
    <a className="brand" href="#home" onClick={() => onNavigate('home')} aria-label="SuntAici home"><span className="brand-mark"><HeartHandshake size={21} strokeWidth={2.2} /></span><span>SuntAici<span className="brand-period">.</span></span></a>
    <div className="side-label">{t('sidebar.space')}</div>
    <nav className="primary-nav" aria-label={t('sidebar.mainNav')}>{NAVIGATION_ITEMS.map(({ id, labelKey, icon: Icon }) => { const label = t(labelKey); return <button className={`nav-item ${view === id ? 'active' : ''}`} key={id} title={label} aria-label={label} onClick={() => onNavigate(id)}><Icon size={18} strokeWidth={1.9} /><span>{label}</span>{id === 'community' && <span className="nav-count">8</span>}</button> })}</nav>
    <div className="sidebar-bottom"><div className="circle-note"><div className="note-icon"><ShieldAlert size={19} /></div><p>{t('sidebar.circleTitle')}</p><span>{t('sidebar.circleText')}</span></div><button className="profile-mini" onClick={() => onNavigate('profile')}><img src={profilePicture} alt={t('profile.uploadPhotoLabel')} /><span><strong>{contact.name}</strong><small>{t('sidebar.viewProfile')}</small></span><ChevronDown size={15} /></button></div>
  </aside>
}

export function Topbar({ view, profilePicture, onNavigate }: ChromeProps) {
  const { language, t } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false)
  const today = new Intl.DateTimeFormat(language === 'ro' ? 'ro-RO' : 'en-GB', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())
  const pageLabel = t((view === 'home' ? 'topbar.home' : view === 'community' ? 'topbar.community' : view === 'report' ? 'topbar.report' : 'topbar.profile') as TranslationKey)
  return <>
    <header className="topbar">
      <button className="mobile-menu-button" type="button" aria-label={t(menuOpen ? 'nav.closeMenu' : 'nav.openMenu')} aria-expanded={menuOpen} aria-controls="mobile-menu-panel" onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X size={19} /> : <Menu size={19} />}</button>
      <button className="mobile-brand" onClick={() => onNavigate('home')}><HeartHandshake size={20} /> SuntAici<span>.</span></button>
      <div className="breadcrumb"><span>{today}</span><span className="breadcrumb-dot">/</span><strong>{pageLabel}</strong></div>
      <LanguageToggle />
      <div className="top-actions"><button className="icon-button notification-button" aria-label={t('topbar.notifications')}><Bell size={18} /><i /></button><button className="header-avatar" onClick={() => onNavigate('profile')} aria-label={t('topbar.openProfile')}><img src={profilePicture} alt="" /></button></div>
    </header>
    {menuOpen && <>
      <button className="mobile-menu-backdrop" type="button" aria-label={t('nav.closeMenu')} onClick={() => setMenuOpen(false)} />
      <nav id="mobile-menu-panel" className="mobile-menu-panel" aria-label={t('nav.mobileMenu')}>
        {NAVIGATION_ITEMS.map(({ id, labelKey, icon: Icon }) => <button className={`mobile-menu-link ${view === id ? 'active' : ''}`} key={id} onClick={() => { onNavigate(id); setMenuOpen(false) }}><Icon size={18} /><span>{t(labelKey)}</span></button>)}
      </nav>
    </>}
  </>
}

export function QuickAccess({ contact, onNavigate }: Pick<ChromeProps, 'contact' | 'onNavigate'>) {
  const { t } = useLanguage()
  return <aside className="right-rail">
    <div className="rail-heading"><span className="eyebrow">{t('quick.heading')}</span><span className="rail-status"><i /> {t('quick.ready')}</span></div>
    <section className="emergency-panel"><div className="emergency-title"><div className="emergency-icon"><Siren size={19} /></div><span>{t('quick.emergency')}</span></div><p>{t('quick.emergencyCopy')}</p>{staticData.emergencyNumbers.map((item) => <a className={`emergency-number ${item.number === '112' ? 'primary' : ''}`} href={phoneHref(item.number)} key={item.number}><span className="number-copy"><strong>{item.number}</strong><small>{t(item.labelKey as TranslationKey)}</small><small className="number-detail">{t(item.detailKey as TranslationKey)}</small></span><span className="call-arrow"><ArrowUpRight size={16} /></span></a>)}<div className="emergency-footnote">{t('quick.saveNumbers')}</div></section>
    <section className="trusted-rail"><div className="rail-section-title"><span className="eyebrow">{t('quick.safetyNet')}</span><button className="quiet-icon" onClick={() => onNavigate('profile')} aria-label={t('quick.editContact')}><ArrowUpRight size={15} /></button></div><div className="rail-person"><div className="rail-person-avatar">{contact.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div><div><strong>{contact.name}</strong><span>{contact.relationship || t('quick.trustedPerson')}</span></div></div><a href={phoneHref(contact.phone)} className="rail-call"><Phone size={16} /> {t('quick.callPerson')}</a><div className="reminder-line"><Clock3 size={15} /><span>{t('quick.reminder')}</span><span className="reminder-off">{t('quick.demo')}</span></div><p className="rail-disclaimer">{t('quick.reminderDisclaimer')}</p></section>
    <section className="safety-tip"><div className="tip-spark"><Sparkles size={17} /></div><span className="eyebrow">{t('quick.smallReminder')}</span><p>{t('quick.instincts')}</p><div className="tip-rule" /></section><div className="rail-footer"><a href="tel:112"><Siren size={14} /> {t('quick.call112')}</a><span>{t('quick.demoLabel')}</span></div>
  </aside>
}

export function MobileNavigation({ view, onNavigate }: Pick<ChromeProps, 'view' | 'onNavigate'>) {
  const { t } = useLanguage()
  return <nav className="mobile-nav" aria-label={t('sidebar.mainNav')}>{NAVIGATION_ITEMS.map(({ id, labelKey, icon: Icon }) => <button className={view === id ? 'active' : ''} key={id} onClick={() => onNavigate(id)}><Icon size={19} /><span>{t(labelKey)}</span></button>)}</nav>
}
