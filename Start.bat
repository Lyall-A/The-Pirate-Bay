@echo off
title = The Pirate Bay
if exist "node_modules" (
    node ./src/index.js
    timeout /t 5 /nobreak
) else (
    echo First run, installing modules...
    npm i
    echo Finished installing modules!
    title = The Pirate Bay
    node ./src/index.js
    timeout /t 5 /nobreak
)
