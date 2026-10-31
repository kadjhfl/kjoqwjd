@echo off
chcp 65001 >nul
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  start "HAWRAZ" cmd /k "py -m http.server 8765"
) else (
  where python >nul 2>nul
  if %errorlevel%==0 (
    start "HAWRAZ" cmd /k "python -m http.server 8765"
  ) else (
    echo Python نصب نیست. لطفاً Python 3 را نصب کن و دوباره اجرا کن.
    pause
    exit /b 1
  )
)
timeout /t 2 >nul
start "" http://localhost:8765
