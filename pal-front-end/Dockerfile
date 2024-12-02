# Use Node.js LTS as base image
FROM node:lts

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the application for production
RUN npm run build

# Expose the application port
EXPOSE 8100

# Command to run the application
CMD ["npm", "start"]