@echo off
powershell.exe -NoProfile -File "%~dp0Start-MoorWords.ps1"
if errorlevel 1 pause
