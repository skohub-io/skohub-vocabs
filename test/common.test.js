/* eslint no-console: 0 */ // --> OFF
import { describe, expect, it } from "vitest"
const {
  i18n,
  getFilePath,
  replaceFilePathInUrl,
  getLinkPath,
  getLanguageFromUrl,
  replaceKeyInObject,
  replaceMultipleKeysInObject,
} = require("../src/common")

describe("Translate", () => {
  it("Translates a localized string", () => {
    const localized = { en_us: null, en: null, de: "Südostasien und Ozeanien" }
    expect(i18n("de")(localized)).toBe("Südostasien und Ozeanien")
  })

  it("Should return an empty string", () => {
    const localized = { en_us: null, en: null, de: null }
    expect(i18n("de")(localized)).toBe("")
  })
})

describe("getFilePath", () => {
  it("Should return a valid path", () => {
    expect(
      getFilePath("http://w3id.org/class/hochschulfaecher/S393#", "html")
    ).toBe("/w3id.org/class/hochschulfaecher/S393.html")
  })
  it("Returns a valid file path when extension and pattern is given", () => {
    expect(
      getFilePath(
        "http://localhost:8000/kim/hcrt/index",
        "html",
        "http://localhost:8000"
      )
    ).toBe("/kim/hcrt/index.html")
  })
  it("Returns a valid file path when no extension, but pattern is given", () => {
    expect(
      getFilePath(
        "http://localhost:8000/kim/hcrt/index",
        "",
        "http://localhost:8000"
      )
    ).toBe("/kim/hcrt/index")
  })
})

describe("replaceFilePathinUrl", () => {
  it("Should replace the file path", () => {
    expect(
      replaceFilePathInUrl(
        "http://w3id.org/class/hochschulfaecher/2",
        "http://w3id.org/class/hochschulfaecher/1"
      )
    ).toBe("/w3id.org/class/hochschulfaecher/1")
  })
})

describe("replaceFilePathinUrl with extension", () => {
  it("Should replace the file path and add an extension", () => {
    expect(
      replaceFilePathInUrl(
        "http://w3id.org/class/hochschulfaecher/2",
        "http://w3id.org/class/hochschulfaecher/1",
        "json"
      )
    ).toBe("/w3id.org/class/hochschulfaecher/1.json")
  })
})

describe("getLinkPath", () => {
  it("convert file path to gatsby link", () => {
    expect(
      getLinkPath("http://w3id.org/class/hochschulfaecher/1", "de.html")
    ).toBe("../1.de.html")
  })
})

describe("getLanguageFromUrl", () => {
  it("parses language if lang param in location.search is given", () => {
    const location = {
      search: "?lang=de",
    }
    expect(getLanguageFromUrl(location)).toBe("de")
  })
  it("returns null, if no lang param is present in location.search", () => {
    const location = {
      search: "",
    }
    expect(getLanguageFromUrl(location)).toBeNull()
  })
})

describe("replaceKeysInObject", () => {
  it("replaces key in an object", () => {
    const obj = { a: 1, b: 2 }
    const newObj = replaceKeyInObject(obj, "a", "c")
    expect(newObj).toStrictEqual({ c: 1, b: 2 })
  })

  it("also works if the key is not present", () => {
    const obj = { a: 1, b: 2 }
    const newObj = replaceKeyInObject(obj, "x", "c")
    expect(newObj).toStrictEqual({ a: 1, b: 2 })
  })
})

describe("replaceMultipleKeysInObject", () => {
  it("replaces multiple keys in an object", () => {
    const obj = { a: 1, b: 2 }
    const newObj = replaceMultipleKeysInObject(obj, [
      ["a", "c"],
      ["b", "d"],
    ])
    expect(newObj).toStrictEqual({ c: 1, d: 2 })
  })
})
