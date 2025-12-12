#!/usr/bin/env node
/**
 * 🚀 BACKEND COMPLET RENDER - L1 TRIANGLE SHOP
 * Gestion complète: API + Hébergement Images + Database
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== CONFIGURATION ====================

// Dossier pour les images uploadées
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// ==================== MIDDLEWARE ====================

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Session-Id'],
    credentials: false
}));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') return res.status(204).end();
    next();
});

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Servir les fichiers statiques (HTML, CSS, JS)
app.use(express.static(__dirname));

// Servir les images uploadées
app.use('/uploads', express.static(UPLOAD_DIR));

// ==================== DATABASE ====================

const DB_FILE = path.join(__dirname, 'database.json');

function readDatabase() {
    try {
        if (fs.existsSync(DB_FILE)) {
            const data = fs.readFileSync(DB_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('❌ DB Read Error:', error.message);
    }
    return { products: [], orders: [], logs: [], sessions: {} };
}

function writeDatabase(data) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('❌ DB Write Error:', error.message);
        return false;
    }
}

function addLog(action, details = {}) {
    const db = readDatabase();
    if (!Array.isArray(db.logs)) db.logs = [];
    db.logs.push({
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        action,
        details
    });
    writeDatabase(db);
}

// ==================== AUTHENTIFICATION ====================

const ADMIN_CREDENTIALS = {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'admin123'
};

function verifyAuth(req, res, next) {
    const sessionId = req.headers['x-session-id'];
    if (!sessionId) {
        return res.status(401).json({ error: 'Session requise' });
    }

    const db = readDatabase();
    const session = db.sessions?.[sessionId];
    
    if (!session || new Date(session.expires) < new Date()) {
        return res.status(401).json({ error: 'Session expirée' });
    }

    req.sessionId = sessionId;
    next();
}

// ==================== ROUTES AUTHENTIFICATION ====================

app.post('/api/admin/login', (req, res) => {
    try {
        const { username, password } = req.body;

        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            const sessionId = uuidv4();
            const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

            const db = readDatabase();
            if (!db.sessions) db.sessions = {};
            db.sessions[sessionId] = { username, expires };
            writeDatabase(db);

            addLog('admin_login', { username });
            
            res.json({
                success: true,
                sessionId,
                message: 'Connexion réussie'
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Identifiants incorrects'
            });
        }
    } catch (error) {
        console.error('❌ Login Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/admin/logout', verifyAuth, (req, res) => {
    try {
        const db = readDatabase();
        if (db.sessions?.[req.sessionId]) {
            delete db.sessions[req.sessionId];
            writeDatabase(db);
        }
        res.json({ success: true, message: 'Déconnexion réussie' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== ROUTES UPLOAD IMAGES ====================

app.post('/api/upload-image', verifyAuth, (req, res) => {
    try {
        const { imageData, filename } = req.body;

        if (!imageData || !imageData.startsWith('data:image')) {
            return res.status(400).json({ error: 'Image invalide' });
        }

        // Extraire le type et les données base64
        const matches = imageData.match(/^data:image\/(\w+);base64,(.+)$/);
        if (!matches) {
            return res.status(400).json({ error: 'Format image invalide' });
        }

        const ext = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, 'base64');

        // Générer un nom de fichier unique
        const uniqueFilename = `${Date.now()}-${filename || uuidv4()}.${ext}`;
        const filepath = path.join(UPLOAD_DIR, uniqueFilename);

        // Sauvegarder l'image
        fs.writeFileSync(filepath, buffer);

        // URL publique de l'image
        const imageUrl = `/uploads/${uniqueFilename}`;

        addLog('image_upload', { filename: uniqueFilename, size: buffer.length });

        res.json({
            success: true,
            imageUrl,
            filename: uniqueFilename,
            message: 'Image uploadée avec succès'
        });

    } catch (error) {
        console.error('❌ Upload Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ==================== ROUTES PRODUITS ====================

app.get('/api/products', (req, res) => {
    try {
        const db = readDatabase();
        const products = Array.isArray(db.products) ? db.products : [];
        
        // Retourner uniquement les produits admin
        const adminProducts = products.filter(p => p.addedByAdmin === true);
        
        console.log(`📦 GET /api/products: ${adminProducts.length}/${products.length} admin items`);
        res.json(adminProducts);
    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/products', verifyAuth, (req, res) => {
    try {
        const db = readDatabase();
        const newProduct = {
            id: uuidv4(),
            ...req.body,
            addedByAdmin: true,
            createdAt: new Date().toISOString()
        };

        if (!Array.isArray(db.products)) db.products = [];
        db.products.push(newProduct);
        
        if (writeDatabase(db)) {
            addLog('product_created', { id: newProduct.id, name: newProduct.name });
            res.json({ success: true, product: newProduct });
        } else {
            res.status(500).json({ error: 'Échec de sauvegarde' });
        }
    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/products/:id', verifyAuth, (req, res) => {
    try {
        const db = readDatabase();
        const productIndex = db.products.findIndex(p => p.id === req.params.id);
        
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }

        db.products[productIndex] = {
            ...db.products[productIndex],
            ...req.body,
            id: req.params.id,
            addedByAdmin: true,
            updatedAt: new Date().toISOString()
        };

        if (writeDatabase(db)) {
            addLog('product_updated', { id: req.params.id });
            res.json({ success: true, product: db.products[productIndex] });
        } else {
            res.status(500).json({ error: 'Échec de sauvegarde' });
        }
    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/products/:id', verifyAuth, (req, res) => {
    try {
        const db = readDatabase();
        const productIndex = db.products.findIndex(p => p.id === req.params.id);
        
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }

        const deletedProduct = db.products.splice(productIndex, 1)[0];
        
        if (writeDatabase(db)) {
            addLog('product_deleted', { id: req.params.id, name: deletedProduct.name });
            res.json({ success: true, message: 'Produit supprimé' });
        } else {
            res.status(500).json({ error: 'Échec de sauvegarde' });
        }
    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ==================== ROUTES COMMANDES ====================

app.get('/api/orders', verifyAuth, (req, res) => {
    try {
        const db = readDatabase();
        res.json(Array.isArray(db.orders) ? db.orders : []);
    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/orders', (req, res) => {
    try {
        const db = readDatabase();
        const newOrder = {
            id: uuidv4(),
            ...req.body,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        if (!Array.isArray(db.orders)) db.orders = [];
        db.orders.push(newOrder);
        
        if (writeDatabase(db)) {
            addLog('order_created', { id: newOrder.id, total: newOrder.total });
            res.json({ success: true, order: newOrder });
        } else {
            res.status(500).json({ error: 'Échec de sauvegarde' });
        }
    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/orders/:id', verifyAuth, (req, res) => {
    try {
        const db = readDatabase();
        const orderIndex = db.orders.findIndex(o => o.id === req.params.id);
        
        if (orderIndex === -1) {
            return res.status(404).json({ error: 'Commande non trouvée' });
        }

        db.orders[orderIndex] = {
            ...db.orders[orderIndex],
            ...req.body,
            updatedAt: new Date().toISOString()
        };

        if (writeDatabase(db)) {
            addLog('order_updated', { id: req.params.id, status: req.body.status });
            res.json({ success: true, order: db.orders[orderIndex] });
        } else {
            res.status(500).json({ error: 'Échec de sauvegarde' });
        }
    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ==================== ROUTES LOGS ====================

app.get('/api/logs', verifyAuth, (req, res) => {
    try {
        const db = readDatabase();
        const logs = Array.isArray(db.logs) ? db.logs : [];
        res.json(logs.slice(-100)); // Derniers 100 logs
    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ==================== ROUTES SANTÉ ====================

app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage()
    });
});

app.get('/api', (req, res) => {
    res.json({
        name: 'L1 Triangle Shop API',
        version: '2.0.0',
        endpoints: {
            auth: ['/api/admin/login', '/api/admin/logout'],
            products: ['/api/products', '/api/products/:id'],
            orders: ['/api/orders', '/api/orders/:id'],
            images: ['/api/upload-image'],
            logs: ['/api/logs'],
            health: ['/api/health']
        }
    });
});

// ==================== ROUTE INDEX ====================

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ==================== DÉMARRAGE SERVEUR ====================

app.listen(PORT, () => {
    console.log('╔════════════════════════════════════════════════╗');
    console.log('║   🚀 L1 TRIANGLE SHOP - BACKEND RENDER        ║');
    console.log('╚════════════════════════════════════════════════╝');
    console.log('');
    console.log(`✅ Serveur démarré sur le port ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`📁 Dossier uploads: ${UPLOAD_DIR}`);
    console.log(`💾 Database: ${DB_FILE}`);
    console.log('');
    console.log('📋 Endpoints disponibles:');
    console.log('   • GET  /api/products');
    console.log('   • POST /api/products');
    console.log('   • POST /api/upload-image');
    console.log('   • POST /api/admin/login');
    console.log('   • GET  /api/orders');
    console.log('   • GET  /api/logs');
    console.log('   • GET  /api/health');
    console.log('');
    console.log('🔑 Credentials:');
    console.log(`   • Username: ${ADMIN_CREDENTIALS.username}`);
    console.log(`   • Password: ${ADMIN_CREDENTIALS.password}`);
    console.log('════════════════════════════════════════════════');
});

// Gestion des erreurs non capturées
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('❌ Unhandled Rejection:', error);
});

module.exports = app;
