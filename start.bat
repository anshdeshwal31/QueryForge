@echo off

REM Install required packages
echo Installing required packages...
pip install -r requirements.txt

REM Check if .env file exists
if not exist ".env" (
    echo Creating .env file from template...
    copy .env.example .env
    echo Please edit .env file and add your OpenAI API key before running the application.
    pause
    exit /b 1
)

REM Start the Flask application
echo Starting RAG Pipeline API server...
python app.py

pause
