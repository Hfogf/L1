# 🚀 ACTIVER GITHUB PAGES - GUIDE ÉTAPE PAR ÉTAPE

## ✅ Étape 1: Accéder aux Paramètres

1. Ouvrez votre navigateur et allez sur:
   ```
   https://github.com/Hfogf/L1
   ```

2. Cliquez sur **"Settings"** (⚙️) en haut à droite du dépôt

## ✅ Étape 2: Activer GitHub Pages

1. Dans le menu de gauche, cliquez sur **"Pages"**

2. Sous **"Build and deployment"**, configurez:
   - **Source:** Sélectionnez `Deploy from a branch`
   - **Branch:** Sélectionnez `main` (ou `master`)
   - **Folder:** Sélectionnez `/ (root)`

3. Cliquez sur **"Save"** (Enregistrer)

## ✅ Étape 3: Attendre le Déploiement

1. Une fois sauvegardé, GitHub va commencer à construire votre site
2. Attendez **2-5 minutes**
3. Rechargez la page des paramètres Pages
4. Vous verrez un message vert avec l'URL:
   ```
   Your site is live at https://hfogf.github.io/L1/
   ```

## ✅ Étape 4: Tester le Site

Une fois déployé, testez ces URLs:

### Page Principale (Boutique)
```
https://hfogf.github.io/L1/
```

### Page Admin Login
```
https://hfogf.github.io/L1/admin-login-v2.html
```

### Dashboard Admin
```
https://hfogf.github.io/L1/admin-dashboard-fixed.html
```

## 🔧 Si ça ne marche pas immédiatement

1. **Attendez 5 minutes** - Le déploiement prend du temps
2. **Videz le cache du navigateur**: Ctrl + Shift + R (ou Cmd + Shift + R sur Mac)
3. **Vérifiez l'onglet Actions**: https://github.com/Hfogf/L1/actions
   - Vous devriez voir une action "pages build and deployment"
   - Attendez qu'elle soit verte (✓)

## 📝 Accès Rapides

### Paramètres GitHub Pages
```
https://github.com/Hfogf/L1/settings/pages
```

### Actions GitHub (vérifier le déploiement)
```
https://github.com/Hfogf/L1/actions
```

## ⚡ Ce qui se passe automatiquement

Une fois GitHub Pages activé:
- ✅ Votre site sera accessible à `https://hfogf.github.io/L1/`
- ✅ Les fichiers HTML/CSS/JS seront servis depuis GitHub
- ✅ L'admin se connectera à l'API Render (`https://l1triangle-shop.onrender.com/api`)
- ✅ Les produits admin s'afficheront automatiquement
- ✅ Les images WhatsApp seront chargées depuis le dépôt GitHub

## 🎯 Prochaines Étapes Après Activation

1. Testez la page principale: https://hfogf.github.io/L1/
2. Connectez-vous en admin: https://hfogf.github.io/L1/admin-login-v2.html
3. Vérifiez que les produits s'affichent correctement
4. Si besoin, vérifiez que Render est bien démarré: https://l1triangle-shop.onrender.com/api/products

---

**Note Importante:** GitHub Pages est GRATUIT mais peut prendre jusqu'à 10 minutes pour le premier déploiement.
