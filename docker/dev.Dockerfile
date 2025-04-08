# Use the official Node.js image as the base image
FROM node:20-alpine

# Set the timezone to Asia/Seoul
# RUN apt-get update && apt-get install -y tzdata && \
#     ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
#     echo "Asia/Seoul" > /etc/timezone

RUN apk add --no-cache tzdata
# Set the timezone to KST
ENV TZ=Asia/Seoul

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY ["tsconfig.build.json", "tsconfig.json", "./"]
COPY ["nest-cli.json", "./"]

COPY [".env", "./"]
# COPY ["src/", "./src/"]

# Build the NestJS application
# RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Specify the command to run the application
CMD ["npm", "run", "start:dev"]