// Fonction serverless pour gérer les commandes
const orders = [];

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        if (req.method === 'GET') {
            return res.status(200).json(orders);
        }

        if (req.method === 'POST') {
            const newOrder = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                ...req.body,
                createdAt: new Date().toISOString(),
                status: 'pending'
            };
            orders.push(newOrder);
            return res.status(201).json(newOrder);
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Error in orders:', error);
        return res.status(500).json({ error: error.message });
    }
};
