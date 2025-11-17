# 🚗 Ficha de Vistoria Veicular Interativa

Aplicação web estática para preenchimento, registro e impressão de **fichas de vistoria veicular**, com:

- Marcações interativas de avarias em diagrama do veículo
- Upload de fotos anexadas
- Campo de observações
- Assinaturas digitais (vistoriador, proprietário e responsável pelo recolhimento)
- Layout preparado para impressão em formato A4 (PDF)

Repositório: `vistoria` – Ficha de Vistoria Veicular.
Criado e mantido por **Diego Viana** – [@diegoviana300](https://github.com/diegoviana300).

---

## 🧱 Tecnologias

- **HTML5** + **Tailwind CSS** (via CDN)
- **JavaScript (ES Modules)** puro
- [signature_pad](https://github.com/szimek/signature_pad) para assinatura digital
- Sem backend, sem build step: apenas arquivos estáticos

### Estrutura de pastas (sugerida)

```text
vistoria/
├── index.html
├── css/
│   └── styles.css
└── js/
    ├── app.js
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

> **Importante:** não abrir direto com `file://`.
> Como o projeto usa `type="module"` nos scripts, o navegador exige que seja servido via `http://` (servidor local ou GitHub Pages).

---

## 🌐 Publicando no GitHub Pages (GitHub.io)

Como o projeto é 100% estático, roda sem ajustes em **GitHub Pages**.

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
   - Branch: `main` (ou a branch padrão que estiver usando)
   - Folder: `/ (root)`
4. Clicar em **Save**.
5. Aguardar alguns minutos até o build terminar.
6. Verificar a URL exibida em **GitHub Pages** (normalmente `https://<username>.github.io/vistoria/`).

Depois disso, basta acessar a URL do GitHub Pages e usar a ficha diretamente no navegador.

---

## 📝 Como usar a ficha

1. **Identificação do veículo**
   - Preencher: Autos nº, veículo, placa, quilometragem.

2. **Checklists de vistoria**
   - Itens do veículo (chave, controle, manual, rádio/multimídia, TAG pedágio, tapetes etc.).
   - Funcionamento (buzina, faróis, pisca-alerta, luz de freio, luz de ré, ar-condicionado etc.).
   - Outros itens (macaco, triângulo, chave de roda, extintor, cintos, pneus, estepe, estado dos bancos).
   - Nível de combustível (R, ¼, ½, ¾, cheio).

3. **Registro de avarias**
   - Clicar sobre o diagrama do carro.
   - Descrever a avaria na janela modal (ex.: “risco profundo”, “amassado no para-lama”).
   - Cada avaria gera:
     - Um marcador colorido no diagrama.
     - Uma linha correspondente na lista de avarias.

4. **Observações gerais**
   - Campo livre para registrar contexto da operação, condições específicas, alertas mecânicos etc.
   - O texto é replicado em um bloco próprio na versão de impressão.

5. **Responsáveis e assinaturas**
   - Campos para:
     - Policial responsável/vistoriador e matrícula.
     - Proprietário/possuidor e CPF.
     - Responsável pelo recolhimento/empresa e CPF/CNPJ.
   - Botões de assinatura:
     - Ao clicar em `[ Assinar ]`, abre-se o modal com um canvas para desenhar a assinatura.
     - A assinatura é salva como imagem e exibida sobre a linha de assinatura.

6. **Fotografias anexadas**
   - Botão “Adicionar Fotos”:
     - No computador: escolhe arquivos.
     - No celular: pode escolher entre câmera e galeria (dependendo do navegador).
   - As fotos são exibidas em grade para conferência.
   - Na impressão, são organizadas em blocos com legenda “Foto 1”, “Foto 2” etc.

7. **Local e data da apreensão**
   - Campo de cidade + campo de data.
   - Antes de imprimir, os valores são copiados para o texto final formatado.

8. **Imprimir / PDF**
   - Botão **“Imprimir / PDF”**:
     - Ajusta o layout para A4.
     - Popular campos de observações, fotos, cidade e data na área de impressão.
     - Abre o diálogo de impressão do navegador — é possível salvar como PDF.

9. **Limpar**
   - Botão **“Limpar”**:
     - Recarrega a página e reseta todos os campos, avarias e fotos carregadas.

---

## 🧩 Ideias de evolução

Algumas melhorias possíveis para versões futuras:

- Salvar e carregar vistorias via `localStorage` (indexando por placa + nome do veículo).
- Modo **Configuração** para:
  - Trocar logomarca da instituição no topo.
  - Trocar a imagem de rodapé.
  - Selecionar grupo regional a partir de um arquivo JSON (e-mail, cidade, endereço, nome do grupo regional).
- Exportar os dados da vistoria em JSON, CSV ou PDF com metadados.
- Internacionalização (pt-BR / en-US).
- Validações mais rígidas para campos obrigatórios.

---

## 👨‍💻 Autor

**Diego Viana**
Desenvolvedor e criador da ficha de vistoria veicular.

- GitHub: [@diegoviana300](https://github.com/diegoviana300)

Contribuições (issues, pull requests, sugestões de UX e melhorias de código) são bem-vindas.
