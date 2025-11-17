let signaturePad;
let currentSignatureTargetId = null;

export function initSignatures() {
    const signatureModal = document.getElementById('signature-modal');
    const canvas = document.getElementById('signature-pad');
    const clearSignatureBtn = document.getElementById('clear-signature');
    const saveSignatureBtn = document.getElementById('save-signature');
    const closeSignatureBtn = document.getElementById('close-signature');

    if (!signatureModal || !canvas || !clearSignatureBtn || !saveSignatureBtn || !closeSignatureBtn) {
        console.warn('Signatures: elementos de DOM não encontrados, pulando init.');
        return;
    }

    if (typeof SignaturePad === 'undefined') {
        console.error('Signatures: biblioteca SignaturePad não carregada.');
        return;
    }

    signaturePad = new SignaturePad(canvas, {
        backgroundColor: 'rgba(255, 255, 255, 0)'
    });

    function resizeCanvas() {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext('2d').scale(ratio, ratio);
        signaturePad.clear();
    }

    window.addEventListener('resize', resizeCanvas);

    window.addEventListener('orientationchange', () => {
        if (!signatureModal.classList.contains('hidden')) {
            signatureModal.classList.add('hidden');
            setTimeout(() => {
                signatureModal.classList.remove('hidden');
                resizeCanvas();
            }, 100);
        }
    });

    // Mantemos compatível com onclick="openSignatureModal('vistoriador')"
    window.openSignatureModal = (targetId) => {
        currentSignatureTargetId = targetId;
        signatureModal.classList.remove('hidden');
        setTimeout(() => {
            resizeCanvas();
        }, 10);
    };

    closeSignatureBtn.addEventListener('click', () => {
        signatureModal.classList.add('hidden');
    });

    clearSignatureBtn.addEventListener('click', () => {
        signaturePad.clear();
    });

    saveSignatureBtn.addEventListener('click', () => {
        if (signaturePad.isEmpty()) {
            alert('Por favor, forneça uma assinatura.');
            return;
        }

        const dataURL = signaturePad.toDataURL('image/png');
        const targetDiv = document.getElementById(`signature-display-${currentSignatureTargetId}`);

        if (!targetDiv) {
            console.warn('Signatures: elemento de destino não encontrado para', currentSignatureTargetId);
            signatureModal.classList.add('hidden');
            return;
        }

        targetDiv.innerHTML = `<img src="${dataURL}" alt="Assinatura" class="mx-auto h-full object-contain signature-image"/>`;

        const buttonContainer = targetDiv.parentElement.querySelector('.border-t-2');
        const button = buttonContainer ? buttonContainer.querySelector('button') : null;
        if (button) {
            button.textContent = '[ Refazer ]';
        }

        signatureModal.classList.add('hidden');
        makeDraggable();
    });
}

function makeDraggable() {
    const signatures = document.querySelectorAll('.signature-display');

    signatures.forEach((signature) => {
        let isDragging = false;
        let offsetX;
        let offsetY;

        const startDrag = (e) => {
            isDragging = true;
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);
            offsetX = clientX - signature.offsetLeft;
            offsetY = clientY - signature.offsetTop;
            signature.style.cursor = 'grabbing';
        };

        const drag = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);
            signature.style.left = `${clientX - offsetX}px`;
            signature.style.top = `${clientY - offsetY}px`;
        };

        const stopDrag = () => {
            isDragging = false;
            signature.style.cursor = 'move';
        };

        signature.addEventListener('mousedown', startDrag);
        signature.addEventListener('touchstart', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchend', stopDrag);
    });
}
