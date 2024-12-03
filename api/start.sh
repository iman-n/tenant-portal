#!/bin/sh

# Wait for PostgreSQL to be ready
./wait-for-it.sh postgres:5432 -- echo "PostgreSQL is up"

# Run migrations
npx prisma migrate deploy

# Start the application
npm run start:prod
