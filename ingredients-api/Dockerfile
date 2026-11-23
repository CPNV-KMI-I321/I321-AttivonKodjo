FROM node:24-bookworm-slim
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY src ./src
RUN mkdir -p /app/data && chown node:node /app/data

ENV NODE_ENV=production
ENV PORT=3002
ENV DB_PATH=/app/data/ingredients.sqlite

EXPOSE 3002
USER node
CMD ["node", "src/server.js"]
