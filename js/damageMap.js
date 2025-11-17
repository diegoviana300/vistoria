let damages = [];
let currentClickPosition = { x: 0, y: 0 };

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export function initDamageMap() {
    const carDiagramWrapper = document.getElementById('car-diagram-container');
    if (!carDiagramWrapper) {
        console.warn('DamageMap: #car-diagram-container não encontrado.');
        return;
    }

    const carDiagramContainer = carDiagramWrapper.querySelector('.relative');
    const damageModal = document.getElementById('damage-modal');
    const damageDescription = document.getElementById('damage-description');
    const damageError = document.getElementById('damage-error');
    const saveDamageBtn = document.getElementById('save-damage');
    const cancelDamageBtn = document.getElementById('cancel-damage');
    const damageList = document.getElementById('damage-list');

    if (!carDiagramContainer || !damageModal || !damageDescription || !damageError || !saveDamageBtn || !cancelDamageBtn || !damageList) {
        console.warn('DamageMap: elementos de DOM faltando, pulando init.');
        return;
    }

    carDiagramContainer.addEventListener('click', (e) => {
        const rect = carDiagramContainer.getBoundingClientRect();
        currentClickPosition = {
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100
        };
        damageDescription.value = '';
        damageError.classList.add('hidden');
        damageModal.classList.remove('hidden');
        damageDescription.focus();
    });

    function closeDamageModal() {
        damageModal.classList.add('hidden');
    }

    cancelDamageBtn.addEventListener('click', closeDamageModal);

    saveDamageBtn.addEventListener('click', () => {
        const description = damageDescription.value.trim();
        if (!description) {
            damageError.classList.remove('hidden');
            return;
        }

        const color = getRandomColor();
        damages.push({ ...currentClickPosition, description, color });
        renderDamages(carDiagramContainer, damageList);
        closeDamageModal();
    });

    // estado inicial
    renderDamages(carDiagramContainer, damageList);
}

function renderDamages(carDiagramContainer, damageList) {
    carDiagramContainer.querySelectorAll('.damage-marker').forEach((marker) => marker.remove());

    damageList.innerHTML = '';
    if (damages.length === 0) {
        damageList.innerHTML = '<li class="text-gray-400 italic">Nenhuma avaria registrada.</li>';
        return;
    }

    damages.forEach((damage) => {
        const marker = document.createElement('div');
        marker.className = 'damage-marker';
        marker.style.left = `${damage.x}%`;
        marker.style.top = `${damage.y}%`;
        marker.style.backgroundColor = damage.color;
        marker.title = damage.description;
        carDiagramContainer.appendChild(marker);

        const listItem = document.createElement('li');
        listItem.className = 'flex items-center';

        const colorDot = document.createElement('span');
        colorDot.className = 'w-3 h-3 rounded-full mr-2 flex-shrink-0';
        colorDot.style.backgroundColor = damage.color;

        listItem.appendChild(colorDot);
        listItem.append(damage.description);
        damageList.appendChild(listItem);
    });
}
