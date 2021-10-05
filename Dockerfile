FROM node:14.18.0-slim as builder
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

COPY ./build/.next ./.next
COPY ./build/public ./public
COPY ./build/node_modules ./node_modules


EXPOSE 3000

CMD ["node_modules/.bin/next", "start"]



