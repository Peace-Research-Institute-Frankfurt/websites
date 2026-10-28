function removeLanguagePrefix(s) {
  return s.replace('/fr', '')
}

export default function useTranslations(translationData, pageNodes) {
  let translations = []

  const languages = ['fr', 'en']
  const targetLanguages = languages.filter((el) => el !== translationData.currentLanguage)
  const basePath = removeLanguagePrefix(translationData.currentSlug)

  if (translationData.translations) {
    translations = translationData.translations
      .map((t) => {
        const translationPage = pageNodes.find((el) => el.pageContext.id === t.id)
        if (!translationPage) return null  // Guard: Seite existiert noch nicht
        return { path: translationPage.path, language: translationPage.pageContext.language }
      })
      .filter(Boolean)  // nulls entfernen
  } else {
    translations = targetLanguages
      .map((l) => {
        const translationPage = pageNodes.find((el) => {
          const p = removeLanguagePrefix(el.path)
          return el.pageContext.language === l && p === basePath
        })
        if (!translationPage) return null  // Guard
        return { path: translationPage.path, language: l }
      })
      .filter(Boolean)
  }

  return translations
}