@echo off
echo ========================================================
echo         RUNNING LEEDS WEBAPP BACKEND TEST SUITE
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/2] Running Backend Unit ^& Integration Tests (node:test)...
call node --test tests/**/*.test.js
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Backend unit tests failed!
    exit /b %ERRORLEVEL%
)

echo.
echo [2/2] Running RS256 Cryptographic ^& Security Test Suite...
call node test-rs256.js
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ RS256 cryptographic tests failed!
    exit /b %ERRORLEVEL%
)

echo.
echo ========================================================
echo         🎉 ALL BACKEND TEST SUITES PASSED!
echo ========================================================
exit /b 0

