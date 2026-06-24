FROM node:22-bookworm-slim

ENV NODE_ENV production

WORKDIR /app

RUN chown -R node:node /app

COPY --chown=node:node .env.example .env
COPY --chown=node:node . .

USER node

# don't run prepare step with husky
RUN npm pkg delete scripts.prepare

RUN npm i --only=production

# disable notifier warning
RUN npm config set update-notifier false

# Make the image runnable as an arbitrary uid (e.g. `docker run --user <uid>:<gid>`),
# so a webhook host process can own the build output it bind-mounts and clean it up
# on rebuild. Without this the image only works as its baked-in `node` user:
#  - HOME/npm cache point at a writable, uid-independent location
#  - /app and the gatsby build cache are writable by any uid
#  - gatsby writes latest-adapters.js into its own package dir at build time,
#    so that dir must be writable by an arbitrary uid too
ENV HOME=/tmp
ENV NPM_CONFIG_CACHE=/tmp/.npm
RUN mkdir -p /app/.cache \
 && chmod -R a+rwX /app/.cache /app/node_modules/gatsby \
 && chmod a+rwX /app

CMD ["npm", "run", "container-build"]