#!/usr/bin/env bash

# Install Google Chrome
echo "Installing Google Chrome..."
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list
sudo apt-get update
sudo apt-get install -y google-chrome-stable

# Verify Chrome installation
if [ -f /usr/bin/google-chrome ]; then
  echo "Google Chrome installed successfully at /usr/bin/google-chrome"
else
  echo "Google Chrome installation failed!"
  exit 1
fi

# Install ChromeDriver
echo "Installing ChromeDriver..."
CHROME_DRIVER_VERSION=$(curl -sS chromedriver.storage.googleapis.com/LATEST_RELEASE)
wget -N https://chromedriver.storage.googleapis.com/$CHROME_DRIVER_VERSION/chromedriver_linux64.zip
unzip chromedriver_linux64.zip
sudo mv chromedriver /usr/local/bin/chromedriver
sudo chmod +x /usr/local/bin/chromedriver
rm chromedriver_linux64.zip

# Verify ChromeDriver installation
if [ -f /usr/local/bin/chromedriver ]; then
  echo "ChromeDriver installed successfully at /usr/local/bin/chromedriver"
else
  echo "ChromeDriver installation failed!"
  exit 1
fi

echo "All dependencies installed successfully!"
