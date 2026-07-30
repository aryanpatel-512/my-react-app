FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# We expose 10000 since the app is configured for port 10000 on Render
EXPOSE 10000

CMD ["node", "server.js"]
