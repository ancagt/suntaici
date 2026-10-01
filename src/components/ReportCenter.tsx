import { useState, type ChangeEvent, type FormEvent } from 'react'
import { AlertTriangle, BookOpen, Check, ChevronDown, FileText, ImagePlus, LockKeyhole, MapPin, Plus, ShieldAlert, Siren, Trash2, X } from 'lucide-react'
import staticData from '../data.json'
import { DOMESTIC_RELATIONSHIP_OPTIONS, INCIDENT_CATEGORY_OPTIONS, MAX_EVIDENCE_PHOTOS, MAX_IMAGE_BYTES } from '../constants'
import type { Coordinates, DomesticRecord, EvidencePhoto, IncidentReport, IncidentSubject, JournalEntry, ReportTab } from '../types'
import { useLanguage } from '../LanguageContext'
import type { TranslationKey } from '../translations'
import { IncidentMap } from './IncidentMap'

type ReportCenterProps = { active: boolean; notify: (message: string) => void }

export function ReportCenter({ active, notify }: ReportCenterProps) {
  const { language, t } = useLanguage()
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

  function saveIncidentReport(event: FormEvent<HTMLFormElement>) {
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
    notify(t('incident.saveSuccess'))
  }

  function uploadEvidence(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || [])
    event.target.value = ''
    if (!files.length) return
    const accepted: EvidencePhoto[] = []
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        notify(t('incident.imageOnly'))
        continue
      }
      if (file.size > MAX_IMAGE_BYTES) {
        notify(t('incident.imageLimit'))
        continue
      }
      if (evidencePhotos.length + accepted.length >= MAX_EVIDENCE_PHOTOS) {
        notify(t('incident.maxPhotos'))
        break
      }
      accepted.push({ id: `${Date.now()}-${accepted.length}`, name: file.name, url: URL.createObjectURL(file), size: file.size })
    }
    if (accepted.length) {
      setEvidencePhotos((current) => [...current, ...accepted])
      notify(t('incident.photosAdded'))
    }
  }

  function removeEvidencePhoto(photo: EvidencePhoto) {
    URL.revokeObjectURL(photo.url)
    setEvidencePhotos((current) => current.filter((item) => item.id !== photo.id))
  }

  function saveDomesticRecord(event: FormEvent<HTMLFormElement>) {
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
    notify(t('incident.recordSaved'))
  }

  function saveJournalEntry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!journalDraft.trim()) return
    setJournalEntries((current) => [{ id: Date.now(), note: journalDraft.trim(), createdAt: new Date().toISOString() }, ...current])
    setJournalDraft('')
    notify(t('incident.journalSaved'))
  }

  return <div hidden={!active}>
    <section className="page-title-row report-title">
      <div><div className="eyebrow">{t('report.eyebrow')}</div><h1>{t('report.title')}</h1><p className="welcome-copy">{t('report.copy')}</p></div>
      <span className="session-badge"><LockKeyhole size={14} /> {t('report.privateSession')}</span>
    </section>
    <div className="report-safety-note"><AlertTriangle size={17} /><p><strong>{t('report.safetyLead')}</strong> {t('report.privacy')} <a href="tel:112">112</a>.</p></div>
    <div className="report-tabs" role="tablist" aria-label={t('report.tabsLabel')}>
      <button role="tab" aria-selected={reportTab === 'incident'} className={reportTab === 'incident' ? 'active' : ''} onClick={() => setReportTab('incident')}><MapPin size={16} /> {t('report.flag')}</button>
      <button role="tab" aria-selected={reportTab === 'domestic'} className={reportTab === 'domestic' ? 'active' : ''} onClick={() => setReportTab('domestic')}><ShieldAlert size={16} /> {t('report.domesticTab')}</button>
      <button role="tab" aria-selected={reportTab === 'journal'} className={reportTab === 'journal' ? 'active' : ''} onClick={() => setReportTab('journal')}><FileText size={16} /> {t('report.journalTab')}</button>
      <button role="tab" aria-selected={reportTab === 'learn'} className={reportTab === 'learn' ? 'active' : ''} onClick={() => setReportTab('learn')}><BookOpen size={16} /> {t('report.learnTab')}</button>
    </div>

    {reportTab === 'incident' && <section className="report-panel" role="tabpanel">
      <div className="report-panel-heading"><div><span className="eyebrow">{t('report.incidentEyebrow')}</span><h2>{t('report.incidentTitle')}</h2><p>{t('report.incidentIntro')}</p></div><span className="private-chip"><LockKeyhole size={12} /> {t('report.onlyDevice')}</span></div>
      <form className="safety-form" onSubmit={saveIncidentReport}>
        <label>{t('report.forWho')}<select value={reportFor} onChange={(event) => setReportFor(event.target.value as IncidentSubject)}><option value="For me">{t('report.forMe')}</option><option value="For someone I know">{t('report.forKnown')}</option><option value="I don't know them">{t('report.forUnknown')}</option></select></label>
        <label>{t('report.incidentType')}<select value={incidentCategory} onChange={(event) => setIncidentCategory(event.target.value)}>{INCIDENT_CATEGORY_OPTIONS.map((option) => <option key={option.value} value={option.value}>{t(option.labelKey)}</option>)}</select></label>
        <div className="form-two-column"><label>{t('report.victimDescription')}<textarea value={victimDescription} onChange={(event) => setVictimDescription(event.target.value)} placeholder={t('report.victimPlaceholder')} /></label><label>{t('report.abuserDescription')}<textarea value={personDescription} onChange={(event) => setPersonDescription(event.target.value)} placeholder={t('report.abuserPlaceholder')} /></label></div>
        <div className="form-two-column"><label>{t('report.clothing')}<textarea value={clothingDescription} onChange={(event) => setClothingDescription(event.target.value)} placeholder={t('report.clothingPlaceholder')} /></label><label>{t('report.action')}<textarea required value={incidentDescription} onChange={(event) => setIncidentDescription(event.target.value)} placeholder={t('report.actionPlaceholder')} /></label></div>
        <label>{t('report.place')} <input value={incidentPlace} onChange={(event) => setIncidentPlace(event.target.value)} placeholder={t('report.placePlaceholder')} /></label>
        <div className="map-picker-heading"><div><strong>{t('report.pinTitle')}</strong><span>{t('report.pinHint')}</span></div>{incidentPin && <button type="button" className="clear-pin" onClick={() => setIncidentPin(null)}><X size={14} /> {t('report.removePin')}</button>}</div>
        <IncidentMap active={active && reportTab === 'incident'} pin={incidentPin} onPinChange={setIncidentPin} />
        {incidentPin && <p className="pin-coordinates"><MapPin size={13} /> {t('report.pin')}: {incidentPin.lat.toFixed(5)}, {incidentPin.lng.toFixed(5)}</p>}
        <div className="form-submit-row"><span><LockKeyhole size={14} /> {t('report.privateNote')}</span><button className="publish-button" type="submit">{t('report.saveNote')} <Check size={15} /></button></div>
      </form>
      {incidentReports.length > 0 && <div className="saved-records"><h3>{t('report.savedIncidents')} <span>{incidentReports.length}</span></h3>{incidentReports.map((report) => { const categoryKey = INCIDENT_CATEGORY_OPTIONS.find((option) => option.value === report.category)?.labelKey ?? 'report.other'; const reportForKey: TranslationKey = report.reportFor === 'For me' ? 'report.forMe' : report.reportFor === 'For someone I know' ? 'report.forKnown' : 'report.forUnknown'; return <article className="saved-record" key={report.id}><div><strong>{t(categoryKey)} · {t(reportForKey)}</strong><time>{new Date(report.createdAt).toLocaleString(language === 'ro' ? 'ro-RO' : 'en-GB')}</time></div>{report.victimDescription && <p><strong>{t('report.victim')}:</strong> {report.victimDescription}</p>}{report.personDescription && <p><strong>{t('report.abuser')}:</strong> {report.personDescription}</p>}{report.clothing && <p><strong>{t('report.clothing')}:</strong> {report.clothing}</p>}<p><strong>{t('report.actionLabel')}:</strong> {report.description}</p><span>{report.place || (report.pin ? `${t('report.pin')}: ${report.pin.lat.toFixed(4)}, ${report.pin.lng.toFixed(4)}` : t('report.noLocation'))}</span></article> })}</div>}
    </section>}

    {reportTab === 'domestic' && <section className="report-panel" role="tabpanel">
      <div className="report-panel-heading"><div><span className="eyebrow">{t('report.domesticEyebrow')}</span><h2>{t('report.domesticTitle')}</h2><p>{t('report.domesticIntro')}</p></div><span className="private-chip"><LockKeyhole size={12} /> {t('report.onlyDevice')}</span></div>
      <form className="safety-form" onSubmit={saveDomesticRecord}>
        <label>{t('report.relationshipToPerson')}<select value={domesticRelationship} onChange={(event) => setDomesticRelationship(event.target.value)}>{DOMESTIC_RELATIONSHIP_OPTIONS.map((option) => <option key={option.value} value={option.value}>{t(option.labelKey)}</option>)}</select></label>
        <label>{t('report.recordPrompt')}<textarea required value={domesticDescription} onChange={(event) => setDomesticDescription(event.target.value)} placeholder={t('report.recordPlaceholder')} /></label>
        <div className="evidence-uploader"><div><ImagePlus size={18} /><span><strong>{t('report.evidencePhotos')}</strong><small>{t('report.evidenceLimit')}</small></span></div><label className="attach-button"><Plus size={15} /> {t('report.addPhotos')}<input type="file" accept="image/*" multiple onChange={uploadEvidence} /></label></div>
        {evidencePhotos.length > 0 && <div className="evidence-grid">{evidencePhotos.map((item) => <figure className="evidence-photo" key={item.id}><img src={item.url} alt={`${t('report.evidencePhotos')}: ${item.name}`} /><figcaption title={item.name}>{item.name}</figcaption><button type="button" className="remove-photo" onClick={() => removeEvidencePhoto(item)} aria-label={`${t('community.removePhoto')}: ${item.name}`}><Trash2 size={14} /></button></figure>)}</div>}
        <div className="form-submit-row"><span><LockKeyhole size={14} /> {t('report.notUploaded')}</span><button className="publish-button" type="submit">{t('report.saveRecord')} <Check size={15} /></button></div>
      </form>
      {domesticRecords.length > 0 && <div className="saved-records"><h3>{t('report.savedDomestic')} <span>{domesticRecords.length}</span></h3>{domesticRecords.map((record) => { const relationshipKey = DOMESTIC_RELATIONSHIP_OPTIONS.find((option) => option.value === record.relationship)?.labelKey ?? 'report.other'; return <article className="saved-record" key={record.id}><div><strong>{t(relationshipKey)}</strong><time>{new Date(record.createdAt).toLocaleString(language === 'ro' ? 'ro-RO' : 'en-GB')}</time></div><p>{record.description}</p><span>{record.evidenceCount} {record.evidenceCount === 1 ? t('report.photo') : t('report.photos')}</span>{record.photos.length > 0 && <div className="saved-evidence">{record.photos.map((item) => <img key={item.id} src={item.url} alt={`${t('report.evidencePhotos')}: ${item.name}`} />)}</div>}</article> })}</div>}
    </section>}

    {reportTab === 'journal' && <section className="report-panel" role="tabpanel">
      <div className="report-panel-heading"><div><span className="eyebrow">{t('report.journalEyebrow')}</span><h2>{t('report.journalTitle')}</h2><p>{t('report.journalIntro')}</p></div><span className="private-chip"><LockKeyhole size={12} /> {t('report.sessionOnly')}</span></div>
      <form className="safety-form journal-form" onSubmit={saveJournalEntry}><label>{t('report.yourNote')}<textarea required value={journalDraft} onChange={(event) => setJournalDraft(event.target.value)} placeholder={t('report.notePlaceholder')} /></label><div className="form-submit-row"><span><LockKeyhole size={14} /> {t('report.journalPrivacy')}</span><button className="publish-button" type="submit">{t('report.saveJournal')} <Check size={15} /></button></div></form>
      {journalEntries.length > 0 ? <div className="journal-entries">{journalEntries.map((entry) => <article className="journal-entry" key={entry.id}><time>{new Date(entry.createdAt).toLocaleString(language === 'ro' ? 'ro-RO' : 'en-GB')}</time><p>{entry.note}</p></article>)}</div> : <div className="journal-empty"><FileText size={20} /><p>{t('report.emptyJournal')}</p></div>}
    </section>}

    {reportTab === 'learn' && <section className="report-panel education-panel" role="tabpanel">
      <div className="report-panel-heading"><div><span className="eyebrow">{t('report.educationEyebrow')}</span><h2>{t('report.educationTitle')}</h2><p>{t('report.educationIntro')}</p></div></div>
      <div className="education-grid">{staticData.abuseArticles.map((article) => { const articleKey = (field: string) => t(`articles.${article.id}.${field}` as TranslationKey); return <details className="education-article" key={article.id}><summary><span><small>{articleKey('type')}</small><strong>{articleKey('title')}</strong></span><ChevronDown size={17} /></summary><p>{articleKey('summary')}</p><div><strong>{t('report.possibleSigns')}</strong><p>{articleKey('sign')}</p></div><div><strong>{t('report.supportOption')}</strong><p>{articleKey('support')}</p></div></details> })}</div>
      <div className="support-resources"><Siren size={17} /><p><strong>{t('report.inDanger')}</strong> {t('report.dangerCall')} <a href="tel:112">112</a>. {t('report.domesticHelpline')} <a href="tel:0800500333">0800 500 333</a>.</p></div>
    </section>}
  </div>
}
