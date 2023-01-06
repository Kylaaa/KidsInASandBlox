$configData = Get-Content .\config.json | ConvertFrom-Json
$username = $configData.username

$targetUrl = "https://api.twitch.tv/helix/users?login=$username"
& .\request.ps1 -targetUrl $targetUrl