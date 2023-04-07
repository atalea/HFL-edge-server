title = Edge Server
@echo off
set /p "port=Enter Port to run on: "
set /p "host=Enter central IP: "
node edge\index.js %port% %host%
pause