FROM node:18.13.0-buster-slim

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

CMD ["npm", "run", "container-build"]