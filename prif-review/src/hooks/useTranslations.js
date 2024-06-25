function removeLanguagePrefix(s) {
  // Hard-coding this for English for now
  return s.replace('/en', '')
}

export default function useTranslations(translationData, pageNodes) {
  // This array will hold data about translations of the current page,
  // including accurate paths, and excluding the current language.
  let translations = []

  const languages = ['de', 'en']
  const targetLanguages = languages.filter((el) => el !== translationData.currentLanguage)
  const basePath = removeLanguagePrefix(translationData.currentSlug)

  if (translationData.translations) {
    translations = translationData.translations.map((t) => {
      const translationPage = pageNodes.find((el) => el.pageContext.id === t.id)
      if (translationPage) {
        return { path: translationPage.path, language: translationPage.pageContext.language }
      }
      return null
    })
  } else {
    translations = targetLanguages.map((l) => {
      const translationPage = pageNodes.find((el) => {
        const p = removeLanguagePrefix(el.path)
        return el.pageContext.language === l && p === basePath
      })
      if (translationPage) {
        return { path: translationPage.path, language: l }
      }
      return null
    })
  }
  return translations
}
