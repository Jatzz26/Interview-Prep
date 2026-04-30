FROM ghcr.io/puppeteer/puppeteer:latest

USER root

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application source code
COPY . .

# Environment variables for Puppeteer and Render
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
ENV PORT=3000

EXPOSE 3000

# Switch back to the unprivileged user provided by the puppeteer image
USER pptruser

CMD ["npm", "start"]
