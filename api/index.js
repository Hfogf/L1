// Health check pour l'API Vercel
module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    return res.status(200).json({ 
        status: 'ok',
        message: 'L1 Triangle API Vercel',
        timestamp: new Date().toISOString(),
        routes: {
            products: '/api/products',
            orders: '/api/orders'
        }
    });
};
