# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory to /app
WORKDIR /app

# Copy only the package.json and package-lock.json to /app
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Make sure to expose the port your backend is listening on
EXPOSE 5000

# Define the default command to run your backend application
CMD ["node", "server.js"]
