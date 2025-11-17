const GRUPOS = {
    "Cyber": {
        "email": "cybergaeco@mpsc.mp.br",
        "cidade": "São José",
        "regiao": "Cyber",
        "nome_g_regional": "CyberGAECO",
        "endereco": "R. Manoel Loureiro, 1938, edifício Mercury, 5º Andar. sala 501 - Barreiros, São José - SC, 88117-331."
    },
    "Capital": {
        "email": "gaecocapital@mpsc.mp.br",
        "cidade": "Florianópolis",
        "regiao": "Capital",
        "nome_g_regional": "GAECO da Capital",
        "endereco": "R. Manoel Loureiro, 1938, edifício Mercury, 5º Andar. sala 501 - Barreiros, São José - SC, 88117-331."
    },
    "Itajaí": {
        "email": "gaecoitajai@mpsc.mp.br",
        "cidade": "Itajaí",
        "regiao": "Itajaí",
        "nome_g_regional": "GAECO de Itajaí",
        "endereco": "Rua Brusque, n. 1224 - centro- CEP 88.303-001 Itajaí/SC"
    },
    "Joinville": {
        "email": "gaecojoinville@mpsc.mp.br",
        "cidade": "Joinville",
        "regiao": "Joinville",
        "nome_g_regional": "GAECO de Joinville",
        "endereco": "Rua Dona Francisca, 1020, Saguaçu - Joinville/SC CEP 89221-006"
    },
    "Lages": {
        "email": "gaecolages@mpsc.mp.br",
        "cidade": "Lages",
        "regiao": "Lages",
        "nome_g_regional": "GAECO de Lages",
        "endereco": "R. James Roberto Amós, 280, sala 110, 1º andar - Centro, Lages - SC, 88502-320"
    },
    "Chapecó": {
        "email": "gaecochapeco@mpsc.mp.br",
        "cidade": "Chapecó",
        "regiao": "Chapecó",
        "nome_g_regional": "GAECO de Chapecó",
        "endereco": "Rua Curitiba 74, centro,Chapecó/SC CEP 89801-341"
    },
    "Criciúma": {
        "email": "gaecocriciuma@mpsc.mp.br",
        "cidade": "Criciúma",
        "regiao": "Criciúma",
        "nome_g_regional": "GAECO de Criciúma",
        "endereco": "Rua Giacomo Sonego Neto, 379, Pinheirinho, Criciúma/SC CEP 88804-440"
    },
    "Blumenau": {
        "email": "gaecoblumenau@mpsc.mp.br",
        "cidade": "Blumenau",
        "regiao": "Blumenau",
        "nome_g_regional": "GAECO de Blumenau",
        "endereco": "Rua Marechal Deodoro, 100, 6º andar, Velha, Blumenau/SC CEP 89036-300"
    },
    "São Miguel do Oeste": {
        "email": "gaecosmo@mpsc.mp.br",
        "cidade": "São Miguel do Oeste",
        "regiao": "São Miguel do Oeste",
        "nome_g_regional": "GAECO de São Miguel do Oeste",
        "endereco": "Rua 1º de janeiro, 416, centro - São Miguel do Oeste/SC CEP 89900-000."
    },
    "Coordenação": {
        "email": "gaeco@mpsc.mp.br",
        "cidade": "Florianópolis",
        "regiao": "Coordenação",
        "nome_g_regional": "Coordenação Estadual",
        "endereco": "R. Bocaiúva, 1750, 4 andar - Centro, Florianópolis - SC, 88015-904"
    }
};

const DEFAULT_INST_NOME = "GRUPO DE ATUAÇÃO ESPECIAL DE COMBATE ÀS ORGANIZAÇÕES CRIMINOSAS - GAECO";
const DEFAULT_HEADER_LOGO = "imagem/logo_mpsc.png";
const DEFAULT_FOOTER_LOGO = "imagem/gaeco2.bmp";

// CHAVE DO LOCALSTORAGE
const STORAGE_KEY = "vistoriaConfig";

export function initConfig() {
    // elementos dinâmicos
    const headerLogo = document.getElementById("header-logo");
    const printHeaderLogo = document.getElementById("print-header-logo");
    const footerLogo = document.getElementById("footer-logo");

    const instNomeEl = document.getElementById("inst-nome");
    const printInstNomeEl = document.getElementById("print-inst-nome");
    const regionalNomeEl = document.getElementById("regional-nome");
    const printRegionalNomeEl = document.getElementById("print-regional-nome");

    const footerEnderecoEl = document.getElementById("footer-endereco");
    const footerEmailEl = document.getElementById("footer-email");
    const cidadeInput = document.getElementById("cidade-input");

    // elementos do modal
    const configButton = document.getElementById("config-button");
    const configModal = document.getElementById("config-modal");
    const grupoSelect = document.getElementById("config-grupo");
    const headerLogoInput = document.getElementById("config-header-logo");
    const footerLogoInput = document.getElementById("config-footer-logo");
    const instNomeInput = document.getElementById("config-inst-nome");
    const cancelBtn = document.getElementById("config-cancel");
    const saveBtn = document.getElementById("config-save");

    if (!configButton || !configModal || !grupoSelect) {
        console.warn("Config: elementos de configuração não encontrados, módulo não inicializado.");
        return;
    }

    // Preenche opções de grupo no select
    Object.keys(GRUPOS).forEach((key) => {
        const opt = document.createElement("option");
        opt.value = key;
        opt.textContent = key;
        grupoSelect.appendChild(opt);
    });

    // Lê config do localStorage (se existir)
    let stored = null;
    try {
        stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch {
        stored = null;
    }

    let currentConfig = {
        groupKey: (stored && stored.groupKey) || "Itajaí",
        headerLogo: (stored && stored.headerLogo) || DEFAULT_HEADER_LOGO,
        footerLogo: (stored && stored.footerLogo) || DEFAULT_FOOTER_LOGO,
        instNome: (stored && stored.instNome) || DEFAULT_INST_NOME
    };

    function applyConfig() {
        const group = GRUPOS[currentConfig.groupKey] || GRUPOS["Itajaí"];

        // logos
        if (headerLogo) headerLogo.src = currentConfig.headerLogo;
        if (printHeaderLogo) printHeaderLogo.src = currentConfig.headerLogo;
        if (footerLogo) footerLogo.src = currentConfig.footerLogo;

        // nome instituição
        if (instNomeEl) instNomeEl.textContent = currentConfig.instNome;
        if (printInstNomeEl) printInstNomeEl.textContent = currentConfig.instNome;

        // nome grupo regional
        const regionalText = group.nome_g_regional || `GRUPO REGIONAL DE ${group.regiao}`;
        if (regionalNomeEl) regionalNomeEl.textContent = regionalText;
        if (printRegionalNomeEl) printRegionalNomeEl.textContent = regionalText;

        // endereço e e-mail
        if (footerEnderecoEl) footerEnderecoEl.textContent = group.endereco;
        if (footerEmailEl) footerEmailEl.textContent = `E-mail: ${group.email}`;

        // cidade padrão (se vazio)
        if (cidadeInput && !cidadeInput.value) {
            cidadeInput.value = group.cidade;
        }

        // fundo branco
        document.body.classList.remove("bg-stone-100");
        document.body.classList.add("bg-white");
    }

    applyConfig();

    function openModal() {
        grupoSelect.value = currentConfig.groupKey;
        headerLogoInput.value = currentConfig.headerLogo;
        footerLogoInput.value = currentConfig.footerLogo;
        instNomeInput.value = currentConfig.instNome;
        configModal.classList.remove("hidden");
    }

    function closeModal() {
        configModal.classList.add("hidden");
    }

    configButton.addEventListener("click", (e) => {
        e.preventDefault();
        openModal();
    });

    cancelBtn.addEventListener("click", (e) => {
        e.preventDefault();
        closeModal();
    });

    saveBtn.addEventListener("click", (e) => {
        e.preventDefault();

        const selectedGroup = grupoSelect.value;

        currentConfig = {
            groupKey: GRUPOS[selectedGroup] ? selectedGroup : "Itajaí",
            headerLogo: headerLogoInput.value || DEFAULT_HEADER_LOGO,
            footerLogo: footerLogoInput.value || DEFAULT_FOOTER_LOGO,
            instNome: instNomeInput.value || DEFAULT_INST_NOME
        };

        // AQUI É A PARTE QUE A DOC PROMETEU
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(currentConfig));
        } catch (err) {
            console.warn("Config: não foi possível salvar no localStorage", err);
        }

        applyConfig();
        closeModal();
    });

    // Fecha modal clicando fora
    configModal.addEventListener("click", (e) => {
        if (e.target === configModal) {
            closeModal();
        }
    });
}
