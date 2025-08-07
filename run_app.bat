@echo off
echo Activating virtual environment...
call "rag-env\Scripts\activate.bat"

echo Starting Flask RAG application...
python app.py

pause
