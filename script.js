// Инициализация иконок и анимаций при скролле
lucide.createIcons();
AOS.init({ duration: 1000, once: true });

// Элементы управления
const burger = document.getElementById('burger');
const closeMenu = document.getElementById('close-menu');
const sideMenu = document.getElementById('side-menu');
const navItems = document.querySelectorAll('#side-menu li');
const pages = document.querySelectorAll('.page');
const aiOverlay = document.getElementById('ai-chat');
const closeAi = document.getElementById('close-ai');

// Открытие/Закрытие меню
burger.onclick = () => sideMenu.classList.add('open');
closeMenu.onclick = () => sideMenu.classList.remove('open');

// Навигация
navItems.forEach(item => {
    item.onclick = () => {
        const target = item.getAttribute('data-target');
        
        if (target === 'ai') {
            aiOverlay.style.display = 'flex';
        } else {
            pages.forEach(p => p.classList.remove('active'));
            document.getElementById(target).classList.add('active');
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        }
        sideMenu.classList.remove('open');
    };
});

// Закрытие AI
closeAi.onclick = () => {
    aiOverlay.style.display = 'none';
};

// Симуляция шагов в Решениях
const steps = document.querySelectorAll('.step');
steps.forEach((step, index) => {
    step.onclick = () => {
        step.style.borderColor = '#8b5cf6';
        step.style.background = '#f5f3ff';
        
        if(index === 3) { // На последнем шаге показываем лоадер
            document.getElementById('loader').classList.remove('hidden');
            setTimeout(() => {
                alert("Решение загружено! (Это демо-режим)");
                document.getElementById('loader').classList.add('hidden');
            }, 2000);
        }
    };
});

// Плавный скролл для всей страницы
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
