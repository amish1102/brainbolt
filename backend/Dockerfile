FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of backend code
COPY . .

# Build TypeScript
RUN npm run build

# Expose backend port
EXPOSE 4000

# Start compiled app
CMD ["node", "dist/server.js"]
