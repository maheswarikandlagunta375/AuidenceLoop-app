FROM node:22-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache curl

# Copy dependency manifests
COPY package*.json ./

# Install packages
RUN npm ci

# Copy application source
COPY . .

# Build client bundle
RUN npm run build

# Expose server port
EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

# Start full-stack server
CMD ["npm", "start"]
