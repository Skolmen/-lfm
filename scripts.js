document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded');
    menuStorageManager();
    settingsStorageManager();
    showMenu(currentMenu);
});

let currentMenu = '';

const MENUS = {
    'home': 'home-button',
    'promille': 'promille-button',
    'history': 'history-button',
    'settings': 'settings-button'
};

const STANDARD_GENDER = 'male';
const STANDARD_WEIGHT = 70;

const SETTINGS = ['weight', 'gender'];

function showMenu(menu) {
    currentMenu = menu;
    localStorage.setItem('currentMenu', currentMenu);

    switch (menu) {
        case 'home':
            updateHome();
            break;
        case 'promille':
            calculatePromille();
            break;
        case 'history':
            showHistory();
            break;
        default:
            break;
    }

    Object.keys(MENUS).forEach((key) => {
        let menuElement = document.getElementById(key);
        if (menuElement) menuElement.style.display = 'none';
    });

    let selectedMenu = document.getElementById(menu);
    if (selectedMenu) selectedMenu.style.display = 'block';

    let footer = document.getElementsByTagName('footer')[0];
    
    for (let i = 0; i < footer.getElementsByTagName('div').length; i++) {
        footer.getElementsByTagName('div')[i].classList.remove('active');
    }
    
    let activeButton = document.getElementById(MENUS[menu]);
    if (activeButton) activeButton.classList.add('active');
}

function menuStorageManager() {
    let storedMenu = localStorage.getItem('currentMenu');
    if (storedMenu && MENUS.hasOwnProperty(storedMenu)) {
        currentMenu = storedMenu;
    } else {
        currentMenu = 'home';
    }
}

function changeSetting(element, setting) {
    switch (setting) {
        case 'weight':
            localStorage.setItem('weight', element.value);
            break
        case 'gender':
            localStorage.setItem('gender', element.value);
            break;
        default:
            break;
    }
}

function settingsStorageManager() {
    let weight = localStorage.getItem('weight');
    if (weight) {
        document.getElementById('settings-weight').value = weight
    }
    else {
        localStorage.setItem('weight', STANDARD_WEIGHT);
        document.getElementById('settings-gender').value = STANDARD_WEIGHT;
    }

    let gender = localStorage.getItem('gender');
    if (gender) {
        document.getElementById('settings-gender').value = gender;
    }
    else {
        localStorage.setItem('gender', STANDARD_GENDER);
        document.getElementById('settings-gender').value = STANDARD_GENDER;
    }

}

function openNewUnitWindow() {
    console.log('openNewUnitWindow');
    const newUnitWindow = document.getElementById('new-unit-window');
    newUnitWindow.style.display = 'block';

    const date = document.getElementById('new-unit-date');
    const time = document.getElementById('new-unit-time');

    const now = new Date();

    const currentDate = now.toISOString().split('T')[0];

    const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);

    date.value = currentDate;
    time.value = currentTime;
}

function closeNewUnitWindow() {
    console.log('closeNewUnitWindow');
    const newUnitWindow = document.getElementById('new-unit-window');
    newUnitWindow.style.display = 'none';
}

function calculatePromille() {
    console.log('calculatePromille');
}

function showHistory() {
    console.log('showHistory');
}

function updateHome() {
    console.log('updateHome');
}

function removeUnit(value) {
    console.log('removeUnit' + value);
}

