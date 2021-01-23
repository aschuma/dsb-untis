FROM node:14.15.4-slim

ENV USERNAME="username" \
    PASSWORD="secret" \
    FLATMODE="true" \
    TZ="Europe/Berlin"

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm audit fix
COPY . .
EXPOSE 8080
CMD [ "node", "docker/server.js" ]