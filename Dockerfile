FROM node:18-slim

# Install git (required by some npm packages)
RUN apt-get update && apt-get install -y git

# Create and set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Create auth_info if missing
RUN mkdir -p auth_info

# Optional: Expose port for debugging
EXPOSE 3000

# Start the bot
CMD ["node", "index.js"]
