[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

$kitRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$distributionPath = Join-Path $kitRoot 'dist'
$archivePath = Join-Path $distributionPath 'single-agent-project-steward-kit.zip'
$checksumPath = "$archivePath.sha256"

$packageItems = @(
    (Join-Path $kitRoot 'AGENTS.md'),
    (Join-Path $kitRoot 'DEPLOY.md'),
    (Join-Path $kitRoot 'README.md'),
    (Join-Path $kitRoot '.gitignore'),
    (Join-Path $kitRoot 'package.json'),
    (Join-Path $kitRoot 'package-lock.json'),
    (Join-Path $kitRoot 'bin'),
    (Join-Path $kitRoot 'skills'),
    (Join-Path $kitRoot 'test'),
    (Join-Path $kitRoot 'tools')
)

foreach ($item in $packageItems) {
    if (-not (Test-Path -LiteralPath $item)) {
        throw "Required package item is missing: $item"
    }
}

if (-not (Test-Path -LiteralPath $distributionPath)) {
    New-Item -ItemType Directory -Path $distributionPath | Out-Null
}

Compress-Archive -LiteralPath $packageItems -DestinationPath $archivePath -CompressionLevel Optimal -Force

$hash = (Get-FileHash -LiteralPath $archivePath -Algorithm SHA256).Hash.ToLowerInvariant()
Set-Content -LiteralPath $checksumPath -Value "$hash  single-agent-project-steward-kit.zip" -Encoding ascii

Write-Output "Created package: $archivePath"
Write-Output "Created checksum: $checksumPath"
