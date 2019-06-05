FROM node:latest

WORKDIR /app

RUN npm run build

ADD dist /app/dist

EXPOSE 5000

RUN npx serve dist
