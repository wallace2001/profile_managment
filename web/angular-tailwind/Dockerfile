### STAGE 1: Build ###
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install -g @angular/cli

RUN npm install

COPY . .

RUN npm run build --prod

EXPOSE 4200

CMD ["npm", "run", "start"]

