const { useState, useEffect } = React;

const SAMPLE_PRODUCTS = [
  // Manettes
  { id: 'm1', title: 'Manette L1 TRIANGLE Pro', category: 'Manettes', price: 59.99, image: 'https://picsum.photos/seed/manette1/400/240', description: 'Manette ergonomique, latence réduite, compatible PC/console.' },
  { id: 'm2', title: 'Manette Sans Fil V2', category: 'Manettes', price: 44.90, image: 'https://picsum.photos/seed/manette2/400/240', description: 'Sans fil, autonomie 30h, recharge rapide.' },
  { id: 'm3', title: 'Mini Gamepad Mobile', category: 'Manettes', price: 24.50, image: 'https://picsum.photos/seed/manette3/400/240', description: 'Compact pour gaming mobile, Bluetooth, léger.' },

  // Moniteurs
  { id: 'mon1', title: 'Moniteur 144Hz 27"', category: 'Moniteurs', price: 249.00, image: 'https://picsum.photos/seed/monitor1/400/240', description: '27 pouces, 144Hz, faible latence, parfait pour FPS.' },
  { id: 'mon2', title: 'Moniteur 240Hz 24"', category: 'Moniteurs', price: 399.00, image: 'https://picsum.photos/seed/monitor2/400/240', description: 'Écran pro 240Hz, dalle IPS, design borderless.' },
  { id: 'mon3', title: 'Moniteur 60Hz 22"', category: 'Moniteurs', price: 129.00, image: 'https://picsum.photos/seed/monitor3/400/240', description: 'Écran bureautique 22", excellent rendu couleur.' },

  // Vape
  { id: 'v1', title: 'Vape Starter Kit', category: 'Vape', price: 29.99, image: 'https://picsum.photos/seed/vape1/400/240', description: 'Kit débutant, batterie intégrée, saveurs variées.' },
  { id: 'v2', title: 'E-liquide 50ml', category: 'Vape', price: 12.50, image: 'https://picsum.photos/seed/vape2/400/240', description: 'E-liquide, plusieurs arômes, nicotine optionnelle.' },
  { id: 'v3', title: 'Pod Vape Compact', category: 'Vape', price: 19.99, image: 'https://picsum.photos/seed/vape3/400/240', description: 'Pod compact, usage facile, recharge USB-C.' },

  // Accessoires
  { id: 'a1', title: 'Casque Gaming RGB', category: 'Accessoires', price: 69.99, image: 'https://picsum.photos/seed/headset1/400/240', description: 'Son surround, micro amovible, lumières RGB.', poster: 'Affiche: Son Surround' },
  { id: 'a2', title: 'Tapis de souris XL', category: 'Accessoires', price: 19.90, image: 'https://picsum.photos/seed/mousepad1/400/240', description: 'Surface lisse, base antidérapante, grand format.', poster: 'Affiche: XL Surface' },
  { id: 'a3', title: 'Clavier Mécanique', category: 'Accessoires', price: 89.00, image: 'https://picsum.photos/seed/keyboard1/400/240', description: 'Switchs tactiles, rétroéclairage RGB, durable.', poster: 'Affiche: Switchs Tactiles' },
  { id: 'a4', title: 'Microphone USB', category: 'Accessoires', price: 39.50, image: 'https://picsum.photos/seed/mic1/400/240', description: 'Micro pour streaming et appels, plug & play.', poster: 'Affiche: Micro USB' },
  { id: 'a5', title: 'Support Casque', category: 'Accessoires', price: 12.50, image: 'https://picsum.photos/seed/stand1/400/240', description: 'Support élégant pour ranger votre casque.', poster: 'Affiche: Support' },
  { id: 'a6', title: 'Filtre Antipoussière PC', category: 'Accessoires', price: 9.99, image: 'https://picsum.photos/seed/filter1/400/240', description: 'Filtre réutilisable facile à installer.', poster: 'Affiche: Filtre' },
  { id: 'a7', title: 'Repos Poignets Ergonomique', category: 'Accessoires', price: 14.90, image: 'https://picsum.photos/seed/wrist1/400/240', description: 'Confort pour longues sessions, anti-dérapant.', poster: 'Affiche: Confort' },
  { id: 'a8', title: 'Station de Charge 3-en-1', category: 'Accessoires', price: 34.99, image: 'https://picsum.photos/seed/chargerstation1/400/240', description: 'Charge simultanément téléphone, montre et écouteurs.', poster: 'Affiche: Station 3-en-1' },

  // AirPods
  { id: 'ap1', title: 'AirPods Pro (Gen 1)', category: 'AirPods', price: 149.99, image: 'https://picsum.photos/seed/airpods1/400/240', description: 'ANC, boîtier de charge, son haute fidélité.' },
  { id: 'ap2', title: 'AirPods (Gen 2)', category: 'AirPods', price: 99.99, image: 'https://picsum.photos/seed/airpods2/400/240', description: 'Connexion rapide, son clair, autonomie solide.' },

  // Câbles & Chargeurs
  { id: 'c1', title: 'Câble USB-C 2m', category: 'Câbles & Chargeurs', price: 8.99, image: 'https://picsum.photos/seed/cable1/400/240', description: 'Câble renforcé, charge rapide 60W.' },
  { id: 'c2', title: 'Chargeur Rapide 30W', category: 'Câbles & Chargeurs', price: 24.90, image: 'https://picsum.photos/seed/charger1/400/240', description: 'Chargeur compact 30W USB-C, PD.' },
  { id: 'c3', title: 'Hub USB Multi-port', category: 'Câbles & Chargeurs', price: 34.50, image: 'https://picsum.photos/seed/hub1/400/240', description: 'Hub 4 ports, HDMI, USB-A, carte SD.' }
  ,
  // Additional products added per request
  // extra manettes
  { id: 'm4', title: 'Manette Elite Pro', category: 'Manettes', price: 129.99, image: 'https://picsum.photos/seed/manette4/400/240', description: 'Manette premium avec palettes arrière et réglages avancés.' },
  { id: 'm5', title: 'Manette Mobile Fold', category: 'Manettes', price: 34.99, image: 'https://picsum.photos/seed/manette5/400/240', description: 'Se plie pour transport, ergonomique pour mobile.' },

  // extra monitors
  { id: 'mon4', title: 'Moniteur Ultrawide 34"', category: 'Moniteurs', price: 579.00, image: 'https://picsum.photos/seed/monitor4/400/240', description: 'Écran ultrawide 34" 144Hz, immersion totale.' },

  // extra vape flavors and kits
  { id: 'v4', title: 'Vape Pro 2000 puffs', category: 'Vape', price: 39.99, image: 'https://picsum.photos/seed/vape4/400/240', description: 'Grande capacité 2000 puffs, pack saveurs tropicales.' },
  { id: 'v5', title: 'E-liquide Menthe 50ml', category: 'Vape', price: 12.50, image: 'https://picsum.photos/seed/vape5/400/240', description: 'Saveur menthe fraîche, base de qualité.' },

  // extra accessoires
  { id: 'a9', title: 'Support Écran Réglable', category: 'Accessoires', price: 29.99, image: 'https://picsum.photos/seed/stand2/400/240', description: 'Support réglable pour améliorer ergonomie écran.' , poster: 'Affiche: Ergonomie' },
  { id: 'a10', title: 'Lampe LED Bureau', category: 'Accessoires', price: 22.50, image: 'https://picsum.photos/seed/lamp1/400/240', description: 'Lampe LED à intensité variable, design moderne.', poster: 'Affiche: Lumière' },

  // extra AirPods variant
  { id: 'ap3', title: 'AirPods Pro (Gen 2)', category: 'AirPods', price: 199.99, image: 'https://picsum.photos/seed/airpods3/400/240', description: 'Nouvelle génération, meilleure autonomie et ANC.' },

  // extra cables
  { id: 'c4', title: 'Câble Lightning 1m', category: 'Câbles & Chargeurs', price: 9.99, image: 'https://picsum.photos/seed/cable2/400/240', description: 'Câble Apple Lightning, durable et rapide.' }
];

function localizeProduct(p, lang){
  // provide translations for title and description
  const map = {
    'm1': { fr: {title: 'Manette L1 TRIANGLE Pro', desc: 'Manette ergonomique, latence réduite, compatible PC/console.' }, en: {title: 'L1 TRIANGLE Pro Controller', desc: 'Ergonomic controller, low latency, PC/console compatible.'}, cr: {title: 'Manèt L1 TRIANGLE Pro', desc: 'Manèt ergonomik, latans ba, konpatib PC/console.' } },
    'm2': { fr: {title: 'Manette Sans Fil V2', desc: 'Sans fil, autonomie 30h, recharge rapide.' }, en: {title: 'Wireless Controller V2', desc: 'Wireless, 30h battery life, fast charge.'}, cr: {title: 'Manèt san fil V2', desc: 'San fil, 30h batri, rechaje vit.' } },
    'mon1': { fr: {title: 'Moniteur 144Hz 27"', desc: '27 pouces, 144Hz, faible latence, parfait pour FPS.' }, en: {title: '27" 144Hz Monitor', desc: '27 inch, 144Hz, low latency, perfect for FPS.'}, cr: {title: 'Monitè 27" 144Hz', desc: '27 pous, 144Hz, latans ba, pafè pou FPS.' } },
    'mon2': { fr: {title: 'Moniteur 240Hz 24"', desc: 'Écran pro 240Hz, dalle IPS, design borderless.' }, en: {title: '24" 240Hz Monitor', desc: 'Pro 240Hz screen, IPS panel, borderless design.'}, cr: {title: 'Monitè 24" 240Hz', desc: 'Ekran pwofesyonèl 240Hz, IPS, san ankadreman.' } },
    'v1': { fr: {title: 'Vape Starter Kit', desc: 'Kit débutant, batterie intégrée, saveurs variées.' }, en: {title: 'Vape Starter Kit', desc: 'Beginner kit, built-in battery, various flavours.'}, cr: {title: 'Kit Demare Vape', desc: 'Kit pou débutan, batri entegre, divès gou.' } },
    'v2': { fr: {title: 'E-liquide 50ml', desc: 'E-liquide, plusieurs arômes, nicotine optionnelle.' }, en: {title: 'E-liquid 50ml', desc: 'E-liquid, multiple flavours, optional nicotine.'}, cr: {title: 'E-likid 50ml', desc: 'E-likid, plizyè gou, nikotin opsyonèl.' } },
    'v3': { fr: {title: 'Pod Vape Compact', desc: 'Pod compact, usage facile, recharge USB-C.' }, en: {title: 'Compact Vape Pod', desc: 'Compact pod, easy to use, USB-C charging.'}, cr: {title: 'Pod Vape Konpak', desc: 'Pod konpak, fasil pou itilize, rechaj USB-C.' } }
  };
  const trans = map[p.id] || {};
  const title = (trans[lang] && trans[lang].title) || p.title;
  const desc = (trans[lang] && trans[lang].desc) || p.description;
  return {...p, title, description: desc };
}

function useLocalStorage(key, initial){
  const [state, setState] = useState(()=>{
    try{ const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : initial }catch(e){ return initial }
  });
  useEffect(()=>{ try{ localStorage.setItem(key, JSON.stringify(state)) }catch(e){} }, [key, state]);
  return [state, setState];
}

// UI translations for app strings
const UI_STRINGS = {
  productsHeading: { fr:'Produits', en:'Products', cr:'Pwodwi' },
  view: { fr:'Voir', en:'View', cr:'Gade' },
  addToCart: { fr:'Ajouter au panier', en:'Add to cart', cr:'Ajoute nan panyen' },
  cartTitle: { fr:'Votre panier', en:'Your cart', cr:'Panye ou' },
  close: { fr:'Fermer', en:'Close', cr:'Fèmen' },
  cartEmpty: { fr:'Panier vide', en:'Cart is empty', cr:'Panyen vid' },
  unitPrice: { fr:'Prix unité:', en:'Unit price:', cr:'Pri inite:' },
  remove: { fr:'Supprimer', en:'Remove', cr:'Retire' },
  total: { fr:'Total', en:'Total', cr:'Total' },
  name: { fr:'Nom', en:'Name', cr:'Non' },
  phone: { fr:'Téléphone', en:'Phone', cr:'Telefòn' },
  address: { fr:'Adresse de livraison', en:'Delivery address', cr:'Adrès livrezon' },
  sendMail: { fr:'Envoyer par mail', en:'Send by email', cr:'Voye pa imèl' },
  whatsapp: { fr:'Discuter par WhatsApp', en:'Discuss on WhatsApp', cr:'Diskite sou WhatsApp' },
  afterValidation: { fr:'Après validation, nous discuterons sur WhatsApp pour organiser la livraison et le paiement (espèces ou CB à la réception).', en:'After confirmation we will discuss on WhatsApp to arrange delivery and payment (cash or card on delivery).', cr:'Apre verifikasyon, n ap diskite sou WhatsApp pou òganize livrezon ak peman (lajan kach oswa kat sou livrezon).' }
};

function App(){
  const [storedLang, setStoredLang] = useLocalStorage('lang','fr');
  const [lang, setLang] = useState(storedLang);
  const [products, setProducts] = useState(SAMPLE_PRODUCTS.map(p=> localizeProduct(p, storedLang)));
  const [cart, setCart] = useLocalStorage('cart', {});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);

  useEffect(()=>{
    const onLang = (e)=>{
      const l = (e && e.detail && e.detail.lang) || localStorage.getItem('lang') || 'fr';
      setLang(l);
      setStoredLang(l);
      setProducts(SAMPLE_PRODUCTS.map(p=> localizeProduct(p, l)));
    };
    window.addEventListener('languageChange', onLang);
    return ()=> window.removeEventListener('languageChange', onLang);
  }, []);

  function addToCart(prod, qty=1){
    setCart(prev=>{
      const next = {...prev};
      if(next[prod.id]) next[prod.id].qty += qty; else next[prod.id] = { product: prod, qty };
      return next;
    });
  }

  function updateQty(id, qty){
    setCart(prev=>{ const next = {...prev}; if(next[id]){ next[id].qty = qty; if(next[id].qty<=0) delete next[id]; } return next });
  }

  function removeItem(id){ setCart(prev=>{ const next = {...prev}; delete next[id]; return next }) }

  const cartCount = Object.values(cart).reduce((s,i)=>s + (i.qty||0), 0);
  const total = Object.values(cart).reduce((s,i)=>s + (i.qty * i.product.price), 0).toFixed(2);

  return (
    <div>
      <section className="container" style={{paddingTop:12}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:12}}>
          <div>
            <div style={{fontWeight:800, fontSize:18}}>L1 TRIANGLE</div>
            <div className="small">{ lang === 'fr' ? 'Matériel gaming & vape — livraison et paiement à la livraison' : lang === 'en' ? 'Gaming gear & vape — delivery and pay on delivery' : 'Ekipman gaming & vape — livrezon ak peman sou livrezon' }</div>
          </div>
          <div>
            <button className="cart-btn" onClick={()=>setDrawerOpen(true)}>{ lang === 'fr' ? `Panier (${cartCount})` : lang === 'en' ? `Cart (${cartCount})` : `Panye (${cartCount})` }</button>
          </div>
        </div>
      </section>

      <main className="container">
        <section id="products">
          <h2 style={{marginTop:8}}>{ UI_STRINGS.productsHeading[lang] }</h2>
          {/* Group products by category */}
          {(() => {
            const grouped = products.reduce((acc,p)=>{
              acc[p.category] = acc[p.category] || [];
              acc[p.category].push(p);
              return acc;
            }, {});
            return Object.keys(grouped).map(cat=> (
              <div key={cat} style={{marginBottom:20}}>
                <h3 style={{marginBottom:8}}>{cat}</h3>
                <div className="grid">
                  {grouped[cat].map(p=> (
                    <article className="card" key={p.id}>
                      <div className="card-media">
                        <img src={p.image} alt={p.title} onClick={()=>setModalProduct(p)} />
                        {p.poster && <div className="poster-badge">{p.poster}</div>}
                      </div>
                      <div className="card-body">
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                          <div>
                            <strong>{p.title}</strong>
                            <div className="small">{p.category}</div>
                          </div>
                          <div className="price">${p.price.toFixed(2)}</div>
                        </div>
                        <div className="small">{p.description}</div>
                        <div className="actions">
                          <button className="btn" onClick={()=>setModalProduct(p)}>{ UI_STRINGS.view[lang] }</button>
                          <button className="btn primary" onClick={()=>addToCart(p)}>{ UI_STRINGS.addToCart[lang] }</button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))
          })()}
        </section>
      </main>

      <CartDrawer open={drawerOpen} onClose={()=>setDrawerOpen(false)} cart={cart} updateQty={updateQty} removeItem={removeItem} total={total} />

      {modalProduct && <ProductModal product={modalProduct} onClose={()=>setModalProduct(null)} onAdd={(p)=>{ addToCart(p); setModalProduct(null); }} />}
    </div>
  );
}

function CartDrawer({open, onClose, cart, updateQty, removeItem, total}){
  return (
    <aside className={"cart-drawer " + (open? 'open':'' )} aria-hidden={!open}>
      <div className="cart-header">
        <div style={{fontWeight:700}}>{ UI_STRINGS.cartTitle[localStorage.getItem('lang') || 'fr'] }</div>
        <div><button className="btn" onClick={onClose}>{ UI_STRINGS.close[localStorage.getItem('lang') || 'fr'] }</button></div>
      </div>
      <div className="cart-items">
        {Object.keys(cart).length === 0 && <div className="small" style={{padding:'1rem'}}>{ UI_STRINGS.cartEmpty[localStorage.getItem('lang') || 'fr'] }</div>}
        {Object.values(cart).map(item=> (
          <div className="cart-item" key={item.product.id}>
            <img src={item.product.image} alt="" />
            <div style={{flex:1}}>
              <div style={{display:'flex', justifyContent:'space-between'}}>
                <div><strong>{item.product.title}</strong></div>
                <div className="small">${(item.product.price * item.qty).toFixed(2)}</div>
              </div>
              <div className="small">{ UI_STRINGS.unitPrice[localStorage.getItem('lang') || 'fr'] } ${item.product.price.toFixed(2)}</div>
              <div style={{marginTop:6, display:'flex', gap:6}}>
                <button className="btn" onClick={()=>updateQty(item.product.id, item.qty-1)}>-</button>
                <div style={{padding:'0.5rem 0.75rem', border:'1px solid #eee', borderRadius:6}}>{item.qty}</div>
                <button className="btn" onClick={()=>updateQty(item.product.id, item.qty+1)}>+</button>
                <button className="btn" onClick={()=>removeItem(item.product.id)}>{ UI_STRINGS.remove[localStorage.getItem('lang') || 'fr'] }</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-footer">
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:8}}>
          <div>{ UI_STRINGS.total[localStorage.getItem('lang') || 'fr'] }</div>
          <div style={{fontWeight:700}}>${total}</div>
        </div>
        <CheckoutForm cart={cart} total={total} />
      </div>
    </aside>
  );
}

function CheckoutForm({cart, total}){
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const lang = localStorage.getItem('lang') || 'fr';

  function makeOrderMessage(){
    const lines = [];
    const l = localStorage.getItem('lang') || 'fr';
    const labels = {
      fr: { order: 'Commande L1 TRIANGLE', name: 'Nom', phone: 'Téléphone', address: 'Adresse', products: 'Produits sélectionnés', total: 'Total', payment: 'Mode de paiement: Paiement à la livraison' },
      en: { order: 'L1 TRIANGLE Order', name: 'Name', phone: 'Phone', address: 'Address', products: 'Selected products', total: 'Total', payment: 'Payment method: Pay on delivery' },
      cr: { order: 'Kòmand L1 TRIANGLE', name: 'Non', phone: 'Telefòn', address: 'Adrès', products: 'Pwodwi yo chwazi', total: 'Total', payment: 'Metòd peman: Peman sou livrezon' }
    };
    const lab = labels[l] || labels.fr;
    lines.push(`${lab.order}%0A`);
    lines.push(`${lab.name}: ${name || '[nom]'}%0A`);
    lines.push(`${lab.phone}: ${phone || '[téléphone]'}%0A`);
    lines.push(`${lab.address}: ${address || '[adresse]'}%0A`);
    lines.push(`${lab.products}:%0A`);
    Object.values(cart).forEach(i=>{
      lines.push(`- ${i.product.title} (${i.product.category}) x${i.qty} : $${(i.product.price * i.qty).toFixed(2)}%0A`);
      if(i.product.image) lines.push(`${i.product.image}%0A`);
    });
    lines.push(`${lab.total}: $${total}%0A`);
    lines.push('%0A' + lab.payment);
    return lines.join('');
  }

  const mailTo = () => {
    const be = localStorage.getItem('business_email') || 'senatmike78@gmail.com';
    return `mailto:${encodeURIComponent(be)}?subject=${encodeURIComponent('Nouvelle commande')}&body=${makeOrderMessage()}`;
  };
  const whatsapp = () => {
    const bw = localStorage.getItem('business_whatsapp');
    if(bw){ return `https://wa.me/${encodeURIComponent(bw)}?text=${makeOrderMessage()}`; }
    return `https://wa.me/?text=${makeOrderMessage()}`;
  };

  return (
    <div>
      <div className="field">
        <label>{ UI_STRINGS.name[lang] }</label>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder={ lang === 'fr' ? 'Votre nom' : lang === 'en' ? 'Your name' : 'Non ou' } />
      </div>
      <div className="field">
        <label>{ UI_STRINGS.phone[lang] }</label>
        <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder={ lang === 'fr' ? '+33...' : lang === 'en' ? '+44...' : '+509...' } />
      </div>
      <div className="field">
        <label>{ UI_STRINGS.address[lang] }</label>
        <textarea value={address} onChange={e=>setAddress(e.target.value)} rows={2} placeholder={ lang === 'fr' ? 'Rue, ville...' : lang === 'en' ? 'Street, city...' : 'Lari, vil...' }></textarea>
      </div>

      <div style={{display:'flex', gap:8}}>
        <a className="btn" href={mailTo()}>{ UI_STRINGS.sendMail[lang] }</a>
        <a className="btn primary" href={whatsapp()} target="_blank">{ UI_STRINGS.whatsapp[lang] }</a>
      </div>
      <div className="small" style={{marginTop:8}}>
        { UI_STRINGS.afterValidation[lang] }
      </div>
    </div>
  );
}

function ProductModal({product, onClose, onAdd}){
  return (
    <div className="modal" onClick={onClose}>
      <div className="panel" onClick={e=>e.stopPropagation()}>
        <div style={{display:'flex', gap:0}}>
          <img src={product.image} style={{width: '40%', objectFit:'cover'}} alt="" />
          <div style={{padding:16, flex:1}}>
            <div style={{display:'flex', justifyContent:'space-between'}}>
              <h3>{product.title}</h3>
              <div className="price">${product.price.toFixed(2)}</div>
            </div>
            <p>{product.description}</p>
            <div style={{display:'flex', gap:8, marginTop:12}}>
                  <button className="btn" onClick={onClose}>{ UI_STRINGS.close[localStorage.getItem('lang') || 'fr'] }</button>
                  <button className="btn primary" onClick={()=>onAdd(product)}>{ UI_STRINGS.addToCart[localStorage.getItem('lang') || 'fr'] }</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
