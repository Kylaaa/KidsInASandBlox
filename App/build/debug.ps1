$buildFolder = $PSScriptRoot
$debugEnvFile = "env-debug.env"
$buildAndRunFile = Get-Item "$buildFolder/buildAndRun.ps1"

powershell $buildAndRunFile -Environment $debugEnvFile