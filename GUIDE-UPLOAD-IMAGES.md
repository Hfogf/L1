# 🖼️ SYSTÈME D'UPLOAD D'IMAGES - GUIDE COMPLET

## 📋 Vue d'ensemble

Le nouveau backend `backend-render.js` inclut un système complet d'upload et d'hébergement d'images directement sur Render.

## ✨ Fonctionnalités

✅ Upload d'images via API  
✅ Hébergement automatique des images  
✅ URLs permanentes pour chaque image  
✅ Support formats: JPG, PNG, WEBP, GIF  
✅ Limitation: 50MB par image  
✅ Authentification admin requise  

## 🚀 Comment ça marche

### 1. Upload depuis l'Admin Dashboard

```javascript
// Exemple de code dans votre dashboard admin
async function uploadImage(imageFile) {
    const reader = new FileReader();
    
    reader.onload = async function(e) {
        const imageData = e.target.result; // Base64
        
        const response = await fetch('https://l1triangle-shop.onrender.com/api/upload-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Session-Id': sessionStorage.getItem('sessionId')
            },
            body: JSON.stringify({
                imageData: imageData,
                filename: imageFile.name
            })
        });
        
        const result = await response.json();
        console.log('Image URL:', result.imageUrl);
        // result.imageUrl = "/uploads/1234567890-image.jpg"
    };
    
    reader.readAsDataURL(imageFile);
}
```

### 2. Utiliser l'image uploadée

Une fois uploadée, l'image est accessible via:
```
https://l1triangle-shop.onrender.com/uploads/1234567890-image.jpg
```

### 3. Ajouter un produit avec l'image

```javascript
async function addProduct(productData, imageUrl) {
    const response = await fetch('https://l1triangle-shop.onrender.com/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Session-Id': sessionStorage.getItem('sessionId')
        },
        body: JSON.stringify({
            name: productData.name,
            price: productData.price,
            description: productData.description,
            category: productData.category,
            image: imageUrl, // URL de l'image uploadée
            addedByAdmin: true
        })
    });
    
    return await response.json();
}
```

## 🎨 Interface d'Upload (HTML)

```html
<!-- Ajouter dans admin-dashboard-fixed.html -->
<div class="upload-section">
    <h3>📤 Upload Image</h3>
    <input type="file" id="imageInput" accept="image/*">
    <button onclick="handleImageUpload()">Upload</button>
    <div id="uploadResult"></div>
</div>

<script>
async function handleImageUpload() {
    const fileInput = document.getElementById('imageInput');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Sélectionnez une image');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const response = await fetch('https://l1triangle-shop.onrender.com/api/upload-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Session-Id': sessionStorage.getItem('sessionId')
                },
                body: JSON.stringify({
                    imageData: e.target.result,
                    filename: file.name
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                document.getElementById('uploadResult').innerHTML = 
                    `✅ Image uploadée: <br>
                     <img src="https://l1triangle-shop.onrender.com${result.imageUrl}" 
                          style="max-width: 200px"><br>
                     <code>${result.imageUrl}</code>`;
            } else {
                alert('Erreur: ' + result.error);
            }
        } catch (error) {
            alert('Erreur d\'upload: ' + error.message);
        }
    };
    
    reader.readAsDataURL(file);
}
</script>
```

## 📁 Structure des Fichiers

```
/
├── backend-render.js       # Backend principal avec upload
├── database.json          # Base de données
├── uploads/               # Dossier des images uploadées
│   ├── 1702300000000-image1.jpg
│   ├── 1702300000001-image2.png
│   └── ...
```

## 🔒 Sécurité

- ✅ Authentification requise pour upload
- ✅ Validation du format d'image
- ✅ Limite de taille (50MB)
- ✅ Noms de fichiers uniques (timestamp)
- ✅ Pas d'exécution de code (images seulement)

## 🌐 URLs d'Images

### Images uploadées
```
https://l1triangle-shop.onrender.com/uploads/1234567890-image.jpg
```

### Images GitHub (anciennes)
```
https://raw.githubusercontent.com/Hfogf/L1/main/WhatsApp%20Image%202025-11-21%20at%2008.23.36_385ddb4c.jpg
```

## 🔄 Migration des Images Existantes

Pour migrer vos images WhatsApp actuelles:

1. Téléchargez les images depuis votre dépôt GitHub
2. Uploadez-les via l'interface admin
3. Mettez à jour les produits avec les nouvelles URLs

## 📊 Endpoints API

### Upload Image
```http
POST /api/upload-image
Headers:
  Content-Type: application/json
  X-Session-Id: <session-id>

Body:
{
  "imageData": "data:image/jpeg;base64,/9j/4AAQ...",
  "filename": "mon-image.jpg"
}

Response:
{
  "success": true,
  "imageUrl": "/uploads/1702300000000-mon-image.jpg",
  "filename": "1702300000000-mon-image.jpg",
  "message": "Image uploadée avec succès"
}
```

### Accéder aux Images
```http
GET /uploads/:filename

Exemple:
GET /uploads/1702300000000-mon-image.jpg
```

## 🧪 Test de l'Upload

```bash
# Test avec curl
curl -X POST https://l1triangle-shop.onrender.com/api/upload-image \
  -H "Content-Type: application/json" \
  -H "X-Session-Id: <votre-session-id>" \
  -d '{
    "imageData": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "filename": "test.png"
  }'
```

## ⚠️ Notes Importantes

1. **Persistence**: Les images uploadées sur Render peuvent être perdues lors d'un redéploiement. Pour une solution permanente, utilisez un service comme Cloudinary ou AWS S3.

2. **Performance**: Les premières requêtes peuvent être lentes (cold start Render).

3. **Taille**: Limitez la taille des images pour de meilleures performances.

## 🎯 Prochaines Étapes

1. Déployez le nouveau backend: `.\DEPLOYER-RENDER.ps1`
2. Ajoutez l'interface d'upload dans votre dashboard admin
3. Testez l'upload d'une image
4. Créez un produit avec l'image uploadée
5. Vérifiez que l'image s'affiche sur le site

---

**Support**: Si vous avez des questions, vérifiez les logs sur Render Dashboard.
