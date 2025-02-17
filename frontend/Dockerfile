# Use Node.js base image
FROM node:20

# Set work directory inside container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy frontend source code
COPY . .

# Expose frontend port
EXPOSE 3000

# Run React frontend
CMD ["npm", "run", "dev"]