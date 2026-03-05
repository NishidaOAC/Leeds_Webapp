FROM node:20

# Create app directory
WORKDIR /node-app

# Copy package files first (better for caching)
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy the rest of the source code
COPY . .

# Start the application
CMD ["npm", "start"]