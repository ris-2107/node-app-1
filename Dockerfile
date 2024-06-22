# Use the official Node.js 18.14.0 Alpine image as base
FROM node:18.14.0-alpine as build

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the app (if you have any build steps, otherwise skip this step)
# RUN npm run build

# Use a smaller base image for the final stage
FROM node:18.14.0-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy only the necessary files from the build stage
COPY --from=build /usr/src/app ./

# Install nodemon globally for development
RUN npm install -g nodemon
# Expose the port your app runs on
EXPOSE 8000

# Command to run your application
CMD ["nodemon", "app.js"]
