# Use an official Node.js runtime as a parent image
FROM node:19-alpine

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install --production

# Copy the rest of the application code to the container
COPY . .

# Set environment variables
ENV NODE_ENV production
ENV PORT 3333

# Expose the port the app listens on
EXPOSE $PORT

# Start the application
CMD [ "npm", "start" ]
