#!/bin/bash

# Install required packages
echo "Installing required packages..."
pip install -r requirements.txt

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "Please edit .env file and add your OpenAI API key before running the application."
    exit 1
fi

# Start the Flask application
echo "Starting RAG Pipeline API server..."
python app.py
