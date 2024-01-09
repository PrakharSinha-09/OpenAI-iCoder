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

# Make port 3000 available to the world outside this container
EXPOSE 5173

# Define the default command to run your application
CMD ["npm", "run", "dev"]
