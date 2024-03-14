$buildFolder = $PSScriptRoot
$mockApiFile = Get-Item "$buildFolder/mockTwitchAPI.ps1"
$mockWSFile = Get-Item "$buildFolder/mockTwitchWS.ps1"

# launch the mocked services in new windows
start powershell $mockApiFile
start powershell $mockWSFile