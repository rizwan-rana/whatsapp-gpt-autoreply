FROM node:18-slim

# 👇 Add this line to install Git
RUN apt-get update && apt-get install -y git

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000

CMD ["node", "index.js"]
