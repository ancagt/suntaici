import type { Dispatch, FormEventHandler, SetStateAction } from 'react'
import { Camera, Check, Heart, Menu, Phone, ShieldCheck, UserRoundPlus, X, Clock3 } from 'lucide-react'
import type { Contact, Profile } from '../types'
import { phoneHref } from '../utils'
import { useLanguage } from '../LanguageContext'

type ProfileViewProps = {
  active: boolean
  contact: Contact
  contactDraft: Contact
  setContactDraft: Dispatch<SetStateAction<Contact>>
  addingContact: boolean
  onToggleAddContact: () => void
  onAddContact: FormEventHandler<HTMLFormElement>
  profile: Profile
  setProfile: Dispatch<SetStateAction<Profile>>
  profilePicture: string
  onUploadProfilePicture: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export function ProfileView({ active, contact, contactDraft, setContactDraft, addingContact, onToggleAddContact, onAddContact, profile, setProfile, profilePicture, onUploadProfilePicture }: ProfileViewProps) {
  const { t } = useLanguage()
  return <div hidden={!active}>
    <section className="page-title-row profile-title"><div><div className="eyebrow">{t('profile.eyebrow')}</div><h1>{t('profile.title')}</h1><p className="welcome-copy">{t('profile.copy')}</p></div><span className="session-badge"><ShieldCheck size={15} /> {t('profile.demoSession')}</span></section>
    <div className="profile-layout">
      <section className="profile-card">
        <div className="profile-card-heading"><div><span className="eyebrow">{t('profile.identifying')}</span><h2>{t('profile.about')}</h2></div><button className="quiet-icon" aria-label={t('profile.edit')}><Menu size={17} /></button></div>
        <div className="profile-identity"><div className="profile-photo-control"><img src={profilePicture} alt={t('profile.uploadPhotoLabel')} /><label className="profile-photo-button"><Camera size={13} /> {t('profile.uploadPhoto')}<input type="file" accept="image/*" onChange={onUploadProfilePicture} /></label></div><div><h3>Alexandra Miron</h3><span>{t('profile.location')}</span></div><span className="verified-tag"><Check size={13} /> {t('profile.you')}</span></div>
        <div className="profile-fields">
          <label>{t('profile.height')} <div className="input-with-unit"><input type="number" min="80" max="250" value={profile.height} onChange={(event) => setProfile({ ...profile, height: event.target.value })} /><span>{t('profile.cm')}</span></div></label>
          <label>{t('profile.weight')} <div className="input-with-unit"><input type="number" min="20" max="300" value={profile.weight} onChange={(event) => setProfile({ ...profile, weight: event.target.value })} /><span>{t('profile.kg')}</span></div></label>
          <label className="full-field">{t('profile.marks')} <textarea value={profile.marks} onChange={(event) => setProfile({ ...profile, marks: event.target.value })} placeholder={t('profile.marksPlaceholder')} /></label>
        </div>
        <div className="data-note"><ShieldCheck size={16} /><span>{t('profile.dataNote')}</span></div>
      </section>
      <section className="profile-card trusted-card">
        <div className="profile-card-heading"><div><span className="eyebrow">{t('profile.people')}</span><h2>{t('profile.trustedContact')}</h2></div><span className="contact-count">01</span></div>
        <div className="trusted-person"><div className="contact-avatar"><Heart size={20} fill="currentColor" /></div><div className="contact-info"><strong>{contact.name}</strong><span>{contact.relationship || t('profile.trustedPerson')}</span><a href={phoneHref(contact.phone)}>{contact.phone}</a></div><a className="call-contact" href={phoneHref(contact.phone)} aria-label={`${t('profile.call')} ${contact.name}`}><Phone size={16} /></a></div>
        <div className="alert-setting"><div className="alert-setting-icon"><Clock3 size={17} /></div><div><strong>{t('profile.reminderTitle')}</strong><p>{t('profile.reminderCopy')}</p></div><span className="toggle-demo" aria-label={t('profile.reminderPreview')}><i /></span></div>
        <button className="add-contact-button" onClick={onToggleAddContact}>{addingContact ? <X size={16} /> : <UserRoundPlus size={16} />}{addingContact ? t('profile.cancel') : t('profile.updateContact')}</button>
        {addingContact && <form className="contact-form" onSubmit={onAddContact}><label>{t('profile.name')}<input required value={contactDraft.name} onChange={(event) => setContactDraft({ ...contactDraft, name: event.target.value })} placeholder={t('profile.fullNamePlaceholder')} /></label><label>{t('profile.relationship')}<input value={contactDraft.relationship} onChange={(event) => setContactDraft({ ...contactDraft, relationship: event.target.value })} placeholder={t('profile.relationshipPlaceholder')} /></label><label>{t('profile.phone')}<input required type="tel" value={contactDraft.phone} onChange={(event) => setContactDraft({ ...contactDraft, phone: event.target.value })} placeholder={t('profile.phonePlaceholder')} /></label><button className="publish-button" type="submit">{t('profile.saveSession')} <Check size={15} /></button></form>}
      </section>
    </div>
  </div>
}
