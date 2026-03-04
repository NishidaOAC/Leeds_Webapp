FROM node:20

WORKDIR /node-app

# Use the wildcard to handle cases where package-lock might be missing
COPY package*.json ./

# Verify the file is actually there during build
RUN ls -la package.json

RUN npm install --force

# Copy the specific service code
COPY ./Backend/customer-service/ .

CMD ["npm", "start"]