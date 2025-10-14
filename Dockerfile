# Use node image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# Expose React port
EXPOSE 3000

# Start React development server
CMD ["npm", "start"]
