'use strict';

// O JSON é a fonte única das fotos e informações dos looks.
function addImage(container, src, alt, className = '') {
  if (!src) return;
  const image = new Image();
  image.alt = alt;
  image.className = className;
  image.decoding = 'async';
  image.onload = () => container.classList.remove('empty');
  image.onerror = () => { image.remove(); container.classList.add('empty'); };
  image.src = src;
  container.append(image);
}

function renderLook(look) {
  const number = String(look.numero).padStart(2, '0');
  const section = document.createElement('section');
  section.className = 'look';
  section.id = `look-${number}`;
  section.setAttribute('aria-labelledby', `title-${number}`);
  const figure = document.createElement('figure');
  figure.className = 'model empty';
  figure.setAttribute('aria-label', look.foto.alt || `Foto do look ${number} a adicionar`);
  addImage(figure, look.foto.arquivo, look.foto.alt);
  const info = document.createElement('div');
  info.className = 'look-info';
  const heading = document.createElement('h2');
  heading.id = `title-${number}`;
  const label = document.createElement('span');
  label.textContent = 'LOOK';
  const index = document.createElement('span');
  index.textContent = number;
  heading.append(label, index);
  const slots = document.createElement('div');
  slots.className = 'piece-slots';
  for (const piece of look.pecas) {
    const item = document.createElement('article');
    item.className = 'piece-info';
    const title = document.createElement('h3');
    title.textContent = piece.titulo;
    item.append(title);
    const lines = [piece.caracteristicaExtra, piece.tipo === 'unica' ? 'Unique Piece' : null, piece.tamanhos];
    for (const text of lines.filter(Boolean)) {
      const line = document.createElement('p');
      line.textContent = text;
      item.append(line);
    }
    slots.append(item);
  }
  const watermark = document.createElement('span');
  watermark.className = 'look-number';
  watermark.setAttribute('aria-hidden', 'true');
  watermark.textContent = `LOOK ${number}`;
  if (look.imagemTitulo) {
    const lettering = new Image();
    lettering.alt = '';
    lettering.decoding = 'async';
    lettering.onload = () => {
      watermark.replaceChildren(lettering);
      watermark.classList.add('look-number-image');
    };
    lettering.src = look.imagemTitulo;
  }
  info.append(heading, slots);
  section.append(watermark, figure, info);
  return section;
}

async function init() {
  try {
    let data = window.ANURB_LOOKS;
    if (location.protocol !== 'file:') {
      const response = await fetch('./looks.json');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      data = await response.json();
    }
    document.querySelector('#looks').replaceChildren(...data.looks.map(renderLook));
    const heroPhoto = document.querySelector('#hero-photo');
    heroPhoto.replaceChildren();
    document.querySelector('.hero').classList.toggle('hero-composite', Boolean(data.midia.capaComLettering));
    addImage(heroPhoto, data.midia.capa, 'Anurb Izquierdo — Drop 01');
    if (data.midia.titulo) {
      const title = new Image();
      title.alt = '';
      title.className = 'hero-title-image';
      title.onload = () => { document.querySelector('.hero').append(title); document.querySelector('.hero').classList.add('has-title-image'); };
      title.src = data.midia.titulo;
    }
    if (data.midia.ornamento) {
      const ornament = new Image();
      ornament.onload = () => { document.querySelector('.ornament-rail').style.backgroundImage = `url(${JSON.stringify(ornament.src)})`; };
      ornament.src = data.midia.ornamento;
    }
  } catch (error) {
    document.querySelector('#load-error').hidden = false;
    console.error('Erro ao carregar looks.json:', error);
  }
}
init();

function initBrandCursor() {
  const finePointer = matchMedia('(any-hover: hover) and (any-pointer: fine)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const cursor = document.createElement('div');
  cursor.className = 'brand-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  const graphic = new Image();
  graphic.alt = '';
  graphic.draggable = false;
  cursor.append(graphic);
  document.body.append(cursor);
  let ready = false;
  let spin = null;

  function hide() {
    cursor.classList.remove('is-visible');
    document.documentElement.classList.remove('custom-cursor-active');
  }
  function position(event) {
    if (!ready || event.pointerType !== 'mouse') {
      hide();
      return false;
    }
    cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
    cursor.classList.add('is-visible');
    document.documentElement.classList.add('custom-cursor-active');
    return true;
  }
  graphic.onload = () => { ready = true; };
  graphic.onerror = () => { ready = false; hide(); };
  graphic.src = 'midia/cursor.png';
  document.addEventListener('pointermove', position, { passive: true });
  document.addEventListener('pointerdown', event => {
    if (!position(event) || event.button !== 0 || reducedMotion.matches) return;
    // Captura o ângulo atual para cliques seguidos não provocarem saltos.
    const matrix = new DOMMatrixReadOnly(getComputedStyle(graphic).transform);
    const angle = Math.atan2(matrix.b, matrix.a) * 180 / Math.PI;
    if (spin) spin.cancel();
    spin = graphic.animate([
      { transform: `rotate(${angle}deg)` },
      { transform: 'rotate(1080deg)' }
    ], {
      duration: 1800,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
    });
  });
  document.documentElement.addEventListener('pointerleave', hide);
  window.addEventListener('blur', hide);
  document.addEventListener('visibilitychange', () => { if (document.hidden) hide(); });
  finePointer.addEventListener('change', hide);
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches && spin) spin.cancel(); });
}
initBrandCursor();

function initLanguages() {
  const picker = document.querySelector('.language-picker');
  const current = picker.querySelector('.language-current');
  const options = picker.querySelector('.language-options');
  const names = { en: 'English', es: 'Español', pt: 'Português' };
  const copy = {
    en: ['PIECES', 'ABOUT', 'CONTACT', 'WEARABLE PIECES'],
    es: ['PIEZAS', 'ACERCA DE', 'CONTACTO', 'PIEZAS PARA VESTIR'],
    pt: ['PEÇAS', 'SOBRE', 'CONTATO', 'PEÇAS PARA VESTIR']
  };
  let selected = 'en';
  function setOpen(open) {
    options.hidden = !open;
    current.setAttribute('aria-expanded', String(open));
  }
  picker.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse') setOpen(true);
  });
  picker.addEventListener('pointerleave', () => {
    if (!picker.contains(document.activeElement)) setOpen(false);
  });
  current.addEventListener('click', () => setOpen(options.hidden));
  picker.addEventListener('focusout', event => {
    if (!picker.contains(event.relatedTarget)) setOpen(false);
  });
  picker.addEventListener('keydown', event => {
    if (event.key === 'Escape') { setOpen(false); current.focus(); }
    if (event.key === 'ArrowDown' && event.target === current) {
      event.preventDefault();
      setOpen(true);
      options.querySelector('button').focus();
    }
  });
  document.addEventListener('pointerdown', event => {
    if (!picker.contains(event.target)) setOpen(false);
  });
  options.addEventListener('click', event => {
    const button = event.target.closest('[data-language]');
    if (!button) return;
    selected = button.dataset.language;
    current.textContent = selected.toUpperCase();
    current.setAttribute('aria-label', `Language: ${names[selected]}`);
    document.documentElement.lang = selected === 'pt' ? 'pt-BR' : selected;
    const nav = document.querySelector('.site-header nav');
    const text = copy[selected];
    nav.querySelector('a[href="#pieces"]').textContent = text[0];
    const reserved = nav.querySelectorAll('.menu-links > span');
    reserved[0].textContent = text[1];
    reserved[1].textContent = text[2];
    document.querySelector('.collection-caption').textContent = text[3];
    options.replaceChildren(...Object.keys(names).filter(lang => lang !== selected).map(lang => {
      const option = document.createElement('button');
      option.type = 'button';
      option.dataset.language = lang;
      option.lang = lang;
      option.setAttribute('aria-label', names[lang]);
      option.textContent = lang.toUpperCase();
      return option;
    }));
    setOpen(false);
    current.focus();
  });
}
initLanguages();
