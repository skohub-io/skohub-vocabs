FROM node:14.21-alpine3.16

WORKDIR /app

COPY ./package.json .

COPY ./package-lock.json .

RUN npm install -f

COPY . .

COPY .env.example .env

CMD ["npm", "run", "container-build"]