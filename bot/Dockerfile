FROM node:16.13.1

WORKDIR /app
COPY . .

RUN npm install

RUN npm i -g ts-node

CMD ["ts-node", "./src/main.ts"]