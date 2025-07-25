# Base image
FROM node:22 as builder

# Set working directory
WORKDIR /app

# Copy the root package.json and yarn.lock to install dependencies
COPY package*.json ./app

# Install dependencies
RUN yarn install

# Copy the entire monorepo to the container
COPY . .

# Build the NestJS app
RUN yarn nx build server

# Use a lightweight Node.js image for the production environment
FROM node:22-alpine as yaari

RUN apk add --no-cache postgresql-client

# Set working directory
COPY packages/server/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh
WORKDIR /app

# Copy the build output and install only production dependencies
COPY --from=builder /app/packages/server /app
COPY --from=builder /app/node_modules /app/node_modules

# Expose the server port
EXPOSE 3000

# Start the NestJS app
CMD ["yarn", "start"]
ENTRYPOINT ["/app/entrypoint.sh"]
