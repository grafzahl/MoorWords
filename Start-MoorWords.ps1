param([switch]$CheckOnly)
$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot

function Test-NodeRuntime([string]$Candidate) {
    if (-not $Candidate -or -not (Test-Path -LiteralPath $Candidate -PathType Leaf)) { return $false }
    try {
        $version = & $Candidate --version 2>$null
        return ($LASTEXITCODE -eq 0 -and $version -match '^v(\d+)\.' -and [int]$Matches[1] -ge 20)
    } catch { return $false }
}

try {
    $nodePath = $null
    $nodeCommand = Get-Command node.exe -CommandType Application -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($nodeCommand -and (Test-NodeRuntime $nodeCommand.Source)) { $nodePath = $nodeCommand.Source }
    foreach ($candidate in @("$env:ProgramFiles\nodejs\node.exe", "$env:LOCALAPPDATA\Programs\nodejs\node.exe")) {
        if (-not $nodePath -and (Test-NodeRuntime $candidate)) { $nodePath = $candidate }
    }
    $runtimeRoot = Join-Path $env:LOCALAPPDATA 'MoorWords\runtime'
    if (-not $nodePath -and (Test-Path -LiteralPath $runtimeRoot)) {
        $cached = Get-ChildItem -LiteralPath $runtimeRoot -Directory -Filter 'node-v24.*-win-*' | Sort-Object LastWriteTime -Descending
        foreach ($directory in $cached) {
            $candidate = Join-Path $directory.FullName 'node.exe'
            if (Test-NodeRuntime $candidate) { $nodePath = $candidate; break }
        }
    }
    if (-not $nodePath) {
        if ($CheckOnly) { throw 'Kein kompatibles Node.js gefunden. Beim normalen Start wird es automatisch geladen.' }
        $architecture = $env:PROCESSOR_ARCHITECTURE
        if ($env:PROCESSOR_ARCHITEW6432) { $architecture = $env:PROCESSOR_ARCHITEW6432 }
        switch ($architecture.ToUpperInvariant()) {
            'AMD64' { $nodeArch = 'x64' }
            'ARM64' { $nodeArch = 'arm64' }
            default { throw 'Automatischer Download nur fuer Windows x64 und ARM64. Bitte passendes Node.js ab Version 20 von https://nodejs.org installieren.' }
        }
        Write-Host 'Node.js fehlt. MoorWords laedt eine portable Version von https://nodejs.org.'
        Write-Host 'Keine Administratorrechte und keine systemweite Installation erforderlich.'
        Write-Host 'Beim ersten Start ist dafuer eine Internetverbindung erforderlich.'
        [Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12
        $ProgressPreference = 'SilentlyContinue'
        New-Item -ItemType Directory -Path $runtimeRoot -Force | Out-Null
        $manifest = (Invoke-WebRequest -Uri 'https://nodejs.org/dist/latest-v24.x/SHASUMS256.txt' -UseBasicParsing -TimeoutSec 60).Content
        $pattern = '(?m)^([a-fA-F0-9]{64})\s+(node-v24\.\d+\.\d+-win-' + $nodeArch + '\.zip)\s*$'
        $entry = [regex]::Match([string]$manifest, $pattern)
        if (-not $entry.Success) { throw 'Die offizielle Downloadliste enthaelt keine passende Node.js-Version.' }
        $expectedHash = $entry.Groups[1].Value
        $archiveName = $entry.Groups[2].Value
        $versionName = [regex]::Match($archiveName, '^node-(v24\.\d+\.\d+)-').Groups[1].Value
        $archivePath = Join-Path $runtimeRoot $archiveName
        Write-Host "Lade Node.js $versionName ($nodeArch) ..."
        Invoke-WebRequest -Uri "https://nodejs.org/dist/$versionName/$archiveName" -OutFile $archivePath -UseBasicParsing -TimeoutSec 300
        if ((Get-FileHash -LiteralPath $archivePath -Algorithm SHA256).Hash -ne $expectedHash) {
            throw 'Die SHA-256-Pruefsumme stimmt nicht. Die Datei wird nicht gestartet. Bitte erneut versuchen.'
        }
        Expand-Archive -LiteralPath $archivePath -DestinationPath $runtimeRoot -Force
        $nodePath = Join-Path (Join-Path $runtimeRoot ([IO.Path]::GetFileNameWithoutExtension($archiveName))) 'node.exe'
        if (-not (Test-NodeRuntime $nodePath)) { throw 'Die portable Node.js-Version konnte nicht gestartet werden.' }
    }
    if ($CheckOnly) { Write-Host "Node.js verfuegbar: $nodePath"; exit 0 }
    Write-Host ''
    Write-Host 'MoorWords startet. Oeffne im Browser: http://localhost:4173'
    Write-Host 'Dieses Fenster offen lassen. Beenden mit Strg+C.'
    & $nodePath (Join-Path $PSScriptRoot 'server.mjs')
    if ($LASTEXITCODE -ne 0) { throw 'Der Spielserver wurde mit einem Fehler beendet. Falls Port 4173 belegt ist, beende die bereits laufende MoorWords-Instanz.' }
} catch {
    Write-Host ('MoorWords konnte nicht starten: ' + $_.Exception.Message) -ForegroundColor Red
    Write-Host 'Bei Downloadproblemen: Internet/Proxy pruefen oder Node.js von https://nodejs.org installieren und PowerShell neu oeffnen.'
    if (-not $CheckOnly) { Read-Host 'Enter zum Beenden' | Out-Null }
    exit 1
}
