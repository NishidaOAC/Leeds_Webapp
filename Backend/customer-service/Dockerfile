FROM node:20

# Force the creation of the directory
RUN mkdir -p /node-app
WORKDIR /node-app

# 1. Copy specifically from the root context to the current WORKDIR
COPY package.json /node-app/package.json
COPY package-lock.json* /node-app/

# 2. DEBUG: List files to PROVE it exists before npm runs
RUN ls -la /node-app

# 3. Install
RUN npm install --force

# 4. Copy the service code
COPY ./Backend/customer-service /node-app

CMD ["npm", "start"]