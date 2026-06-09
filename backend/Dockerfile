FROM node:20-alpine

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY package*.json ./

RUN npm install && \
    npm cache clean --force

COPY . .

USER appuser

EXPOSE 3000

CMD ["npm", "run", "server"]