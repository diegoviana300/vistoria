export function setupPrint() {
    // Expor para uso pelos botões com onclick="..."
    window.imprimir = imprimir;
    window.clearForm = clearForm;
}

function imprimir() {
    // Cidade e data
    const cidadeInput = document.getElementById('cidade-input');
    const dataInputEl = document.getElementById('data-input');

    const cidade = (cidadeInput && cidadeInput.value) || '________________';
    const dataInput = dataInputEl && dataInputEl.value;

    let dataFormatada = '____ / ____ / ________';
    if (dataInput) {
        const [ano, mes, dia] = dataInput.split('-');
        dataFormatada = `${dia} / ${mes} / ${ano}`;
    }

    const cidadePrint = document.getElementById('cidade-print');
    const dataPrint = document.getElementById('data-print');

    if (cidadePrint) cidadePrint.textContent = cidade;
    if (dataPrint) dataPrint.textContent = dataFormatada;

    // Galeria de fotos
    const preview = document.getElementById('photo-gallery-preview');
    const printGallery = document.getElementById('photo-gallery-print');

    if (preview && printGallery) {
        printGallery.innerHTML = '';
        const images = preview.querySelectorAll('img');

        images.forEach((img, index) => {
            const item = document.createElement('div');
            item.className = 'photo-print-item';

            const imgClone = img.cloneNode();
            const title = document.createElement('p');
            title.textContent = `Foto ${index + 1}`;

            item.appendChild(imgClone);
            item.appendChild(title);
            printGallery.appendChild(item);
        });
    }

    // Observações
    const observacoesTextArea = document.getElementById('observacoes-textarea');
    const observacoesPrintDiv = document.getElementById('observacoes-print');

    if (observacoesTextArea && observacoesPrintDiv) {
        observacoesPrintDiv.textContent = observacoesTextArea.value || '';
    }

    window.print();
}

function clearForm() {
    if (confirm('Tem certeza que deseja limpar todos os campos e avarias registradas? Esta ação não pode ser desfeita.')) {
        location.reload();
    }
}
