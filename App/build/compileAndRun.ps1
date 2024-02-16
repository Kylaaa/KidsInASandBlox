$ErrorActionPreference = "Stop"

$buildFolder = $PSScriptRoot
powershell "$buildFolder/build.ps1"
powershell "$buildFolder/run.ps1"