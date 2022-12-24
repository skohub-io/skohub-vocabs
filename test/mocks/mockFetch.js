import { conceptSchemeOneLang, conceptSchemeThreeLang } from "../data/hcrt"
const conceptSchemeOneLangResponse = conceptSchemeOneLang
const conceptSchemeThreeLangResponse = conceptSchemeThreeLang

export default async function mockFetch(url) {
  switch (url) {
    case "test-one-language/index.json": {
      return {
        ok: true,
        status: 200,
        json: async () => conceptSchemeOneLangResponse,
      }
    }
    case "test-three-languages/index.json": {
      return {
        ok: true,
        status: 200,
        json: async () => conceptSchemeThreeLangResponse,
      }
    }
    default: {
      throw new Error(`Unhandled request: ${url}`)
    }
  }
}
