@echo off
echo Activating virtual environment...
call "rag-env\Scripts\activate.bat"

echo Starting Django RAG application...
python manage.py runserver

pause
