$projectRoot = Resolve-Path -Path "$PSScriptRoot/../"


# compile scss files
$cssFolder = "$projectRoot/public/css"
npx sass $cssFolder/main.scss $cssFolder/main.css


# compile react jsx files
npx webpack