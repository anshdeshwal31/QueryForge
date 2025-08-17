@echo off

REM Install required packages
echo Installing required packages...
pip install -r requirements.txt

REM Check if .env file exists
if not exist ".env" (
    echo Creating .env file from template...
    copy .env.example .env
    echo Please edit .env file and add your Google API key before running the application.
    pause
    exit /b 1
)

REM Run Django migrations
echo Running Django migrations...
python manage.py migrate

REM Start the Django application
echo Starting RAG Pipeline API server...
python manage.py runserver

pause
