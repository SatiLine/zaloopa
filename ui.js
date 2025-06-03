export function showGreeting(userName, greetingHeader) {
    greetingHeader.textContent = `Привет, ${userName}!`;
}

// Корабли SpaceX 
export function renderShipsControls(container, onChange) {
    container.innerHTML = '';
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Поиск по имени корабля...';
    const sortSelect = document.createElement('select');
    sortSelect.innerHTML = `
        <option value="asc">Сортировка: А-Я</option>
        <option value="desc">Сортировка: Я-А</option>
    `;
    function triggerChange() {
        onChange({
            search: searchInput.value,
            sort: sortSelect.value
        });
    }
    searchInput.addEventListener('input', triggerChange);
    sortSelect.addEventListener('change', triggerChange);
    container.append(' ', searchInput, ' ', sortSelect);
}

export function renderShipsData(data, container) {
    container.innerHTML = '';
    if (!data.length) {
        container.textContent = 'Нет данных для отображения.';
        return;
    }
    const grid = document.createElement('div');
    grid.className = 'tile-grid';

    data.forEach(ship => {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.tabIndex = 0;
        tile.setAttribute('data-id', ship.id);

        const img = document.createElement('img');
        img.src = 'starship.jpg'; 
        img.alt = ship.name || 'Корабль SpaceX';

        const title = document.createElement('div');
        title.className = 'tile-title';
        title.textContent = ship.name || 'Без имени';

        tile.appendChild(img);
        tile.appendChild(title);

        tile.addEventListener('click', () => {
            showModal(
                ship.name,
                `<b>Тип:</b> ${ship.type || '-'}<br>
                 <b>Порт:</b> ${ship.home_port || '-'}<br>
                 <b>Активен:</b> ${ship.active ? 'Да' : 'Нет'}<br>
                 ${ship.year_built ? `<b>Год постройки:</b> ${ship.year_built}<br>` : ''}
                 ${ship.url ? `<b><a href="${ship.url}" target="_blank" style="color:#2d8cff;">Подробнее</a></b><br>` : ''}
                 ${ship.description || ''}`,
                'starship.jpg' 
            );
        });

        grid.appendChild(tile);
    });

    container.appendChild(grid);
}

export function renderShipsStatistics(stat, container) {
    container.innerHTML = `Всего: ${stat.count}, Активных: ${stat.active}`;
}

// Спутники Starlink
export function renderStarlinkControls(container, onChange) {
    container.innerHTML = '';
    const sortSelect = document.createElement('select');
    sortSelect.innerHTML = `
        <option value="desc">Сортировка: Новые выше</option>
        <option value="asc">Сортировка: Старые выше</option>
    `;
    sortSelect.addEventListener('change', () => {
        onChange({
            sort: sortSelect.value
        });
    });
    container.append(' ', sortSelect);
}

export function renderStarlinkData(data, container) {
    container.innerHTML = '';
    if (!data.length) {
        container.textContent = 'Нет данных для отображения.';
        return;
    }
    const grid = document.createElement('div');
    grid.className = 'tile-grid';

    data.forEach(sat => {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.tabIndex = 0;

        const img = document.createElement('img');
        img.src = 'starlink.jpg'; 
        img.alt = sat.spaceTrack?.OBJECT_NAME || 'Starlink';

        const title = document.createElement('div');
        title.className = 'tile-title';
        title.textContent = sat.spaceTrack?.OBJECT_NAME || 'Starlink';

        tile.appendChild(img);
        tile.appendChild(title);

        tile.addEventListener('click', () => {
            showModal(
                sat.spaceTrack?.OBJECT_NAME,
                `<b>Дата запуска:</b> ${sat.spaceTrack?.LAUNCH_DATE || '-'}<br>
                 <b>NORAD ID:</b> ${sat.spaceTrack?.OBJECT_ID || '-'}<br>
                 <b>Статус:</b> ${sat.spaceTrack?.STATUS || '-'}`
                , 'starlink.jpg' 
            );
        });

        grid.appendChild(tile);
    });

    container.appendChild(grid);
}

export function renderStarlinkStatistics(stat, container) {
    container.innerHTML = `Всего: ${stat.count}, Активных: ${stat.operational}`;
}

// Корабли Dragon
export function renderDragonsControls(container, onChange) {
    container.innerHTML = '';
    const sortSelect = document.createElement('select');
    sortSelect.innerHTML = `
        <option value="asc">Сортировка: А-Я</option>
        <option value="desc">Сортировка: Я-А</option>
    `;
    sortSelect.addEventListener('change', () => {
        onChange({
            sort: sortSelect.value
        });
    });
    container.append(' ', sortSelect);
}

export function renderDragonsData(data, container) {
    container.innerHTML = '';
    if (!data.length) {
        container.textContent = 'Нет данных для отображения.';
        return;
    }
    const grid = document.createElement('div');
    grid.className = 'tile-grid';

    data.forEach(dragon => {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.tabIndex = 0;

        const img = document.createElement('img');
        img.src = dragon.flickr_images?.[0] || 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/SpaceX_Crew_Dragon_%2848999388147%29.jpg/320px-SpaceX_Crew_Dragon_%2848999388147%29.jpg';
        img.alt = dragon.name || 'Dragon';

        const title = document.createElement('div');
        title.className = 'tile-title';
        title.textContent = dragon.name || 'Dragon';

        tile.appendChild(img);
        tile.appendChild(title);

        tile.addEventListener('click', () => {
            showModal(
                dragon.name,
                `<b>Тип:</b> ${dragon.type || '-'}<br>
                 <b>Экипаж:</b> ${dragon.crew_capacity ?? '-'}<br>
                 <b>Масса (кг):</b> ${dragon.dry_mass_kg ?? '-'}<br>
                 <b>Описание:</b> ${dragon.description ? dragon.description.slice(0, 200) + '...' : '-'}`
                , dragon.flickr_images?.[0]
            );
        });

        grid.appendChild(tile);
    });

    container.appendChild(grid);
}

export function renderDragonsStatistics(data, container) {
    container.innerHTML = `Всего: ${data.length}`;
}

// Модальное окно
function showModal(title, html, image) {
    document.querySelectorAll('.modal-bg').forEach(el => el.remove());

    const bg = document.createElement('div');
    bg.className = 'modal-bg';

    const modal = document.createElement('div');
    modal.className = 'modal';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', () => bg.remove());

    modal.innerHTML = `
        <div class="modal-title">${title || ''}</div>
        ${image ? `<img src="${image}" alt="${title}" style="width:100px; border-radius:8px; margin-bottom:10px;">` : ''}
        <div style="margin-bottom:10px; color:#b3c6ff;">${html || ''}</div>
    `;
    modal.appendChild(closeBtn);
    bg.appendChild(modal);
    document.body.appendChild(bg);

    bg.addEventListener('click', e => {
        if (e.target === bg) bg.remove();
    });
}
