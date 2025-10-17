FROM node:20-slim AS builder
WORKDIR /app


COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund

COPY . .

ENV MONGODB_URI="mongodb://placeholder-for-build"
ENV NEXTAUTH_SECRET="placeholder-for-build"

RUN npm run build

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "start"]