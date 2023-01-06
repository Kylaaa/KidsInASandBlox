param(
    [Parameter(Mandatory,HelpMessage="a url to hit")]
    $targetUrl
)

$configData = Get-Content .\config.json | ConvertFrom-Json
$clientId = $configData.clientId

$auth = Get-Content -Path ".\auth.json" | ConvertFrom-Json
$accessToken = $auth.access_token
$accessExpiration = $auth.expires_in
$accessTokenType = (Get-Culture).TextInfo.ToTitleCase($auth.token_type)

# TODO - re-authenticate if the expiration has past

$headersAuth = "Authorization: $accessTokenType $accessToken"
$headersClientId = "Client-Id: $clientId"

Remove-Item alias:curl -erroraction "silentlycontinue"

curl -X GET $targetUrl -H $headersAuth -H $headersClientId