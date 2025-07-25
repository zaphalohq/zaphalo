# Use the official Node.js image as the base image
FROM node:22 AS builder

# Set working directory
WORKDIR /app

# Copy only the package.json and lock files to install dependencies
COPY package*.json ./app

# Install dependencies
RUN yarn install

# Copy the rest of the app code
COPY . .

# Build the React app
RUN yarn nx build frontend

# Use a lightweight web server to serve the static files
FROM nginx:alpine

# Copy the build output to the Nginx directory
COPY --from=builder /app/packages/frontend/build /usr/share/nginx/html

# Expose the port Nginx is running on
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
