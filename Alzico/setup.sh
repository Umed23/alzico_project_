#!/bin/bash

echo "🧠 Alzico Alzheimer's Detection App - Setup Script"
echo "================================================"
echo

echo "📦 Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo
echo "✅ Dependencies installed successfully!"
echo
echo "🚀 Starting the web app..."
echo
echo "🌐 The app will open in your browser at: http://localhost:3002"
echo
echo "📱 For mobile development:"
echo "   - Android: npm run android"
echo "   - iOS: npm run ios (macOS only)"
echo
echo "🛑 Press Ctrl+C to stop the server"
echo

npm run web 