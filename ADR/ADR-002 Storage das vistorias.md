```markdown
# ADR – Persistência de vistorias em localStorage e reabertura via modal

## Status

- Status: **Aprovado**
- Data: 2025-11-17
- Escopo: Ficha de Vistoria Veicular (frontend estático)

---

## Contexto

A ficha de vistoria hoje funciona apenas em **memória do navegador**:

- Se o usuário recarrega a página ou fecha o navegador, os dados da vistoria são perdidos.
- Em operações reais, o vistoriador pode:
  - Preencher parte da ficha, ser interrompido e precisar retomar depois.
  - Trabalhar com mais de um veículo em sequência (múltiplas vistorias no mesmo dia).
- Não há mecanismo nativo para:
  - **Salvar** uma vistoria com base na placa/nome do veículo.
  - **Listar** vistorias anteriores e **carregar** para ajuste ou reimpressão.
- Não existe backend nem banco de dados: o projeto é **100% estático**, servindo apenas HTML/CSS/JS via GitHub Pages ou servidor estático simples.

Diante disso, precisamos de uma solução **local**, simples e que não exija infraestrutura extra.

---

## Decisão

Utilizar **localStorage** do navegador para:

1. **Salvar vistorias** localmente usando:
   - **Placa** + **nome do veículo** como “chave lógica”.
2. **Listar vistorias salvas** em um **modal**:
   - Exibir placa, veículo, cidade e data de atualização.
   - Permitir **Carregar** (preenche o formulário atual).
   - Permitir **Excluir** (remove do localStorage).
3. Expor essa funcionalidade via interface mínima:
   - Dois botões com **ícones apenas** (sem texto) na barra de ações:
     - Ícone de disquete → salvar vistoria.
     - Ícone de lista → abrir modal de vistorias salvas.

---

## Detalhes da implementação

### 1. LocalStorage

- Chave usada no `localStorage`:

!!!text
vistoriaRecords
!!!

- Estrutura salva (lista de registros):

!!!json
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
!!!

- `key` (chave lógica) = `(placa + "|" + veiculo).toUpperCase()`
  - Se já existir registro com a mesma chave, a vistoria é **atualizada**.
  - Se não existir, é criado um novo registro.

### 2. Dados incluídos na persistência

Incluídos:

- Identificação do veículo:
  - Autos nº
  - Veículo
  - Placa
  - Km
- Local e data:
  - Cidade
  - Data da apreensão
- Observações gerais
- Responsáveis:
  - Vistoriador (nome e matrícula)
  - Proprietário/possuidor (nome e CPF)
  - Responsável pelo recolhimento (nome e CPF/CNPJ)
- Checklists:
  - Estado de todos os `checkboxes`
  - Estado de todos os `radios`
  - Valores dos `textInputs` e `number` dentro da seção de checklists

**Deliberadamente NÃO incluídos nesta fase:**

- Assinaturas (imagens base64).
- Fotos anexadas (imagens base64).
- Avarias no diagrama do carro (marcações e lista descritiva).

Motivo: imagens base64 consomem bastante espaço no `localStorage`, e o primeiro objetivo é garantir **persistência leve de dados textuais**.

### 3. Interface (botões com ícone)

Foram adicionados dois botões apenas com ícone (sem texto), na área abaixo do formulário:

- `#save-vistoria-btn`
  - Ícone de disquete
  - Ação: coleta dados do formulário + escreve/atualiza em `vistoriaRecords`.
- `#list-vistorias-btn`
  - Ícone de lista
  - Ação: abre o modal de listagem.

Ambos são **no-print** e com `title` para acessibilidade:

- `title="Salvar vistoria"`
- `title="Vistorias salvas"`

### 4. Modal de vistorias salvas

Elemento `#vistorias-modal`:

- Corpo com `#vistorias-list` (conteúdo gerado via JS).
- Botão `#vistorias-close` para fechar.
- Fecha também clicando no **fundo escuro**.

A listagem usa uma `<table>` simples:

- Colunas:
  - Placa
  - Veículo
  - Cidade
  - Atualizado em (formatado `dd/MM/yyyy HH:mm`)
  - Ações:
    - **Carregar**: aplica os dados no formulário atual.
    - **Excluir**: remove o registro e recarrega a lista.

### 5. Módulo dedicado

Toda a lógica de persistência foi isolada em:

!!!text
js/vistoriaStorage.js
!!!

Com uma função principal:

!!!js
export function initVistoriaStorage() {
  // ligação com botões, modal e localStorage
}
!!!

E é inicializada em:

!!!js
import { initVistoriaStorage } from "./vistoriaStorage.js";

document.addEventListener("DOMContentLoaded", () => {
  // ...
  initVistoriaStorage();
});
!!!

---

## Alternativas consideradas

1. **Não persistir nada (estado apenas em memória)**
   - Simples, mas frágil.
   - Qualquer recarga ou fechamento de aba perde a vistoria.

2. **Persistir em `sessionStorage`**
   - Sobrevive a refresh, mas não a fechamento do navegador.
   - Para cenário de vistoria em dias diferentes, não resolve.

3. **Criar backend / API REST e gravar em banco**
   - Seria o ideal institucionalmente, mas foge totalmente do escopo atual:
     - Requer servidor, autenticação, segurança, etc.
   - A ficha foi desenhada para rodar em **GitHub Pages** / **puro estático**.

Foi escolhida a opção **localStorage** como compromisso entre:

- Zero infraestrutura extra.
- Persistência razoável no dispositivo local.
- Simplicidade de implementação.

---

## Consequências

### Positivas

- Vistoriador pode:
  - Salvar o estado atual da vistoria e continuar depois.
  - Alternar entre vistorias de diferentes veículos.
- Reutilização:
  - Reabrir vistoria antiga para reimprimir ou ajustar detalhes.
- Nenhuma dependência externa (funciona offline e em GitHub Pages).
- A responsabilidade de persistência está **isolada** em `vistoriaStorage.js`:
  - Facilita testes futuros.
  - Facilita troca por outro mecanismo (ex.: API) no futuro.

### Negativas / Limitações

- Persistência é **local por navegador**:
  - Se o usuário trocar de dispositivo ou navegador, não enxerga as vistorias salvas no outro.
- `localStorage` tem limite de espaço (~5MB por origem):
  - Se começarmos a salvar imagens (assinaturas/fotos) sem critério, podemos estourar o limite.
- Não há:
  - Controle de versão dos dados.
  - Criptografia (dados ficam visíveis via DevTools).
- Se o HTML mudar muito (adição/remoção de campos no checklist), o mapeamento por índice pode ficar inconsistente para vistorias antigas.

---

## Próximos passos possíveis

- Persistência opcional de:
  - Avarias (lista + coordenadas).
  - Assinaturas (com compressão ou limite).
  - Metadados das fotos (sem necessariamente guardar a imagem).
- Botão de **exportar** vistoria (JSON) para permitir backup externo.
- Estratégia de **migração** de estrutura em caso de novas versões (ex.: `schemaVersion` por registro).
- Tela de “Configuração avançada” para:
  - Limpar todas as vistorias salvas.
  - Definir limite de vistorias.
  - Exportar/importar lote de vistorias.

---

