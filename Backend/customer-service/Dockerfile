FROM node:20

# Create and set the directory inside the container
WORKDIR /node-app

# 1. Copy the package files from the ROOT context
# (Docker is looking at the folder where your docker-compose.yaml sits)
COPY package*.json ./

# 2. Install dependencies
RUN npm install --force

# 3. Copy the specific service folder into the container
# This must match the path from the root of your project
COPY ./Backend/customer-service .

# 4. Start the app
CMD ["npm", "start"]