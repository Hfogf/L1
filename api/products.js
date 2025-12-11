// Fonction serverless pour gérer les produits
const products = [];

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        if (req.method === 'GET') {
            return res.status(200).json(products);
        }

        if (req.method === 'POST') {
            const newProduct = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                ...req.body,
                createdAt: new Date().toISOString(),
                addedByAdmin: true
            };
            products.push(newProduct);
            return res.status(201).json(newProduct);
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Error in products:', error);
        return res.status(500).json({ error: error.message });
    }
};
