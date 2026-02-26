@echo off
echo ================================
echo  AI Image Editor Pro
echo ================================
echo.
echo Uruchamianie aplikacji...
python main.py
if errorlevel 1 (
    echo.
    echo BLAD: Nie mozna uruchomic.
    echo Upewnij sie ze Python jest zainstalowany.
    echo.
    echo Zainstaluj biblioteki: install.bat
    pause
)
