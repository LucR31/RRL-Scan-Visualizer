# Use an official Node.js image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the desired port (adjust if needed)
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
