param(
    [Parameter(Mandatory,HelpMessage="The Twitch API Client Secret")]
    $secret,

    [Parameter(HelpMessage="a json file to write out the results")]
    $outfile = ".\auth.json"
)

$configData = Get-Content .\config.json | ConvertFrom-Json

$clientId = $configData.clientId

$targetUrl = "https://id.twitch.tv/oauth2/token"
$headers = "Content-Type: application/x-www-form-urlencoded"
$body = "client_id=$clientId&client_secret=$secret&grant_type=client_credentials"

curl -X POST $targetUrl -H $headers -d $body | Out-File -FilePath $outfile