// Background wallpaper animation (particles / neon glows)
(function(){
  // If a background video element exists, prefer it and skip canvas animation
  const video = document.getElementById('bg-video');
  if(video){
    // hide canvas if present and stop
    const c = document.getElementById('bg-canvas');
    if(c) c.style.display = 'none';
    return;
  }

  const canvas = document.getElementById('bg-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');

  // Respect prefers-reduced-motion
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce){ canvas.style.display = 'none'; return; }

  let w = 0, h = 0, particles = [];
  const colors = ['#00f0ff', '#a100ff', '#ff3b6b'];

  function resize(){
    const ratio = window.devicePixelRatio || 1;
    w = canvas.width = Math.max(300, Math.floor(window.innerWidth * ratio));
    h = canvas.height = Math.max(300, Math.floor(window.innerHeight * ratio));
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    // adjust particle count by area
    const area = window.innerWidth * window.innerHeight;
    const count = area > 1200000 ? 80 : area > 600000 ? 50 : 28;
    while(particles.length < count) particles.push(createParticle(ratio));
    while(particles.length > count) particles.pop();
  }

  function createParticle(ratio){
    const size = (Math.random()*18 + 6) * ratio;
    return {
      x: Math.random()*w,
      y: Math.random()*h,
      vx: (Math.random()-0.5) * 0.4,
      vy: (Math.random()-0.5) * 0.4,
      r: size,
      color: colors[Math.floor(Math.random()*colors.length)],
      phase: Math.random()*Math.PI*2
    };
  }

  function step(){
    ctx.clearRect(0,0,w,h);
    // subtle background gradient overlay
    const g = ctx.createLinearGradient(0,0,w,h);
    g.addColorStop(0, 'rgba(3,8,12,0.18)');
    g.addColorStop(1, 'rgba(2,6,10,0.28)');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,w,h);

    // draw particles
    particles.forEach(p=>{
      p.x += p.vx + Math.sin(p.phase)*0.1;
      p.y += p.vy + Math.cos(p.phase)*0.1;
      p.phase += 0.002 + Math.random()*0.002;
      if(p.x < -p.r) p.x = w + p.r;
      if(p.x > w + p.r) p.x = -p.r;
      if(p.y < -p.r) p.y = h + p.r;
      if(p.y > h + p.r) p.y = -p.r;

      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = p.color;
      // neon glow
      ctx.shadowColor = p.color;
      ctx.shadowBlur = Math.max(12, p.r * 0.9);
      ctx.globalAlpha = 0.9;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
    });

    // link lines
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < 180){
          ctx.strokeStyle = 'rgba(120,200,255,' + (0.12 * (1 - dist/180)) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    ctx.restore();

    // subtle vignette
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    const vign = ctx.createRadialGradient(w/2, h/2, Math.min(w,h)/4, w/2, h/2, Math.max(w,h)/1.1);
    vign.addColorStop(0, 'rgba(0,0,0,0)');
    vign.addColorStop(1, 'rgba(0,0,0,0.42)');
    ctx.fillStyle = vign;
    ctx.fillRect(0,0,w,h);
    ctx.restore();

    if(!document.hidden) requestAnimationFrame(step);
  }

  // handle visibility to save CPU
  document.addEventListener('visibilitychange', ()=>{
    if(!document.hidden) requestAnimationFrame(step);
  });

  window.addEventListener('resize', ()=>{ resize(); });
  resize();
  requestAnimationFrame(step);
})();
