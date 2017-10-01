FROM node:8.1.3

COPY package.json /usr/src/app/package.json
COPY package-lock.json /usr/src/app/package-lock.json

WORKDIR /usr/src/app
RUN npm install --loglevel error
RUN npm install -g knex

COPY . /usr/src/app

RUN chmod +x ./initialize.sh

EXPOSE 3000
