powershell -Command "$x = (gc vss-extension.json) | ConvertFrom-Json; $Ver = $x.version.Split('.'); $ver[2] = (($Ver[2] -as [int]) +1) -as [string]; $newVersion = $ver[0]+'.'+$ver[1]+'.'+$ver[2]; (gc vss-extension.json) -replace '\"version\": \"\d+\.\d+\.\d+(\.\d+)*\"', \"\"\"version\"\": \"\"$newVersion\"\"\" | Out-File -encoding ASCII vss-extension.json"
call npm install
echo build...
call npm run build
