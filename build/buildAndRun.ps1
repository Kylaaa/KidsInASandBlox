param(
	[Parameter(Mandatory=$false)]
	[Alias("Environment")]
	[string]$env = "env-prod.env"
)
$ErrorActionPreference = "Stop"

$buildFolder = $PSScriptRoot
powershell "$buildFolder/build.ps1"
powershell "$buildFolder/run.ps1" -Environment $env