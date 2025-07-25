# Uses the official Node.js image version 18
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
RUN npm install --ignore-scripts

# Copy all the files from the app directory to the working directory
COPY src .       

# Change ownership of the app directory to the node user
RUN chown -R node:node /usr/src/app

# Switch to the non-root user
USER node

# Expose port 80 for the web server
EXPOSE 80

# Start the Node.js application
CMD ["node", "server.js"]
