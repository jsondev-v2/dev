[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$ProjectPath,

    [Parameter(Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [string]$Task,

    [switch]$Force
)

$ErrorActionPreference = 'Stop'

$resolvedProject = (Resolve-Path -LiteralPath $ProjectPath).Path
if (-not (Test-Path -LiteralPath $resolvedProject -PathType Container)) {
    throw "ProjectPath must be an existing directory: $ProjectPath"
}

$templatePath = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..\assets\task-cache.md')).Path
$cacheDirectory = Join-Path $resolvedProject '.agent\cache'
$historyDirectory = Join-Path $cacheDirectory 'history'
$activeTaskPath = Join-Path $cacheDirectory 'active-task.md'

if (Test-Path -LiteralPath $activeTaskPath) {
    $existingTask = Get-Content -Raw -LiteralPath $activeTaskPath
    $isFinished = $existingTask -match '(?m)^- Status: (Complete|Blocked|Cancelled)\s*$'
    if (-not $isFinished -and -not $Force) {
        throw "An unfinished task cache already exists: $activeTaskPath. Complete it or use -Force only when replacement is intentional."
    }

    if (-not (Test-Path -LiteralPath $historyDirectory)) {
        New-Item -ItemType Directory -Path $historyDirectory | Out-Null
    }

    $archiveName = '{0}-task.md' -f (Get-Date -Format 'yyyyMMdd-HHmmss')
    Move-Item -LiteralPath $activeTaskPath -Destination (Join-Path $historyDirectory $archiveName)
}

if (-not (Test-Path -LiteralPath $cacheDirectory)) {
    New-Item -ItemType Directory -Path $cacheDirectory | Out-Null
}

$timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss K'
$content = Get-Content -Raw -LiteralPath $templatePath
$content = $content.Replace('{{TASK}}', $Task.Trim()).Replace('{{STARTED}}', $timestamp)
Set-Content -LiteralPath $activeTaskPath -Value $content -Encoding utf8

Write-Output "Created active task cache: $activeTaskPath"
