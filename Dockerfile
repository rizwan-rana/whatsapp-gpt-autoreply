FROM node:18-slim

WORKDIR /app

# Copy everything first to ensure all files are available
COPY . .

# Install dependencies
RUN npm install

# Expose port (not required unless you're running a web service)
EXPOSE 3000

# Start the bot
CMD ["node", "index.js"]
