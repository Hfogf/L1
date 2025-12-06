// ==================== ADMIN DASHBOARD ULTRA-ROBUSTE ====================

// API Client simplifié (indépendant)
class AdminAPI {
    constructor() {
        this.baseUrls = [
            'http://172.29.192.1:3000/api',
            'http://localhost:3000/api',
            'http://10.115.107.126:3000/api'
        ];
        this.timeout = 15000;
        this.retries = 5;
    }

    async request(endpoint, options = {}) {
        const method = options.method || 'GET';
        const body = options.body ? JSON.stringify(options.body) : null;
        
        console.log(`📡 [${method}] ${endpoint}`);

        let lastError = null;

        for (let urlAttempt = 0; urlAttempt < this.baseUrls.length; urlAttempt++) {
            const baseUrl = this.baseUrls[urlAttempt];

            for (let attempt = 1; attempt <= this.retries; attempt++) {
                const fullUrl = `${baseUrl}${endpoint}`;
                
                try {
                    console.log(`⏳ Tentative ${attempt}/${this.retries} sur ${baseUrl}`);
                    
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
                    
                    const response = await fetch(fullUrl, {
                        method,
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body,
                        mode: 'cors',
                        credentials: 'omit',
                        cache: 'no-store',
                        signal: controller.signal
                    });

                    clearTimeout(timeoutId);

                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}`);
                    }

                    let data = null;
                    const contentType = response.headers.get('content-type');
                    
                    if (contentType && contentType.includes('application/json')) {
                        data = await response.json();
                    } else {
                        data = await response.text();
                    }

                    console.log(`✅ Succès [${method}] ${endpoint}`);
                    return data;

                } catch (error) {
                    lastError = error;
                    console.error(`❌ Erreur: ${error.message}`);
                    
                    if (attempt < this.retries) {
                        const delay = 500 * attempt;
                        await new Promise(resolve => setTimeout(resolve, delay));
                    }
                }
            }
        }

        console.error(`🔴 Erreur totale: ${lastError?.message}`);
        throw new Error(`Connexion API échouée: ${lastError?.message}`);
    }

    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    async post(endpoint, body) {
        return this.request(endpoint, { method: 'POST', body });
    }

    async put(endpoint, body) {
        return this.request(endpoint, { method: 'PUT', body });
    }

    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
}

const adminAPI = new AdminAPI();
const ADMIN_CODE = 'L1_TRIANGLE';

// ==================== AUTHENTICATION ====================

function handleLogin(e) {
    e.preventDefault();
    const code = document.getElementById('code')?.value;
    
    if (code === ADMIN_CODE) {
        sessionStorage.setItem('admin_authenticated', ADMIN_CODE);
        showDashboard();
    } else {
        const errorEl = document.getElementById('error');
        if (errorEl) {
            errorEl.textContent = '❌ Code invalide';
            errorEl.style.display = 'block';
        }
        alert('❌ Code invalide');
    }
}

function logout() {
    sessionStorage.removeItem('admin_authenticated');
    location.reload();
}

function checkAdmin() {
    const sessionAdmin = sessionStorage.getItem('admin_authenticated');
    if (sessionAdmin === ADMIN_CODE) {
        showDashboard();
        return true;
    }
    return false;
}

// ==================== DASHBOARD ====================

function showDashboard() {
    document.body.innerHTML = `
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
            header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 5px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
            header h1 { margin: 0; }
            header button { background: white; color: #667eea; border: none; padding: 10px 20px; border-radius: 3px; cursor: pointer; font-weight: bold; }
            
            .tabs { display: flex; gap: 10px; margin-bottom: 20px; }
            .tab-btn { padding: 10px 20px; background: white; border: 2px solid #ddd; cursor: pointer; border-radius: 3px; font-weight: bold; }
            .tab-btn.active { background: #667eea; color: white; border-color: #667eea; }
            
            .container { max-width: 1200px; margin: 0 auto; }
            .section { display: none; background: white; padding: 20px; border-radius: 5px; }
            .section.active { display: block; }
            
            .form-group { margin-bottom: 15px; }
            label { display: block; margin-bottom: 5px; font-weight: bold; }
            input, textarea, select { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 3px; box-sizing: border-box; font-size: 14px; }
            textarea { resize: vertical; min-height: 100px; }
            
            button { background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 3px; cursor: pointer; font-weight: bold; }
            button:hover { background: #5568d3; }
            button.danger { background: #e74c3c; }
            button.danger:hover { background: #c0392b; }
            
            table { width: 100%; border-collapse: collapse; }
            table td, table th { padding: 10px; border-bottom: 1px solid #ddd; text-align: left; }
            table th { background: #f0f0f0; font-weight: bold; }
            table tr:hover { background: #f9f9f9; }
            
            .success { background: #d4edda; color: #155724; padding: 10px; border-radius: 3px; margin-bottom: 10px; }
            .error { background: #f8d7da; color: #721c24; padding: 10px; border-radius: 3px; margin-bottom: 10px; }
            .loading { color: #667eea; font-weight: bold; }
        </style>
        
        <div class="container">
            <header>
                <h1>📊 Admin Dashboard L1Triangle</h1>
                <button onclick="logout()">Déconnexion</button>
            </header>
            
            <div class="tabs">
                <button class="tab-btn active" onclick="switchTab('products')">🛍️ Produits</button>
                <button class="tab-btn" onclick="switchTab('orders')">📦 Commandes</button>
                <button class="tab-btn" onclick="switchTab('logs')">📋 Logs</button>
            </div>
            
            <div id="products" class="section active"></div>
            <div id="orders" class="section"></div>
            <div id="logs" class="section"></div>
        </div>
    `;
    
    loadProductsAdmin();
    loadOrdersAdmin();
    loadLogsAdmin();
}

function switchTab(tab) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tab).classList.add('active');
    document.querySelector(`[onclick*="${tab}"]`).classList.add('active');
}

// ==================== PRODUITS ====================

async function loadProductsAdmin() {
    const el = document.getElementById('products');
    el.innerHTML = '<p class="loading">⏳ Chargement...</p>';
    
    try {
        const products = await adminAPI.get('/products');
        
        el.innerHTML = `
            <h2>Gestion des Produits</h2>
            <h3>➕ Ajouter un produit</h3>
            <form onsubmit="handleAddProduct(event)" style="display: grid; gap: 10px; margin-bottom: 30px;">
                <div class="form-group"><label>Nom *</label><input type="text" name="name" required></div>
                <div class="form-group"><label>Catégorie *</label><select name="category" required><option>manettes</option><option>accessoires</option><option>moniteurs</option><option>airpods</option><option>cables</option></select></div>
                <div class="form-group"><label>Prix ($) *</label><input type="number" name="price" step="0.01" required></div>
                <div class="form-group"><label>Stock *</label><input type="number" name="stock" required></div>
                <div class="form-group"><label>Description</label><textarea name="description"></textarea></div>
                <div class="form-group"><label>URL Image</label><input type="url" name="image"></div>
                <button type="submit">Ajouter</button>
            </form>
            
            <h3>Produits existants (${products.length})</h3>
            <div id="products-list"></div>
        `;
        
        const listEl = document.getElementById('products-list');
        listEl.innerHTML = (products || []).map(p => `
            <div style="background: #f9f9f9; padding: 15px; margin-bottom: 10px; border-radius: 3px;">
                <h4>${p.name}</h4>
                <p><strong>Cat:</strong> ${p.category} | <strong>$:</strong> ${p.price} | <strong>Stock:</strong> ${p.stock}</p>
                <button onclick="handleDeleteProduct('${p.id}')" class="danger">🗑️ Supprimer</button>
            </div>
        `).join('');
        
    } catch (error) {
        el.innerHTML = `<div class="error">❌ ${error.message}</div>`;
    }
}

async function handleAddProduct(e) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    
    const product = {
        name: data.get('name'),
        category: data.get('category'),
        price: parseFloat(data.get('price')),
        stock: parseInt(data.get('stock')),
        description: data.get('description'),
        image: data.get('image') || 'https://via.placeholder.com/300x200?text=Produit'
    };
    
    try {
        await adminAPI.post('/products', product);
        alert('✅ Produit ajouté!');
        loadProductsAdmin();
    } catch (error) {
        alert(`❌ ${error.message}`);
    }
}

async function handleDeleteProduct(id) {
    if (!confirm('Êtes-vous sûr?')) return;
    
    try {
        await adminAPI.delete(`/products/${id}`);
        alert('✅ Supprimé!');
        loadProductsAdmin();
    } catch (error) {
        alert(`❌ ${error.message}`);
    }
}

// ==================== COMMANDES ====================

async function loadOrdersAdmin() {
    const el = document.getElementById('orders');
    el.innerHTML = '<p class="loading">⏳ Chargement...</p>';
    
    try {
        const orders = await adminAPI.get('/orders');
        
        el.innerHTML = `
            <h2>Commandes (${(orders || []).length})</h2>
            <table>
                <tr><th>ID</th><th>Client</th><th>Total</th><th>Date</th></tr>
                ${(orders || []).map(o => `
                    <tr>
                        <td>${o.id}</td>
                        <td>${o.customerName}</td>
                        <td>$${o.total?.toFixed(2) || '0'}</td>
                        <td>${new Date(o.date).toLocaleDateString()}</td>
                    </tr>
                `).join('')}
            </table>
        `;
        
    } catch (error) {
        el.innerHTML = `<div class="error">❌ ${error.message}</div>`;
    }
}

// ==================== LOGS ====================

async function loadLogsAdmin() {
    const el = document.getElementById('logs');
    el.innerHTML = '<p class="loading">⏳ Chargement...</p>';
    
    try {
        const logs = await adminAPI.get('/logs');
        
        el.innerHTML = `
            <h2>Logs Système (${(logs || []).length})</h2>
            <table>
                <tr><th>Type</th><th>Message</th><th>Date</th></tr>
                ${(logs || []).map(l => `
                    <tr>
                        <td>${l.type || 'INFO'}</td>
                        <td>${l.message}</td>
                        <td>${new Date(l.date).toLocaleString()}</td>
                    </tr>
                `).join('')}
            </table>
        `;
        
    } catch (error) {
        el.innerHTML = `<div class="error">❌ ${error.message}</div>`;
    }
}

// ==================== INIT ====================

document.addEventListener('DOMContentLoaded', () => {
    if (!checkAdmin()) {
        console.log('Non authentifié - formulaire de login visible');
    }
});
