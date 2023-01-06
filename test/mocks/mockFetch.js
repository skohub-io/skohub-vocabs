import { indexDE, indexEN } from "../data/flexsearchIndex"
import { ConceptScheme } from "../data/pageContext"

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
      const topConcept = ConceptScheme.hasTopConcept[0]
      const narrower = ConceptScheme.hasTopConcept[0].narrower[0]
      const res = {
        ...ConceptScheme,
        title: {
          ...ConceptScheme.title,
          en: null,
        },
        hasTopConcept: {
          ...topConcept,
          prefLabel: {
            ...topConcept.prefLabel,
            en: null,
          },
          narrower: {
            ...narrower,
            prefLabel: {
              ...narrower.prefLabel,
              en: null,
            },
          },
          broader: {
            ...topConcept.broader,
            prefLabel: {
              ...topConcept.broader.prefLabel,
              en: null,
            },
          },
        },
      }
      return {
        ok: true,
        status: 200,
        json: async () => res,
      }
    }
    case "/no-prefLabel/w3id.org/index.json": {
      const topConcept = ConceptScheme.hasTopConcept[0]
      const narrower = ConceptScheme.hasTopConcept[0].narrower[0]
      const res = {
        ...ConceptScheme,
        title: {
          ...ConceptScheme.title,
          en: null,
        },
        hasTopConcept: {
          ...topConcept,
          prefLabel: {
            ...topConcept.prefLabel,
            en: null,
          },
          narrower: {
            ...narrower,
            prefLabel: {
              ...narrower.prefLabel,
              en: null,
            },
          },
          broader: {
            ...topConcept.broader,
            prefLabel: {
              ...topConcept.broader.prefLabel,
              en: null,
            },
          },
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
