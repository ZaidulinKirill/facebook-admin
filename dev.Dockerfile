FROM node:14-alpine
WORKDIR /app

COPY ./package*.json ./
RUN npm i

COPY ./nuxt.config.js ./

CMD [ "npm", "run", "dev" ]
