// assets/js/main.js

import './header.js';
import './home.js';
import './services.js';

// Comportamentos globais (exemplo)
window.addEventListener('scroll', () => {
  document.body.classList.toggle('scrolling', window.scrollY > 0);
});
