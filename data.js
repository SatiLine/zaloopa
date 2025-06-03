const SPACEX_API_BASE = 'https://api.spacexdata.com/v4';

// все корабли SpaceX
export async function fetchShips() {
    const response = await fetch(`${SPACEX_API_BASE}/ships`);
    if (!response.ok) throw new Error('Ошибка загрузки данных о кораблях');
    return await response.json();
}

// все спутники Starlink
export async function fetchStarlinkSatellites() {
    const response = await fetch(`${SPACEX_API_BASE}/starlink`);
    if (!response.ok) throw new Error('Ошибка загрузки данных о спутниках Starlink');
    return await response.json();
}

// все капсулы Dragon
export async function fetchDragons() {
    const response = await fetch(`${SPACEX_API_BASE}/dragons`);
    if (!response.ok) throw new Error('Ошибка загрузки данных о Dragon');
    return await response.json();
}

// Фильтрация кораблей по имени
export function filterShipsByName(ships, searchTerm) {
    if (!searchTerm) return ships;
    return ships.filter(ship =>
        ship.name && ship.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
}

// Сортировка кораблей по имени
export function sortShipsByName(ships, ascending = true) {
    return [...ships].sort((a, b) => {
        if (!a.name || !b.name) return 0;
        return ascending
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
    });
}

// Сортировка спутников по дате запуска
export function sortStarlinkByLaunchDate(satellites, ascending = true) {
    return [...satellites].sort((a, b) => {
        const dateA = new Date(a.spaceTrack.LAUNCH_DATE);
        const dateB = new Date(b.spaceTrack.LAUNCH_DATE);
        if (isNaN(dateA) || isNaN(dateB)) return 0;
        return ascending ? dateA - dateB : dateB - dateA;
    });
}

// Статистика по кораблям
export function getShipsStatistics(ships) {
    return {
        count: ships.length,
        active: ships.filter(s => s.active).length
    };
}

// Статистика по спутникам
export function getStarlinkStatistics(satellites) {
    return {
        count: satellites.length,
        operational: satellites.filter(s =>
            s.spaceTrack && s.spaceTrack.STATUS === 'ACTIVE'
        ).length
    };
}
