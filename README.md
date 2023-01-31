[![Build and Tests](https://github.com/skohub-io/skohub-vocabs/actions/workflows/main.yml/badge.svg)](https://github.com/skohub-io/skohub-vocabs/actions/workflows/main.yml)

# Static site generator for Simple Knowledge Management Systems (SKOS)

This part of the [SkoHub](http://skohub.io) project covers the need to easily publish a controlled vocabulary as a SKOS file, with a basic lookup API and a nice HTML view. It consists of two parts: the actual static site generator and a webhook server that allows to trigger a build from GitHub. For usage & implementation details see the [blog post](https://blog.lobid.org/2019/09/27/presenting-skohub-vocabs.html).

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

The `.env` file contains configuration details used by the static site generator and the webhook server (like `PORT`, see below).

After changes to your `.env` or `data/*` files, make sure to delete the `.cache` directory:

    $ rm -rf .cache

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

Use this command to build your pages with docker:

`docker run -v $(pwd)/public:/app/public -v $(pwd)/data:/app/data -v $(pwd)/.env:/app/.env skohub/skohub-vocabs-docker:latest`

## Serve from other location than root (`/`)

If you want to serve your sites from another location than root, you can make use of the `BASEURL`-variable in `.env`.
If you are using a VS Code plugin like [Vscode Live Server](https://github.com/ritwickdey/vscode-live-server-plus-plus) or `python -m http.server` to preview the built pages, you might get errors when clicking links, because the files are in the `public/` folder.
To fix this set `BASEURL=public` in your `.env` file.

## UI Configuration

The following customizations can be made:

1. Changing the Logo
1. Changing the Fonts
1. Changing the Colors

### Changing the Logo

The logo consists of two parts.
The first is a graphics file.
And the second is simply text.

If you **don't want to use the text**, just delete `<span class="skohubTitle">SkoHub Vocabs</span>` in [src/components/header.js](src/components/header.js#L115). Then the graphic logo remains.

If you **don't want to use the graphics file**, just delete the `img`-Tag in [src/components/header.js](src/components/header.js#L114). 
Then only the text remains.

If you want to **change the graphics file**, you can upload a new file to [src/images](src/images).
Then you need to change the path in [src/components/header.js](src/components/header.js#L9) at line 9 `import skohubsvg from ...`. 
The new logo doesn't scale correctly? 
Please check the proportions in [line 28](src/components/header.js#L28) (width and height).
That's all.

### Changing the fonts

We use fonts that are self-hosted.

If you want to change a font, please upload the new font to the [src/fonts](src/fonts) folder.
You can for example get fonts from Google Fonts (download / free of charge).

After that you have to adjust the CSS at [src/components/layout.js](src/components/layout.js).
1. Change the import path at [line 19](src/components/layout.js#L19) and following.
1. Change `@font-face` at [line 78](src/components/layout.js#L78) an following. 
1. Change the `font-family` in the [css body tag at line 128](src/components/layout.js#L128) an following. That's all.

### Changing the Colors

There are no colors in the templates.
We only use variables [src/styles/variables.js](src/styles/variables.js).

We use the following default colors / variables:

- `skoHubWhite: 'rgb(255, 255, 255)'`,
- `skoHubDarkGreen: 'rgb(15, 85, 75)'`,
- `skoHubMiddleGreen: 'rgb(20, 150, 140)'`,
- `skoHubLightGreen: 'rgb(40, 200, 175)'`,
- `skoHubThinGreen: 'rgb(55, 250, 210)'`,
- `skoHubBlackGreen: 'rgb(5, 30, 30)'`,
- `skoHubAction: 'rgb(230, 0, 125)'`,
- `skoHubNotice: 'rgb(250, 180, 50)'`,
- `skoHubDarkGrey: 'rgb(155, 155, 155)'`,
- `skoHubMiddleGrey: 'rgb(200, 200, 200)'`,
- `skoHubLightGrey: 'rgb(235, 235, 235)'`,

To change a color, the RGB values can be adjusted.
HEX codes are also possible.
The names of variables should only be changed if you use "search and replace" to adapt the names also in the templates.

## Running the webhook server

The webhook server allows to trigger a build when vocabularies are updated (i.e. changes are merged into the `master` branch) on GitHub.

Running `npm run listen` will start the server on the defined `PORT` and expose a `build` endpoint. In order to wire this up with GitHub, this has to be available to the public. You can then configure the webhook in your GitHub repositories settings:

![image](https://user-images.githubusercontent.com/149825/62695510-c756b880-b9d6-11e9-86a9-0c4dcd6bc2cd.png)

## Connecting to our webhook server

Feel free to clone https://github.com/literarymachine/skos.git to poke around. Go to https://github.com/YOUR_GITHUB_USER/skos/settings/hooks/new to set up the web hook (get in touch to receive the secret). Edit https://github.com/YOUR_GITHUB_USER/skos/edit/master/hochschulfaecher.ttl and commit the changes to master. This will trigger a build and expose it at https://test.skohub.io/YOUR_GITHUB_USER/skos/w3id.org/class/hochschulfaecher/scheme.

## Use start scripts and monit

You may want to use the start scripts in `scripts/` to manage via init and to monitor with `monit`.

## Troubleshooting

Depending on special circumstances you may get errors in the log files, e.g.
`EMFILE: too many open files`. [Search our issues for solutions](https://github.com/skohub-io/skohub-vocabs/issues?q=is%3Aissue) or feel encouraged to open a new issue if you can't find a solution.

## Development

For development on your local machine you can use Docker compose: 

    $ docker compose up

to spin up a docker container as configured in `Dockerfile.dev`. Inside the container, the web server is running in development mode. The build is accessible on the host via port mapping at `http://localhost:8000/`.

Your project folder will be mounted into the container, with exceptions defined in `.dockerignore`. Fast refresh aka hot reloading is kept so changes to the source files should affect the generated static sites instantly.

### Code formatting and styling

To improve code quality we currently use [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/) for formatting and linting.
Pre-Commit hooks are implemented using [lint-staged](https://github.com/okonet/lint-staged) and [husky](https://github.com/typicode/husky).
This will format the code and check for linting errors with each commit.
So if your commit errors, make sure to check the output and fix accordingly.

### Testing

We use unit, integration and E2E tests, but don't distinguish too hard between unit and integration tests, since the distinction between these are a bit blurry in component development (see [React Testing Overview](https://reactjs.org/docs/testing.html)).
In general a behaviour driven development is favoured and for every new feature an appropriate test should be added.
The unit and integration tests can be found in the `test` folder.
We use [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for testing.

To run these tests use `npm run test` or `npm run test:coverage` to see coverage reports.

For E2E tests we use [Cypress](https://www.cypress.io/). The tests can be found in `cypress/e2e`.
The E2E tests should generally test the interaction with the app like a typical user would.

To run E2E tests the three `.ttl` files (and just these) from the `test` folder must be present in the data folder.
You can copy them directly there or use the `cypress/prepare-cypress-test.sh` script.

After that run `npm run test:e2e:ci` for running e2e tests in the console.
If you want to run cypress interactivley run `npm run test:e2e`.

## Credits

The project to create a stable beta version of SkoHub has been funded by the North-Rhine Westphalian Library Service Centre (hbz) and carried out in cooperation with [graphthinking GmbH](https://graphthinking.com/) in 2019/2020.

<a target="_blank" href="https://www.hbz-nrw.de"><img src="https://raw.githubusercontent.com/skohub-io/skohub.io/master/img/logo-hbz-color.svg" width="120px"></a>
