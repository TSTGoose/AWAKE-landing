const CONFIG = {
    prices: {
        reels: { basic: 1000, dynamic: 3500 },
        shoot: { head: 2500, dynamic: 5000 },
        podcast: { editStandard: 15000, editPro: 25000, shootBase: 4500, extraHour: 2500 },
        youtube: { minimal: 1000, standard: 1500, unique: 2500, videographer: 3500, head: 2500 },
        addons: {
            reelsScript: 1500,
            reelsCover: 2000,
            shootStudio: 500,
            shootExtraCam: 1000,
            shootMua: 1500,
            shootStylist: 1500,
            podcastStudio: 500,
            podcastCover: 1500,
            podcastSeo: 2000,
            youtubeCover: 2000,
            youtubeSeo: 2000
        }
    },
    discounts: {
        reels: { threshold10: 0.05, threshold15: 0.10, threshold20: 0.15 },
        shoot: { threshold3: 0.15 },
        podcastReels: 0.25
    }
};

// Инициализация Lucide иконок
lucide.createIcons();

// ========== Состояние приложения ==========
let category = 'reels';

// Reels
let reelsType = 'dynamic';
let reelsQty = 4;
let reelsScript = false;
let reelsCover = false;

// Shoot
let shootType = 'dynamic';
let shootHours = 2;
let shootStudio = false;
let shootExtraCam = false;
let shootMua = false;
let shootStylist = false;

// Podcast
let podcastNeedShoot = false;
let podcastShootType = 'standard';
let podcastExtraHours = 0;
let podcastEditType = 'pro';
let podcastStudio = false;
let podcastCover = false;
let podcastSeo = false;
let podcastNeedReels = false;
let podcastReelsType = 'dynamic';
let podcastReelsQty = 4;
let podcastExtendedShoot = false;

// YouTube
let youtubeTariff = 'standard';
let youtubeMinutes = 5;
let youtubeNeedShoot = false;
let youtubeShootType = 'videographer';
let youtubeShootHours = 1;
let youtubeCover = false;
let youtubeSeo = false;

// ========== Цены (дубль – для совместимости) ==========
const PRICES = {
    reels: { basic: 1000, dynamic: 3500 },
    shoot: { head: 2500, dynamic: 5000 },
    podcast: { editStandard: 15000, editPro: 25000, shootBase: 4500, extraHour: 2500 },
    youtube: { minimal: 1000, standard: 1500, unique: 2500, videographer: 3500, head: 2500 },
    addons: {
        reelsScript: 1500,
        reelsCover: 2000,
        shootStudio: 500,
        shootExtraCam: 1000,
        shootMua: 1500,
        shootStylist: 1500,
        podcastStudio: 500,
        podcastCover: 1500,
        podcastSeo: 2000,
        youtubeCover: 2000,
        youtubeSeo: 2000
    }
};

// ========== Скидки ==========
function getReelsDiscount(qty) {
    if (qty >= 20) return 0.15;
    if (qty >= 15) return 0.10;
    if (qty >= 10) return 0.05;
    return 0;
}
function getShootDiscount(hours) {
    return hours >= 3 ? 0.15 : 0;
}

// ========== DOM элементы (калькулятор) ==========
const tabBtns = document.querySelectorAll('.tab-btn');
const panels = {
    reels: document.getElementById('reels-options'),
    shoot: document.getElementById('shoot-options'),
    podcast: document.getElementById('podcast-options'),
    youtube: document.getElementById('youtube-options')
};

// Reels
const reelsQtyDisplay = document.getElementById('reels-qty-display');
const reelsQtySlider = document.getElementById('reels-qty-slider');
const reelsQtyDecr = document.getElementById('reels-qty-decr');
const reelsQtyIncr = document.getElementById('reels-qty-incr');
const reelsScriptCheck = document.getElementById('reels-script');
const reelsCoverCheck = document.getElementById('reels-cover');

// Shoot
const shootHoursDisplay = document.getElementById('shoot-hours-display');
const shootHoursSlider = document.getElementById('shoot-hours-slider');
const shootHoursDecr = document.getElementById('shoot-hours-decr');
const shootHoursIncr = document.getElementById('shoot-hours-incr');
const shootStudioCheck = document.getElementById('shoot-studio');
const shootExtraCamCheck = document.getElementById('shoot-extracam');
const shootMuaCheck = document.getElementById('shoot-mua');
const shootStylistCheck = document.getElementById('shoot-stylist');

// Podcast
const podcastNeedShootCheck = document.getElementById('podcast-need-shoot');
const podcastShootBlock = document.getElementById('podcast-shoot-block');
const podcastExtraHoursSlider = document.getElementById('podcast-extra-hours');
const podcastExtraHoursDisplay = document.getElementById('podcast-extra-hours-display');
const podcastStudioCheck = document.getElementById('podcast-studio');
const podcastCoverCheck = document.getElementById('podcast-cover');
const podcastSeoCheck = document.getElementById('podcast-seo');
const podcastNeedReelsCheck = document.getElementById('podcast-need-reels');
const podcastReelsBlock = document.getElementById('podcast-reels-block');
const podcastReelsQtyDecr = document.getElementById('podcast-reels-qty-decr');
const podcastReelsQtyIncr = document.getElementById('podcast-reels-qty-incr');
const podcastReelsQtySlider = document.getElementById('podcast-reels-qty-slider');
const podcastReelsQtyDisplay = document.getElementById('podcast-reels-qty-display');
const podcastExtendedShootCheck = document.getElementById('podcast-extended-shoot');
const podcastExtendedBlock = document.getElementById('podcast-extended-block');

// YouTube
const youtubeMinDisplay = document.getElementById('youtube-min-display');
const youtubeMinSlider = document.getElementById('youtube-min-slider');
const youtubeMinDecr = document.getElementById('youtube-min-decr');
const youtubeMinIncr = document.getElementById('youtube-min-incr');
const youtubeNeedShootCheck = document.getElementById('youtube-need-shoot');
const youtubeShootBlock = document.getElementById('youtube-shoot-block');
const youtubeShootHoursSlider = document.getElementById('youtube-shoot-hours');
const youtubeShootHoursDisplay = document.getElementById('youtube-shoot-hours-display');
const youtubeCoverCheck = document.getElementById('youtube-cover');
const youtubeSeoCheck = document.getElementById('youtube-seo');

// Итоговые поля
const totalSpan = document.getElementById('total-price');
const serviceCostSpan = document.getElementById('service-cost');
const addonsCostSpan = document.getElementById('addons-cost');
const discountSpan = document.getElementById('discount-cost');
const includedDesc = document.getElementById('included-description');
const orderItemsDiv = document.getElementById('order-items');
const orderDetails = document.getElementById('order-details');

// ========== Утилиты калькулятора ==========
function setCategory(cat) {
    category = cat;
    Object.values(panels).forEach(p => p.classList.add('hidden'));
    if (panels[cat]) panels[cat].classList.remove('hidden');
    tabBtns.forEach(btn => {
        if (btn.dataset.category === cat) btn.classList.add('active');
        else btn.classList.remove('active');
    });
    updateTotal();
}

function activateTariff(containerSelector, typeAttr, currentValue) {
    document.querySelectorAll(`${containerSelector} .tariff-card`).forEach(card => {
        const cardType = card.getAttribute(typeAttr);
        if (cardType === currentValue) card.classList.add('active');
        else card.classList.remove('active');
    });
}

// Аккордеон FAQ
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.closest('.faq-item');
        faqItem.classList.toggle('active');
    });
});

// ========== Анимация метрик ==========
function animateMetrics() {
    const metricCards = document.querySelectorAll('.metric-card');
    const metricValues = document.querySelectorAll('.metric-value');

    function animateValue(el, start, end, duration, suffix = '') {
        let startTimestamp = null;
        const isFloat = end % 1 !== 0;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            let current;
            if (isFloat) current = (progress * (end - start) + start).toFixed(1);
            else current = Math.floor(progress * (end - start) + start);
            el.innerText = current + suffix;
            if (progress < 1) window.requestAnimationFrame(step);
            else el.innerText = end + suffix;
        };
        window.requestAnimationFrame(step);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                metricCards.forEach((card, index) => {
                    setTimeout(() => card.classList.add('visible'), index * 200);
                });
                setTimeout(() => {
                    metricValues.forEach(el => {
                        const card = el.closest('.metric-card');
                        const finalValue = parseFloat(card.dataset.value);
                        const currentText = el.innerText;
                        const suffix = currentText.replace(/[0-9.]/g, '');
                        animateValue(el, 0, finalValue, 1500, suffix);
                    });
                }, 900);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const metricsGrid = document.querySelector('.metrics-grid');
    if (metricsGrid) observer.observe(metricsGrid);
}
document.addEventListener('DOMContentLoaded', animateMetrics);

// ========== Обновление цены и состава ==========
function updateTotal() {
    let service = 0, addons = 0, discount = 0, description = '';
    if (category === 'reels') {
        const pricePerReel = reelsType === 'basic' ? CONFIG.prices.reels.basic : CONFIG.prices.reels.dynamic;
        service = pricePerReel * reelsQty;
        if (reelsScript) addons += CONFIG.prices.addons.reelsScript * reelsQty;
        if (reelsCover) addons += CONFIG.prices.addons.reelsCover * reelsQty;
        const discountRate = getReelsDiscount(reelsQty);
        if (reelsType === 'dynamic') discount = service * discountRate;
        description = reelsType === 'basic' ? 'Базовый монтаж' : 'Динамичный монтаж';
    }
    else if (category === 'shoot') {
        const pricePerHour = shootType === 'head' ? CONFIG.prices.shoot.head : CONFIG.prices.shoot.dynamic;
        service = pricePerHour * shootHours;
        const discountRate = getShootDiscount(shootHours);
        discount = service * discountRate;
        if (shootStudio) addons += CONFIG.prices.addons.shootStudio;
        if (shootExtraCam) addons += CONFIG.prices.addons.shootExtraCam;
        if (shootMua) addons += CONFIG.prices.addons.shootMua;
        if (shootStylist) addons += CONFIG.prices.addons.shootStylist;
        description = `Съёмка: ${shootType === 'head' ? 'говорящая голова' : 'динамичная'}`;
    }
    else if (category === 'podcast') {
        if (podcastEditType === 'standard') service += CONFIG.prices.podcast.editStandard;
        else service += CONFIG.prices.podcast.editPro;
        if (podcastNeedShoot) {
            addons += CONFIG.prices.podcast.shootBase;
            if (podcastExtendedShoot) addons += podcastExtraHours * CONFIG.prices.podcast.extraHour;
        }
        if (podcastNeedReels) {
            const reelPrice = podcastReelsType === 'basic' ? CONFIG.prices.reels.basic : CONFIG.prices.reels.dynamic;
            const reelsCost = reelPrice * podcastReelsQty;
            addons += reelsCost;
            discount += reelsCost * CONFIG.discounts.podcastReels;
        }
        if (podcastStudio) addons += CONFIG.prices.addons.podcastStudio;
        if (podcastCover) addons += CONFIG.prices.addons.podcastCover;
        if (podcastSeo) addons += CONFIG.prices.addons.podcastSeo;
        if (podcastNeedShoot) {
            const shootBase = CONFIG.prices.podcast.shootBase;
            const shootExtra = podcastExtendedShoot ? podcastExtraHours * CONFIG.prices.podcast.extraHour : 0;
            const shootTotal = shootBase + shootExtra;
            const totalHours = 2 + (podcastExtendedShoot ? podcastExtraHours : 0);
            const shootDiscountRate = getShootDiscount(totalHours);
            discount += shootTotal * shootDiscountRate;
        }
        description = podcastEditType === 'standard' ? 'Обработка стандарт' : 'Обработка продвинутая';
    }
    else if (category === 'youtube') {
        let pricePerMin = CONFIG.prices.youtube[youtubeTariff];
        service = pricePerMin * youtubeMinutes;
        if (youtubeNeedShoot) {
            const shootPrice = youtubeShootType === 'videographer' ? CONFIG.prices.youtube.videographer : CONFIG.prices.youtube.head;
            service += shootPrice * youtubeShootHours;
        }
        if (youtubeCover) addons += CONFIG.prices.addons.youtubeCover;
        if (youtubeSeo) addons += CONFIG.prices.addons.youtubeSeo;
        description = `Монтаж YouTube (${youtubeTariff})`;
    }

    const total = service + addons - discount;
    totalSpan.innerText = Math.round(total).toLocaleString('ru-RU') + ' ₽';
    serviceCostSpan.innerText = Math.round(service).toLocaleString('ru-RU') + ' ₽';
    addonsCostSpan.innerText = Math.round(addons).toLocaleString('ru-RU') + ' ₽';
    discountSpan.innerText = '− ' + Math.round(discount).toLocaleString('ru-RU') + ' ₽';
    includedDesc.innerText = description || 'Выберите параметры';

    let items = [];
    if (category === 'reels') {
        items.push({ name: reelsType === 'basic' ? 'Базовый монтаж' : 'Динамичный монтаж', qty: reelsQty, unit: 'роликов' });
        if (reelsScript) items.push({ name: 'Сценарий/идеи', qty: reelsQty, unit: 'шт' });
        if (reelsCover) items.push({ name: 'Обложки', qty: reelsQty, unit: 'шт' });
    } else if (category === 'shoot') {
        items.push({ name: shootType === 'head' ? 'Говорящая голова' : 'Динамичная съёмка', qty: shootHours, unit: 'часов' });
        if (shootStudio) items.push({ name: 'Аренда студии', qty: 1, unit: '' });
        if (shootExtraCam) items.push({ name: 'Доп. камера', qty: 1, unit: '' });
        if (shootMua) items.push({ name: 'Поиск визажиста', qty: 1, unit: '' });
        if (shootStylist) items.push({ name: 'Поиск стилиста', qty: 1, unit: '' });
    } else if (category === 'podcast') {
        if (podcastNeedShoot) {
            const totalShootHours = 2 + (podcastExtendedShoot ? podcastExtraHours : 0);
            items.push({ name: 'Съёмка подкаста', qty: totalShootHours, unit: 'ч' });
        }
        items.push({ name: podcastEditType === 'standard' ? 'Обработка (стандарт)' : 'Обработка (продвинутый)', qty: 1, unit: 'выпуск' });
        if (podcastStudio) items.push({ name: 'Поиск студии', qty: 1, unit: '' });
        if (podcastCover) items.push({ name: 'Обложка', qty: 1, unit: '' });
        if (podcastSeo) items.push({ name: 'SEO', qty: 1, unit: '' });
        if (podcastNeedReels) items.push({ name: `Рилсы (${podcastReelsType === 'basic' ? 'базовый' : 'динамичный'})`, qty: podcastReelsQty, unit: 'роликов' });
    } else if (category === 'youtube') {
        items.push({ name: `Монтаж (${youtubeTariff})`, qty: youtubeMinutes, unit: 'мин' });
        if (youtubeNeedShoot) items.push({ name: youtubeShootType === 'videographer' ? 'Аренда видеографа' : 'Говорящая голова', qty: youtubeShootHours, unit: 'ч' });
        if (youtubeCover) items.push({ name: 'Обложка YouTube', qty: 1, unit: '' });
        if (youtubeSeo) items.push({ name: 'SEO YouTube', qty: 1, unit: '' });
    }
    orderItemsDiv.innerHTML = items.map(i => `<div class="order-item"><span>${i.name}</span><span class="value">${i.qty} ${i.unit}</span></div>`).join('');

    if (orderDetails) {
        let detailsText = 'Состав заказа:\n';
        items.forEach(i => { detailsText += `- ${i.name}: ${i.qty} ${i.unit}\n`; });
        detailsText += `\nПредварительная стоимость: ${Math.round(total).toLocaleString('ru-RU')} ₽`;
        orderDetails.value = detailsText;
    }
}

// ========== Обработчики событий калькулятора ==========
tabBtns.forEach(btn => btn.addEventListener('click', () => setCategory(btn.dataset.category)));

document.querySelectorAll('#reels-options .tariff-card[data-reels-type]').forEach(card => {
    card.addEventListener('click', function() {
        reelsType = this.dataset.reelsType;
        activateTariff('#reels-options', 'data-reels-type', reelsType);
        updateTotal();
    });
});

function updateReelsQty(value) {
    reelsQty = Math.max(1, Math.min(20, value));
    reelsQtyDisplay.innerText = reelsQty;
    reelsQtySlider.value = reelsQty;
    updateTotal();
}
reelsQtyDecr.addEventListener('click', () => updateReelsQty(reelsQty - 1));
reelsQtyIncr.addEventListener('click', () => updateReelsQty(reelsQty + 1));
reelsQtySlider.addEventListener('input', (e) => updateReelsQty(parseInt(e.target.value)));
reelsScriptCheck.addEventListener('change', (e) => { reelsScript = e.target.checked; updateTotal(); });
reelsCoverCheck.addEventListener('change', (e) => { reelsCover = e.target.checked; updateTotal(); });

document.querySelectorAll('#shoot-options .tariff-card[data-shoot-type]').forEach(card => {
    card.addEventListener('click', function() {
        shootType = this.dataset.shootType;
        activateTariff('#shoot-options', 'data-shoot-type', shootType);
        updateTotal();
    });
});

function updateShootHours(value) {
    shootHours = Math.max(1, Math.min(10, value));
    shootHoursDisplay.innerText = shootHours;
    shootHoursSlider.value = shootHours;
    updateTotal();
}
shootHoursDecr.addEventListener('click', () => updateShootHours(shootHours - 1));
shootHoursIncr.addEventListener('click', () => updateShootHours(shootHours + 1));
shootHoursSlider.addEventListener('input', (e) => updateShootHours(parseInt(e.target.value)));
shootStudioCheck.addEventListener('change', (e) => { shootStudio = e.target.checked; updateTotal(); });
shootExtraCamCheck.addEventListener('change', (e) => { shootExtraCam = e.target.checked; updateTotal(); });
shootMuaCheck.addEventListener('change', (e) => { shootMua = e.target.checked; updateTotal(); });
shootStylistCheck.addEventListener('change', (e) => { shootStylist = e.target.checked; updateTotal(); });

document.querySelectorAll('#podcast-options .tariff-card[data-podcast-edit]').forEach(card => {
    card.addEventListener('click', function() {
        podcastEditType = this.dataset.podcastEdit;
        activateTariff('#podcast-options', 'data-podcast-edit', podcastEditType);
        updateTotal();
    });
});

podcastNeedReelsCheck.addEventListener('change', (e) => {
    podcastNeedReels = e.target.checked;
    podcastReelsBlock.classList.toggle('hidden', !podcastNeedReels);
    updateTotal();
});

document.querySelectorAll('#podcast-options .tariff-card[data-podcast-reels-type]').forEach(card => {
    card.addEventListener('click', function() {
        podcastReelsType = this.dataset.podcastReelsType;
        document.querySelectorAll('#podcast-options .tariff-card[data-podcast-reels-type]').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        updateTotal();
    });
});

function updatePodcastReelsQty(value) {
    podcastReelsQty = Math.max(1, Math.min(20, value));
    podcastReelsQtyDisplay.innerText = podcastReelsQty;
    podcastReelsQtySlider.value = podcastReelsQty;
    updateTotal();
}
podcastReelsQtyDecr.addEventListener('click', () => updatePodcastReelsQty(podcastReelsQty - 1));
podcastReelsQtyIncr.addEventListener('click', () => updatePodcastReelsQty(podcastReelsQty + 1));
podcastReelsQtySlider.addEventListener('input', (e) => updatePodcastReelsQty(parseInt(e.target.value)));

podcastNeedShootCheck.addEventListener('change', (e) => {
    podcastNeedShoot = e.target.checked;
    podcastShootBlock.classList.toggle('hidden', !podcastNeedShoot);
    updateTotal();
});

document.querySelectorAll('input[name="podcast-shoot-type"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        podcastShootType = e.target.value;
        updateTotal();
    });
});

if (podcastExtendedShootCheck) {
    podcastExtendedShootCheck.addEventListener('change', (e) => {
        podcastExtendedShoot = e.target.checked;
        if (podcastExtendedBlock) podcastExtendedBlock.classList.toggle('hidden', !podcastExtendedShoot);
        updateTotal();
    });
}

podcastExtraHoursSlider.addEventListener('input', (e) => {
    podcastExtraHours = parseInt(e.target.value);
    podcastExtraHoursDisplay.innerText = podcastExtraHours;
    updateTotal();
});
podcastStudioCheck.addEventListener('change', (e) => { podcastStudio = e.target.checked; updateTotal(); });
podcastCoverCheck.addEventListener('change', (e) => { podcastCover = e.target.checked; updateTotal(); });
podcastSeoCheck.addEventListener('change', (e) => { podcastSeo = e.target.checked; updateTotal(); });

document.querySelectorAll('#youtube-options .tariff-card[data-youtube-tariff]').forEach(card => {
    card.addEventListener('click', function() {
        youtubeTariff = this.dataset.youtubeTariff;
        activateTariff('#youtube-options', 'data-youtube-tariff', youtubeTariff);
        updateTotal();
    });
});

function updateYoutubeMinutes(value) {
    youtubeMinutes = Math.max(1, Math.min(60, value));
    youtubeMinDisplay.innerText = youtubeMinutes;
    youtubeMinSlider.value = youtubeMinutes;
    updateTotal();
}
youtubeMinDecr.addEventListener('click', () => updateYoutubeMinutes(youtubeMinutes - 1));
youtubeMinIncr.addEventListener('click', () => updateYoutubeMinutes(youtubeMinutes + 1));
youtubeMinSlider.addEventListener('input', (e) => updateYoutubeMinutes(parseInt(e.target.value)));

youtubeNeedShootCheck.addEventListener('change', (e) => {
    youtubeNeedShoot = e.target.checked;
    youtubeShootBlock.classList.toggle('hidden', !youtubeNeedShoot);
    updateTotal();
});

document.querySelectorAll('input[name="youtube-shoot-type"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        youtubeShootType = e.target.value;
        updateTotal();
    });
});

youtubeShootHoursSlider.addEventListener('input', (e) => {
    youtubeShootHours = parseInt(e.target.value);
    youtubeShootHoursDisplay.innerText = youtubeShootHours;
    updateTotal();
});
youtubeCoverCheck.addEventListener('change', (e) => { youtubeCover = e.target.checked; updateTotal(); });
youtubeSeoCheck.addEventListener('change', (e) => { youtubeSeo = e.target.checked; updateTotal(); });

document.getElementById('calculate-btn').addEventListener('click', () => {
    document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
});
document.getElementById('submit-order').addEventListener('click', () => {
    alert('Спасибо! Мы свяжемся с вами в течение 15 минут.');
});

// ========== Бегущая строка ==========
function setupMarquee(brands) {
    const marqueeContainer = document.getElementById('marquee-content');
    if (!marqueeContainer) return;
    const createBrandsHtml = (list) => list.map(name => `<span>${name}</span>`).join('');
    let html = '';
    let totalWidth = 0;
    const tempSpan = document.createElement('span');
    tempSpan.style.visibility = 'hidden';
    tempSpan.style.position = 'absolute';
    tempSpan.style.whiteSpace = 'nowrap';
    tempSpan.style.fontSize = getComputedStyle(document.documentElement).fontSize;
    document.body.appendChild(tempSpan);
    do {
        html += createBrandsHtml(brands);
        tempSpan.innerHTML = html;
        totalWidth = tempSpan.offsetWidth;
    } while (totalWidth < window.innerWidth * 2 && brands.length > 0);
    document.body.removeChild(tempSpan);
    marqueeContainer.innerHTML = html;
}

// ========== Загрузка данных из JSON (горизонтальная галерея) ==========
async function loadData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();

        if (data.brands) setupMarquee(data.brands);

        const track = document.getElementById('track');
        if (track && data.cases) {
            track.innerHTML = data.cases.map(caseItem => {
                const featuredClass = caseItem.featured ? 'featured' : '';
                let videoHtml = '';
                if (caseItem.videoLinks && caseItem.videoLinks.length > 0) {
                    const firstLink = caseItem.videoLinks[0];
                    if (firstLink.includes('youtube.com') || firstLink.includes('youtu.be')) {
                        let videoId = '';
                        if (firstLink.includes('youtu.be')) videoId = firstLink.split('/').pop();
                        else try { videoId = new URL(firstLink).searchParams.get('v'); } catch(e) {}
                        if (videoId) videoHtml = `<iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
                        else videoHtml = `<div class="video-placeholder"></div>`;
                    } else {
                        videoHtml = `<div class="video-placeholder"></div>`;
                    }
                } else {
                    videoHtml = `<div class="video-placeholder"></div>`;
                }

                let keyResult = '', extraStats = '';
                if (caseItem.stats) {
                    const parts = caseItem.stats.split('|');
                    keyResult = parts[0].trim();
                    extraStats = parts.slice(1).join('|').trim();
                } else {
                    keyResult = 'Результат';
                    extraStats = caseItem.description || '';
                }

                const hasSite = caseItem.siteLink && caseItem.siteLink !== '';
                return `
                    <div class="card ${featuredClass}">
                        ${caseItem.featured ? '<div class="badge">ТОП</div>' : ''}
                        <div class="video">${videoHtml}</div>
                        <div class="overlay">
                            <div class="text-wrapper">
                                <div class="niche">${caseItem.niche || 'Кейс'}</div>
                                <div class="title">${caseItem.name}</div>
                                <div class="key-result">${keyResult}</div>
                                <div class="extra-stats">${extraStats}</div>
                            </div>
                            <div class="actions">
                                <button class="btn-case" data-video-url="${caseItem.videoLinks?.[0] || ''}">Смотреть кейс →</button>
                                ${hasSite ? `<a href="${caseItem.siteLink}" target="_blank" class="btn-site">Сайт →</a>` : ''}
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            document.querySelectorAll('.btn-case').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const url = btn.dataset.videoUrl;
                    if (url) window.open(url, '_blank');
                    else alert('Видео для этого кейса скоро появится. Оставьте заявку, и мы покажем результаты!');
                });
            });

            setupCaseNavigation();
        }
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
    }
}

// ========== Навигация галереи ==========
function setupCaseNavigation() {
    const track = document.getElementById('track');
    const leftBtn = document.getElementById('casesNavLeft');
    const rightBtn = document.getElementById('casesNavRight');

    if (!track) return;

    const scrollAmount = 350;

    function scrollLeft() {
        console.log("скролл влево");
        track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
    function scrollRight() {
        console.log("скролл направо");
        track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }

    if (leftBtn) leftBtn.addEventListener('click', scrollLeft);
    if (rightBtn) rightBtn.addEventListener('click', scrollRight);

    let isDown = false;
    let startX, scrollLeftPos;
    track.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - track.offsetLeft;
        scrollLeftPos = track.scrollLeft;
        track.style.cursor = 'grabbing';
    });
    track.addEventListener('mouseup', () => { isDown = false; track.style.cursor = 'grab'; });
    track.addEventListener('mouseleave', () => { isDown = false; track.style.cursor = 'grab'; });
    track.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 1.5;
        track.scrollLeft = scrollLeftPos - walk;
    });
    track.style.cursor = 'grab';
}

// ========== СЛАЙДЕР БОЛЬШИХ КЕЙСОВ ==========
(function() {
    const track = document.getElementById('sliderTrack');
    if (!track) return;

    const slides = Array.from(track.children);
    const dotsContainer = document.getElementById('sliderDots');
    let activeSlide = null;

    if (slides.length === 0) return;

    // Создание точек
    if (dotsContainer) {
        slides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                scrollToSlide(i);
            });
            dotsContainer.appendChild(dot);
        });
    }
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];

    // Функция прокрутки к слайду по индексу
    function scrollToSlide(index) {
        if (index < 0 || index >= slides.length) return;
        const slideWidth = slides[0].getBoundingClientRect().width;
        const gap = parseFloat(getComputedStyle(track).gap);
        const scrollAmount = slides[0].offsetLeft - track.offsetLeft;
        const targetScroll = slides[index].offsetLeft - scrollAmount;
        track.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }

    // Клик по карточке → прокрутка к ней
    slides.forEach((slide, idx) => {
        slide.addEventListener('click', (e) => {
            // Если клик был по видео-плейсхолдеру или кнопке внутри, не прокручиваем
            if (e.target.closest('.case-video')) return;
            scrollToSlide(idx);
        });
    });

    function updateActiveSlide() {
        const trackRect = track.getBoundingClientRect();
        const centerX = trackRect.left + trackRect.width / 2;

        let closestSlide = null;
        let closestIndex = 0;
        let minDistance = Infinity;

        slides.forEach((slide, i) => {
            const rect = slide.getBoundingClientRect();
            const slideCenter = rect.left + rect.width / 2;
            const distance = Math.abs(centerX - slideCenter);
            if (distance < minDistance) {
                minDistance = distance;
                closestSlide = slide;
                closestIndex = i;
            }
        });

        if (closestSlide && closestSlide !== activeSlide) {
            slides.forEach(s => s.classList.remove('active'));
            closestSlide.classList.add('active');
            activeSlide = closestSlide;

            if (dots.length) {
                dots.forEach((dot, i) => {
                    if (i === closestIndex) dot.classList.add('active');
                    else dot.classList.remove('active');
                });
            }

            // Запуск счётчиков для активного слайда
            startCountersForSlide(closestSlide);
        }
    }

    function startCountersForSlide(slideElement) {
        const counters = slideElement.querySelectorAll('[data-count]');
        counters.forEach(counter => {
            if (counter.getAttribute('data-counted') === 'true') return;
            const target = parseFloat(counter.getAttribute('data-count'));
            if (isNaN(target)) return;
            let current = 0;
            const step = target / 40;
            const update = () => {
                if (current < target) {
                    current += step;
                    if (current > target) current = target;
                    if (target >= 1000 && target < 10000) {
                        counter.innerText = Math.floor(current).toLocaleString();
                    } else if (target % 1 !== 0) {
                        counter.innerText = current.toFixed(1);
                    } else {
                        counter.innerText = Math.floor(current);
                    }
                    requestAnimationFrame(update);
                } else {
                    if (target >= 1000 && target < 10000) {
                        counter.innerText = target.toLocaleString();
                    } else if (target % 1 !== 0) {
                        counter.innerText = target.toFixed(1);
                    } else {
                        counter.innerText = target;
                    }
                    counter.setAttribute('data-counted', 'true');
                }
            };
            update();
        });
    }

    // Инициализация
    updateActiveSlide();

    // Отслеживание скролла
    track.addEventListener('scroll', () => {
        requestAnimationFrame(updateActiveSlide);
    });

    // Адаптация при изменении размера окна
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => updateActiveSlide(), 100);
    });

    // Клик по видео-плейсхолдеру (открыть ссылку) – не прокручиваем слайд
    document.querySelectorAll('.case-video').forEach(el => {
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            const slide = el.closest('.slide');
            // Открываем видео только если карточка активна
            if (!slide || !slide.classList.contains('active')) return;
            const url = el.getAttribute('data-video-url');
            if (url) window.open(url, '_blank');
            else alert('Видео для этого кейса скоро появится');
        });
    });
})();

// ========== Инициализация ==========
setCategory('reels');
activateTariff('#reels-options', 'data-reels-type', reelsType);
activateTariff('#shoot-options', 'data-shoot-type', shootType);
activateTariff('#podcast-options', 'data-podcast-edit', podcastEditType);
activateTariff('#youtube-options', 'data-youtube-tariff', youtubeTariff);
updateTotal();

document.addEventListener('DOMContentLoaded', loadData);


