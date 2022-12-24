FROM node:18.12.1-bullseye-slim, 

WORKDIR /app

COPY ./package.json .

COPY ./package-lock.json .

RUN npm install -f

COPY . .

COPY .env.example .env

CMD ["npm", "run", "container-build"]