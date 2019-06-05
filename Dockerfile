FROM node:10.16-alpine

WORKDIR /app

ADD dist /app/dist

EXPOSE 5000

RUN npx serve dist
