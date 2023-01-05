// PC Indicates PageContext

export const ConceptPC = {
  node: {
    id: "http://w3id.org/class/hochschulfaecher/S99#",
    type: "Concept",
    hub: "https://test.skohub.io/hub",
    prefLabel: {
      de: "Konstruktionstechnik",
    },
    altLabel: {
      de: ["Alt-Label-1", "Alt-Label-2"],
    },
    hiddenLabel: {
      de: ["Hidden-Label-1", "Hidden-Label-2"],
    },
    definition: null,
    scopeNote: null,
    narrower: [],
    broader: {
      id: "http://w3id.org/class/hochschulfaecher/B96#",
      prefLabel: {
        de: "Maschinenbau",
      },
    },
    inScheme: {
      id: "http://w3id.org/class/hochschulfaecher/scheme#",
      title: {
        de: "Fächersystematik Hochschulbildung in Deutschland",
      },
    },
    topConceptOf: null,
  },
  language: "de",
}

export const ConceptNoPrefLabelPC = {
  node: {
    id: "http://w3id.org/class/hochschulfaecher/S99#",
    type: "Concept",
    hub: "https://test.skohub.io/hub",
    prefLabel: {
      en: null,
      de: "Konstruktionstechnik",
    },
    definition: null,
    scopeNote: null,
    narrower: [],
    broader: {
      id: "http://w3id.org/class/hochschulfaecher/B96#",
      prefLabel: {
        en: null,
        de: "Maschinenbau",
      },
    },
    inScheme: {
      id: "http://w3id.org/class/hochschulfaecher/scheme#",
      title: {
        en_us: null,
        de: "Fächersystematik Hochschulbildung in Deutschland",
      },
    },
    topConceptOf: null,
  },
  language: "en",
}

export const ConceptSchemeNoNarrower = {
  id: "http://w3id.org/class/hochschulfaecher/scheme#",
  type: "ConceptScheme",
  title: {
    de: "Fächersystematik Hochschulbildung in Deutschland",
    en: "Destatis classification for subject groups, study areas and study subjects",
    uk: "Destatis класифікація за предметними рубриками, спеціальностями та дисциплінами",
  },
  hasTopConcept: [
    {
      id: "http://w3id.org/class/hochschulfaecher/F1#",
      broader: null,
      prefLabel: {
        de: "Agrar-, Forst- und Ernährungswissenschaften, Veterinärmedizin",
      },
    },
  ],
}

export const ConceptSchemeNoNarrowerPC = {
  node: ConceptSchemeNoNarrower,
  language: "de",
}

export const ConceptSchemeNoNarrowerOneLang = {
  id: "http://w3id.org/class/hochschulfaecher/scheme#",
  type: "ConceptScheme",
  title: {
    de: "Fächersystematik Hochschulbildung in Deutschland",
  },
  hasTopConcept: [
    {
      id: "http://w3id.org/class/hochschulfaecher/F1#",
      broader: null,
      prefLabel: {
        de: "Agrar-, Forst- und Ernährungswissenschaften, Veterinärmedizin",
      },
    },
  ],
}

export const ConceptSchemeNoNarrowerOneLangPC = {
  node: ConceptSchemeNoNarrowerOneLang,
  language: "de",
}

export const ConceptSchemeWithNarrower = {
  id: "http://w3id.org/class/hochschulfaecher/scheme#",
  type: "ConceptScheme",
  title: {
    de: "Fächersystematik Hochschulbildung in Deutschland",
    en: "Destatis classification for subject groups, study areas and study subjects",
    uk: "Destatis класифікація за предметними рубриками, спеціальностями та дисциплінами",
  },
  hasTopConcept: [
    {
      id: "http://w3id.org/class/hochschulfaecher/F1#",
      broader: null,
      prefLabel: {
        de: "Agrar-, Forst- und Ernährungswissenschaften, Veterinärmedizin",
      },
      narrower: [
        {
          id: "http://w3id.org/class/hochschulfaecher/B1#",
          prefLabel: {
            de: "Agrarwissenschaft/Landwirtschaft",
          },
          topConceptOf: null,
          inScheme: {
            id: "http://w3id.org/class/hochschulfaecher/scheme#",
            title: {
              de: "Fächersystematik Hochschulbildung in Deutschland",
              en: "Destatis classification for subject groups, study areas and study subjects",
              uk: "Destatis класифікація за предметними рубриками, спеціальностями та дисциплінами",
            },
          },
        },
      ],
    },
  ],
}

export const ConceptSchemeWithNarrowerPC = {
  node: ConceptSchemeWithNarrower,
  language: "de",
}

export const ConceptSchemeWithNarrowerThreeLangs = {
  id: "http://w3id.org/class/hochschulfaecher/scheme#",
  type: "ConceptScheme",
  title: {
    de: "Fächersystematik Hochschulbildung in Deutschland",
    en: "Destatis classification for subject groups, study areas and study subjects",
    uk: "Destatis класифікація за предметними рубриками, спеціальностями та дисциплінами",
  },
  hasTopConcept: [
    {
      id: "http://w3id.org/class/hochschulfaecher/F1#",
      broader: null,
      prefLabel: {
        de: "Agrar-, Forst- und Ernährungswissenschaften, Veterinärmedizin",
        en: "Agricultural, Forest and Nutritional Sciences, Veterinary medicine",
        uk: "Сільськогосподарські, лісові та харчові науки, ветеринарія",
      },
      narrower: [
        {
          id: "http://w3id.org/class/hochschulfaecher/B1#",
          prefLabel: {
            de: "Agrarwissenschaft/Landwirtschaft",
            en: "Agricultural Science/Agriculture",
            uk: "Аграрні науки/Сільське господарство",
          },
          topConceptOf: null,
          inScheme: {
            id: "http://w3id.org/class/hochschulfaecher/scheme#",
            title: {
              de: "Fächersystematik Hochschulbildung in Deutschland",
              en: "Destatis classification for subject groups, study areas and study subjects",
              uk: "Destatis класифікація за предметними рубриками, спеціальностями та дисциплінами",
            },
          },
        },
      ],
    },
  ],
}

export const ConceptSchemeWithNarrowerThreeLangsPC = {
  node: ConceptSchemeWithNarrowerThreeLangs,
  language: "de",
}

export const ConceptSchemeNoPrefLabel = {
  id: "http://w3id.org/class/hochschulfaecher/scheme#",
  type: "ConceptScheme",
  title: {
    de: "Fächersystematik Hochschulbildung in Deutschland",
  },
  hasTopConcept: [
    {
      id: "http://w3id.org/class/hochschulfaecher/F1#",
      narrower: [
        {
          id: "http://w3id.org/class/hochschulfaecher/B1#",
          topConceptOf: null,
          inScheme: {
            id: "http://w3id.org/class/hochschulfaecher/scheme#",
            title: {
              de: "Fächersystematik Hochschulbildung in Deutschland",
            },
          },
          prefLabel: {
            de: "Agrarwissenschaft/Landwirtschaft",
            en: "",
          },
        },
      ],
      broader: null,
      prefLabel: {
        de: "Agrar-, Forst- und Ernährungswissenschaften, Veterinärmedizin",
        en: "",
      },
    },
  ],
}

export const ConceptSchemeNoPrefLabelPC = {
  node: ConceptSchemeNoPrefLabel,
  language: "en",
}

export const CollectionPC = {
  node: {
    id: "http://w3id.org/class/hochschulfaecher/S99#",
    type: "Collection",
    prefLabel: {
      de: "Test-Collection",
    },
    definition: null,
    member: [
      {
        id: "http://w3id.org/class/hochschulfaecher/B96#",
        prefLabel: {
          de: "Test-Member 1",
        },
      },
      {
        id: "http://w3id.org/class/hochschulfaecher/B97#",
        prefLabel: {
          de: "Test-Member 2",
        },
      },
    ],
  },
  language: "de",
}
