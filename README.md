[![Build and Tests](https://github.com/skohub-io/skohub-vocabs/actions/workflows/main.yml/badge.svg)](https://github.com/skohub-io/skohub-vocabs/actions/workflows/main.yml)

# Static site generator for Simple Knowledge Management Systems (SKOS)

This part of the [SkoHub](http://skohub.io) project covers the need to easily publish a controlled vocabulary as a SKOS file, with a basic lookup API and a nice HTML view. You can also make use of a webhook server that will trigger builds of your vocabulary from GitHub or GitLab. For usage & implementation details see [SkoHub Webhook](https://github.com/skohub-io/skohub-webhook) and this [blog post](https://blog.lobid.org/2019/09/27/presenting-skohub-vocabs.html).

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

## Set up

    $ git clone https://github.com/skohub-io/skohub-vocabs.git
    $ cd skohub-vocabs
    $ npm i
    $ cp .env.example .env
    $ cp test/data/systematik.ttl data/

The `.env` file contains configuration details used by the static site generator and the webhook server (like `PORT`, see below).

After changes to your `.env` or `data/*` files, make sure to delete the `.cache` directory:

    $ rm -rf .cache

## Running the static site generator

The static site generator will parse all turtle files in `./data` and build the vocabularies it finds:

    $ npm run build

The build can be found in `public/` and be served e.g. by Apache. The directory structure is derived from the URIs of the SKOS concepts, e.g. `https://w3id.org/class/hochschulfaecher/scheme` will be available from `public/w3id.org/class/hochschulfaecher/scheme(.html|.json)`.

You can also run the development web server:

    $ npm run develop

to serve the build from `http://localhost:8000/`. Again, the URL is based on the SKOS URIs, e.g. `http://localhost:8000/w3id.org/class/hochschulfaecher/scheme.html`

## Running the static site generator with docker

You can also run the static site generator with docker.
It will parse all turtle files in `./data` and build the vocabularies it finds.
The build can then be found in the `public/` folder.
Since docker creates the content of this folder it will have root permissions.
So in order to delete the content you might have to use `sudo rm public`

Use this command to build your pages with docker:

`docker run -v $(pwd)/public:/app/public -v $(pwd)/data:/app/data -v $(pwd)/.env:/app/.env skohub/skohub-vocabs-docker:master`

## Serving from other location than root (`/`)

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

## Troubleshooting

Depending on special circumstances you may get errors in the log files, e.g.
`EMFILE: too many open files`. [Search our issues for solutions](https://github.com/skohub-io/skohub-vocabs/issues?q=is%3Aissue) or feel encouraged to open a new issue if you can't find a solution.

## Development

### Code formatting and styling

To improve code quality we currently use [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/) for formatting and linting.
Pre-Commit hooks are implemented using [lint-staged](https://github.com/okonet/lint-staged) and [husky](https://github.com/typicode/husky).
This will format the code and check for linting errors with each commit.
So if your commit errors, make sure to check the output and fix accordingly.

## Credits

The project to create a stable beta version of SkoHub has been funded by the North-Rhine Westphalian Library Service Centre (hbz) and carried out in cooperation with [graphthinking GmbH](https://graphthinking.com/) in 2019/2020.

<a target="_blank" href="https://www.hbz-nrw.de"><img src="https://raw.githubusercontent.com/skohub-io/skohub.io/master/img/logo-hbz-color.svg" width="120px"></a>
