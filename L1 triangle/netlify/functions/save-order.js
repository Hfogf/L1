const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: 'OK' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ ok: false, error: 'Method not allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    
    if (!data.name || !data.phone || !data.items) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ ok: false, error: 'Missing required fields: name, phone, items' })
      };
    }

    console.log('New order received:', {
      name: data.name,
      phone: data.phone,
      email: data.email || 'N/A',
      items: data.items,
      total: data.total || 0,
      timestamp: new Date().toISOString()
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ok: true,
        message: 'Commande reçue avec succès',
        orderId: `ORDER-${Date.now()}`,
        data: {
          name: data.name,
          phone: data.phone,
          total: data.total
        }
      })
    };
  } catch (err) {
    console.error('Error processing order:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        ok: false,
        error: 'Erreur serveur lors du traitement de la commande',
        details: err && err.message ? err.message : undefined
      })
    };
  }
};
