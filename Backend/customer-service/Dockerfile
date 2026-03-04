FROM node:20

# Create directory
WORKDIR /node-app

# 1. Copy package files from the root context
# We use ./ to represent the root of the build context
COPY ./package.json ./
COPY ./package-lock.json ./

# 2. Install
RUN npm install --force

# 3. Copy the specific service code
COPY ./Backend/customer-service/ .

CMD ["npm", "start"]