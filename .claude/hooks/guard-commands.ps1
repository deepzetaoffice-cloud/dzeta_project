# PreToolUse hook (Bash|PowerShell): blocks destructive or rule-bypassing shell commands.
# See docs/ai/02 section 4 and docs/ai/12 section 4.

$ErrorActionPreference = 'Stop'
try {
    $data = [Console]::In.ReadToEnd() | ConvertFrom-Json
} catch {
    exit 0
}

$cmd = [string]$data.tool_input.command
if (-not $cmd) { exit 0 }

$rules = @(
    @{ Pattern = 'git\s+push\b.*(\s--force\b|\s--force-with-lease\b|\s-f\b|\s\+\S)'; Why = 'Force-pushing rewrites shared history.' },
    @{ Pattern = 'git\s+reset\s+.*--hard'; Why = 'git reset --hard destroys uncommitted work.' },
    @{ Pattern = 'git\s+clean\s+-'; Why = 'git clean deletes untracked files.' },
    @{ Pattern = 'git\s+checkout\s+(--\s|\.\s*$|-f\b)'; Why = 'This discards uncommitted changes.' },
    @{ Pattern = 'git\s+restore\b(?!.*--staged)'; Why = 'git restore discards uncommitted changes.' },
    @{ Pattern = 'git\s+branch\s+-D\b'; Why = 'Force-deleting a branch can lose work.' },
    @{ Pattern = '--no-verify\b'; Why = 'Skipping git hooks bypasses the project gates.' },
    @{ Pattern = '(^|[\s;&|])rm\s+-[a-zA-Z]*r[a-zA-Z]*f|(^|[\s;&|])rm\s+-[a-zA-Z]*f[a-zA-Z]*r'; Why = 'Recursive forced deletion is not allowed.' },
    @{ Pattern = 'Remove-Item\b.*-Recurse'; Why = 'Recursive deletion is not allowed.' },
    # Order-independent: the protected name and a write/move/delete operation may appear in any order.
    @{ Pattern = '^(?=.*(deepZeta Ai Logo|Coded Logo SVG))(?=.*(sed\s+-i|>|Set-Content|Out-File|Add-Content|Move-Item|Remove-Item|Copy-Item|Rename-Item|\bmv\b|\brm\b|\bcp\b|\btee\b))'; Why = 'The logo SVG is locked.' },
    @{ Pattern = '^(?=.*\.env(?!\.example)\b)(?=.*(sed\s+-i|>|Set-Content|Out-File|Add-Content|Move-Item|Copy-Item|\bmv\b|\bcp\b|\btee\b))'; Why = 'Environment files are never written by agents.' }
)

foreach ($r in $rules) {
    if ($cmd -match $r.Pattern) {
        [Console]::Error.WriteLine("BLOCKED by guard-commands hook: $($r.Why) Command: $cmd. If this is truly needed, stop and ask the owner to run it themselves.")
        exit 2
    }
}
exit 0
