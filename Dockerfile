# Use Node 18
FROM node:18

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Expose dev server port
EXPOSE 3000

# Start React dev server
CMD ["npm", "start"]
