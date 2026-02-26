@echo off
echo ================================
echo  AI Content Generator - DEMO
echo ================================
echo.
echo Uruchamianie wersji DEMO (bez wymagań instalacji)...
echo.
python demo.py
if errorlevel 1 (
    echo.
    echo BLAD: Nie mozna uruchomic aplikacji.
    echo Upewnij sie, ze Python jest zainstalowany.
    pause
)
