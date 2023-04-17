title = Edge Server
@echo off
set /p "host=Enter central IP: "
for /f %%a in ('powershell Invoke-RestMethod api.ipify.org') do set PublicIP=%%a
node edge\index.js %host% %PublicIP%
pause