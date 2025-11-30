<#
deploy_netlify.ps1

Usage (interactive):
  .\deploy_netlify.ps1

Usage (non-interactive):
  .\deploy_netlify.ps1 -NetlifyToken 'NETLIFY_AUTH_TOKEN' -SiteId 'NETLIFY_SITE_ID' -GitHubToken 'GITHUB_TOKEN' -GitHubRepo 'owner/repo'

This script will:
- ensure `netlify` CLI is installed
- optionally set Netlify env vars (GITHUB_TOKEN, GITHUB_REPO, PRODUCTS_PATH, BRANCH)
- run a production deploy for the current folder

You MUST run this script locally. Do NOT share your tokens in public chat.
#>

param(
  [string]$NetlifyToken,
  [string]$SiteId,
  [string]$GitHubToken,
  [string]$GitHubRepo,
  [string]$ProductsPath = "products.json",
  [string]$Branch = "main"
)

function Write-Info([string]$msg){ Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Write-Err([string]$msg){ Write-Host "[ERROR] $msg" -ForegroundColor Red }

Push-Location $PSScriptRoot

Write-Info "Checking Node & npm..."
try{
  node -v > $null 2>&1
  npm -v > $null 2>&1
}catch{
  Write-Err "Node.js and npm are required. Install from https://nodejs.org/"
  Pop-Location; exit 1
}

Write-Info "Checking netlify CLI..."
try{
  netlify --version > $null 2>&1
}catch{
  Write-Info "Installing netlify-cli globally (requires npm)..."
  npm install -g netlify-cli
}

if($NetlifyToken){
  Write-Info "Using provided Netlify token for this session (won't be stored)."
  $env:NETLIFY_AUTH_TOKEN = $NetlifyToken
}

if(-not $SiteId){
  Write-Info "No Site ID provided. You can either provide -SiteId or run 'netlify sites:list' after login to find your site id."
}

Write-Info "Linking / deploying site..."

if(-not $env:NETLIFY_AUTH_TOKEN){
  Write-Info "No NETLIFY_AUTH_TOKEN found. Running interactive login (a browser window will open)."
  netlify login
}

if(-not $SiteId){
  Write-Info "Please enter your Netlify site id (or press Enter to create/link interactively):"
  $SiteId = Read-Host "Site ID (leave blank for interactive)"
}

if(-not $SiteId){
  Write-Info "Running interactive site link (you will be prompted)."
  netlify link
  Write-Info "After linking, run this script again with -SiteId <your-site-id> to continue automated env set + deploy."
  Pop-Location; exit 0
}

if($GitHubToken -and $GitHubRepo){
  Write-Info "Setting Netlify environment variables (GITHUB_TOKEN, GITHUB_REPO, PRODUCTS_PATH, BRANCH) for site $SiteId"
  netlify env:set GITHUB_TOKEN $GitHubToken --site $SiteId
  netlify env:set GITHUB_REPO $GitHubRepo --site $SiteId
  netlify env:set PRODUCTS_PATH $ProductsPath --site $SiteId
  netlify env:set BRANCH $Branch --site $SiteId
}else{
  Write-Info "Skipping setting GITHUB_TOKEN/GITHUB_REPO because they were not provided. You can set them later in Netlify UI."
}

Write-Info "Installing dependencies (for Netlify functions)..."
npm install

Write-Info "Deploying to Netlify (production)..."
if($SiteId){
  netlify deploy --dir=. --prod --site $SiteId
}else{
  netlify deploy --dir=. --prod
}

Write-Info "Deploy finished. Check Netlify dashboard for build logs and site URL."
Pop-Location<#
deploy_netlify.ps1

PowerShell helper to deploy this static site to Netlify.

Usage (interactive):
  1. Ensure Node.js + npm are installed.
  2. Run: `npm install -g netlify-cli` (the script will try to install if missing).
  3. Run: `.\deploy_netlify.ps1`.
  4. If not using a token, the script will call `netlify login` to authenticate in your browser.

Usage (non-interactive, CI):
  Set environment variables `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` then run the script:
    $env:NETLIFY_AUTH_TOKEN = '<your-token>'
    $env:NETLIFY_SITE_ID = '<your-site-id>'
    .\deploy_netlify.ps1

Notes:
  - For single, manual deploys you can also use drag & drop: https://app.netlify.com/drop
  - Avoid committing very large media files into git. Host large videos externally.
#>

function Ensure-Command {
    param(
        [string]$Cmd
    )
    $which = Get-Command $Cmd -ErrorAction SilentlyContinue
    return $which -ne $null
}

Write-Host "Deploy helper: preparing Netlify deploy..." -ForegroundColor Cyan

if (-not (Ensure-Command -Cmd node)) {
    Write-Warning "Node.js not found. Netlify CLI requires Node.js and npm. Please install Node from https://nodejs.org/ and re-run this script."
    exit 1
}

if (-not (Ensure-Command -Cmd npm)) {
    Write-Warning "npm not found. Please ensure npm is available in PATH and re-run."
    exit 1
}

# Ensure netlify CLI is available
if (-not (Ensure-Command -Cmd netlify)) {
    Write-Host "Netlify CLI not found. Installing globally with npm..." -ForegroundColor Yellow
    try {
        npm install -g netlify-cli
    } catch {
        Write-Error "Failed to install netlify-cli globally. You can install it manually with: npm install -g netlify-cli"
        exit 1
    }
}

# Warn about large files
$largeFiles = Get-ChildItem -Recurse -File | Where-Object { $_.Length -gt 100MB }
if ($largeFiles) {
    Write-Warning "Large files detected in the repo (over 100MB). Consider hosting heavy media externally before deploying."
    $largeFiles | Select-Object FullName, @{Name='MB';Expression={ [math]::Round($_.Length/1MB,2) }} | Format-Table -AutoSize
}

if ($env:NETLIFY_AUTH_TOKEN -and $env:NETLIFY_SITE_ID) {
    Write-Host "Using non-interactive deploy with NETLIFY_AUTH_TOKEN and NETLIFY_SITE_ID." -ForegroundColor Green
    Write-Host "Running: netlify deploy --dir=. --prod --site $($env:NETLIFY_SITE_ID) --auth <token hidden>"
    $args = @('deploy','--dir=.', '--prod','--site',$env:NETLIFY_SITE_ID,'--auth',$env:NETLIFY_AUTH_TOKEN)
    & netlify @args
    $rc = $LASTEXITCODE
    if ($rc -ne 0) { Write-Error "netlify CLI returned exit code $rc"; exit $rc }
    exit 0
}

Write-Host "No NETLIFY_AUTH_TOKEN + NETLIFY_SITE_ID found. Running interactive flow." -ForegroundColor Yellow
Write-Host "If you prefer token-based CI deploys, create a Personal Access Token and set NETLIFY_AUTH_TOKEN and NETLIFY_SITE_ID environment variables." -ForegroundColor DarkCyan

Write-Host "Opening browser to log into Netlify (netlify login)..." -ForegroundColor Cyan
& netlify login

if ($LASTEXITCODE -ne 0) {
    Write-Warning "netlify login did not complete successfully. You can instead create a site on Netlify dashboard and use drag & drop: https://app.netlify.com/drop"
    exit 1
}

Write-Host "You are logged in. Now deploying the current folder as a production deploy." -ForegroundColor Green
& netlify deploy --dir=. --prod
if ($LASTEXITCODE -ne 0) { Write-Error "netlify deploy failed with exit code $LASTEXITCODE"; exit $LASTEXITCODE }

Write-Host "Deployment finished." -ForegroundColor Green
