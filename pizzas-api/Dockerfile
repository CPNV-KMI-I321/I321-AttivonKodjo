FROM node:24-bookworm-slim
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY src ./src
RUN mkdir -p /app/data && chown node:node /app/data

ENV NODE_ENV=production
ENV PORT=3001
ENV DB_PATH=/app/data/pizzas.sqlite

EXPOSE 3001
USER node
CMD ["node", "src/server.js"]
