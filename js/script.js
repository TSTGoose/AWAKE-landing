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

// ========== Цены ==========
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

// ========== DOM элементы ==========
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

// ========== Утилиты ==========
function setCategory(cat) {
    category = cat;
    Object.values(panels).forEach(p => p.classList.add('hidden'));
    if (panels[cat]) panels[cat].classList.remove('hidden');

    tabBtns.forEach(btn => {
        if (btn.dataset.category === cat) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    updateTotal();
}

// Активация тарифных карточек
function activateTariff(containerSelector, typeAttr, currentValue) {
    document.querySelectorAll(`${containerSelector} .tariff-card`).forEach(card => {
        const cardType = card.getAttribute(typeAttr);
        if (cardType === currentValue) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });
}

// Обновление цены и состава
function updateTotal() {
    let service = 0;
    let addons = 0;
    let discount = 0;
    let description = '';

    if (category === 'reels') {
        const pricePerReel = reelsType === 'basic' ? PRICES.reels.basic : PRICES.reels.dynamic;
        service = pricePerReel * reelsQty;
        if (reelsScript) addons += PRICES.addons.reelsScript * reelsQty;
        if (reelsCover) addons += PRICES.addons.reelsCover * reelsQty;
        const discountRate = getReelsDiscount(reelsQty);
        if (reelsType === 'dynamic') discount = service * discountRate;
        description = reelsType === 'basic' ? 'Базовый монтаж' : 'Динамичный монтаж';
    }
    else if (category === 'shoot') {
        const pricePerHour = shootType === 'head' ? PRICES.shoot.head : PRICES.shoot.dynamic;
        service = pricePerHour * shootHours;
        const discountRate = getShootDiscount(shootHours);
        discount = service * discountRate;
        if (shootStudio) addons += PRICES.addons.shootStudio;
        if (shootExtraCam) addons += PRICES.addons.shootExtraCam;
        if (shootMua) addons += PRICES.addons.shootMua;
        if (shootStylist) addons += PRICES.addons.shootStylist;
        description = `Съёмка: ${shootType === 'head' ? 'говорящая голова' : 'динамичная'}`;
    }
    else if (category === 'podcast') {
        // Обработка — основная услуга
        if (podcastEditType === 'standard') service += PRICES.podcast.editStandard;
        else service += PRICES.podcast.editPro;

        // Съёмка (дополнительно)
        if (podcastNeedShoot) {
            addons += PRICES.podcast.shootBase; // базовая съёмка 2 часа
            if (podcastExtendedShoot) {
                addons += podcastExtraHours * PRICES.podcast.extraHour;
            }
        }

        // Рилсы (дополнительно)
        if (podcastNeedReels) {
            const reelPrice = podcastReelsType === 'basic' ? PRICES.reels.basic : PRICES.reels.dynamic;
            const reelsCost = reelPrice * podcastReelsQty;
            addons += reelsCost;
            const reelsDiscount = reelsCost * 0.05;
            discount += reelsDiscount; // скидка на рилсы
        }

        // Прочие дополнительные услуги
        if (podcastStudio) addons += PRICES.addons.podcastStudio;
        if (podcastCover) addons += PRICES.addons.podcastCover;
        if (podcastSeo) addons += PRICES.addons.podcastSeo;

        // Скидка на съёмку (если есть)
        if (podcastNeedShoot) {
            const shootBase = PRICES.podcast.shootBase;
            const shootExtra = podcastExtendedShoot ? podcastExtraHours * PRICES.podcast.extraHour : 0;
            const shootTotal = shootBase + shootExtra;
            const shootDiscountRate = getShootDiscount(2 + (podcastExtendedShoot ? podcastExtraHours : 0)); // скидка от общего количества часов
            discount += shootTotal * shootDiscountRate;
        }

        description = podcastEditType === 'standard' ? 'Обработка стандарт' : 'Обработка продвинутая';
    }
    else if (category === 'youtube') {
        let pricePerMin = PRICES.youtube[youtubeTariff];
        service = pricePerMin * youtubeMinutes;
        if (youtubeNeedShoot) {
            const shootPrice = youtubeShootType === 'videographer' ? PRICES.youtube.videographer : PRICES.youtube.head;
            service += shootPrice * youtubeShootHours;
        }
        if (youtubeCover) addons += PRICES.addons.youtubeCover;
        if (youtubeSeo) addons += PRICES.addons.youtubeSeo;
        description = `Монтаж YouTube (${youtubeTariff})`;
    }

    const total = service + addons - discount;
    totalSpan.innerText = Math.round(total).toLocaleString('ru-RU') + ' ₽';
    serviceCostSpan.innerText = Math.round(service).toLocaleString('ru-RU') + ' ₽';
    addonsCostSpan.innerText = Math.round(addons).toLocaleString('ru-RU') + ' ₽';
    discountSpan.innerText = '− ' + Math.round(discount).toLocaleString('ru-RU') + ' ₽';
    includedDesc.innerText = description || 'Выберите параметры';

    // Построение корзины
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
        if (podcastNeedShoot) {const totalShootHours = 2 + (podcastExtendedShoot ? podcastExtraHours : 0); items.push({ name: 'Съёмка подкаста', qty: totalShootHours, unit: 'ч' });}
        items.push({ name: podcastEditType === 'standard' ? 'Обработка (стандарт)' : 'Обработка (продвинутый)', qty: 1, unit: 'выпуск' });
        if (podcastStudio) items.push({ name: 'Поиск студии', qty: 1, unit: '' });
        if (podcastCover) items.push({ name: 'Обложка', qty: 1, unit: '' });
        if (podcastSeo) items.push({ name: 'SEO', qty: 1, unit: '' });
        if (podcastNeedReels) {
            items.push({ name: `Рилсы (${podcastReelsType === 'basic' ? 'базовый' : 'динамичный'})`, qty: podcastReelsQty, unit: 'роликов' });
        }
    } else if (category === 'youtube') {
        items.push({ name: `Монтаж (${youtubeTariff})`, qty: youtubeMinutes, unit: 'мин' });
        if (youtubeNeedShoot) items.push({ name: youtubeShootType === 'videographer' ? 'Аренда видеографа' : 'Говорящая голова', qty: youtubeShootHours, unit: 'ч' });
        if (youtubeCover) items.push({ name: 'Обложка YouTube', qty: 1, unit: '' });
        if (youtubeSeo) items.push({ name: 'SEO YouTube', qty: 1, unit: '' });
    }

    orderItemsDiv.innerHTML = items.map(i => `<div class="order-item"><span>${i.name}</span><span class="value">${i.qty} ${i.unit}</span></div>`).join('');

    // Автозаполнение формы
    if (orderDetails) {
        let detailsText = 'Состав заказа:\n';
        items.forEach(i => { detailsText += `- ${i.name}: ${i.qty} ${i.unit}\n`; });
        detailsText += `\nПредварительная стоимость: ${Math.round(total).toLocaleString('ru-RU')} ₽`;
        orderDetails.value = detailsText;
    }
}

// ========== Обработчики событий ==========
// Вкладки
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => setCategory(btn.dataset.category));
});

// Reels
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

// Shoot
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

// Podcast
document.querySelectorAll('#podcast-options .tariff-card[data-podcast-edit]').forEach(card => {
    card.addEventListener('click', function() {
        podcastEditType = this.dataset.podcastEdit;
        activateTariff('#podcast-options', 'data-podcast-edit', podcastEditType);
        updateTotal();
    });
});

// Обработчики для "Нужны рилсы"
podcastNeedReelsCheck.addEventListener('change', (e) => {
    podcastNeedReels = e.target.checked;
    podcastReelsBlock.classList.toggle('hidden', !podcastNeedReels);
    updateTotal();
});

// Выбор тарифа рилсов (карточки)
document.querySelectorAll('#podcast-options .tariff-card[data-podcast-reels-type]').forEach(card => {
    card.addEventListener('click', function() {
        podcastReelsType = this.dataset.podcastReelsType;
        // Активируем только карточки внутри этого блока
        document.querySelectorAll('#podcast-options .tariff-card[data-podcast-reels-type]').forEach(c => {
            c.classList.remove('active');
        });
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

// Радио для типа съёмки (если используется) — можно оставить, но они не активны сейчас
document.querySelectorAll('input[name="podcast-shoot-type"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        podcastShootType = e.target.value;
        updateTotal();
    });
});

// Расширенная съёмка (чекбокс)
if (podcastExtendedShootCheck) {
    podcastExtendedShootCheck.addEventListener('change', (e) => {
        podcastExtendedShoot = e.target.checked;
        if (podcastExtendedBlock) podcastExtendedBlock.classList.toggle('hidden', !podcastExtendedShoot);
        updateTotal();
    });
}

// Дополнительные часы
podcastExtraHoursSlider.addEventListener('input', (e) => {
    podcastExtraHours = parseInt(e.target.value);
    podcastExtraHoursDisplay.innerText = podcastExtraHours;
    updateTotal();
});

podcastStudioCheck.addEventListener('change', (e) => { podcastStudio = e.target.checked; updateTotal(); });
podcastCoverCheck.addEventListener('change', (e) => { podcastCover = e.target.checked; updateTotal(); });
podcastSeoCheck.addEventListener('change', (e) => { podcastSeo = e.target.checked; updateTotal(); });

// YouTube
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

// Кнопка "Получить точный расчёт" — прокрутка к форме
document.getElementById('calculate-btn').addEventListener('click', () => {
    document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
});

// Отправка формы (заглушка)
document.getElementById('submit-order').addEventListener('click', () => {
    alert('Спасибо! Мы свяжемся с вами в течение 15 минут.');
});

// ========== Инициализация ==========
setCategory('reels');
activateTariff('#reels-options', 'data-reels-type', reelsType);
activateTariff('#shoot-options', 'data-shoot-type', shootType);
activateTariff('#podcast-options', 'data-podcast-edit', podcastEditType);
activateTariff('#youtube-options', 'data-youtube-tariff', youtubeTariff);
updateTotal();