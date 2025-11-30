
(function(){
  const DEFAULT = 'fr';
  const key = 'lang';
  const switcher = document.getElementById('lang-switcher');
  if(!switcher) return;

  const btn = document.getElementById('lang-btn');
  const list = document.getElementById('lang-list');

  const translations = {
    nav: { products: {fr:'Produits', en:'Products', cr:'Pwodwi'}, contact: {fr:'Contact', en:'Contact', cr:'Kontakte'}, cart: {fr:'Panier', en:'Cart', cr:'Panye'} },
    hero: { lead: {fr:'Matériel gaming — Manettes, Moniteurs, accessoires et kit vape. Sélectionne tes produits, ajoute-les au panier et finalise ta commande facilement.', en:'Gaming gear — Controllers, monitors, accessories and vape kits. Select products, add to cart and complete your order easily.', cr:"Ekipman gaming — manèt, monitè, aksè swa ak kit vape. Chwazi pwodwi yo, ajoute nan panyen epi finalize kòmand la fasil."}, ctaProducts: {fr:'Voir les produits', en:'View products', cr:'Gade pwodwi'}, ctaContact: {fr:'Nous contacter', en:'Contact us', cr:'Kontakte nou'} },
    sections: { categoriesTitle: {fr:'Nos catégories phares', en:'Our main categories', cr:'Kategori nou yo'} },
    categories: {
      manettes: {title:{fr:'Manettes',en:'Controllers',cr:'Manèt'}, desc:{fr:'Manettes ergonomiques, sans fil, autonomie longue durée, compatibles PC et consoles.', en:'Ergonomic controllers, wireless, long battery life, PC & console compatible.', cr:'Manèt ergonomik, san fil, lavi batri long, konpatib ak PC ak konsole.'}},
      monitors: {title:{fr:'Moniteurs',en:'Monitors',cr:'Monitè'}, desc:{fr:'Écrans 144Hz/240Hz, dalle IPS, design borderless, parfaits pour le gaming compétitif.', en:'144Hz/240Hz displays, IPS panels, borderless design, perfect for competitive gaming.', cr:'Ekran 144Hz/240Hz, IPS, konsepsyon san ankadreman, pafè pou gaming konpetitif.'}},
      vape: {title:{fr:'Vape',en:'Vape',cr:'Vape'}, desc:{fr:'Kits vape, pods compacts, e-liquides variés, recharge USB-C, pour tous les profils.', en:'Vape kits, compact pods, varied e-liquids, USB-C charging, for all profiles.', cr:'Kit vape, pod konpak, e-likid varye, chaj USB-C, pou tout pwofil.'}}
    }
  };

  function getStored(){ return localStorage.getItem(key) || DEFAULT }
  function setStored(l){ localStorage.setItem(key, l); }

  function applyLang(l){

    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      const parts = key.split('.');
      let val = translations;
      parts.forEach(p=>{ if(val) val = val[p]; });
      if(val && val[l]){
       
        if(el.id === 'open-cart'){
          const cnt = el.textContent.match(/\((\d+)\)/);
          const suffix = cnt ? ` (${cnt[1]})` : '';
          el.textContent = val[l] + suffix;
        } else el.textContent = val[l];
      }
    });

    const lead = document.querySelector('.hero .lead');
    if(lead) lead.textContent = translations.hero.lead[l];
    const cta1 = document.querySelector('.hero .hero-cta .btn.primary');
    if(cta1) cta1.textContent = translations.hero.ctaProducts[l];
    const cta2 = document.querySelector('.hero .hero-cta .btn:not(.primary)');
    if(cta2) cta2.textContent = translations.hero.ctaContact[l];


    const catTitle = document.querySelector('#produits-html h2');
    if(catTitle) catTitle.textContent = translations.sections.categoriesTitle[l];
   
    const cards = document.querySelectorAll('.produit-card');
    if(cards && cards.length>=3){
  
      const keys = ['manettes','monitors','vape'];
      cards.forEach((c,i)=>{
        const k = keys[i];
        const titleEl = c.querySelector('.produit-titre');
        const descEl = c.querySelector('.produit-desc');
        if(titleEl) titleEl.textContent = translations.categories[k].title[l];
        if(descEl) descEl.textContent = translations.categories[k].desc[l];
      });
    }

    
    if(btn) btn.textContent = (l === 'fr' ? 'FR ▾' : (l === 'en' ? 'EN ▾' : 'CR ▾'));


    window.dispatchEvent(new CustomEvent('languageChange', { detail: { lang: l } }));
  }

  
  const initial = getStored();
  applyLang(initial);


  btn.addEventListener('click', ()=>{
    const visible = list.getAttribute('aria-hidden') === 'false';
    list.setAttribute('aria-hidden', visible ? 'true' : 'false');
  });
  list.addEventListener('click', (e)=>{
    const li = e.target.closest('li[data-lang]');
    if(!li) return;
    const l = li.getAttribute('data-lang');
    setStored(l);
    applyLang(l);
    list.setAttribute('aria-hidden','true');
  });


  document.addEventListener('click', (e)=>{
    if(!switcher.contains(e.target)) list.setAttribute('aria-hidden','true');
  });

})();
