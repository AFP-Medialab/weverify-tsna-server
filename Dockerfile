FROM --platform=${BUILDPLATFORM:-linux/amd64} node:18-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat

WORKDIR /app
COPY package.json package-lock.json*  ./
RUN  npm ci --legacy-peer-deps

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
COPY entrypoint.sh .
COPY .env.production .

ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

FROM base AS runner
RUN apk add --no-cache bash
#RUN mkdir -p /home/node/app/build
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/entrypoint.sh ./


RUN ["chmod", "+x", "./entrypoint.sh"]
ENTRYPOINT ["./entrypoint.sh"]

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]

