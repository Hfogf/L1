# Mini e‑commerce (HTML/CSS/JS + React via CDN)

Ce dépôt contient un scaffold minimal pour un site e‑commerce responsive sans paiement en ligne (paiement à la livraison).

Fichiers créés
- `index.html` : point d'entrée (React via CDN + Babel pour JSX en navigateur)
- `css/styles.css` : styles responsives simples
- `js/app.jsx` : application React (client-only) — listing produits, panier (localStorage), formulaire de commande générant mail/WhatsApp

Comment tester
1. Ouvrir `index.html` dans un navigateur moderne (double‑clic ou `Ctrl+O`).
2. Ajouter des produits au panier via le bouton "Ajouter".
3. Ouvrir le panier puis remplir le formulaire et cliquer sur "Envoyer par mail" ou "Discuter par WhatsApp" — les liens ouvrent votre client mail / WhatsApp avec le message pré-rempli.

Remarques & limites
- Pas de backend ni système de paiement en ligne. Les commandes sont transmises via mail ou WhatsApp pour discussion et confirmation.
- Les images utilisent `picsum.photos` (placeholders). Remplacez par vos images réelles.
- Panier stocké localement via `localStorage`.

Prochaines améliorations possibles
- Ajouter un backend pour stocker commandes et gérer stock
- Authentification et un espace admin
- Intégrer un vrai système d’envoi (ex: mail server, WhatsApp Business API)
