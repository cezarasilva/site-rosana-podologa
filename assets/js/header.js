// assets/js/header.js

// ===== Efeito de scroll no header =====
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// ===== Menu hambúrguer =====
const menuIcon = document.querySelector('#menu-icon');
const menu = document.querySelector('.header-menu');


// Alternar visibilidade do menu
menuIcon.addEventListener('click', () => {
  menu.classList.toggle('active');
});


// Fechar o menu ao clicar em um link (opcional, mas elegante)
const menuLinks = document.querySelectorAll('.header-menu a');

menuLinks.forEach(link => {
  link.addEventListener('click', () => {
    menu.classList.remove('active');
  });
});
