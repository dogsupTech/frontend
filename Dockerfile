# Define the base node image with specific version and platform
FROM node:18.17.0-alpine as build

# Set the working directory in the container
WORKDIR /app

# Install PNPM
RUN npm install -g pnpm

# Copy package.json and lock file
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the application
RUN pnpm run build

# Start a new, final image to reduce size
FROM node:18.17.0-alpine

# Install PNPM
RUN npm install -g pnpm

# Set the working directory in the container
WORKDIR /app


# Copy built artifacts from the build stage
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/locales ./locales

# Expose the port Next.js runs on
EXPOSE 3000

# Command to run the application
CMD ["pnpm", "start"]
