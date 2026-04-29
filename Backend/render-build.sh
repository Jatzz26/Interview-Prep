#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Installing Node dependencies..."
npm install

echo "Installing Puppeteer Chromium..."
# Store puppeteer cache in the project directory so Render caches it
export PUPPETEER_CACHE_DIR=/opt/render/project/puppeteer
npx puppeteer browsers install chrome
