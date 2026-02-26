@echo off
echo ================================
echo  AI Content Generator - Instalacja
echo ================================
echo.

echo [1/3] Sprawdzanie Pythona...
python --version
if errorlevel 1 (
    echo BLAD: Python nie jest zainstalowany!
    echo Pobierz Python z: https://www.python.org/downloads/
    pause
    exit /b 1
)

echo.
echo [2/3] Instalowanie zaleznosci...
echo To moze potrawac 5-10 minut przy pierwszym razie.
echo.

pip install transformers torch

if errorlevel 1 (
    echo.
    echo BLAD: Instalacja nie powiodla sie.
    echo Sprobuj recznie: pip install transformers torch
    pause
    exit /b 1
)

echo.
echo [3/3] Instalacja zakonczona!
echo.
echo Teraz uruchom: python main.py
echo.
pause
