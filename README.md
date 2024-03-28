[![Build and Tests](https://github.com/skohub-io/skohub-vocabs/actions/workflows/main.yml/badge.svg)](https://github.com/skohub-io/skohub-vocabs/actions/workflows/main.yml)

# Static site generator for Simple Knowledge Management Systems (SKOS)

This part of the [SkoHub](http://skohub.io) project covers the need to easily publish a controlled vocabulary as a SKOS file, with a basic lookup API and a nice HTML view. You can also make use of a webhook server that will trigger builds of your vocabulary from GitHub or GitLab. For usage & implementation details see [SkoHub Webhook](https://github.com/skohub-io/skohub-webhook) and this [blog post](https://blog.lobid.org/2019/09/27/presenting-skohub-vocabs.html).

## Supported URIs

SkoHub Vocabs both parses SKOS vocabularies that use slash URIs (e.g. `https://w3id.org/kim/hcrt/web_page`) and hash URIs (`https://nwbib.de/spatial#Q365`) for separating the vocabulary namespace from the local name. However, slash URIs are better supported than hash URIs.

Using slash URIs, you will get full rendered concept pages with information about all its SKOS attributes as well as a machine readable JSON-LD version of each concept.
With hash URIs you will – currently – just get a basic concept page with information regarding `id`, `skos:notation`, `skos:prefLabel`, `skos:altLabel` and `skos:narrower`.
Since hash URIs by their very nature live mostly in one document, SkoHub Vocabs does not split them, but will also return one JSON-LD document for the concept scheme with information about the above mentioned attributes.
There is not one machine readable version per concept as for slash URIs.

In general we advise the use of slash URIs for SKOS vocabularies.

If you would like more support of hash URIs for SkoHub Vocabs, [please open an issue](https://github.com/skohub-io/skohub-vocabs/issues/new/choose).

## Internationalization

To determine the language displayed of the vocabulary the browser language is used.
If the browser language is not present in the vocabulary a default language is chosen.
If you want to link to a specific language, you can use a URL parameter: `?lang=de`.

## Deprecation of Concepts

To mark a concept as deprecated you can mark it with `owl:deprecated true`.
To point to a successor add `dct:isReplacedBy`.
The information will be available in the machine readable version as well as in the html page.

## Set up

### Install Node.js

We currently support Node >= 18.
#### Windows

Download and install the latest Node.js version from [the official Node.js website]( https://nodejs.org/en/).

#### Unix

[Install the lastest nvm version](https://github.com/nvm-sh/nvm#installing-and-updating).

Set default Node.js version. When nvm is installed, it does not default to a particular node version. You’ll need to install the version you want and give nvm instructions to use it.
See [here](https://github.com/nvm-sh/nvm#bash) to automatically switch to the correct node version (not necessary, but handy).

```
nvm install 18
nvm use 18
```

### Clone repo and install node packages

    $ git clone https://github.com/skohub-io/skohub-vocabs.git
    $ cd skohub-vocabs
    $ npm i
    $ cp .env.example .env
    $ cp demo/systematik.ttl data/

## Run the static site generator

The static site generator will parse all turtle files in `./data` and build the vocabularies it finds:

    $ npm run build

The build can be found in `public/` and be served e.g. by Apache. The directory structure is derived from the URIs of the SKOS concepts, e.g. `https://w3id.org/class/hochschulfaecher/scheme` will be available from `public/w3id.org/class/hochschulfaecher/scheme(.html|.json)`.

## Running the static site generator with docker

You can also run the static site generator with docker.
It will parse all turtle files in `./data` and build the vocabularies it finds.
The build can then be found in the `public/` folder.
Since docker creates the content of this folder it will have root permissions.
So in order to delete the content you might have to use `sudo rm public`

Before running docker make sure there is the `.env` file and some data to process:

    $ cp .env.example .env
    $ cp demo/systematik.ttl data/

The use this command to build your pages with docker:

```bash
docker run \
-v $(pwd)/public:/app/public \
-v $(pwd)/data:/app/data \
-v $(pwd)/.env:/app/.env \
skohub/skohub-vocabs-docker:latest
```

To run with a **custom config** you have to mount your config file into the container:

```bash
docker run \
-v $(pwd)/public:/app/public \
-v $(pwd)/data:/app/data \
-v $(pwd)/.env:/app/.env \
-v $(pwd)/config.yaml:/app/config.yaml \
skohub/skohub-vocabs-docker:latest
```

If you are using a custom logo or font, remember to mount these as well, e.g.


```bash
docker run \
-v $(pwd)/public:/app/public \
-v $(pwd)/data:/app/data \
-v $(pwd)/.env:/app/.env \
-v $(pwd)/config.yaml:/app/config.yaml \
-v $(pwd)/static/fonts:/app/static/fonts \
skohub/skohub-vocabs-docker:latest
```

## Validation of SKOS files

During the build the provided SKOS files are validated against this [SkoHub SHACL shape](https://github.com/skohub-io/shapes/blob/main/skohub.shacl.ttl).
The SkoHub SHACL shape is an opinionated and more restrictive version of the generic SKOS shape you can find in the same repo: https://github.com/skohub-io/shapes

If the SKOS file violates the shape, the build will error and stop.
If you just hit warnings you will see them in the console output.

## Serve from other location than root (`/`)

If you want to serve your sites from another location than root, you can make use of the `BASEURL`-variable.
E.g. if you are using a VS Code plugin like [Vscode Live Server](https://github.com/ritwickdey/vscode-live-server-plus-plus) or `python -m http.server` to preview the built pages, you might get errors when clicking links, because the files are in the `public/` folder.
You can either `cp .env.example .env` and then set your `BASEURL` in `.env`: `BASEURL=public`
Or you can prefix the build command: `BASEURL=public npm run build`.

## Configuration

Configurations can be made via a `config.yaml` file.
To start configuring copy the default file `cp config.default.yaml config.yaml`.

You can configure the following settings:

- Tokenizer used for searching
- Custom Domain
- Fail on Validation
- UI Configurations
    - Title
    - Logo
    - Colors
    - Fonts
- Searchable Fields

The settings are explained in the following sections.

### Tokenizer

SkoHub Vocabs uses Flexsearch v0.6.32 for its searching capabilities.
Flexsearch offers [different tokenizers](https://github.com/nextapps-de/flexsearch#tokenizer-prefix-search) for indexing your vocabularies.
The chosen tokenizer directly affects the required memory and size of your index file.
SkoHub Vocabs defaults to `full` tokenizer.

### Custom Domain

If you want to host your vocabularies under a custom domain (so no W3 perma-id or purl.org redirect), you have to provide that domain in the config.
Example:

The base of your concept scheme is: `http://my-awesome-domain.org/my-vocab`
Then provide `http://my-awesome-domain.org` as `custom_domain` in your `config.yaml`

### Fail on Validation

If `true` (default) the build process will stop if a validation error occures.

### UI

The following customizations can be made:

1. Title
1. Changing the Logo
1. Changing the Colors
1. Changing the Fonts

#### Changing the Title

The Title is mandatory and SkoHub Vocabs will throw an error if it is left empty.

#### Changing the Logo

The logo is served from `static/img`.
To use another logo, put it in there and update the name of the file in the config.

The new logo doesn't scale correctly? 
Please check the proportions in [line 38](src/components/header.js#L38) and [line 39](src/components/header.js#L39) (width and height).

#### Changing the Colors

We use the following default colors / variables:

- `skoHubWhite: 'rgb(255, 255, 255)'`,
- `skoHubDarkColor: 'rgb(15, 85, 75)'`,
- `skoHubMiddleColor: 'rgb(20, 150, 140)'`,
- `skoHubLightColor: 'rgb(40, 200, 175)'`,
- `skoHubThinColor: 'rgb(55, 250, 210)'`,
- `skoHubBlackColor: 'rgb(5, 30, 30)'`,
- `skoHubAction: 'rgb(230, 0, 125)'`,
- `skoHubNotice: 'rgb(250, 180, 50)'`,
- `skoHubDarkGrey: 'rgb(155, 155, 155)'`,
- `skoHubMiddleGrey: 'rgb(200, 200, 200)'`,
- `skoHubLightGrey: 'rgb(235, 235, 235)'`,

To change a color, the RGB values can be adjusted.
HEX codes are also possible.

You need to provide all colors in your config.
Otherwise SkoHub Vocabs will use the default colors.

#### Changing the Fonts

We use fonts that are self-hosted.
If you want to change a font, please upload the new font to the [static/fonts](static/fonts) folder.
You can for example get fonts from Google Fonts (download / free of charge).

We need the font as `ttf`, `woff` and `woff2` and use a regular and a bold font.
After that you have to adjust the config with the appropriate settings for `font_family`, `font_style`, `font_weight` and `name`. 
`name` is the file name of your font (without extension).

You need to provide all settings for `regular` as well as `bold`.
Otherwise SkoHub Vocabs will use the default fonts.

## Adding additional properties to SkoHub Vocabs

If you need additional properties beside SKOS, here is how you add them:

E.g. add `https://schema.org/url` with a value of type string (see below if it is a resource / URI)

* [`context.js`](./src/context.js), add the property you want to add:

```json
url: {
  "@id": "schema:url",
  "@container": "@set"
}
```

* [`queries.js`](./src/queries.js), add the property:

```graphql
...
topConceptOf {
    id
    title {
      ${[...languages].join(" ")}
    }
  }
url
...
```

If the property you are adding is a resource (i.e. has a URI), you need to specify that you want its `id`:

```graphql
...
topConceptOf {
    id
    title {
      ${[...languages].join(" ")}
    }
  }
url {
  id
}
...
```

* (Only necessary if you want to interact with that attribute on the built pages. E.g. for displaying it on concept pages) [`types.js`](./src/types.js), add the GraphQL type:

```graphql
url: [String]
```

This will add the `url` field, being an array of strings.
For other types, compare with already existing properties and just copy as you need.

## Adding Searchable Fields

To add a field to be searchable you have to make the following adjustments:

- Add the field in the `config.yaml` file to `searchableAttributes`, e.g. `editorialNote`
- In `src/queries.js` add it to `ConceptFields` (around line 176):
```graphql
editorialNote {
  ${[...languages].join(" ")}
}
```
- Add it to the labels to be indexed. Go to `gatsby-node.js` and add it the document object around line 341. For fields being *single* language tagged labels (e.g. `skos:prefLabel`) use `prefLabel` as an example. For fields being arrays of language tagged labels (e.g. `skos:altLabel`) use `altLabel` as an example. For `skos:editorialNote` it would be:
```js
...(concept.editorialNote &&
Object.hasOwn(concept.editorialNote, language) && {
  editorialNote: i18n(language)(concept.editorialNote),
}),
```

## Troubleshooting

Depending on special circumstances you may get errors in the log files, e.g.
`EMFILE: too many open files`. [Search our issues for solutions](https://github.com/skohub-io/skohub-vocabs/issues?q=is%3Aissue) or feel encouraged to open a new issue if you can't find a solution.

## Development

For development on your local machine you can use Docker compose: 

    $ docker compose up

to spin up a docker container as configured in `Dockerfile.dev`. Inside the container, the web server is running in development mode. The build is accessible on the host via port mapping at `http://localhost:8000/`.

Your project folder will be mounted into the container, with exceptions defined in `.dockerignore`. Fast refresh aka hot reloading is kept so changes to the source files should affect the generated static sites instantly.

If you added packages with `npm i <package_name>` make sure to rebuild the container with `docker compose up --build --force-recreate`.

If you run into permission errors when starting the container, it might be that the `public` folder got created with root permissions, when you built yor vocabulary with docker.
Run `sudo rm -rf public` to delete the folder and then run docker compose again.

### Code formatting and styling

To improve code quality we currently use [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/) for formatting and linting.
Pre-Commit hooks are implemented using [lint-staged](https://github.com/okonet/lint-staged) and [husky](https://github.com/typicode/husky).
This will format the code and check for linting errors with each commit.
So if your commit errors, make sure to check the output and fix accordingly.

### Testing

We use unit, integration and E2E tests, but don't distinguish too hard between unit and integration tests, since the distinction between these are a bit blurry in component development (see [React Testing Overview](https://reactjs.org/docs/testing.html)).
In general a behaviour driven development is favoured and for every new feature an appropriate test should be added.
The unit and integration tests can be found in the `test` folder.
We use [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for testing.

To run these tests use `npm run test` or `npm run test:coverage` to see coverage reports.

For E2E tests we use [Cypress](https://www.cypress.io/). The tests can be found in `cypress/e2e`.
The E2E tests should generally test the interaction with the app like a typical user would.

To run E2E tests the `*.ttl` files from `./test/data` must be present in `./data`.
They will be automatically copied there if you run the below mentioned commands making use of the `cypress/prepare-cypress-test.sh` script.

Run `npm run test:e2e:ci` for running e2e tests in the console.
If you want to run cypress interactively run `npm run test:e2e`.

## Credits

The project to create a stable beta version of SkoHub has been funded by the North-Rhine Westphalian Library Service Centre (hbz) and carried out in cooperation with [graphthinking GmbH](https://graphthinking.com/) in 2019/2020.

<a target="_blank" href="https://www.hbz-nrw.de"><img src="https://raw.githubusercontent.com/skohub-io/skohub.io/main/img/logo-hbz-color.svg" width="120px"></a>
