# Use Node 20 LTS
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all project files
COPY . .

# Build for production
RUN npm run build

# Run the frontend with serve
CMD ["npx", "serve", "-s", "dist", "-l", "3000"]
