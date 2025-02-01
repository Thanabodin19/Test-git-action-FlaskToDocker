FROM node:18-alpine

WORKDIR /dashboard-next

# Copy only package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the project files
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]