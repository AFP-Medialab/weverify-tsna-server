FROM node:14.15.0-slim as builder
RUN mkdir -p /home/node/app/build
WORKDIR /home/node/app/build

COPY . .
RUN npm ci --only=production
RUN npx next telemetry disable
RUN npm run build
RUN npm prune --production

FROM node:14.15.0-slim
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

COPY --from=builder /home/node/app/build/.next ./.next
COPY --from=builder /home/node/app/build/public ./public
COPY --from=builder /home/node/app/build/node_modules ./node_modules


EXPOSE 3000

CMD ["node_modules/.bin/next", "start"]



