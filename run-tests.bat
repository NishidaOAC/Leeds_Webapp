@echo off
echo ========================================================
echo           LEEDS WEBAPP FULL TEST SUITE RUNNER
echo ========================================================
echo.

call "%~dp0Backend\run-tests.bat"
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Tests failed!
    exit /b %ERRORLEVEL%
)

echo.
echo ========================================================
echo       SUCCESS: All Test Suites Executed Cleanly!
echo ========================================================
exit /b 0

