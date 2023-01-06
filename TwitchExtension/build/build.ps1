$src = "$PWD\.."
$outfile = ".\upload.zip"

Compress-Archive -Path "$src\KidsInASandBlox.json", "$src\extensions-boilerplate" -CompressionLevel NoCompression -DestinationPath $outfile