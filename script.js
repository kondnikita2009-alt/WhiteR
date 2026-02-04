// Переключение разделов
function showSection(name) {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById(name + '-section').classList.remove('hidden');
    document.getElementById('side-menu').classList.remove('active');
}

// Бургер
document.querySelector('.burger-icon').onclick = () => {
    document.getElementById('side-menu').classList.add('active');
};
document.querySelector('.close-menu').onclick = () => {
    document.getElementById('side-menu').classList.remove('active');
};

// Имитация проверки API и Загрузки
function simulateApiCheck() {
    const loader = document.getElementById('loader');
    const loaderText = document.getElementById('loader-text');
    
    // Показываем загрузку при каждом поиске
    loader.style.display = 'flex';
    
    setTimeout(() => {
        // Условие: если мы хотим имитировать ошибку (например, апи не оплачен)
        let apiWorking = true; // Смени на false для теста ошибки

        if (!apiWorking) {
            loaderText.innerHTML = "В данный момент WhiteR недоступен.<br><small>Мы делаем всё возможное, чтобы это исправить.</small>";
            document.querySelector('.spinner').style.display = 'none';
        } else {
            loader.style.display = 'none';
            showSection('chat');
        }
    }, 1500);
}

document.getElementById('search-trigger').onclick = simulateApiCheck;

// Логика авторизации
let isLogin = true;
function toggleAuthMode() {
    isLogin = !isLogin;
    document.getElementById('modal-title').innerText = isLogin ? "Вход" : "Регистрация";
    document.getElementById('reg-fields').classList.toggle('hidden');
    document.getElementById('toggle-text').innerText = isLogin ? "Нет аккаунта? Регистрация" : "Уже есть аккаунт? Войти";
}

function openAuth() {
    document.getElementById('auth-modal').style.display = 'flex';
}

function handleAuth() {
    const user = document.getElementById('username').value;
    const pin = document.getElementById('pin').value;
    
    if (user && pin.length === 6) {
        localStorage.setItem('user', user);
        document.getElementById('user-display').innerText = user;
        document.getElementById('auth-modal').style.display = 'none';
        alert('Успешно!');
    } else {
        alert('Введите корректный ник и 6 цифр PIN');
    }
}

// Проверка входа при запуске
window.onload = () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        document.getElementById('user-display').innerText = savedUser;
    }
};
