[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$ProjectPath,

    [switch]$Force
)

$ErrorActionPreference = 'Stop'

$resolvedProject = (Resolve-Path -LiteralPath $ProjectPath).Path
if (-not (Test-Path -LiteralPath $resolvedProject -PathType Container)) {
    throw "ProjectPath must be an existing directory: $ProjectPath"
}

$templatePath = Join-Path $PSScriptRoot '..\assets\project-profile.md'
$templatePath = (Resolve-Path -LiteralPath $templatePath).Path
$agentDirectory = Join-Path $resolvedProject '.agent'
$profilePath = Join-Path $agentDirectory 'project.md'

if ((Test-Path -LiteralPath $profilePath) -and -not $Force) {
    throw "Project profile already exists: $profilePath. Use -Force only when replacement is intentional."
}

if (-not (Test-Path -LiteralPath $agentDirectory)) {
    New-Item -ItemType Directory -Path $agentDirectory | Out-Null
}

Copy-Item -LiteralPath $templatePath -Destination $profilePath -Force:$Force
Write-Output "Created project profile: $profilePath"
