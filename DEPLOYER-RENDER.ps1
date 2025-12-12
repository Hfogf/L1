# ========================================
#  DEPLOIEMENT RENDER - L1 TRIANGLE SHOP
# ========================================

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " DEPLOIEMENT RENDER - L1 TRIANGLE SHOP" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# [1/4] Vérification des fichiers
Write-Host "[1/4] Verification des fichiers..." -ForegroundColor Yellow

$requiredFiles = @(
    "backend-render.js",
    "package.json",
    "render.yaml",
    "database.json"
)

$missingFiles = @()
foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host "ERREUR: Fichiers manquants:" -ForegroundColor Red
    $missingFiles | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
    pause
    exit 1
}

Write-Host "OK - Tous les fichiers presents" -ForegroundColor Green
Write-Host ""

# [2/4] Ajout des fichiers à Git
Write-Host "[2/4] Ajout des fichiers a Git..." -ForegroundColor Yellow
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERREUR: Git add a echoue" -ForegroundColor Red
    pause
    exit 1
}
Write-Host "OK" -ForegroundColor Green

# [3/4] Commit
Write-Host "[3/4] Commit des changements..." -ForegroundColor Yellow
git commit -m "feat: Backend complet Render avec upload images et hebergement"
if ($LASTEXITCODE -ne 0) {
    Write-Host "AVERTISSEMENT: Rien a commiter ou commit a echoue" -ForegroundColor Yellow
}

# [4/4] Push
Write-Host "[4/4] Push vers GitHub..." -ForegroundColor Yellow
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERREUR: Push a echoue" -ForegroundColor Red
    pause
    exit 1
}
Write-Host "OK" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Green
Write-Host " DEPLOIEMENT TERMINE !" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

Write-Host "Prochaines etapes:" -ForegroundColor Cyan
Write-Host "1. Allez sur: https://dashboard.render.com" -ForegroundColor White
Write-Host "2. Cliquez sur votre service 'l1triangle-shop'" -ForegroundColor White
Write-Host "3. Cliquez sur 'Manual Deploy' puis 'Deploy latest commit'" -ForegroundColor White
Write-Host "4. Attendez 2-3 minutes" -ForegroundColor White
Write-Host "5. Testez: https://l1triangle-shop.onrender.com/api/health" -ForegroundColor White
Write-Host ""

# Ouvrir automatiquement le dashboard Render
Write-Host "Ouvrir le dashboard Render? (O/N): " -ForegroundColor Yellow -NoNewline
$response = Read-Host
if ($response -eq "O" -or $response -eq "o") {
    Start-Process "https://dashboard.render.com/web/srv-ctnhqal6l47c739bkgug"
}

Write-Host "`nAppuyez sur une touche pour continuer..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
