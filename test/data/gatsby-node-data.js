// concept scheme id: http://w3id.org/class/hochschulfaecher/scheme#
export const compactedSlashURI = {
  "@graph": [
    {
      id: "http://w3id.org/class/hochschulfaecher/B1#",
      type: "Concept",
      broader: {
        id: "http://w3id.org/class/hochschulfaecher/F1#",
      },
      definition: {
        de: "Die Agrarwissenschaften beschäftigen sich mit der Produktion von Nahrungs- und Futtermitteln durch die wirtschaftliche Nutzung und Pflege des Bodens sowie den ökonomischen und ökologischen Rahmenbedingungen des landwirtschaftlichen Produktionsprozesses. Zu den Agrarwissenschaften zählen u.a. die Agrarwirtschaft, die Landwirtschaft, der Gartenbau, der Landbau und der Weinbau. Dieser Studienbereich steht in enger Beziehung zu den Forstwissenschaften. ([Quelle](https://www.hochschulkompass.de/agrar-und-forstwissenschaften/agrarwissenschaften.html))",
      },
      inScheme: [
        {
          id: "http://w3id.org/class/hochschulfaecher/scheme#",
        },
      ],
      prefLabel: {
        de: "Agrarwissenschaft/Landwirtschaft",
        en: "Agricultural Science/Agriculture",
        uk: "Аграрні науки/Сільське господарство",
      },
    },
    {
      id: "http://w3id.org/class/hochschulfaecher/F1#",
      type: ["Concept", "http://www.w3.org/2002/07/owl#Class"],
      definition: {
        de: "Die Agrar- und Forstwissenschaften beschäftigen sich vor allem mit Ackerbau, Viehzucht und der Nutzung bzw. Gestaltung von Wald, Natur und Landschaft. Inhaltlich prägen diese Fächergruppe ökologische, wirtschaftliche, sozial- und ingenieurwissenschaftliche Fragestellungen, die im Zusammenhang mit der Natur gestellt und beantwortet werden. Neben dem Studienbereich Agrarwissenschaften sind auch Studiengänge der Forst- und Holzwirtschaften, sowie der Umwelt- und Landschaftsgestaltung Teil der Fächergruppe. ([Quelle](https://www.hochschulkompass.de/agrar-und-forstwissenschaften.html))",
      },
      hiddenLabel: {
        de: ["Hidden"],
      },
      narrower: [
        {
          id: "http://w3id.org/class/hochschulfaecher/B1#",
        },
      ],
      prefLabel: {
        de: "Agrar-, Forst- und Ernährungswissenschaften, Veterinärmedizin",
        en: "Agricultural, Forest and Nutritional Sciences, Veterinary medicine",
        uk: "Сільськогосподарські, лісові та харчові науки, ветеринарія",
      },
      scopeNote: {
        de: "Die Studiengänge der Agrar- und Forstwissenschaften sind stark durch naturwissenschaftliche Studienfächer wie Zoologie, Botanik, Physik und Chemie geprägt. Je nach Studienrichtung werden im Studium auch wirtschafts- und sozialwissenschaftliche Grundlagen vermittelt. Bei den Studiengängen der Forst- und Holzwirtschaften sowie der Umweltgestaltung stehen eher ingenieurwissenschaftlich-technische Inhalte im Fokus. ([Quelle](https://www.hochschulkompass.de/agrar-und-forstwissenschaften.html))",
      },
      topConceptOf: {
        id: "http://w3id.org/class/hochschulfaecher/scheme#",
      },
    },
    {
      id: "http://w3id.org/class/hochschulfaecher/scheme#",
      type: "ConceptScheme",
      description: {
        de: 'Diese Systematik basiert auf der Klassifikation von Studiengängen in Deutschland des [Hochschulkompass](https://www.hochschulkompass.de/studienbereiche-kennenlernen.html). Sie umfasst drei Ebenen, die im Hochschulkompass "Fächergruppen", "studienbereiche" und "Studienfelder" genannt werden.',
      },
      "dct:issued": "2019-05-27",
      title: {
        de: "Fächersystematik Hochschulbildung in Deutschland",
        en: "Destatis classification for subject groups, study areas and study subjects",
        uk: "Destatis класифікація за предметними рубриками, спеціальностями та дисциплінами",
      },
      "http://w3id.org/class/hochschulfaecher/preferredNamespacePrefix": "fshd",
      "http://w3id.org/class/hochschulfaecher/preferredNamespaceUri":
        "http://w3id.org/class/hochschulfaecher/",
      hasTopConcept: [
        {
          id: "http://w3id.org/class/hochschulfaecher/F1#",
        },
      ],
    },
  ],
}

// concept scheme id: "http://example.org/hashURIConceptScheme#scheme"
export const compactedHashURI = {
  "@graph": [
    {
      id: "http://example.org/hashURIConceptScheme#concept1",
      type: "Concept",
      narrower: [
        {
          id: "http://example.org/hashURIConceptScheme#concept4",
        },
      ],
      prefLabel: {
        de: "Concept 1",
      },
      topConceptOf: {
        id: "http://example.org/hashURIConceptScheme#scheme",
      },
    },
    {
      id: "http://example.org/hashURIConceptScheme#concept2",
      type: "Concept",
      prefLabel: {
        de: "Concept 2",
      },
      topConceptOf: {
        id: "http://example.org/hashURIConceptScheme#scheme",
      },
    },
    {
      id: "http://example.org/hashURIConceptScheme#concept3",
      type: "Concept",
      prefLabel: {
        de: "Concept 3",
      },
      topConceptOf: {
        id: "http://example.org/hashURIConceptScheme#scheme",
      },
    },
    {
      id: "http://example.org/hashURIConceptScheme#concept4",
      type: "Concept",
      broader: {
        id: "http://example.org/hashURIConceptScheme#concept1",
      },
      inScheme: [
        {
          id: "http://example.org/hashURIConceptScheme#scheme",
        },
      ],
      prefLabel: {
        de: "Konzept 4",
        en: "Concept4",
      },
    },
    {
      id: "http://example.org/hashURIConceptScheme#scheme",
      type: "ConceptScheme",
      title: {
        de: "Hash URI Concept Scheme",
      },
      hasTopConcept: [
        {
          id: "http://example.org/hashURIConceptScheme#concept1",
        },
        {
          id: "http://example.org/hashURIConceptScheme#concept2",
        },
        {
          id: "http://example.org/hashURIConceptScheme#concept3",
        },
      ],
    },
  ],
}
