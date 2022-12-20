const conceptSchemeResponse = {
  id: "https://w3id.org/kim/hcrt/scheme",
  type: "ConceptScheme",
}

export default async function mockFetch(url) {
  switch (url) {
    case "test/index.json": {
      return {
        ok: true,
        status: 200,
        json: async () => conceptSchemeResponse,
      }
    }
    default: {
      throw new Error(`Unhandled request: ${url}`)
    }
  }
}
