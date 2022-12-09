![https://github.com/hbz/skohub-vocabs/actions?query=workflow%3ABuild](https://github.com/hbz/skohub-vocabs/workflows/Build/badge.svg?branch=master)


# Static site generator for Simple Knowledge Management Systems (SKOS)

This part of the [SkoHub](http://skohub.io) project covers the need to easily publish a controlled vocabulary as a SKOS file, with a basic lookup API and a nice HTML view. It consists of two parts: the actual static site generator and a webhook server that allows to trigger a build from GitHub. For usage & implementation details see the [blog post](https://blog.lobid.org/2019/09/27/presenting-skohub-vocabs.html).

### Install Node.js

We currently support Node >= 14.15.0.
#### Windows

Download and install the latest Node.js version from [the official Node.js website]( https://nodejs.org/en/).

#### Unix

Download the lastest nvm version.
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.1/install.sh | bash
```

Set default Node.js version. When nvm is installed, it does not default to a particular node version. You’ll need to install the version you want and give nvm instructions to use it. This example uses the version 15 release, but more recent version numbers can be used instead.

```
nvm install 14
nvm use 14
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

### Code formatting and styling

To improve code quality we currently use [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/) for formatting and linting.
Pre-Commit hooks are implemented using [lint-staged](https://github.com/okonet/lint-staged) and [husky](https://github.com/typicode/husky).
This will format the code and check for linting errors with each commit.
So if your commit errors, make sure to check the output and fix accordingly.

## Credits

The project to create a stable beta version of SkoHub has been funded by the North-Rhine Westphalian Library Service Centre (hbz) and carried out in cooperation with [graphthinking GmbH](https://graphthinking.com/) in 2019/2020.

<a target="_blank" href="https://www.hbz-nrw.de"><img src="https://raw.githubusercontent.com/skohub-io/skohub.io/master/img/logo-hbz-color.svg" width="120px"></a>
