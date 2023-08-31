import { useEffect } from "react"
import Document from "flexsearch/dist/module/document.js"
import { i18n, getFilePath } from "../common"
import { withPrefix } from "gatsby"

export const handleKeypresses = (labels, setLabels) => {
  useEffect(() => {
    function handleKeyDown(e) {
      // ctrl + k
      if (e.ctrlKey && e.which === 75) {
        e.preventDefault()
        // Get the reference to the input element
        const inputElement = document.getElementById("searchInput")
        // Set the focus on the input element
        inputElement.focus()
        // alt + p
      } else if (e.altKey && e.which === 80) {
        e.preventDefault()
        Object.keys(labels).includes("prefLabel") &&
          setLabels({ ...labels, ["prefLabel"]: !labels["prefLabel"] })
        // alt + n
      } else if (e.altKey && e.which === 78) {
        e.preventDefault()
        Object.keys(labels).includes("notation") &&
          setLabels({ ...labels, ["notation"]: !labels["notation"] })
        // alt + a
      } else if (e.altKey && e.which === 65) {
        e.preventDefault()
        Object.keys(labels).includes("altLabel") &&
          setLabels({ ...labels, ["altLabel"]: !labels["altLabel"] })
        // alt + d
      } else if (e.altKey && e.which === 68) {
        e.preventDefault()
        Object.keys(labels).includes("definition") &&
          setLabels({ ...labels, ["definition"]: !labels["definition"] })
        // alt + e
      } else if (e.altKey && e.which === 69) {
        e.preventDefault()
        Object.keys(labels).includes("example") &&
          setLabels({ ...labels, ["example"]: !labels["example"] })
        // alt + h
      } else if (e.altKey && e.which === 72) {
        e.preventDefault()
        Object.keys(labels).includes("hiddenLabel") &&
          setLabels({ ...labels, ["hiddenLabel"]: !labels["hiddenLabel"] })
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    // Don't forget to clean up
    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown)
    }
  })
}

export const importIndex = async (
  conceptSchemeId,
  labels,
  setIndex,
  language
) => {
  const idx = new Document({
    tokenize: "full",
    charset: "latin",
    id: "id",
    document: {
      id: "id",
      // store: ["prefLabel", "altLabel"], /* not working flexsearchside  */
      index: [
        "notation",
        "prefLabel",
        "altLabel",
        "hiddenLabel",
        "definition",
        "example",
      ],
    },
  })
  // filter from labels object the selected entries
  // and append the needed keys
  // add reg, which is not specific to a key
  const keys = Object.entries(labels)
    .filter((label) => label[1] === true)
    .flatMap((label) => [
      `${label[0]}.cfg`,
      `${label[0]}.ctx`,
      `${label[0]}.map`,
      `${label[0]}.store` /* might be useful later, when importing with stores works in flexsearch */,
      `${label[0]}.tag`,
    ])
    .concat(["reg"])
  for (let i = 0, key; i < keys.length; i += 1) {
    key = keys[i]
    let data
    try {
      data = await fetch(
        withPrefix(
          getFilePath(
            (conceptSchemeId.endsWith("/")
              ? conceptSchemeId.slice(0, -1)
              : conceptSchemeId) + `/search/${language}/${key}`,
            `json`
          )
        )
      )
      const jsonData = await data.json()
      idx.import(key, jsonData ?? null)
    } catch (e) {
      // console.log(e) // eslint-disable-line no-console
    }
  }
  setIndex(idx)
}
