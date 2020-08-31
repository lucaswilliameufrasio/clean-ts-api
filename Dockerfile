FROM node:12
WORKDIR /usr/app/clean-node-api
COPY ./package.json .
RUN npm install --only=prod
