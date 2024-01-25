/**
 * @param {object} concept
 * @param {object} conceptSchemes
 */
export const getUserLang = ({ availableLanguages = [], selectedLanguage }) => {
  if (typeof window !== "undefined") {
    /** @prop {string} */
    const userLang = (navigator.language || navigator.userLanguage).slice(0, 2)
    if (selectedLanguage && availableLanguages.includes(selectedLanguage)) {
      return selectedLanguage
    } else if (
      selectedLanguage &&
      !availableLanguages.includes(selectedLanguage) &&
      availableLanguages.includes(userLang)
    ) {
      return userLang
    } else if (availableLanguages.includes(userLang)) return userLang
    else {
      const language = availableLanguages[0]
      return language
    }
  }
}
