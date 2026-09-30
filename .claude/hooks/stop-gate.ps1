# Stop hook: before Claude finishes, run the fast gate (typecheck + lint + token checks) if code changed.
# Does nothing until Phase 0 creates the "verify:fast" script. See docs/ai/03.

$ErrorActionPreference = 'Stop'
try {
    $data = [Console]::In.ReadToEnd() | ConvertFrom-Json
} catch {
    exit 0
}

# Avoid infinite loops: if we already blocked once, let Claude stop (it must report the failure honestly).
if ($data.stop_hook_active -eq $true) { exit 0 }

$root = $env:CLAUDE_PROJECT_DIR
if (-not $root) { $root = $data.cwd }

$pkg = Join-Path $root 'package.json'
if (-not (Test-Path $pkg)) { exit 0 }
$pkgText = Get-Content -Raw -LiteralPath $pkg
if ($pkgText -notmatch '"verify:fast"\s*:') { exit 0 }

# Only run when source or config files have uncommitted changes.
$changed = & git -C "$root" status --porcelain 2>$null
if (-not ($changed | Where-Object { $_ -match '(src/|scripts/|tests/|\.(ts|tsx|js|mjs|css|json)$)' })) { exit 0 }

Push-Location $root
try {
    $out = & npm.cmd run --silent verify:fast 2>&1
    $code = $LASTEXITCODE
} finally {
    Pop-Location
}

if ($code -ne 0) {
    $tail = ($out | Select-Object -Last 60) -join "`n"
    [Console]::Error.WriteLine("Fast gate FAILED (npm run verify:fast). Fix the problems within the task scope, or report the failure honestly with this output:`n$tail")
    exit 2
}
exit 0
