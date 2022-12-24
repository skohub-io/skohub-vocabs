FROM node:18.12-alpine 

WORKDIR /app

COPY ./package.json .

COPY ./package-lock.json .

COPY ./.npmrc .

RUN npm install -f

COPY . .

COPY .env.example .env

CMD ["npm", "run", "container-build"]