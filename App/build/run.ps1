$projectRoot = Resolve-Path -Path "$PSScriptRoot/../"
$envFile = Get-Item -Path "$projectRoot/.env" | Resolve-Path -Relative
$entryPoint = Get-Item -Path "$projectRoot/index.js"


# run the localhost server
node --env-file=$envFile $entryPoint