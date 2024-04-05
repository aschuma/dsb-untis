FROM node:16.4.2-slim

ENV USERNAME="username" \
    PASSWORD="secret" \
    FLATMODE="true" \
    DEBUG="false" \
    TZ="Europe/Berlin"

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm audit fix
COPY . .
EXPOSE 8080
CMD [ "node", "docker/server.js" ]
