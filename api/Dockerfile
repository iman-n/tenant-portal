# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Add wait-for-it script
COPY wait-for-it.sh ./wait-for-it.sh
RUN chmod +x wait-for-it.sh

# Expose port
EXPOSE 3000

# Create start script
COPY start.sh ./start.sh
RUN chmod +x start.sh

# Start the application
CMD ["./start.sh"]
