# Instructions de déploiement - L1 Triangle Store

## Architecture actuelle

✅ **Frontend**: HTML/CSS/JS statique hébergé sur Netlify
✅ **Backend**: Netlify Functions (serverless Node.js)
✅ **Panier**: localStorage + formulaire de commande
✅ **Produits**: Chargés dynamiquement depuis localStorage (modifiables via admin)

---

## Déploiement sur Netlify

### Étape 1: Préparer le dépôt

Assurez-vous que tous les fichiers sont commités dans votre repo Git:

```powershell
git add .
git commit -m "Add working cart, products, and order function"
git push origin main
```

### Étape 2: Connecter à Netlify

1. Allez sur https://app.netlify.com/
2. Cliquez sur **"Add new site"** → **"Import an existing project"**
3. Connectez votre repo GitHub/GitLab
4. Sélectionnez le repo `L1 triangle` (ou votre nom de repo)

### Étape 3: Configuration du build

Dans les paramètres de build:

- **Build command**: (laisser vide ou `npm install`)
- **Publish directory**: `.` (racine du projet)
- **Functions directory**: `netlify/functions` (détecté automatiquement via `netlify.toml`)

### Étape 4: Variables d'environnement (optionnel pour base de données)

Si vous voulez connecter une base de données MongoDB/Supabase plus tard:

1. Site settings → Environment → Environment variables
2. Ajoutez:
   - `MONGODB_URI` = votre connection string MongoDB Atlas
   - Ou `SUPABASE_URL` + `SUPABASE_KEY` pour Supabase

### Étape 5: Déployer

Cliquez sur **"Deploy site"**

Netlify va:
- Installer les dépendances (`npm install`)
- Builder les fonctions Netlify
- Publier le site

Votre site sera disponible à: `https://[votre-site].netlify.app`

---

## Test du site déployé

### Vérifier que les produits s'affichent

1. Ouvrez `https://[votre-site].netlify.app/produits.html`
2. Vous devez voir:
   - Liste des produits avec images, prix, descriptions
   - Bouton "Ajouter au panier" sur chaque produit
   - Compteur "Panier (0)" en haut

### Vérifier le panier

1. Cliquez sur "Ajouter au panier" sur un produit
2. Le compteur doit changer: "Panier (1)"
3. Cliquez sur "Panier (1)" pour ouvrir le tiroir
4. Vous devez voir:
   - Le produit ajouté avec prix
   - Boutons +/- pour quantité
   - Total calculé
   - Formulaire de commande (Nom, Téléphone, Email)

### Vérifier la soumission de commande

1. Remplissez le formulaire dans le panier
2. Cliquez "Envoyer ma commande"
3. Vous devez voir: "✅ Commande envoyée avec succès !"
4. Le panier se vide automatiquement

### Vérifier les logs Netlify

1. Netlify Dashboard → Functions → `save-order`
2. Cliquez sur "View logs"
3. Vous devez voir les commandes reçues avec détails

---

## Ajouter une vraie base de données (optionnel)

### Option A: MongoDB Atlas (gratuit)

1. Créez un compte sur https://www.mongodb.com/cloud/atlas/register
2. Créez un cluster gratuit (M0)
3. Dans "Database Access", créez un utilisateur avec mot de passe
4. Dans "Network Access", ajoutez `0.0.0.0/0` (ou l'IP de Netlify)
5. Copiez la connection string (Format: `mongodb+srv://user:pass@cluster.mongodb.net/`)
6. Dans Netlify → Environment variables, ajoutez:
   - `MONGODB_URI` = votre connection string

7. Modifiez `netlify/functions/save-order.js`:

```javascript
const { MongoClient } = require('mongodb');

let client;
async function getClient() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
  }
  return client;
}

exports.handler = async (event, context) => {
  // ... code existant pour parser data ...
  
  const client = await getClient();
  const db = client.db('l1triangle_store');
  await db.collection('orders').insertOne({
    ...data,
    createdAt: new Date()
  });
  
  return { statusCode: 200, body: JSON.stringify({ ok: true }) };
};
```

8. Ajoutez `mongodb` dans `package.json`:

```json
{
  "dependencies": {
    "node-fetch": "^2.6.7",
    "mongodb": "^5.0.0"
  }
}
```

9. Redéployez (push Git ou bouton Redeploy sur Netlify)

### Option B: Supabase (gratuit)

1. Créez un compte sur https://supabase.com/
2. Créez un nouveau projet
3. Copiez l'URL et la clé API (anon/public)
4. Dans votre base de données Supabase, créez une table `orders`:

```sql
CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  items JSONB NOT NULL,
  total DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

5. Dans Netlify → Environment variables:
   - `SUPABASE_URL` = votre URL
   - `SUPABASE_KEY` = votre clé anon

6. Modifiez `netlify/functions/save-order.js`:

```javascript
const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  const data = JSON.parse(event.body || '{}');
  
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );
  
  const { error } = await supabase
    .from('orders')
    .insert([{
      name: data.name,
      phone: data.phone,
      email: data.email,
      items: data.items,
      total: data.total
    }]);
  
  if (error) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: error.message }) };
  }
  
  return { statusCode: 200, body: JSON.stringify({ ok: true }) };
};
```

7. Ajoutez dans `package.json`:

```json
{
  "dependencies": {
    "node-fetch": "^2.6.7",
    "@supabase/supabase-js": "^2.0.0"
  }
}
```

---

## Résumé des URLs importantes

- **Site principal**: `https://[votre-site].netlify.app/L1_triangle.html`
- **Page produits**: `https://[votre-site].netlify.app/produits.html`
- **Admin**: `https://[votre-site].netlify.app/admin.html` (mot de passe: `L1_TRIANGLE`)
- **Function commandes**: `https://[votre-site].netlify.app/.netlify/functions/save-order`
- **Function produits**: `https://[votre-site].netlify.app/.netlify/functions/products`

---

## Problèmes courants

### Les produits ne s'affichent pas

- Vérifiez que `js/produits.js` est bien chargé
- Ouvrez la console (F12) et cherchez des erreurs JavaScript
- Vérifiez que `localStorage` contient des produits (console: `localStorage.getItem('products')`)

### Le panier ne s'ouvre pas

- Vérifiez que l'élément `#cart-drawer` existe dans `produits.html`
- Vérifiez que `#open-cart` et `#close-cart` sont bien définis
- Console: cherchez des erreurs liées à `openCart()` ou `closeCart()`

### La fonction save-order échoue

- Netlify Dashboard → Functions → `save-order` → View logs
- Vérifiez les erreurs dans les logs
- Testez manuellement avec curl:

```powershell
curl -X POST https://[votre-site].netlify.app/.netlify/functions/save-order `
  -H "Content-Type: application/json" `
  -d '{"name":"Test","phone":"123","items":[],"total":"0"}'
```

### MongoDB/Supabase connection failed

- Vérifiez que les variables d'environnement sont bien définies dans Netlify
- Vérifiez que l'IP de Netlify est autorisée (MongoDB: Network Access)
- Vérifiez que les credentials sont corrects

---

## Support

Pour toute question ou problème, vérifiez:
1. Les logs Netlify (Functions logs)
2. La console du navigateur (F12 → Console)
3. Le statut de déploiement Netlify (Deploy logs)
