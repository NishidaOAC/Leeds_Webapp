FROM node:20
WORKDIR /node-app

# Explicitly copy the package files first to the current WORKDIR
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy the rest of the files
COPY . .

CMD ["npm", "start"]