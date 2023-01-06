import { indexDE, indexEN } from "../data/flexsearchIndex"
import { ConceptScheme } from "../data/pageContext"

function removeKey(obj, key) {
  // credits: https://stackoverflow.com/a/39461077
  return JSON.parse(JSON.stringify(obj, (k, v) => (k === key ? undefined : v)))
}

export default async function mockFetch(url) {
  switch (url) {
    case "/w3id.org/index.json": {
      return {
        ok: true,
        status: 200,
        json: async () => ConceptScheme,
      }
    }
    case "/one-lang/w3id.org/index.json": {
      // remove all en keys so we just have one language in object
      const res = removeKey(ConceptScheme, "en")

      return {
        ok: true,
        status: 200,
        json: async () => res,
      }
    }
    case "/no-title-in-en/w3id.org/index.json": {
      const res = {
        ...ConceptScheme,
        title: {
          ...ConceptScheme.title,
          en: null,
        },
      }
      return {
        ok: true,
        status: 200,
        json: async () => res,
      }
    }
    case "/w3id.org/index.de.index": {
      return {
        ok: true,
        status: 200,
        json: async () => indexDE,
      }
    }
    case "/w3id.org/class/hochschulfaecher/scheme.en.index": {
      return {
        ok: true,
        status: 200,
        json: async () => indexEN,
      }
    }
    default: {
      throw new Error(`Unhandled request: ${url}`)
    }
  }
}
