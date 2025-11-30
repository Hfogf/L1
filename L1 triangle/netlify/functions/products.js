const fetch = require('node-fetch');

const GITHUB_API = 'https://api.github.com';

function base64Encode(str){ return Buffer.from(str).toString('base64'); }
function base64Decode(str){ return Buffer.from(str, 'base64').toString('utf8'); }

exports.handler = async function(event, context) {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if(event.httpMethod === 'OPTIONS'){
    return { statusCode: 200, headers: cors, body: 'OK' };
  }
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const path = process.env.PRODUCTS_PATH || 'products.json';
  const branch = process.env.BRANCH || 'main';

  if(!token || !repo){
    return { statusCode: 500, headers: cors, body: JSON.stringify({ error: 'Missing configuration on Netlify (GITHUB_TOKEN/GITHUB_REPO).' }) };
  }

  const headers = { 'Authorization': `token ${token}`, 'User-Agent': 'netlify-function', 'Accept':'application/vnd.github.v3+json' };

  if(event.httpMethod === 'GET'){
    const url = `${GITHUB_API}/repos/${repo}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(branch)}`;
    try{
      const res = await fetch(url, { headers });
      if(res.status === 404) return { statusCode: 200, headers: cors, body: JSON.stringify([]) };
      if(!res.ok) return { statusCode: res.status, headers: cors, body: JSON.stringify({ error: 'GitHub API error' }) };
      const data = await res.json();
      const content = base64Decode(data.content);
      const parsed = JSON.parse(content);
      return { statusCode: 200, headers: cors, body: JSON.stringify(parsed) };
    }catch(err){
      return { statusCode: 500, headers: cors, body: JSON.stringify({ error: err.message }) };
    }
  }

  if(event.httpMethod === 'POST'){
    try{
      const body = JSON.parse(event.body || '{}');
      const products = body.products || [];
      const message = body.message || 'Update products via Netlify Function';

      const getUrl = `${GITHUB_API}/repos/${repo}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(branch)}`;
      const getRes = await fetch(getUrl, { headers });
      let sha = null;
      if(getRes.ok){
        const getData = await getRes.json();
        sha = getData.sha;
      }

      const content = base64Encode(JSON.stringify(products, null, 2));
      const putUrl = `${GITHUB_API}/repos/${repo}/contents/${encodeURIComponent(path)}`;
      const putBody = { message, content, branch };
      if(sha) putBody.sha = sha;

      const putRes = await fetch(putUrl, { method: 'PUT', headers: Object.assign({}, headers, {'Content-Type':'application/json'}), body: JSON.stringify(putBody) });
      if(!putRes.ok){ const text = await putRes.text(); return { statusCode: putRes.status, headers: cors, body: text }; }
      const putData = await putRes.json();
      return { statusCode: 200, headers: cors, body: JSON.stringify({ success: true, commit: putData.commit && putData.commit.sha }) };
    }catch(err){
      return { statusCode: 500, headers: cors, body: JSON.stringify({ error: err.message }) };
    }
  }

  return { statusCode: 405, headers: cors, body: JSON.stringify({ error: 'Method not allowed' }) };
};
