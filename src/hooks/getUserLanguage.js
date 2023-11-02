import { useSkoHubContext } from "../context/Context"

/**
 * @param {object} concept
 * @param {object} conceptSchemes
 */
export const getUserLang = ({ availableLanguages = [], selectedLanguage }) => {
  if (typeof window !== "undefined") {
    /** @prop {string} */
    const userLang = (navigator.language || navigator.userLanguage).slice(0, 2)
    if (selectedLanguage && availableLanguages.includes(selectedLanguage))
      return selectedLanguage
    else if (selectedLanguage && !availableLanguages.includes(selectedLanguage))
      return availableLanguages[0]
    else if (selectedLanguage) return selectedLanguage
    else if (availableLanguages.includes(userLang)) return userLang
    else {
      const language = availableLanguages[0]
      const alertedAboutLanguage =
        localStorage.getItem("alertedAboutLanguage") ?? false
      if (alertedAboutLanguage === false) {
        alert(
          `Did not find your user language ("${userLang}"). Setting default language: "${language}"`
        )
        localStorage.setItem("alertedAboutLanguage", true)
      }
      return language
    }
  }
}
