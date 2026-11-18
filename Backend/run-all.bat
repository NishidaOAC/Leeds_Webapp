@echo off
title Leeds Webapp - All Services
echo Starting all Leeds Webapp backend services...
cd /d "%~dp0"
node start-all.js
pause

