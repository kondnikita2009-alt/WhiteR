/**
 * DESTINY MATRIX - PREMIUM LOGIC
 */

// 1. Плавная заставка (Intro) при входе на сайт
document.addEventListener('DOMContentLoaded', () => {
    // Убедимся, что начальное состояние элементов готово к анимации
    gsap.set("#main-header, .hero-title, .hero-subtitle, .hero-btn", { opacity: 0, y: 30 });

    const tl = gsap.timeline();
    tl.to("#main-header", { opacity: 1, y: 0, duration: 1, ease: "power2.out" })
      .to(".hero-title", { opacity: 1, y: 0, duration: 1, ease: "back.out(1.7)" }, "-=0.5")
      .to(".hero-subtitle", { opacity: 1, y: 0, duration: 1 }, "-=0.7")
      .to(".hero-btn", { opacity: 1, y: 0, duration: 0.8, scale: 1, ease: "elastic.out(1, 0.5)" }, "-=0.5");
});

// 2. Переход к калькулятору
function showCalculator() {
    const hero = document.getElementById('hero-intro');
    const app = document.getElementById('main-app');
    
    gsap.to(hero, { 
        opacity: 0, 
        duration: 0.6, 
        onComplete: () => {
            hero.style.display = 'none';
            app.style.visibility = 'visible';
            gsap.to(app, { opacity: 1, duration: 0.8 });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

// 3. Математика Матрицы (Метод 22 Арканов)
function reduceArcana(n) {
    let res = parseInt(n);
    if (isNaN(res)) return 0;
    while (res > 22) {
        res = String(res).split('').reduce((a, b) => a + parseInt(b), 0);
    }
    return res === 0 ? 22 : res;
}

// База данных описаний (Расшифровка)
const arcanaData = {
    1: "Маг: Энергия лидерства и созидания. Вы способны проявлять свои идеи в реальности силой воли.",
    2: "Верховная Жрица: Глубокая интуиция, понимание скрытых процессов и талант дипломата.",
    3: "Императрица: Энергия плодородия, красоты и земного успеха. Процветание через мягкость.",
    4: "Император: Сила структуры, ответственности и лидерства. Способность управлять проектами.",
    5: "Иерофант: Учительство и традиции. Важно передавать знания и соблюдать семейные ценности.",
    6: "Влюбленные: Энергия выбора и любви. Жизнь через призму отношений и эстетики.",
    7: "Колесница: Движение и победа. Успех приходит через четкое планирование и скорость.",
    8: "Справедливость: Понимание баланса. Ваша жизнь отражает закон причины и следствия.",
    9: "Отшельник: Мудрость и поиск глубинных истин. Сила в самопознании и опыте.",
    10: "Колесо Фортуны: Поток удачи. Важно научиться доверять своей судьбе и ловить момент.",
    11: "Сила: Огромный потенциал энергии и трудолюбия. Способность справляться с любыми нагрузками.",
    12: "Повешенный: Новое видение и служение. Креативный подход к решению любых задач.",
    13: "Смерть: Трансформация и перемены. Умение легко отпускать старое ради будущего.",
    14: "Умеренность: Искусство баланса и исцеления. Важна гармония во всем, за что вы беретесь.",
    15: "Дьявол: Харизма и видение теневых сторон. Огромный потенциал в бизнесе и психологии.",
    16: "Башня: Прорыв через разрушение старых форм. Энергия духовного пробуждения.",
    17: "Звезда: Талант и вдохновение. Путь к известности через чистоту своих помыслов.",
    18: "Луна: Магия подсознания. Сила воображения и материализация мыслей.",
    19: "Солнце: Радость и процветание. Лидерство, которое согревает окружающих.",
    20: "Суд: Связь с предками и обновление. Мощная поддержка рода и яснознание.",
    21: "Мир: Глобальные проекты и отсутствие границ. Вы — человек мира.",
    22: "Шут: Свобода от ограничений. Доверие Вселенной и начало новых грандиозных путей."
};

// 4. Главная функция расчета
function calculateMatrix() {
    const input = document.getElementById('birthdate').value;
    if (!input) return alert("Выберите дату рождения!");

    const [yRaw, mRaw, dRaw] = input.split('-');
    
    const d = reduceArcana(dRaw);
    const m = reduceArcana(mRaw);
    const y = reduceArcana(yRaw.split('').reduce((a, b) => a + parseInt(b), 0));
    const bottom = reduceArcana(d + m + y);
    const center = reduceArcana(d + m + y + bottom);

    // Заполнение чисел в SVG
    document.getElementById('tA').textContent = d;
    document.getElementById('tB').textContent = m;
    document.getElementById('tC').textContent = y;
    document.getElementById('tD').textContent = bottom;
    document.getElementById('tE').textContent = center;

    // Анимация появления результата
    document.getElementById('matrix-results').style.display = 'block';
    gsap.from(".matrix-svg-container", { scale: 0.8, opacity: 0, duration: 1.2, ease: "expo.out" });
    
    // Отрисовка линий (без ошибок pathLength)
    gsap.fromTo(".m-line", 
        { strokeDasharray: 1000, strokeDashoffset: 1000 }, 
        { strokeDashoffset: 0, duration: 2, ease: "power2.inOut" }
    );

    // Генерация описаний (Расшифровка внизу)
    const sections = [
        { name: "Личность (Портрет)", val: d },
        { name: "Связь с Ангелом (Таланты)", val: m },
        { name: "Материальный достаток", val: y },
        { name: "Кармическая задача", val: bottom },
        { name: "Ваша суть (Центр)", val: center }
    ];

    let htmlDesc = "";
    let pdfContent = "";

    sections.forEach(s => {
        const text = arcanaData[s.val] || "Описание в разработке...";
        htmlDesc += `
            <div class="description-card">
                <h3>${s.name}: ${s.val} Аркан</h3>
                <p>${text}</p>
            </div>`;
        pdfContent += `<div style="margin-bottom:20pt;"><h3>${s.name} — ${s.val} Аркан</h3><p>${text}</p></div>`;
    });

    document.getElementById('desc-list').innerHTML = htmlDesc;
    document.getElementById('pdf-content').innerHTML = pdfContent;
    document.getElementById('pdf-bday').textContent = input;
    document.getElementById('pdf-today').textContent = new Date().toLocaleDateString();

    window.scrollTo({ top: document.getElementById('matrix-results').offsetTop - 100, behavior: 'smooth' });
}

// 5. PDF Скачивание (как в больнице)
async function downloadPDF() {
    const element = document.getElementById('pdf-template');
    element.style.display = 'block';

    const opt = {
        margin: 10,
        filename: 'Matrix_Analysis.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
        await html2pdf().set(opt).from(element).save();
    } catch (e) {
        alert("Ошибка при создании PDF");
    } finally {
        element.style.display = 'none';
    }
}

// 6. Функция Поделиться
function shareResult() {
    const text = `Я рассчитал свою Матрицу Судьбы! Мой центральный аркан: ${document.getElementById('tE').textContent}. Попробуй и ты!`;
    if (navigator.share) {
        navigator.share({ title: 'Матрица Судьбы', text: text, url: window.location.href });
    } else {
        navigator.clipboard.writeText(text + " " + window.location.href);
        alert("Текст скопирован!");
    }
}
