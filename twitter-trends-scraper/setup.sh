#!/bin/bash

# Update the package list
apt-get update

# Install dependencies
apt-get install -y wget curl gnupg2 unzip

# Add Google Chrome to the sources list and install it
curl -sS https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb -o chrome.deb
dpkg -i chrome.deb
apt-get install -f -y

# Clean up
rm chrome.deb
