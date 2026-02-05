const App = {
    storageKey: 'sp_user_v2',

    init() {
        this.user = JSON.parse(localStorage.getItem(this.storageKey));
        this.handleLoader();
        
        if (document.getElementById('regName')) this.initAuth();
        if (document.querySelector('.dashboard-body')) this.initDashboard();
    },

    handleLoader() {
        const loader = document.getElementById('loader');
        if (loader) setTimeout(() => { loader.style.opacity = '0'; setTimeout(() => loader.remove(), 500); }, 1000);
    },

    initAuth() {
        if (this.user) window.location.href = 'sp-board.html';
        
        const nameInput = document.getElementById('regName');
        const phoneInput = document.getElementById('regPhone');
        const btn = document.getElementById('btn-submit');

        const validate = () => {
            const isName = nameInput.value.length >= 2;
            const isPhone = phoneInput.value.replace(/\s/g, '').length === 9;
            btn.disabled = !(isName && isPhone);
        };

        phoneInput.addEventListener('input', (e) => {
            let v = e.target.value.replace(/\D/g, '').substring(0, 9);
            e.target.value = v.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3').trim();
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
        if (!this.user) { window.location.href = 'index.html'; return; }

        // ПРОВЕРКА МОНЕТ (Сброс каждый день)
        const today = new Date().toDateString();
        if (this.user.lastDate !== today) {
            this.user.coins = 5;
            this.user.lastDate = today;
            this.save();
            alert("Nowy dzień! Otrzymałeś 5 monet.");
        }

        document.getElementById('display-name').innerText = `Cześć, ${this.user.name}!`;
        document.getElementById('balance-amount').innerText = this.user.coins;
        document.getElementById('userAvatar').innerText = this.user.name[0].toUpperCase();
        document.getElementById('ai-greeting').innerText = this.user.style === 'ty' ? "W czym pomóc?" : "W czym mogę Panu pomóc?";
    },

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.user));
    }
};

function showAds() {
    if (confirm("Obejrzyj reklamę (+1 moneta)?")) {
        const user = JSON.parse(localStorage.getItem(App.storageKey));
        user.coins++;
        localStorage.setItem(App.storageKey, JSON.stringify(user));
        document.getElementById('balance-amount').innerText = user.coins;
    }
}

function logout() {
    if (confirm("Wylogować się?")) {
        localStorage.clear();
        window.location.href = 'index.html';
    }
}

document.addEventListener('DOMContentLoaded', () => App.init());
