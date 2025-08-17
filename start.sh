#!/bin/bash

# Install required packages
echo "Installing required packages..."
pip install -r requirements.txt

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "Please edit .env file and add your Google API key before running the application."
    exit 1
fi

# Run Django migrations
echo "Running Django migrations..."
python manage.py migrate

# Start the Django application
echo "Starting RAG Pipeline API server..."
python manage.py runserver
