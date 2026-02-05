/* =========================================
   S.P. AI | CORE LOGIC SYSTEM
   ========================================= */

// --- 1. База переводов (Localization) ---
const translations = {
    pl: {
        title: "Witaj w przyszłości.",
        subtitle: "Twój osobisty asystent edukacyjny.",
        labelName: "Twoje imię",
        labelPhone: "Numer telefonu",
        labelStyle: "Styl komunikacji",
        optTy: "Na Ty",
        optPan: "Oficjalnie",
        btnNext: "Dalej",
        footer: "S.P. AI Systems © 2026",
        greeting: ["Dzień dobry", "Dobry wieczór"],
        coins: "monet"
    },
    en: {
        title: "Welcome to the future.",
        subtitle: "Your personal educational assistant.",
        labelName: "Your Name",
        labelPhone: "Phone Number",
        labelStyle: "Communication Style",
        optTy: "Casual",
        optPan: "Formal",
        btnNext: "Next",
        footer: "S.P. AI Systems © 2026",
        greeting: ["Good morning", "Good evening"],
        coins: "coins"
    },
    ru: {
        title: "Добро пожаловать в будущее.",
        subtitle: "Твой персональный AI ассистент.",
        labelName: "Твое имя",
        labelPhone: "Номер телефона",
        labelStyle: "Стиль общения",
        optTy: "На Ты",
        optPan: "Официально",
        btnNext: "Далее",
        footer: "S.P. AI Systems © 2026",
        greeting: ["Доброе утро", "Добрый вечер"],
        coins: "монет"
    }
};

// --- 2. Управление данными (User Data Manager) ---
const AppManager = {
    key: 'sp_user_data_v1',

    getUser: function() {
        const data = localStorage.getItem(this.key);
        return data ? JSON.parse(data) : null;
    },

    saveUser: function(data) {
        localStorage.setItem(this.key, JSON.stringify(data));
    },

    // Логика ежедневного сброса монет
    checkDailyReset: function(user) {
        const today = new Date().toDateString();
        
        // Если дата последнего входа не совпадает с сегодняшней
        if (user.lastLogin !== today) {
            console.log("New day! Resetting coins.");
            user.coins = 5; // Сброс до 5 (старые сгорают)
            user.lastLogin = today;
            this.saveUser(user);
            
            // Показать уведомление (можно добавить позже)
            alert("Nowy dzień! Twój balans został odnowiony: 5 monet.");
        }
        return user;
    }
};

// --- 3. Инициализация при загрузке ---
document.addEventListener('DOMContentLoaded', () => {
    
    // Удаляем лоадер
    const loader = document.getElementById('loader');
    if(loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => { loader.style.display = 'none'; }, 500);
        }, 800);
    }

    // Проверяем, на какой мы странице
    const isDashboard = document.querySelector('.dashboard-body');
    const isAuthPage = document.getElementById('regName');

    if (isAuthPage) initAuthPage();
    if (isDashboard) initDashboard();
});

// --- 4. Логика Страницы Регистрации (index.html) ---
function initAuthPage() {
    const nameInput = document.getElementById('regName');
    const phoneInput = document.getElementById('regPhone');
    const btnSubmit = document.getElementById('btn-submit');
    const langSwitch = document.getElementById('langSwitch');

    // Если пользователь уже есть -> сразу в кабинет
    if(AppManager.getUser()) {
        window.location.href = 'pages/dashboard.html';
        return;
    }

    // Маска телефона
    phoneInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '').substring(0, 9);
        let formatted = '';
        if(val.length > 0) formatted += val.substring(0, 3);
        if(val.length > 3) formatted += ' ' + val.substring(3, 6);
        if(val.length > 6) formatted += ' ' + val.substring(6, 9);
        e.target.value = formatted;
        
        // Активация кнопки
        const isValid = nameInput.value.length >= 2 && val.length === 9;
        btnSubmit.disabled = !isValid;
    });

    nameInput.addEventListener('input', () => {
        const phoneVal = phoneInput.value.replace(/\s/g, '');
        btnSubmit.disabled = !(nameInput.value.length >= 2 && phoneVal.length === 9);
    });

    // Смена языка
    langSwitch.addEventListener('change', (e) => {
        const t = translations[e.target.value];
        if(!t) return;
        
        // Обновляем тексты
        document.getElementById('t-title').innerText = t.title;
        document.getElementById('t-subtitle').innerText = t.subtitle;
        document.getElementById('t-label-name').innerText = t.labelName;
        document.getElementById('t-label-phone').innerText = t.labelPhone;
        document.getElementById('t-label-style').innerText = t.labelStyle;
        document.getElementById('t-opt-ty').innerText = t.optTy;
        document.getElementById('t-opt-pan').innerText = t.optPan;
        document.getElementById('t-btn-next').innerText = t.btnNext;
        document.getElementById('t-footer').innerText = t.footer;
    });

    // Клик "Регистрация"
    btnSubmit.addEventListener('click', () => {
        const style = document.querySelector('input[name="style"]:checked').value;
        
        const newUser = {
            name: nameInput.value,
            phone: "+48 " + phoneInput.value,
            style: style, // 'ty' или 'pan'
            lang: langSwitch.value,
            coins: 5,
            lastLogin: new Date().toDateString()
        };

        AppManager.saveUser(newUser);

        // Эффект загрузки на кнопке
        btnSubmit.innerHTML = '⏳';
        setTimeout(() => {
            window.location.href = 'pages/dashboard.html';
        }, 1000);
    });
}

// --- 5. Логика Личного Кабинета (dashboard.html) ---
function initDashboard() {
    let user = AppManager.getUser();

    // Если нет юзера -> выкидываем на регистрацию
    if (!user) {
        window.location.href = '../index.html';
        return;
    }

    // Проверяем сброс монет
    user = AppManager.checkDailyReset(user);

    // Обновляем UI
    const hour = new Date().getHours();
    const t = translations[user.lang] || translations['pl'];
    
    // Приветствие по времени суток
    const greetingText = hour < 18 ? t.greeting[0] : t.greeting[1];
    
    // Вставляем данные в HTML
    document.getElementById('display-name').innerText = `${greetingText}, ${user.name}`;
    document.getElementById('userAvatar').innerText = user.name.charAt(0).toUpperCase();
    document.getElementById('balance-amount').innerText = user.coins;
    
    // Текст карточки ИИ
    const aiText = document.getElementById('ai-greeting');
    if(aiText) {
        aiText.innerText = user.style === 'ty' 
            ? `Cześć ${user.name}! Gotowy do działania?` 
            : `Dzień dobry, ${user.name}. Zaczynamy naukę?`;
    }
}

// --- 6. Функция показа рекламы (Заглушка) ---
function showAdsModal() {
    let user = AppManager.getUser();
    if(confirm("Obejrzyj 30s reklamę, aby dostać +1 monetę? (Symulacja)")) {
        user.coins += 1;
        AppManager.saveUser(user);
        document.getElementById('balance-amount').innerText = user.coins;
        alert("Dodano +1 monetę!");
    }
}
