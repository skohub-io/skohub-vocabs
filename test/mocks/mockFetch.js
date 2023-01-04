import { indexDE, indexEN } from "../data/flexsearchIndex"
import {
  ConceptSchemeNoNarrower,
  ConceptSchemeNoPrefLabel,
  ConceptSchemeWithNarrower,
  ConceptSchemeWithNarrowerThreeLangs,
} from "../data/pageContext"

export default async function mockFetch(url) {
  switch (url) {
    case "/w3id.org/class/hochschulfaecher/scheme.json": {
      return {
        ok: true,
        status: 200,
        json: async () => ConceptSchemeWithNarrower,
      }
    }
    case "/three-langs/w3id.org/class/hochschulfaecher/scheme.json": {
      return {
        ok: true,
        status: 200,
        json: async () => ConceptSchemeWithNarrowerThreeLangs,
      }
    }
    case "/no-narrower/w3id.org/class/hochschulfaecher/scheme.json": {
      return {
        ok: true,
        status: 200,
        json: async () => ConceptSchemeNoNarrower,
      }
    }
    case "/no-prefLabel/w3id.org/class/hochschulfaecher/scheme.json": {
      return {
        ok: true,
        status: 200,
        json: async () => ConceptSchemeNoPrefLabel,
      }
    }
    case "/w3id.org/class/hochschulfaecher/scheme.de.index": {
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
