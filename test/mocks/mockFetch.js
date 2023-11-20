import { indexDE } from "../data/flexsearchIndex"
import { cfg, ctx, map, reg } from "../data/search"
import {
  collection,
  ConceptScheme,
  ConceptScheme2,
  hashURIConceptScheme,
  topConcept,
} from "../data/pageContext"

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
    case "/w3id.org/cs2/index.json": {
      return {
        ok: true,
        status: 200,
        json: async () => ConceptScheme2,
      }
    }
    case "/one-lang/w3id.org/index.json": {
      // remove all en keys so we just have one language in object
      let res = removeKey(ConceptScheme, "en")
      // add one key to check if null values gets filtered out correctly
      res = {
        ...res,
        id: "http://one-lang/w3id.org/",
        title: { ...res.title, en: null },
      }

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
          // ...ConceptScheme.title,
          en: null,
        },
      }
      return {
        ok: true,
        status: 200,
        json: async () => res,
      }
    }
    case "/w3id.org/c1.json": {
      return {
        ok: true,
        status: 200,
        json: async () => topConcept,
      }
    }
    case "/w3id.org/collection.json": {
      return {
        ok: true,
        status: 200,
        json: async () => collection,
      }
    }
    case "/no-in-scheme/w3id.org/collection.json": {
      let res = removeKey(collection, "type")
      return {
        ok: true,
        status: 200,
        json: async () => res,
      }
    }
    case "/w3id.org/index-cs/search/de/prefLabel.cfg.json": {
      return {
        ok: true,
        status: 200,
        json: async () => cfg,
      }
    }
    case "/w3id.org/index-cs/search/de/prefLabel.ctx.json": {
      return {
        ok: true,
        status: 200,
        json: async () => ctx,
      }
    }
    case "/w3id.org/index-cs/search/de/prefLabel.map.json": {
      return {
        ok: true,
        status: 200,
        json: async () => map,
      }
    }
    case "/w3id.org/index-cs/search/de/reg.json": {
      return {
        ok: true,
        status: 200,
        json: async () => reg,
      }
    }
    case "/example.org/hashURIConceptScheme.json": {
      return {
        ok: true,
        status: 200,
        json: async () => hashURIConceptScheme,
      }
    }
    default: {
      throw new Error(`Unhandled request: ${url}`)
    }
  }
}
