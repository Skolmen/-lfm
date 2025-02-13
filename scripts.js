document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded');
    menuStorageManager();
    settingsStorageManager();
    // unitStorageManager();

    loadTemplateUnits();

    showMenu(currentMenu);
});

var currentMenu = '';

const MENUS = {
    'home': 'home-button',
    'promille': 'promille-button',
    'history': 'history-button',
    'settings': 'settings-button'
};

const STANDARD_GENDER = 'male';
const STANDARD_WEIGHT = 70;

const SETTINGS = ['weight', 'gender'];

const ALLOWED_UNIT_TYPES = ["unspecified", "beer", "wine", "cider", "wine", "liquor", "alcopop", "other"]

const firstDrinkClass = 'first-drink';

class Unit {
    constructor(date, time, type, volume, alco, name = null) {
        if (!this.validateDate(date)) {
            throw new Error(`Invalid date format: ${date}`);
        }
        if (!this.validateTime(time)) {
            throw new Error(`Invalid time format: ${time}`);
        }
        if (!ALLOWED_UNIT_TYPES.includes(type)) {
            throw new Error(`Invalid unit type: ${type}`);
        }
        if (!this.validateVolume(volume)) {
            throw new Error(`Invalid volume: ${volume}`);
        }
        if (!this.validateAlco(alco)) {
            throw new Error(`Invalid alcohol content: ${alco}`);
        }
        if (!this.validateName(name)) {
            throw new Error(`Invalid name: ${name}`);
        }

        this.name = name;
        this.date = date;
        this.time = time;
        this.type = type;
        this.volume = volume;
        this.alco = alco;
        
        this.id = this.generateId();
        this.timestamp = Date.now(); // Corrected timestamp
    }

    generateId() {
        //use the date and time to generate a unique id and some randomness
        return `${this.date}-${this.time}-${Math.random().toString(36).substring(2, 12)}`;
    }

    validateVolume(volume) {
        return volume > 0;
    }

    validateAlco(alco) {
        return alco > 0;
    }
    
    validateDate(date) {
        return date.match(/^\d{4}-\d{2}-\d{2}$/);
    }

    validateTime(time) {
        return time.match(/^\d{2}:\d{2}$/);
    }

    validateName(name) {
        if (name === null || name === "") return true;
        const templateUnits = JSON.parse(localStorage.getItem('templateUnits'));
        return templateUnits.hasOwnProperty(name);
    }
}

function showMenu(menu) {
    currentMenu = menu;
    localStorage.setItem('currentMenu', currentMenu);

    switch (menu) {
        case 'home':
            updateHome();
            break;
        case 'promille':
            updatePromille();
            break;
        case 'history':
            updateHistory();
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

    const type = document.getElementById('new-unit-type');
    type.selectedIndex = 0;

    const volume = document.getElementById('new-unit-volume');
    volume.value = '';

    const alco = document.getElementById('new-unit-alcohol');
    alco.value = '';

    const firstUnit = document.getElementById('new-unit-first_drink');
    firstUnit.selectedIndex = 0;

    //Load the templates to the select
    const templateUnits = JSON.parse(localStorage.getItem('templateUnits'));
    const templateSelect = document.getElementById('new-unit-template');
    templateSelect.innerHTML = '<option value="" selected>Välj dryck</option>';

    Object.keys(templateUnits).forEach(key => {
        const template = templateUnits[key];
        templateSelect.innerHTML += `<option value="${key}">${template.name}</option>`;
    });
}

function autoFillWithTemplate(key) {
    const type = document.getElementById('new-unit-type');
    const volume = document.getElementById('new-unit-volume');
    const alco = document.getElementById('new-unit-alcohol');

    if (key === '') {
        type.selectedIndex = 0;
        volume.value = '';
        alco.value = '';
        return;
    }

    const templateUnits = JSON.parse(localStorage.getItem('templateUnits'));
    const template = templateUnits[key];

    type.value = template.type;
    volume.value = Math.round(template.volume * 100, 2); //convert to centiliters
    alco.value = template.alco;
}

function closeNewUnitWindow() {
    console.log('closeNewUnitWindow');
    const newUnitWindow = document.getElementById('new-unit-window');
    newUnitWindow.style.display = 'none';

    //update the start page
    updateHome();
}

function addUnit() {

    //TEMPORARY as the time thing is not working
    return;

    const templateSelect = document.getElementById('new-unit-template').value;
    const date = document.getElementById('new-unit-date').value;
    const time = document.getElementById('new-unit-time').value;
    const type = document.getElementById('new-unit-type').value;
    const volume = document.getElementById('new-unit-volume').value / 100; //convert to liters
    const alco = document.getElementById('new-unit-alcohol').value;
    let firstDrink = document.getElementById('new-unit-first_drink').value === 'true';

    //Check if there are any units in local storage
    let units = JSON.parse(localStorage.getItem('units'));
    if (!units) units = {};

    if (Object.keys(units).length === 0) {
        firstDrink = true;
    }

    try {
        const unit = new Unit(date, time, type, volume, alco, templateSelect);
        
        if (firstDrink) {
            const unitId = unit.id;
    
            setFirstDrink(unitId);
        }
        console.log(unit);

        //save the unit to local storage
        let units = JSON.parse(localStorage.getItem('units'));
        if (!units) units = {};
        units[unit.id] = unit;
        localStorage.setItem('units', JSON.stringify(units));

    } catch (e) {
        console.error(e);
    }

    closeNewUnitWindow();
}

function setFirstDrink(unitId) {
    localStorage.setItem('firstDrink', unitId);
}

function loadTemplateUnits() {
    console.log('loadTemplateUnits');
    fetch('templateUnits.json').then(response => response.json()).then(data => {
        localStorage.setItem('templateUnits', JSON.stringify(data));
    });
}

function calculatePromille() {
    console.log('calculatePromille');
}

function updateHistory() {
    console.log('updateHistory');
    let units = JSON.parse(localStorage.getItem('units'));
    if (!units) units = {};

    let firstDrink = localStorage.getItem('firstDrink');
    if (!firstDrink) firstDrink = '';

    if (Object.keys(units).length === 0) {
        document.getElementById('history-units').innerHTML = '<p>Inga druckna enheter</p>';
        return;
    }

    const history = document.getElementById('history-units');
    history.innerHTML = '';

    let sortedKeys = Object.keys(units).sort((a, b) => units[b].timestamp - units[a].timestamp);

    let sortedUnits = {};
    sortedKeys.forEach(key => {
        sortedUnits[key] = units[key];
    });


    Object.keys(sortedUnits).forEach(key => {
        const unit = sortedUnits[key];
        const firstDrinkClass = firstDrink === key ? 'first-drink' : '';
        history.innerHTML += `<div class="unit ${firstDrinkClass}" id="${key}">
            <div class="unit-left">
                <p>Intag: ${unit.time}</p>
                <p>Typ: ${getNameFromType(unit.type)}</p>
                <p>Volym: ${unit.volume.toString().replace('.', ',')} l</p>
                <p>Alkoholhalt: ${unit.alco.toString().replace('.', ',')} %</p>
                <p>Standardenhet: ${calculateStandardEnhet(unit.volume, unit.alco).toString().replace('.', ',')} st</p>
            </div>
            <div class="unit-right" onclick="setAsFirstDrink('${key}')">
                <span>🖋</span>
                <p>Första dryck</p>
            </div>
            <div class="unit-right" onclick="removeUnit('${key}')">
                <span>🗑️</span>
                <p>Ta bort</p>
            </div>
        </div>`;
    });
}

function getNameFromType(type) {
    const dictionary = {
        'beer': 'Öl',
        'wine': 'Vin',
        'cider': 'Cider',
        'liquor': 'Sprit',
        'alcopop': 'Alkoholdryck',
        'other': 'Annat'
    };

    return dictionary[type];
}

function calculateStandardEnhet(volume, alco) {
    // 1 standardenhet = 12 g ren alkohol
    let alcohol = volume * alco / 100; // Calculate the amount of alcohol in liters
    let grams = alcohol * 0.789 * 1000; // Calculate the amount of alcohol in grams
    return Math.round(grams / 12 * 10) / 10; 
}

function calculateDrinkStats() {
    let units = JSON.parse(localStorage.getItem('units'));
    if (!units) units = {};

    let firstDrink = localStorage.getItem('firstDrink');
    if (!firstDrink) return { totalDrinken: 0, totalStandardEnheter: 0, unitsDrunken: 0, gramsConsumed: 0 };

    if (Object.keys(units).length === 0) {
        return { totalDrinken: 0, totalStandardEnheter: 0, unitsDrunken: 0, gramsConsumed: 0 };
    }

    let firstDrinkUnit = units[firstDrink];

    let firstDrinkTime = firstDrinkUnit.timestamp;

    let totalDrinken = 0;
    let totalStandardEnheter = 0;
    let unitsDrunken = 0;
    let gramsConsumed = 0;

    Object.keys(units).forEach(key => {
        let unit = units[key];
        let unitTime = unit.timestamp;

        if (unitTime >= firstDrinkTime) {
            totalDrinken += unit.volume;
            totalStandardEnheter += calculateStandardEnhet(unit.volume, unit.alco);
            unitsDrunken += 1;
            gramsConsumed += unit.volume * unit.alco / 100 * 0.789 * 1000;
        }
    });

    return {
        totalDrinken: parseFloat(totalDrinken.toFixed(2)),
        totalStandardEnheter: parseFloat(totalStandardEnheter.toFixed(1)),
        unitsDrunken: unitsDrunken,
        gramsConsumed: parseFloat(gramsConsumed.toFixed(1))
    };
}

function updateHome() {
    console.log('updateHome');

    const { totalDrinken, totalStandardEnheter, unitsDrunken } = calculateDrinkStats();

    const amountDrinken = document.getElementById('main-amount_drinken');
    const totalStandardEnheterElem = document.getElementById('main-standard_units');
    const totalUnitsDrunken = document.getElementById('main-amount_of_drunken_units');

    
    amountDrinken.innerHTML = `${totalDrinken.toString().replace('.', ',')} l`;
    totalStandardEnheterElem.innerHTML = `${totalStandardEnheter.toString().replace('.', ',')} st`;
    totalUnitsDrunken.innerHTML = `${unitsDrunken.toString().replace('.', ',')} st`;
}

function removeUnit(value) {
    console.log('removeUnit' + value);

    const removeWindow = document.getElementById('remove-unit-window');
    const removeButton = document.getElementById('remove-unit-window-yes');
    const cancelButton = document.getElementById('remove-unit-window-no');

    const timeElement = document.querySelector('#remove-unit-window > div > span:nth-child(1) > span');

    removeWindow.style.display = 'flex';

    let units = JSON.parse(localStorage.getItem('units'));
    if (!units) units = {};

    let unit = units[value];

    timeElement.innerHTML = unit.time;

    removeButton.onclick = () => {

        let firstDrink = localStorage.getItem('firstDrink');
        if (!firstDrink) firstDrink = '';

        if (Object.keys(units).length === 0) {
            return;
        }

        if (firstDrink === value) {
            localStorage.removeItem('firstDrink');
        }

        delete units[value];

        localStorage.setItem('units', JSON.stringify(units));

        removeWindow.style.display = 'none';

        removeButton.onclick = null;
        cancelButton.onclick = null;

        updateHistory();
    };

    cancelButton.onclick = () => {
        removeWindow.style.display = 'none';

        removeButton.onclick = null;
        cancelButton.onclick = null;

        updateHistory();
    };
}

function updatePromille() {
    console.log('updatePromille');

    const promilleElem = document.getElementById('main-promille');
    const timeElem = document.getElementById('main-starting_time');
    const gramsElem = document.getElementById('main-alkhol_gram');

    const grams = calculateDrinkStats().gramsConsumed;

    gramsElem.innerHTML = `${grams.toString().replace('.', ',')} g`;

    //get the time of the first drink
    let firstDrink = localStorage.getItem('firstDrink');
    if (firstDrink) {
        let units = JSON.parse(localStorage.getItem('units'));
        if (!units) units = {};

        let firstDrinkUnit = units[firstDrink];

        timeElem.innerHTML = firstDrinkUnit.time;
    }
    else {
        timeElem.innerHTML = '--:--';
    }

    promilleElem.innerHTML = '-- ‰';
}

function setAsFirstDrink(value) {
    console.log('setAsFirstDrink' + value);

    let units = JSON.parse(localStorage.getItem('units'));
    if (!units) units = {};

    let firstDrink = localStorage.getItem('firstDrink');
    if (firstDrink) {
        const firstDrinkElement = document.getElementById(firstDrink);
        firstDrinkElement.classList.remove(firstDrinkClass);
    }

    const newFirstDrinkElement = document.getElementById(value);
    newFirstDrinkElement.classList.add(firstDrinkClass);

    localStorage.setItem('firstDrink', value);

    updateHistory();
}

