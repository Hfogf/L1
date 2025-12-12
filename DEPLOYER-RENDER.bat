@echo off
echo ========================================
echo  DEPLOIEMENT RENDER - L1 TRIANGLE SHOP
echo ========================================
echo.

echo [1/4] Verification des fichiers...
if not exist "backend-render.js" (
    echo ERREUR: backend-render.js manquant!
    pause
    exit /b 1
)

if not exist "package.json" (
    echo ERREUR: package.json manquant!
    pause
    exit /b 1
)

echo OK - Tous les fichiers presents
echo.

echo [2/4] Ajout des fichiers a Git...
git add .
if errorlevel 1 (
    echo ERREUR: Git add a echoue
    pause
    exit /b 1
)

echo [3/4] Commit des changements...
git commit -m "feat: Backend complet Render avec upload images"
if errorlevel 1 (
    echo AVERTISSEMENT: Rien a commiter ou commit a echoue
)

echo [4/4] Push vers GitHub...
git push origin main
if errorlevel 1 (
    echo ERREUR: Push a echoue
    pause
    exit /b 1
)

echo.
echo ========================================
echo  DEPLOIEMENT TERMINE !
echo ========================================
echo.
echo Prochaines etapes:
echo 1. Allez sur https://dashboard.render.com
echo 2. Cliquez sur votre service "l1triangle-shop"
echo 3. Cliquez sur "Manual Deploy" puis "Deploy latest commit"
echo 4. Attendez 2-3 minutes
echo 5. Testez: https://l1triangle-shop.onrender.com/api/health
echo.
pause
