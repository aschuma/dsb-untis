FROM node:16.4-slim

ENV USERNAME="username" \
    PASSWORD="secret" \
    FLATMODE="true" \
    DEBUG="false" \
    TZ="Europe/Berlin"

WORKDIR /usr/src/app
COPY package*.json ./

RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get clean autoclean && apt-get autoremove -y && rm -rf /var/lib/apt/lists/* \
    && npm install \
    && npm audit fix
    
COPY . .
EXPOSE 8080
CMD [ "node", "docker/server.js" ]
