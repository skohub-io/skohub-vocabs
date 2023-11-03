export const mockConfig = {
  site: {
    siteMetadata: {
      searchableAttributes: ["prefLabel"],
      customDomain: "",
      colors: {
        skoHubWhite: "rgb(255, 255, 255)",
        skoHubDarkColor: "rgb(15, 85, 75)",
        skoHubMiddleColor: "rgb(20, 150, 140)",
        skoHubLightColor: "rgb(40, 200, 175)",
        skoHubThinColor: "rgb(55, 250, 210)",
        skoHubBlackColor: "rgb(5, 30, 30)",
        skoHubAction: "rgb(230, 0, 125)",
        skoHubNotice: "rgb(250, 180, 50)",
        skoHubDarkGrey: "rgb(155, 155, 155)",
        skoHubMiddleGrey: "rgb(200, 200, 200)",
        skoHubLightGrey: "rgb(235, 235, 235)",
      },
      logo: "skohub-signet-color.svg",
      title: "SkoHub Vocabs",
      fonts: {
        bold: {
          font_family: "Ubuntu",
          font_style: "normal",
          font_weight: 700,
          name: "ubuntu-v20-latin-700",
        },
        regular: {
          font_family: "Ubuntu",
          font_style: "normal",
          font_weight: 400,
          name: "ubuntu-v20-latin-regular",
        },
      },
    },
  },
  allConceptScheme: {
    edges: [
      {
        node: {
          id: "http://w3id.org/",
          fields: {
            languages: ["de", "en"],
          },
        },
      },
      {
        node: {
          id: "http://w3id.org/cs2/",
          fields: {
            languages: ["en"],
          },
        },
      },
      {
        node: {
          id: "http://example.org/hashURIConceptScheme#scheme",
          fields: {
            languages: ["de", "en"],
          },
        },
      },
      {
        node: {
          id: "http://one-lang/w3id.org/",
          fields: {
            languages: ["de"],
          },
        },
      },
      {
        node: {
          id: "http://no-in-scheme/w3id.org/",
          fields: {
            languages: ["de", "en", "uk"],
          },
        },
      },
    ],
  },
}
