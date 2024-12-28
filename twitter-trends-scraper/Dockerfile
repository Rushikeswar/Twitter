# Use a more full-featured base image for compatibility
FROM node:16

# Set working directory inside the container
WORKDIR /app

# Install required system dependencies including Google Chrome
RUN apt-get update && apt-get install -y \
    wget \
    curl \
    unzip \
    gnupg2 \
    lsb-release \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libxss1 \
    xdg-utils \
    libx11-xcb1 \
    libdbus-1-3 \
    libxtst6 \
    gnupg \
    && curl -sS https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb -o google-chrome-stable_current_amd64.deb \
    && dpkg -i google-chrome-stable_current_amd64.deb \
    || apt-get install -f -y \
    && rm google-chrome-stable_current_amd64.deb

# Set the path to the Chrome binary
ENV GOOGLE_CHROME_BIN=/usr/bin/google-chrome-stable

# Install the app dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose port 3000 for the app
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
