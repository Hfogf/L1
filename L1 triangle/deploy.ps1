

Set-StrictMode -Version Latest

function Check-Command($cmd){
    $p = Get-Command $cmd -ErrorAction SilentlyContinue; return $null -ne $p
}

Write-Host "Preparing deploy for L1 TRIANGLE site..." -ForegroundColor Cyan


$large = Get-ChildItem -Recurse -File | Where-Object { $_.Length -gt 90MB }
if($large){
    Write-Host "WARNING: Found large files (>90MB). GitHub rejects files >100MB. See list:" -ForegroundColor Yellow
    $large | ForEach-Object { Write-Host " - $($_.FullName) : $([math]::Round($_.Length/1MB,1)) MB" }
    Write-Host "Consider removing or hosting large assets externally (YouTube, CDN) before pushing." -ForegroundColor Yellow
    $ok = Read-Host "Continue anyway? (y/N)"
    if($ok -ne 'y') { Write-Host "Aborting per user request."; exit 1 }
}

if(-not (Check-Command git)){
    Write-Error "Git is not installed or not in PATH. Please install Git (https://git-scm.com/) and re-run."; exit 1
}


if(-not (Test-Path .git)){
    git init
    Write-Host "Initialized new git repository." -ForegroundColor Green
} else { Write-Host "Git repository already initialized." -ForegroundColor Green }

git add --all
try{ git commit -m "Initial commit - L1 TRIANGLE site" } catch { Write-Host "No changes to commit or commit failed: $_" -ForegroundColor Yellow }

if(Check-Command gh){
    try{
        gh auth status --hostname github.com 2>$null
        $authed = $?    
    } catch { $authed = $false }
    if($authed){
        $repoName = Read-Host "Enter repository name to create on GitHub (e.g. l1-triangle-site)"
        if([string]::IsNullOrWhiteSpace($repoName)){ Write-Host "Repository name required for gh creation. Aborting create via gh." -ForegroundColor Yellow }
        else {
            Write-Host "Creating GitHub repo '$repoName' (public) and pushing..." -ForegroundColor Cyan
            gh repo create $repoName --public --source=. --remote=origin --push --confirm
            if($LASTEXITCODE -eq 0){ Write-Host "Repository created and pushed. Check GitHub Actions for deployment progress." -ForegroundColor Green; exit 0 }
            else { Write-Host "gh repo create failed (exit $LASTEXITCODE). You can push manually." -ForegroundColor Red }
        }
    } else { Write-Host "gh CLI not authenticated. Skipping automatic repo creation." -ForegroundColor Yellow }
}


$remote = Read-Host "Enter remote Git URL (https) to push to (or leave blank to abort)"
if([string]::IsNullOrWhiteSpace($remote)){ Write-Host "No remote provided. Aborting."; exit 1 }

git remote remove origin 2>$null | Out-Null
git remote add origin $remote
git branch -M main
git push -u origin main
if($LASTEXITCODE -eq 0){ Write-Host "Pushed to remote. The Actions workflow will deploy to GitHub Pages if present." -ForegroundColor Green }
else { Write-Error "Push failed. Check remote URL and your credentials." }

Write-Host "Done. Visit your repository on GitHub and check the Actions tab to watch the deploy workflow." -ForegroundColor Cyan
