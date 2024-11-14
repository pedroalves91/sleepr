# Development Stage
FROM node:alpine AS development

# Set working directory
WORKDIR /usr/src/app

# Copy main configuration files
COPY package*.json ./
COPY tsconfig.json nest-cli.json ./

# Install root dependencies (shared libs and tools)
RUN npm install --legacy-peer-deps

# Copy only the `notifications` and `libs` folders, to include just what's needed
COPY apps/notifications ./apps/notifications
COPY libs ./libs

# Navigate to the `notifications` directory and install any specific dependencies for `notifications`
RUN cd apps/notifications && npm install --legacy-peer-deps

# Build the `notifications` app
RUN npm run build notifications

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
CMD ["node", "dist/apps/notifications/main"]
