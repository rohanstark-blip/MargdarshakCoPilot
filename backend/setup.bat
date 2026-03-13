@echo off
REM Margdarshak Backend Setup Script for Windows

echo ========================================
echo Margdarshak Backend Setup
echo ========================================
echo.

REM Create virtual environment
echo [1/4] Creating virtual environment...
python -m venv venv
if errorlevel 1 (
    echo ERROR: Failed to create virtual environment
    exit /b 1
)

REM Activate virtual environment
echo [2/4] Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo [3/4] Installing Python dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    exit /b 1
)

REM Download spaCy model
echo [4/4] Downloading spaCy NLP model (en_core_web_sm)...
python -m spacy download en_core_web_sm
if errorlevel 1 (
    echo ERROR: Failed to download spaCy model
    exit /b 1
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the FastAPI server, run:
echo   venv\Scripts\activate.bat
echo   python main.py
echo.
echo The API will be available at:
echo   http://localhost:8000
echo   Swagger UI: http://localhost:8000/docs
echo.
pause
