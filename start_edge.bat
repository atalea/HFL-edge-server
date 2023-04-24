title = Edge Server
@echo off
set /p "HOST=Enter Local IP for edge to run on: "
set /p "CENTRAL_SERVER=Enter Central Server IP: "
node edge\index.js
pause