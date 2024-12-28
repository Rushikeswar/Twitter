#!/bin/bash

# Update the system package list and install dependencies
apt-get update
apt-get install -y wget curl

# Install Google Chrome
curl -sSL https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb -o google-chrome-stable_current_amd64.deb
apt install -y ./google-chrome-stable_current_amd64.deb

# Install necessary libraries for Google Chrome to work
apt-get install -y fonts-liberation libappindicator3-1 libasound2 libnss3 libx11-xcb1 xdg-utils
