FROM node:alpine

ARG NODE_ENV=${NODE_ENV}

WORKDIR /usr/app

COPY package.json yarn.lock ./

RUN yarn install

COPY . ./

EXPOSE 3000

CMD if [ ${NODE_ENV} = "prod" ]; then yarn start; else yarn dev; fi