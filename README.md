# 🚗 Ficha de Vistoria Veicular Interativa

Aplicação web estática para preenchimento, registro e impressão de **fichas de vistoria veicular**, com:

- Marcações interativas de avarias no diagrama do veículo
- Upload de fotos anexadas
- Campo de observações
- Assinaturas digitais (vistoriador, proprietário e responsável pelo recolhimento)
- Layout preparado para impressão em formato A4 (PDF)
- Configuração de **grupos regionais, logos e identidade visual**
- **Persistência local de vistorias** usando `localStorage`

Criado e mantido por **Diego Viana** – [@diegoviana300](https://github.com/diegoviana300).

---

## 🧭 Fases do projeto

### 🟢 Fase 1 – Ficha digital e impressão

- Estrutura básica da ficha:
  - Identificação do veículo.
  - Checklists de itens, funcionamento e acessórios.
  - Observações gerais.
  - Responsáveis e assinaturas.
  - Fotografias anexadas.
- Diagrama de avarias:
  - Clique no veículo para marcar avarias.
  - Marcadores coloridos e lista de avarias.
- Impressão:
  - Layout preparado para **A4 retrato**.
  - Botão **“Imprimir / PDF”** para gerar PDF via navegador.

### 🟡 Fase 2 – Identidade visual e grupos regionais

- Botão de engrenagem no cabeçalho para **Configurações**.
- Seleção de **grupo regional** a partir de um JSON estático (Cyber, Capital, Itajaí, Joinville, Lages, Chapecó, Criciúma, Blumenau, São Miguel do Oeste, Coordenação).
- Troca dinâmica de:
  - Nome do grupo regional (tela e versão de impressão).
  - Endereço e e-mail no rodapé.
  - Logos de cabeçalho e rodapé.
  - Nome da instituição (linha superior).
- Fundo da página padronizado para **branco**.
- Configurações persistidas em `localStorage` (`vistoriaConfig`).

### 🔴 Fase 3 – Persistência local de vistorias

- Botão **Salvar vistoria** (ícone de disquete).
- Botão **Vistorias salvas** (ícone de lista).
- Salvamento de vistorias em `localStorage` (`vistoriaRecords`):
  - Base de identificação: **placa + nome do veículo**.
  - Permite **criar, atualizar, listar, carregar e excluir** vistorias locais.
- Modal de listagem com:
  - Placa, veículo, cidade, data de atualização.
  - Ações: **Carregar** e **Excluir**.

---

## 🧱 Tecnologias

- **HTML5** + **Tailwind CSS** (via CDN)
- **JavaScript (ES Modules)**
- [signature_pad](https://github.com/szimek/signature_pad) para assinatura digital
- Nenhum backend, nenhum build step: apenas arquivos estáticos (perfeito para GitHub Pages)

### Estrutura de pastas (sugerida)

```text
vistoria/
├── index.html
├── css/
│   └── styles.css
└── js/
    ├── app.js
    ├── config.js          # Fase 2 – identidade visual / grupos
    ├── vistoriaStorage.js # Fase 3 – persistência local
    ├── signatures.js
    ├── damageMap.js
    ├── photos.js
    └── print.js
```

---

## ▶️ Como rodar localmente (Python)

> Requer: **Python 3** instalado.

1. Clonar o repositório:

```bash
git clone https://github.com/diegoviana300/vistoria.git
cd vistoria
```

2. Subir um servidor HTTP simples com Python:

```bash
python3 -m http.server 8000
```

3. Acessar no navegador:

```text
http://localhost:8000/index.html
```

> Importante: **não** abra o arquivo direto via `file://`.
> Como o projeto usa `type="module"` nos scripts, o navegador exige que seja servido via `http://` (servidor local ou GitHub Pages).

---

## 🌐 Publicando no GitHub Pages (GitHub.io)

Como o projeto é 100% estático, roda direto em **GitHub Pages**.

Supondo o repositório:

```text
https://github.com/diegoviana300/vistoria
```

a URL pública tende a ser:

```text
https://diegoviana300.github.io/vistoria/
```

### Passo a passo

1. No GitHub, abrir o repositório `vistoria`.
2. Ir em **Settings** → menu lateral **Pages**.
3. Em **Source**:
   - Selecionar: `Deploy from a branch`
   - Branch: `main` (ou a branch padrão)
   - Folder: `/ (root)`
4. Clicar em **Save**.
5. Aguardar alguns minutos até o build terminar.
6. Acessar a URL exibida em **GitHub Pages** (algo como `https://<username>.github.io/vistoria/`).

---

## 📝 Uso da ficha (Fase 1)

1. **Identificação do veículo**
   - Preencher:
     - Autos nº (`autos-numero`)
     - Veículo (`veiculo-nome`)
     - Placa (`veiculo-placa`)
     - Km (`veiculo-km`)

2. **Checklists de vistoria**
   - Itens do veículo (chave, manual, rádio, TAG pedágio, tapetes, etc.).
   - Funcionamento (buzina, faróis, pisca-alerta, luz de freio, luz de ré, ar-condicionado, etc.).
   - Outros itens (macaco, triângulo, chave de roda, extintor, cintos, pneus, estepe, estado dos bancos).
   - Nível de combustível (R, ¼, ½, ¾, Cheio).

3. **Registro de avarias**
   - Clicar sobre o diagrama do carro.
   - Descrever a avaria na janela modal (ex.: “risco profundo”, “amassado lateral”).
   - Cada avaria gera:
     - Um marcador colorido no desenho.
     - Uma linha correspondente na lista de avarias.

4. **Observações gerais**
   - Campo livre (`observacoes-textarea`) para:
     - Informações sobre a operação.
     - Condições específicas do veículo.
     - Avisos mecânicos ou administrativos.
   - O conteúdo é replicado para um bloco específico na versão de impressão.

5. **Responsáveis e assinaturas**
   - Campos:
     - Policial responsável/vistoriador (`resp-vistoriador-nome`, `resp-vistoriador-matricula`).
     - Proprietário/possuidor (`resp-proprietario-nome`, `resp-proprietario-cpf`).
     - Responsável pelo recolhimento (`resp-recolhimento-nome`, `resp-recolhimento-doc`).
   - Botões `[ Assinar ]` abrem o modal de assinatura:
     - Assinatura desenhada em canvas via `signature_pad`.
     - A imagem é exibida sobre a linha de assinatura correspondente.

6. **Fotografias anexadas**
   - Botão “Adicionar Fotos”:
     - Desktop: seleção de arquivos.
     - Mobile: opção de câmera/galeria (dependendo do navegador).
   - Fotos são exibidas em grade para conferência.
   - Na impressão, são organizadas com legenda (“Foto 1”, “Foto 2”, etc.).

7. **Local e data da apreensão**
   - Campos:
     - Cidade (`cidade-input`)
     - Data (`data-input`)
   - Antes de imprimir, os valores são copiados para o texto final formatado.

8. **Imprimir / PDF**
   - Botão **“Imprimir / PDF”**:
     - Ajusta o layout para A4.
     - Monta a versão de impressão (observações, fotos, cabeçalho e rodapé).
     - Abre a caixa de diálogo de impressão (permite salvar em PDF).

9. **Limpar**
   - Botão **“Limpar”**:
     - Recarrega a página e reseta todos os campos.

---

## 🎛️ Configurações de identidade visual (Fase 2)

A ficha permite adaptar a identidade visual para diferentes grupos do GAECO.

### Botão de configuração

- Ícone de **engrenagem** no canto superior direito do cabeçalho:
  - ID: `config-button`.
  - Abre o modal de configurações (`config-modal`).

### Campos do modal

- `config-grupo` – seleção do grupo regional (carregado a partir de um objeto JSON em `config.js`).
- `config-header-logo` – caminho/URL da logo do cabeçalho (ex.: `imagem/logo_mpsc.png`).
- `config-footer-logo` – caminho/URL da logo do rodapé (ex.: `imagem/gaeco2.bmp`).
- `config-inst-nome` – nome da instituição (linha superior do cabeçalho).

### Grupos regionais

Os grupos são definidos em `config.js`:

```js
const GRUPOS = {
  "Itajaí": {
    email: "gaecoitajai@mpsc.mp.br",
    cidade: "Itajaí",
    regiao: "Itajaí",
    nome_g_regional: "GAECO de Itajaí",
    endereco: "Rua Brusque, n. 1224 - centro- CEP 88.303-001 Itajaí/SC"
  },
  "Chapecó": {
    email: "gaecochapeco@mpsc.mp.br",
    cidade: "Chapecó",
    regiao: "Chapecó",
    nome_g_regional: "GAECO de Chapecó",
    endereco: "Rua Curitiba 74, centro,Chapecó/SC CEP 89801-341"
  },
  // ... demais grupos
};
```

### O que muda ao trocar o grupo

Ao salvar as configurações:

- Cabeçalho:
  - `inst-nome` e `print-inst-nome` recebem o nome da instituição configurado.
  - `regional-nome` e `print-regional-nome` recebem `nome_g_regional` do grupo.
- Rodapé:
  - `footer-endereco` recebe `endereco`.
  - `footer-email` recebe `E-mail: ${email}`.
- Cidade:
  - Se `cidade-input` estiver vazio, passa a ser a `cidade` do grupo.
- Logos:
  - `header-logo` e `print-header-logo` usam o valor de `config-header-logo`.
  - `footer-logo` usa o valor de `config-footer-logo`.
- Fundo:
  - `bg-stone-100` é removido e `bg-white` é aplicado no `<body>`.

### Persistência das configurações (`vistoriaConfig`)

Configurações são salvas em:

```text
vistoriaConfig
```

Exemplo de conteúdo:

```json
{
  "groupKey": "Chapecó",
  "headerLogo": "imagem/logo_mpsc.png",
  "footerLogo": "imagem/gaeco2.bmp",
  "instNome": "GRUPO DE ATUAÇÃO ESPECIAL DE COMBATE ÀS ORGANIZAÇÕES CRIMINOSAS - GAECO"
}
```

Na inicialização, o módulo `config.js` lê `vistoriaConfig` e reaplica a configuração.

---

## 💾 Persistência de vistorias (Fase 3)

### Botões de ação (somente ícone)

- **Salvar vistoria**
  - ID: `save-vistoria-btn`
  - Ícone de disquete.
  - `title="Salvar vistoria"`
  - Coleta os dados do formulário e grava em `localStorage`.

- **Vistorias salvas**
  - ID: `list-vistorias-btn`
  - Ícone de lista.
  - `title="Vistorias salvas"`
  - Abre o modal com as vistorias armazenadas.

Ambos são `no-print` e ficam ao lado dos botões “Imprimir / PDF” e “Limpar”.

### O que é salvo

Os dados são salvos em:

```text
vistoriaRecords
```

Estrutura geral:

```json
[
  {
    "key": "ABC1234|ONIX LTZ",
    "meta": {
      "autos": "2024.000123-9",
      "veiculo": "Onix LTZ",
      "placa": "ABC1234",
      "km": "34567",
      "cidade": "Itajaí",
      "dataApreensao": "2025-11-17",
      "key": "ABC1234|ONIX LTZ",
      "createdAt": "2025-11-17T12:34:56.000Z",
      "updatedAt": "2025-11-17T12:40:00.000Z"
    },
    "data": {
      "meta": { ... },
      "form": {
        "autos": "...",
        "veiculo": "...",
        "placa": "...",
        "km": "...",
        "observacoes": "...",
        "cidade": "...",
        "dataApreensao": "...",
        "responsaveis": {
          "vistoriadorNome": "...",
          "vistoriadorMatricula": "...",
          "proprietarioNome": "...",
          "proprietarioCpf": "...",
          "recolhimentoNome": "...",
          "recolhimentoDoc": "..."
        },
        "checklist": {
          "checkboxes": [true, false, ...],
          "radios": [false, true, ...],
          "textInputs": ["...", "...", ...]
        }
      }
    }
  }
]
```

- `key` = `(placa + "|" + veiculo).toUpperCase()`
  - Se já existir registro com a mesma `key`, ele é **atualizado**.
  - Se não existir, um novo registro é inserido.

Incluídos na persistência:

- Identificação do veículo (autos, veículo, placa, km).
- Cidade e data da apreensão.
- Observações gerais.
- Responsáveis (vistoriador, proprietário, responsável pelo recolhimento).
- Checklists:
  - Estado de todos os `checkboxes`.
  - Estado de todos os `radios`.
  - Valores dos `textInputs` e `number` dentro de `#checklists`.

**Não são salvos (por enquanto):**

- Assinaturas (imagens base64).
- Fotos anexadas.
- Avarias do diagrama (marcadores e descrições).

### Modal de vistorias salvas

Elemento `#vistorias-modal`:

- Lista as vistorias em uma tabela com colunas:
  - Placa
  - Veículo
  - Cidade
  - Atualizado em
  - Ações

Para cada vistoria:

- **Carregar**
  - Preenche o formulário atual com os dados salvos.
  - Fecha o modal.

- **Excluir**
  - Confirma a ação.
  - Remove o registro de `vistoriaRecords`.
  - Recarrega a lista do modal.

---

## ⚠️ Limitações atuais

- Persistência é **local ao navegador**:
  - Vistorias não são compartilhadas entre dispositivos/usuários.
- `localStorage` tem limite de espaço (~5 MB):
  - Por isso imagens (assinaturas/fotos) ainda não entram na persistência.
- Mudanças profundas na estrutura do formulário podem exigir:
  - Migração de dados antigos.
  - Ajuste na forma de mapear os checklists (hoje por índice).

---

## 🗺️ Próximos passos (roadmap)

- Persistir (opcionalmente) avarias do diagrama.
- Estrutura de exportação/importação de vistorias (JSON).
- Persistência amigável de fotos (miniaturas ou apenas metadados).
- Controle de “versão de schema” para garantir compatibilidade em evoluções.

---

## 👨‍💻 Autor

**Diego Viana** – Desenvolvedor e criador da ficha de vistoria veicular.

- GitHub: [@diegoviana300](https://github.com/diegoviana300)

Sugestões, issues e PRs para melhorar UX, código e fluxo de trabalho são bem-vindos.
