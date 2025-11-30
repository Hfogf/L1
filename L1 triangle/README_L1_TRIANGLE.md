# L1 TRIANGLE — Boutique Matériel Gaming & Vape

Prototype HTML/CSS/JS avec React (via CDN) — site responsive pour vente de manettes, moniteurs et kits vape.

Fichiers présents
- `L1_triangle.html` : page brandée (préférée pour ouverture)
- `index.html` : alternative d'entrée (prototype)
- `css/styles.css` : styles (thème gaming sombre + animations)
- `js/app.jsx` : application React (produits, panier, checkout mail/WhatsApp)

Comment tester
1. Ouvrir `L1_triangle.html` (double‑clic) dans un navigateur moderne.
2. Parcourir les produits et cliquer sur "Ajouter" pour remplir le panier.
3. Ouvrir le panier (bouton "Panier"), renseigner nom/téléphone/adresse puis cliquer sur "Envoyer par mail" ou "Discuter par WhatsApp".

Remplacement d'images et logo
- Dépose ton logo à la racine du projet sous le nom `logo.png` ou adapte le chemin dans `L1_triangle.html`.
- Remplace les images produits dans le dossier `images/` (ex : `manette-pro.jpg`, `manette-wireless.jpg`, `monitor-144.jpg`, `monitor-240.jpg`, `vape-kit.jpg`, `eliquid-50.jpg`). Tu peux aussi éditer `js/app.jsx` pour changer les URLs.

Notes
- Prototype sans backend — commandes envoyées via mail/WhatsApp. Paiement et livraison sont gérés hors-ligne.
- Pour production, ajoute un build React, un backend (Node/Express) pour stocker commandes, et sécurise les échanges.

Prochaines améliorations possibles
- Ajouter un backend pour stocker commandes et gérer stock
- Authentification et un espace admin
- Intégrer un vrai système d’envoi (ex: mail server, WhatsApp Business API)
