export function initPhotos() {
    const uploadInput = document.getElementById('photo-upload');
    const preview = document.getElementById('photo-gallery-preview');

    if (!uploadInput || !preview) {
        console.warn('Photos: elementos de DOM não encontrados, pulando init.');
        return;
    }

    uploadInput.addEventListener('change', (event) => {
        const files = event.target.files;
        if (!files || !files.length) return;

        for (const file of files) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const wrapper = document.createElement('div');
                wrapper.className = 'relative p-2 border rounded-lg shadow';

                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'w-full h-auto object-cover rounded-lg';

                const removeBtn = document.createElement('button');
                removeBtn.innerHTML = '&times;';
                removeBtn.className = 'absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold';
                removeBtn.onclick = () => {
                    wrapper.remove();
                };

                wrapper.appendChild(img);
                wrapper.appendChild(removeBtn);
                preview.appendChild(wrapper);
            };
            reader.readAsDataURL(file);
        }

        event.target.value = '';
    });
}
