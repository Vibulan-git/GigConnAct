@echo off
setlocal
set PATH=%~dp0;%PATH%
set GCLOUD_PROJECT=gigconnact

:: Check if the user is running a deploy command
echo %* | findstr /i "deploy" >nul
if %errorlevel%==0 (
    echo [Wrapper] Generating functions.yaml dynamically...
    "%~dp0node.exe" "%~dp0generate_yaml.js"
)

"%~dp0node.exe" "C:\Users\vibul\.cache\firebase\tools\lib\node_modules\firebase-tools\lib\bin\firebase.js" %*
endlocal
