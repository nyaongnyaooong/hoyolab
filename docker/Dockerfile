# Use the official Node.js image as the base image
FROM node:20-alpine

RUN apk add --no-cache tzdata
# Set the timezone to KST
ENV TZ=Asia/Seoul

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
COPY .env ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY dist ./dist
# COPY . .

# Build the NestJS application
# RUN npm run build && rm -rf src

# Expose the port the app runs on
EXPOSE 3000

# Specify the command to run the application
CMD ["npm", "run", "start:prod"]