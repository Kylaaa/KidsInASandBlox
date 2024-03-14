$buildFolder = $PSScriptRoot
$debugEnvFile = "env-debug.env"
$buildAndRunFile = Get-Item "$buildFolder/buildAndRun.ps1"

#$debugConfig = curl -X GET 'http://localhost:8080/units/clients' | ConvertFrom-Json
#Write-Host $debugConfig

powershell $buildAndRunFile -Environment $debugEnvFile