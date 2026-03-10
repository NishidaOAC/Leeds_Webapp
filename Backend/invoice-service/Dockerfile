FROM node:20
WORKDIR /node-app

# 1. Copy package files from the Backend root
COPY package*.json ./

# 2. Install dependencies
RUN npm install --force

# 3. Copy ONLY this specific service's code
# Because context is ./Backend, we must specify the folder name
COPY . . 

CMD ["npm", "start"]