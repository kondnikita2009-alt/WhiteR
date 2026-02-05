const App = {
    storageKey: 'sp_user_v2',

    init() {
        // Загружаем данные пользователя
        const savedData = localStorage.getItem(this.storageKey);
        this.user = savedData ? JSON.parse(savedData) : null;
        
        this.handleLoader();
        
        // Определяем, на какой мы странице, по наличию уникальных ID
        if (document.getElementById('regName')) {
            this.initAuth();
        } else if (document.querySelector('.dashboard-body')) {
            this.initDashboard();
        }
    },

    handleLoader() {
        const loader = document.getElementById('loader');
        if (loader) {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => loader.remove(), 500);
            }, 1000);
        }
        // Если мы на странице регистрации, показываем основной контейнер
        const appContainer = document.getElementById('app');
        if (appContainer) {
            setTimeout(() => {
                appContainer.classList.remove('hidden');
            }, 1100);
        }
    },

    initAuth() {
        // Если пользователь уже вошел, перекидываем на дашборд
        if (this.user) {
            window.location.href = 'sp-board.html';
            return;
        }
        
        const nameInput = document.getElementById('regName');
        const phoneInput = document.getElementById('regPhone');
        const btn = document.getElementById('btn-submit');

        if (!nameInput || !phoneInput || !btn) return;

        const validate = () => {
            const isName = nameInput.value.trim().length >= 2;
            const isPhone = phoneInput.value.replace(/\s/g, '').length === 9;
            btn.disabled = !(isName && isPhone);
        };

        phoneInput.addEventListener('input', (e) => {
            let v = e.target.value.replace(/\D/g, '').substring(0, 9);
            // Форматируем 000 000 000
            if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
            else if (v.length > 3) v = v.replace(/(\d{3})(\d{3})/, '$1 $2');
            e.target.value = v;
            validate();
        });

        nameInput.addEventListener('input', validate);

        btn.onclick = () => {
            const data = {
                name: nameInput.value,
                phone: phoneInput.value,
                style: document.querySelector('input[name="style"]:checked').value,
                coins: 5,
                lastDate: new Date().toDateString()
            };
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            window.location.href = 'sp-board.html';
        };
    },

    initDashboard() {
        // Если данных нет, возвращаем на регистрацию
        if (!this.user) {
            window.location.href = 'index.html';
            return;
        }

        // Проверка монет (Daily Reset)
        const today = new Date().toDateString();
        if (this.user.lastDate !== today) {
            this.user.coins = 5;
            this.user.lastDate = today;
            this.save();
            alert("Nowy dzień! Twój balans został odnowiony (5 monet).");
        }

        // Заполняем данные на странице, если элементы существуют
        const nameEl = document.getElementById('display-name');
        const coinEl = document.getElementById('balance-amount');
        const avatarEl = document.getElementById('userAvatar');
        const greetEl = document.getElementById('ai-greeting');

        if (nameEl) nameEl.innerText = `Cześć, ${this.user.name}!`;
        if (coinEl) coinEl.innerText = this.user.coins;
        if (avatarEl) avatarEl.innerText = this.user.name[0].toUpperCase();
        if (greetEl) {
            greetEl.innerText = this.user.style === 'ty' 
                ? "W czym pomóc?" 
                : "W czym mogę Panu pomóc?";
        }
    },

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.user));
    }
};

// Глобальные функции для кнопок
window.showAds = function() {
    const data = localStorage.getItem('sp_user_v2');
    if (data) {
        const user = JSON.parse(data);
        if (confirm("Obejrzyj reklamę (+1 moneta)?")) {
            user.coins++;
            localStorage.setItem('sp_user_v2', JSON.stringify(user));
            const coinEl = document.getElementById('balance-amount');
            if (coinEl) coinEl.innerText = user.coins;
        }
    }
};

window.logout = function() {
    if (confirm("Wylogować się?")) {
        localStorage.clear();
        window.location.href = 'index.html';
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
