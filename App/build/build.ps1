$projectRoot = Resolve-Path -Path "$PSScriptRoot/../"


# compile scss files
$uiFolder = "$projectRoot/src/ui/"
$uiAppsFolder = "$uiFolder/apps"
$uiComponentsFolder = "$uiFolder/components"
$cssFolder = "$projectRoot/public/css/"

npx sass "$uiFolder/main.scss" "$cssFolder/main.css" --no-source-map
npx sass ${uiAppsFolder}:${uiAppsFolder} --no-source-map
npx sass ${uiComponentsFolder}:${uiComponentsFolder} --no-source-map

# add generated file warning to CSS files
$warning = "/* THIS IS A GENERATED FILE. ANY CHANGES TO THIS FILE WILL BE OVERWRITTEN */" + [Environment]::NewLine
$nodeFolder = "$projectRoot/node_modules"
$cssFiles = Get-ChildItem -Path "$projectRoot/*.css" -Recurse | where { !$_.FullName.StartsWith($nodeFolder) }
$cssFiles | ForEach-Object {
	$firstLine = Get-Content -Path $_ -TotalCount 1
	if ($firstLine -ne $warning) {
		$content = $warning + (Get-Content -Path $_ -Raw)
		Set-Content -Path $_ $content
	}
}

# compile react jsx files
npx webpack