# PostToolUse hook (Edit|Write|MultiEdit): formats and lints the file that was just changed.
# Does nothing until Phase 0 installs Prettier/ESLint. Lint errors are fed back to Claude (exit 2).

$ErrorActionPreference = 'Stop'
try {
    $data = [Console]::In.ReadToEnd() | ConvertFrom-Json
} catch {
    exit 0
}

$path = $data.tool_input.file_path
if (-not $path) { exit 0 }

$root = $env:CLAUDE_PROJECT_DIR
if (-not $root) { $root = $data.cwd }
$bin = Join-Path $root 'node_modules\.bin'

try { $full = [System.IO.Path]::GetFullPath($path) } catch { exit 0 }
if (-not (Test-Path -LiteralPath $full)) { exit 0 }
$ext = [System.IO.Path]::GetExtension($full).ToLowerInvariant()

# Never touch planning sources or the logo.
if ($full -match '[\\/]Planning Folder[\\/]') { exit 0 }

$prettier = Join-Path $bin 'prettier.cmd'
if ((Test-Path $prettier) -and ($ext -in @('.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.css', '.json', '.md', '.mdx', '.yml', '.yaml'))) {
    & $prettier --write --log-level warn -- "$full" 2>&1 | Out-Null
}

$eslint = Join-Path $bin 'eslint.cmd'
if ((Test-Path $eslint) -and ($ext -in @('.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'))) {
    $out = & $eslint --max-warnings 0 -- "$full" 2>&1
    if ($LASTEXITCODE -ne 0) {
        [Console]::Error.WriteLine("ESLint problems in ${full}:`n$($out -join "`n")`nFix them within the task scope (docs/ai/03).")
        exit 2
    }
}
exit 0
