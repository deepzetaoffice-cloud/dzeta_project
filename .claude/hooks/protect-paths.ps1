# PreToolUse hook (Edit|Write|MultiEdit|NotebookEdit): hard-blocks edits to files that must never change.
# Rule files and planning docs are NOT blocked here; settings.json puts them on "ask" so the owner approves each edit.
# See docs/ai/00-project-master-rules.md section 5.

$ErrorActionPreference = 'Stop'
try {
    $data = [Console]::In.ReadToEnd() | ConvertFrom-Json
} catch {
    exit 0  # Unparseable input: don't block, the permission system still applies.
}

$path = $data.tool_input.file_path
if (-not $path) { $path = $data.tool_input.notebook_path }
if (-not $path) { exit 0 }

$root = $env:CLAUDE_PROJECT_DIR
if (-not $root) { $root = $data.cwd }

try { $full = [System.IO.Path]::GetFullPath($path) } catch { $full = $path }
$rootFull = [System.IO.Path]::GetFullPath($root).TrimEnd('\', '/')
$rel = $full
if ($full.StartsWith($rootFull, [System.StringComparison]::OrdinalIgnoreCase)) {
    $rel = $full.Substring($rootFull.Length).TrimStart('\', '/')
}
$rel = $rel -replace '\\', '/'

$rules = @(
    @{ Pattern = '^Planning Folder/For Ai/deepZeta Ai Logo/'; Why = 'The logo SVG is locked and is never edited, reformatted or optimised (docs/ai/00 section 5).' },
    @{ Pattern = '(^|/)\.env(\.(?!example$)[^/]*)?$'; Why = 'Environment files hold secrets and are never edited by agents. Only .env.example may be changed, through an approved plan.' },
    @{ Pattern = '(^|/)package-lock\.json$'; Why = 'The lockfile changes only through npm commands in an approved plan, never by direct edit (docs/ai/06 section 5).' }
)

foreach ($r in $rules) {
    if ($rel -match $r.Pattern) {
        [Console]::Error.WriteLine("BLOCKED by protect-paths hook: '$rel'. $($r.Why) If a change is truly needed, stop and propose it to the owner.")
        exit 2
    }
}
exit 0
