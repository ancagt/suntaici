import { useLanguage } from '../LanguageContext'

export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage()
  return <div className="language-toggle" role="group" aria-label={t('language.label')}>
    <button type="button" className={language === 'en' ? 'active' : ''} aria-label={t('language.english')} title={t('language.english')} aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>EN</button>
    <button type="button" className={language === 'ro' ? 'active' : ''} aria-label={t('language.romanian')} title={t('language.romanian')} aria-pressed={language === 'ro'} onClick={() => setLanguage('ro')}>RO</button>
  </div>
}
