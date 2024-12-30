# Development Stage
FROM node:alpine AS development

# Set working directory
WORKDIR /usr/src/app

# Copy main configuration files
COPY package*.json ./
COPY tsconfig.json nest-cli.json ./

# Install root dependencies (shared libs and tools)
RUN npm install --legacy-peer-deps

# Copy only the `gateway` and `libs` folders, to include just what's needed
COPY apps/gateway ./apps/gateway
COPY libs ./libs

# Navigate to the `gateway` directory and install any specific dependencies for `gateway`
RUN cd apps/gateway && npm install --legacy-peer-deps

# Build the `gateway` app
RUN npm run build gateway

# Production Stage
FROM node:alpine AS production

# Set environment to production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Set working directory for production
WORKDIR /usr/src/app

# Copy only necessary files for production installation
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production && npm cache clean --force

# Copy the built files from the development stage
COPY --from=development /usr/src/app/dist ./dist

# Run the application
CMD ["node", "dist/apps/gateway/main"]
