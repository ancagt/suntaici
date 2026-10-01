import { useState, type ReactNode } from 'react'
import { DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY } from './constants'
import { LanguageContext } from './LanguageContext'
import { translations } from './translations'
import type { Language, TranslationKey } from './translations'

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY) === 'ro' ? 'ro' : DEFAULT_LANGUAGE
  })

  function setLanguage(nextLanguage: Language) {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage)
    setLanguageState(nextLanguage)
  }

  const value = {
    language,
    setLanguage,
    t: (key: TranslationKey) => translations[language][key],
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
