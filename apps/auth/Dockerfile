# Development Stage
FROM node:alpine AS development

# Set working directory
WORKDIR /usr/src/app

# Copy main configuration files
COPY package*.json ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json
COPY apps/auth/prisma ./prisma

# Install root dependencies (shared libs and tools)
RUN npm install --legacy-peer-deps

RUN npx prisma generate

# Copy only the `auth` and `libs` folders, to include just what's needed
COPY apps/auth ./apps/auth
COPY libs ./libs

# Navigate to the `auth` directory and install any specific dependencies for `auth`
RUN cd apps/auth && npm install --legacy-peer-deps

# Build the `auth` app
RUN npm run build auth

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
CMD ["npm", "run", "start:prod", "dist/apps/auth/main"]
