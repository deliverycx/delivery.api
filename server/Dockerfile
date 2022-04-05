FROM node:16.13.1 AS development

WORKDIR /usr/node/app

COPY package*.json ./

RUN npm install --only=development

COPY . .

RUN npm run build

FROM node:16.13.1 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/node/app


COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/node/app/dist ./dist

CMD ["node", "dist/main"]