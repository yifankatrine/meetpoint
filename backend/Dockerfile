FROM node:lts-alpine

WORKDIR /app

COPY package.json package.json
RUN npm install

COPY .env .env
COPY . .

EXPOSE 5000

CMD ["npm", "run", "start"]