FROM node:14.15.0-slim as builder
RUN mkdir -p /home/node/app/build
WORKDIR /home/node/app/build

COPY . .
RUN npm ci --only=production
RUN npm run build
RUN npm prune --production

FROM node:14.15.0-slim
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

COPY --from=builder /home/node/app/build/package*.json ./
COPY --from=builder /home/node/app/build/.next ./.next
COPY --from=builder /home/node/app/build/public ./public
COPY --from=builder /home/node/app/build/server.js ./
COPY --from=builder /home/node/app/build/node_modules ./node_modules
#RUN npm install next

EXPOSE 3000

CMD npm start



