FROM node:18-slim

# Create and set the working directory
WORKDIR /usr/src/app

# Copy only package files first for layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy everything else (index.js, auth_info, etc.)
COPY . .

# Create auth_info if it doesn't exist (safe fallback)
RUN mkdir -p auth_info

# Expose a port (optional, for debugging)
EXPOSE 3000

# Start the bot
CMD ["node", "index.js"]
