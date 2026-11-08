[CmdletBinding()]
param(
    [ValidateSet('User', 'Repository')]
    [string]$Scope = 'User',

    [string]$RepositoryPath,

    [switch]$Force
)

$ErrorActionPreference = 'Stop'

$kitRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$sourcePath = (Resolve-Path -LiteralPath (Join-Path $kitRoot 'skills\single-agent-project-steward')).Path

if ($Scope -eq 'User') {
    if (-not [string]::IsNullOrWhiteSpace($env:CODEX_HOME)) {
        $codexRoot = [IO.Path]::GetFullPath($env:CODEX_HOME)
    } else {
        $userProfilePath = [Environment]::GetFolderPath('UserProfile')
        if ([string]::IsNullOrWhiteSpace($userProfilePath)) {
            throw 'Unable to determine the user profile directory.'
        }
        $codexRoot = Join-Path $userProfilePath '.codex'
    }
    $destinationRoot = Join-Path $codexRoot 'skills'
} else {
    if ([string]::IsNullOrWhiteSpace($RepositoryPath)) {
        throw 'RepositoryPath is required when Scope is Repository.'
    }
    $resolvedRepository = (Resolve-Path -LiteralPath $RepositoryPath).Path
    if (-not (Test-Path -LiteralPath $resolvedRepository -PathType Container)) {
        throw "RepositoryPath must be an existing directory: $RepositoryPath"
    }
    $destinationRoot = Join-Path $resolvedRepository '.codex\skills'
}

$destinationPath = Join-Path $destinationRoot 'single-agent-project-steward'

if (Test-Path -LiteralPath $destinationPath) {
    if (-not $Force) {
        throw "Skill is already installed at $destinationPath. Use -Force only when updating intentionally."
    }

    $backupPath = '{0}.backup-{1}' -f $destinationPath, (Get-Date -Format 'yyyyMMdd-HHmmss')
    Move-Item -LiteralPath $destinationPath -Destination $backupPath
    Write-Output "Backed up existing skill to: $backupPath"
}

if (-not (Test-Path -LiteralPath $destinationRoot)) {
    New-Item -ItemType Directory -Path $destinationRoot -Force | Out-Null
}

Copy-Item -LiteralPath $sourcePath -Destination $destinationPath -Recurse

$installedManifest = Join-Path $destinationPath 'SKILL.md'
if (-not (Test-Path -LiteralPath $installedManifest -PathType Leaf)) {
    throw "Installation verification failed; SKILL.md was not found at $installedManifest"
}

Write-Output "Installed single-agent-project-steward for scope '$Scope': $destinationPath"
