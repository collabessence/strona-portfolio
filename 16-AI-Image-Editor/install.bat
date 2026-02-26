@echo off
echo ================================
echo  AI Image Editor Pro - Instalacja
echo ================================
echo.

echo [1/3] Sprawdzanie Pythona...
python --version
if errorlevel 1 (
    echo BLAD: Python nie jest zainstalowany!
    pause
    exit /b 1
)

echo.
echo [2/3] Instalowanie bibliotek AI...
echo Moze potrawac 5-10 minut...
echo.

pip install Pillow rembg opencv-python numpy

if errorlevel 1 (
    echo.
    echo BLAD: Instalacja nie powiodla sie.
    pause
    exit /b 1
)

echo.
echo [3/3] Instalacja zakonczona!
echo.
echo Uruchom: python main.py
echo lub kliknij run.bat
echo.
pause
