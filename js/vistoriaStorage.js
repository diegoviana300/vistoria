const STORAGE_KEY = "vistoriaRecords";

export function initVistoriaStorage() {
    const saveBtn = document.getElementById("save-vistoria-btn");
    const listBtn = document.getElementById("list-vistorias-btn");
    const modal = document.getElementById("vistorias-modal");
    const listContainer = document.getElementById("vistorias-list");
    const closeBtn = document.getElementById("vistorias-close");

    if (!saveBtn || !listBtn || !modal || !listContainer || !closeBtn) {
        console.warn("VistoriaStorage: elementos de DOM não encontrados, módulo não inicializado.");
        return;
    }

    saveBtn.addEventListener("click", onSaveClick);
    listBtn.addEventListener("click", () => openModal(modal, listContainer));
    closeBtn.addEventListener("click", () => closeModal(modal));

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
}

// --------- CRUD no localStorage ---------

function loadRecords() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed;
    } catch (err) {
        console.warn("VistoriaStorage: erro ao ler do localStorage", err);
        return [];
    }
}

function saveRecords(records) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
        return true;
    } catch (err) {
        console.warn("VistoriaStorage: erro ao salvar no localStorage", err);
        alert("Não foi possível salvar a vistoria (limite de armazenamento atingido?).");
        return false;
    }
}

// --------- Coleta e aplicação dos dados ---------

function getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value : "";
}

function setVal(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value || "";
}

function collectVistoriaData() {
    const autos = getVal("autos-numero");
    const veiculo = getVal("veiculo-nome");
    const placa = getVal("veiculo-placa");
    const km = getVal("veiculo-km");

    const observacoes = getVal("observacoes-textarea");
    const cidade = getVal("cidade-input");
    const dataApreensao = getVal("data-input");

    const respVistoriadorNome = getVal("resp-vistoriador-nome");
    const respVistoriadorMatricula = getVal("resp-vistoriador-matricula");
    const respProprietarioNome = getVal("resp-proprietario-nome");
    const respProprietarioCpf = getVal("resp-proprietario-cpf");
    const respRecolhimentoNome = getVal("resp-recolhimento-nome");
    const respRecolhimentoDoc = getVal("resp-recolhimento-doc");

    const checklistCheckboxes = Array.from(
        document.querySelectorAll("#checklists input[type='checkbox']")
    ).map((cb) => cb.checked);

    const checklistRadios = Array.from(
        document.querySelectorAll("#checklists input[type='radio']")
    ).map((rb) => rb.checked);

    const checklistTextInputs = Array.from(
        document.querySelectorAll("#checklists input[type='text'], #checklists input[type='number']")
    ).map((inp) => inp.value);

    return {
        meta: {
            autos,
            veiculo,
            placa,
            km,
            cidade,
            dataApreensao
        },
        form: {
            autos,
            veiculo,
            placa,
            km,
            observacoes,
            cidade,
            dataApreensao,
            responsaveis: {
                vistoriadorNome: respVistoriadorNome,
                vistoriadorMatricula: respVistoriadorMatricula,
                proprietarioNome: respProprietarioNome,
                proprietarioCpf: respProprietarioCpf,
                recolhimentoNome: respRecolhimentoNome,
                recolhimentoDoc: respRecolhimentoDoc
            },
            checklist: {
                checkboxes: checklistCheckboxes,
                radios: checklistRadios,
                textInputs: checklistTextInputs
            }
        }
        // OBS: não estamos salvando fotos, assinaturas nem avarias ainda
    };
}

function applyVistoriaData(data) {
    if (!data || !data.form) return;

    const { form } = data;

    setVal("autos-numero", form.autos);
    setVal("veiculo-nome", form.veiculo);
    setVal("veiculo-placa", form.placa);
    setVal("veiculo-km", form.km);

    setVal("observacoes-textarea", form.observacoes);
    setVal("cidade-input", form.cidade);
    setVal("data-input", form.dataApreensao);

    const resp = form.responsaveis || {};
    setVal("resp-vistoriador-nome", resp.vistoriadorNome);
    setVal("resp-vistoriador-matricula", resp.vistoriadorMatricula);
    setVal("resp-proprietario-nome", resp.proprietarioNome);
    setVal("resp-proprietario-cpf", resp.proprietarioCpf);
    setVal("resp-recolhimento-nome", resp.recolhimentoNome);
    setVal("resp-recolhimento-doc", resp.recolhimentoDoc);

    // Checklists – reaplica pelo índice (ordem atual do DOM)
    const checkboxes = Array.from(
        document.querySelectorAll("#checklists input[type='checkbox']")
    );
    const radios = Array.from(
        document.querySelectorAll("#checklists input[type='radio']")
    );
    const textInputs = Array.from(
        document.querySelectorAll("#checklists input[type='text'], #checklists input[type='number']")
    );

    if (form.checklist) {
        const cbVals = form.checklist.checkboxes || [];
        const rbVals = form.checklist.radios || [];
        const txtVals = form.checklist.textInputs || [];

        checkboxes.forEach((cb, idx) => {
            cb.checked = !!cbVals[idx];
        });

        radios.forEach((rb, idx) => {
            rb.checked = !!rbVals[idx];
        });

        textInputs.forEach((inp, idx) => {
            inp.value = txtVals[idx] || "";
        });
    }
}

// --------- Handlers UI ---------

function onSaveClick() {
    const data = collectVistoriaData();
    const placa = (data.meta.placa || "").trim();
    const veiculo = (data.meta.veiculo || "").trim();

    if (!placa && !veiculo) {
        alert("Preencha pelo menos a PLACA ou o NOME DO VEÍCULO antes de salvar.");
        return;
    }

    const nowIso = new Date().toISOString();
    let records = loadRecords();

    // chave de identidade: placa + veiculo em maiúsculas
    const key = (placa + "|" + veiculo).toUpperCase();

    let existing = records.find((r) => r.key === key);

    if (existing) {
        existing.data = data;
        existing.meta = {
            ...data.meta,
            key,
            updatedAt: nowIso,
            createdAt: existing.meta.createdAt || nowIso
        };
    } else {
        records.push({
            key,
            meta: {
                ...data.meta,
                key,
                createdAt: nowIso,
                updatedAt: nowIso
            },
            data
        });
    }

    if (saveRecords(records)) {
        alert("Vistoria salva com sucesso.");
    }
}

function openModal(modal, listContainer) {
    const records = loadRecords();

    listContainer.innerHTML = "";

    if (!records.length) {
        listContainer.innerHTML =
            '<p class="text-gray-500 text-sm">Nenhuma vistoria salva.</p>';
        modal.classList.remove("hidden");
        return;
    }

    const table = document.createElement("table");
    table.className = "min-w-full text-left border border-gray-200";

    const thead = document.createElement("thead");
    thead.innerHTML = `
        <tr class="bg-gray-100 text-xs uppercase text-gray-600">
            <th class="px-2 py-2 border-b">Placa</th>
            <th class="px-2 py-2 border-b">Veículo</th>
            <th class="px-2 py-2 border-b">Cidade</th>
            <th class="px-2 py-2 border-b">Atualizado em</th>
            <th class="px-2 py-2 border-b text-right">Ações</th>
        </tr>
    `;

    const tbody = document.createElement("tbody");

    records.forEach((r, idx) => {
        const tr = document.createElement("tr");
        tr.className = idx % 2 === 0 ? "bg-white" : "bg-gray-50";

        const placa = (r.meta.placa || "").toUpperCase();
        const veiculo = r.meta.veiculo || "";
        const cidade = r.meta.cidade || "";
        const updatedAt = formatDateTime(r.meta.updatedAt);

        tr.innerHTML = `
            <td class="px-2 py-1 border-b text-xs">${placa || "-"}</td>
            <td class="px-2 py-1 border-b text-xs">${veiculo || "-"}</td>
            <td class="px-2 py-1 border-b text-xs">${cidade || "-"}</td>
            <td class="px-2 py-1 border-b text-xs">${updatedAt}</td>
            <td class="px-2 py-1 border-b text-xs text-right"></td>
        `;

        const actionsTd = tr.querySelector("td:last-child");

        const loadBtn = document.createElement("button");
        loadBtn.className =
            "inline-flex items-center px-2 py-1 mr-1 border rounded text-xs text-teal-700 border-teal-600 hover:bg-teal-50";
        loadBtn.textContent = "Carregar";
        loadBtn.addEventListener("click", () => {
            applyVistoriaData(r.data);
            modal.classList.add("hidden");
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.className =
            "inline-flex items-center px-2 py-1 border rounded text-xs text-red-700 border-red-500 hover:bg-red-50";
        deleteBtn.textContent = "Excluir";
        deleteBtn.addEventListener("click", () => {
            if (confirm("Confirma excluir esta vistoria salva?")) {
                const updated = loadRecords().filter((rec) => rec.key !== r.key);
                saveRecords(updated);
                openModal(modal, listContainer); // recarrega a lista
            }
        });

        actionsTd.appendChild(loadBtn);
        actionsTd.appendChild(deleteBtn);

        tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    listContainer.appendChild(table);

    modal.classList.remove("hidden");
}

function closeModal(modal) {
    modal.classList.add("hidden");
}

function formatDateTime(iso) {
    if (!iso) return "-";
    try {
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return "-";
        const dia = String(d.getDate()).padStart(2, "0");
        const mes = String(d.getMonth() + 1).padStart(2, "0");
        const ano = d.getFullYear();
        const hora = String(d.getHours()).padStart(2, "0");
        const min = String(d.getMinutes()).padStart(2, "0");
        return `${dia}/${mes}/${ano} ${hora}:${min}`;
    } catch {
        return "-";
    }
}
