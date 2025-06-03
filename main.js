import {
    fetchShips,
    fetchStarlinkSatellites,
    fetchDragons,
    filterShipsByName,
    sortShipsByName,
    getShipsStatistics,
    sortStarlinkByLaunchDate,
    getStarlinkStatistics
} from './data.js';

import {
    showGreeting,
    renderShipsControls,
    renderShipsData,
    renderShipsStatistics,
    renderStarlinkControls,
    renderStarlinkData,
    renderStarlinkStatistics,
    renderDragonsControls,
    renderDragonsData,
    renderDragonsStatistics
} from './ui.js';

class App {
    constructor() {
        // DOM-элементы
        this.welcomeSection = document.getElementById('welcome-section');
        this.mainSection = document.getElementById('main-section');
        this.greetingHeader = document.getElementById('greeting');
        this.shipsBtn = document.getElementById('ships-btn');
        this.starlinkBtn = document.getElementById('starlink-btn');
        this.dragonsBtn = document.getElementById('dragons-btn');

        this.shipsPage = document.getElementById('ships-page');
        this.starlinkPage = document.getElementById('starlink-page');
        this.dragonsPage = document.getElementById('dragons-page');

        this.shipsControls = document.getElementById('ships-controls');
        this.shipsData = document.getElementById('ships-data');
        this.shipsStatistics = document.getElementById('ships-statistics');
        this.starlinkControls = document.getElementById('starlink-controls');
        this.starlinkData = document.getElementById('starlink-data');
        this.starlinkStatistics = document.getElementById('starlink-statistics');
        this.dragonsControls = document.getElementById('dragons-controls');
        this.dragonsData = document.getElementById('dragons-data');
        this.dragonsStatistics = document.getElementById('dragons-statistics');

        this.welcomeForm = document.getElementById('welcome-form');
        this.usernameInput = document.getElementById('username');

        // Состояние
        this.userName = '';
        this.shipsRaw = [];
        this.shipsFiltered = [];
        this.starlinkRaw = [];
        this.starlinkFiltered = [];
        this.dragonsRaw = [];
        this.dragonsFiltered = [];

        this.init();
    }

    init() {
        this.welcomeSection.style.display = 'block';
        this.mainSection.style.display = 'none';
        this.shipsPage.style.display = 'none';
        this.starlinkPage.style.display = 'none';
        this.dragonsPage.style.display = 'none';
        this.setActiveButton(this.shipsBtn);

        // Обработчики
        this.welcomeForm.addEventListener('submit', (event) => this.handleWelcomeSubmit(event));
        this.shipsBtn.addEventListener('click', () => { this.showShipsPage(); this.setActiveButton(this.shipsBtn); });
        this.starlinkBtn.addEventListener('click', () => { this.showStarlinkPage(); this.setActiveButton(this.starlinkBtn); });
        this.dragonsBtn.addEventListener('click', () => { this.showDragonsPage(); this.setActiveButton(this.dragonsBtn); });
    }

    async handleWelcomeSubmit(event) {
        event.preventDefault();
        this.userName = this.usernameInput.value.trim();
        if (this.userName) {
            this.welcomeSection.style.display = 'none';
            this.mainSection.style.display = 'block';
            showGreeting(this.userName, this.greetingHeader);

            this.shipsData.textContent = 'Загрузка...';
            this.starlinkData.textContent = 'Загрузка...';
            this.dragonsData.textContent = 'Загрузка...';
            try { this.shipsRaw = await fetchShips(); } catch { this.shipsData.textContent = 'Ошибка загрузки кораблей'; }
            try { this.starlinkRaw = await fetchStarlinkSatellites(); } catch { this.starlinkData.textContent = 'Ошибка загрузки спутников'; }
            try { this.dragonsRaw = await fetchDragons(); } catch { this.dragonsData.textContent = 'Ошибка загрузки Dragon'; }

            this.showShipsPage();
            this.setActiveButton(this.shipsBtn);
        }
    }

    setActiveButton(activeBtn) {
        [this.shipsBtn, this.starlinkBtn, this.dragonsBtn].forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }

    showShipsPage() {
        this.shipsPage.style.display = 'block';
        this.starlinkPage.style.display = 'none';
        this.dragonsPage.style.display = 'none';

        renderShipsControls(this.shipsControls, (options) => this.onShipsControlChange(options));
        this.shipsFiltered = [...this.shipsRaw];
        renderShipsData(this.shipsFiltered, this.shipsData);
        renderShipsStatistics(getShipsStatistics(this.shipsFiltered), this.shipsStatistics);
    }

    onShipsControlChange(options) {
        let result = filterShipsByName(this.shipsRaw, options.search);
        result = sortShipsByName(result, options.sort === 'asc');
        this.shipsFiltered = result;
        renderShipsData(this.shipsFiltered, this.shipsData);
        renderShipsStatistics(getShipsStatistics(this.shipsFiltered), this.shipsStatistics);
    }

    showStarlinkPage() {
        this.shipsPage.style.display = 'none';
        this.starlinkPage.style.display = 'block';
        this.dragonsPage.style.display = 'none';

        renderStarlinkControls(this.starlinkControls, (options) => this.onStarlinkControlChange(options));
        this.starlinkFiltered = [...this.starlinkRaw];
        renderStarlinkData(this.starlinkFiltered, this.starlinkData);
        renderStarlinkStatistics(getStarlinkStatistics(this.starlinkFiltered), this.starlinkStatistics);
    }

    onStarlinkControlChange(options) {
        let result = [...this.starlinkRaw];
        result = sortStarlinkByLaunchDate(result, options.sort === 'asc');
        this.starlinkFiltered = result;
        renderStarlinkData(this.starlinkFiltered, this.starlinkData);
        renderStarlinkStatistics(getStarlinkStatistics(this.starlinkFiltered), this.starlinkStatistics);
    }

    showDragonsPage() {
        this.shipsPage.style.display = 'none';
        this.starlinkPage.style.display = 'none';
        this.dragonsPage.style.display = 'block';

        renderDragonsControls(this.dragonsControls, (options) => this.onDragonsControlChange(options));
        this.dragonsFiltered = [...this.dragonsRaw];
        renderDragonsData(this.dragonsFiltered, this.dragonsData);
        renderDragonsStatistics(this.dragonsFiltered, this.dragonsStatistics);
    }

    onDragonsControlChange(options) {
        this.dragonsFiltered = [...this.dragonsRaw];
        this.dragonsFiltered.sort((a, b) => {
            if (!a.name || !b.name) return 0;
            return options.sort === 'asc'
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name);
        });
        renderDragonsData(this.dragonsFiltered, this.dragonsData);
        renderDragonsStatistics(this.dragonsFiltered, this.dragonsStatistics);
    }
}

new App();
