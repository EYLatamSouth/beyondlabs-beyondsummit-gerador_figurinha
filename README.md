# 🃏 Beyond Summit — Gerador de Figurinhas

Aplicação web para geração de figurinhas digitais personalizadas para o evento **Beyond Summit** da EY América Latina. O usuário faz upload de uma foto, a remoção de fundo acontece 100% no browser (sem enviar imagens ao servidor), preenche seus dados e baixa uma figurinha em PNG de 900×1200px.

---

## ✨ Funcionalidades

- Upload de foto com remoção de fundo automática via WebAssembly ([@imgly/background-removal](https://img.ly/background-removal))
- Composição de figurinha em tempo real via Canvas API
- Seleção de país com chips de acesso rápido e modal com lista completa
- Download imediato do PNG sem depender do backend
- Registro de participação assíncrono (fire-and-forget) via Azure Functions
- Painel administrativo com métricas protegido por chave

---

## 🛠️ Stack

| Tecnologia | Uso |
|---|---|
| React 18 + TypeScript 5 | Framework UI |
| Vite 5 | Bundler e dev server |
| Tailwind CSS 3 | Estilização |
| shadcn/ui | Componentes base |
| @imgly/background-removal | Remoção de fundo client-side (WASM) |
| HTML5 Canvas API | Composição e exportação da figurinha |
| Azure Functions v4 (Node.js) | Backend: `POST /api/register`, `GET /api/metrics` |
| Azure Cosmos DB | Armazenamento de registros de participação |
| Azure Static Web Apps | Hosting + Functions integradas |
| GitHub Actions | CI/CD |

---

## 🚀 Começando

### Pré-requisitos

- Node.js 20+
- npm 10+
- [Azure Static Web Apps CLI](https://azure.github.io/static-web-apps-cli/) (`npm install -g @azure/static-web-apps-cli`) — apenas para desenvolvimento local com Functions

### Instalação

```bash
git clone https://github.com/Vini334/teste-gerador.git
cd teste-gerador
npm install
```

### Variáveis de ambiente

```bash
cp .env.example .env
```

| Variável | Descrição | Dev local |
|---|---|---|
| `VITE_API_BASE_URL` | URL base das Azure Functions | `http://localhost:7071` |

Em produção, deixe `VITE_API_BASE_URL` vazio — o Azure Static Web Apps resolve `/api` automaticamente.

---

## 💻 Desenvolvimento

### Somente frontend (sem Functions)

```bash
npm run dev
```

Acesse `http://localhost:5173`. O registro de participação ficará inativo.

### Frontend + Azure Functions (ambiente completo)

Configure o `.env` com `VITE_API_BASE_URL=http://localhost:7071` e rode:

```bash
swa start
```

O `swa-cli` emula o ambiente do Azure Static Web Apps com as Functions rodando localmente.

---

## 📦 Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o dev server Vite |
| `npm run build` | Compila TypeScript e gera bundle de produção |
| `npm run lint` | Executa o ESLint |
| `npm run preview` | Serve o bundle de produção localmente |

---

## 🏗️ Arquitetura

O frontend é **100% client-side** — nenhuma imagem é enviada a servidores externos.

```
Upload foto
  → useBackgroundRemoval (@imgly WASM, local)
  → blob URL com fundo transparente
  → StampCanvas compõe layers em tempo real
  → Usuário preenche StampForm (nome, cargo, área, email, país)
  → Clique em "Baixar figurinha"
      → canvas.toDataURL() → download PNG  (síncrono, imediato)
      → registerParticipant() → POST /api/register  (assíncrono, fire and forget)
```

### Layers do canvas (ordem obrigatória)

| # | Layer | Arquivo |
|---|---|---|
| 1 | Fundo verde com silhueta BS | `/public/template/figurinha-bg.png` |
| 2 | Foto do usuário (fundo removido) | blob URL |
| 3 | Card de bandeira (desenhado dinamicamente) | `/public/flags/[code].svg` |
| 4 | Textos: NOME + Área | — |

### Endpoints da API

| Endpoint | Método | Auth | Descrição |
|---|---|---|---|
| `/api/register` | POST | Nenhuma | Registra participação no Cosmos DB |
| `/api/metrics` | GET | Header `x-admin-key` | Retorna indicadores para o painel admin |

---

## 📁 Estrutura do projeto

```
├── api/                    # Azure Functions
│   ├── register/           # POST /api/register
│   └── metrics/            # GET /api/metrics
├── public/
│   ├── flags/              # Bandeiras SVG por código ISO alpha-2
│   └── template/           # Assets do canvas (bg, overlay)
├── src/
│   ├── components/         # Componentes React (PascalCase)
│   ├── hooks/              # Hooks customizados (prefixo use)
│   ├── lib/
│   │   └── canvas.ts       # Funções puras de composição do canvas
│   ├── pages/              # Páginas da aplicação
│   ├── types/              # Interfaces TypeScript
│   └── App.tsx             # Orquestrador de estado e navegação
├── docs/                   # Documentação técnica
├── .env.example
└── staticwebapp.config.json
```

---

## 🌎 Países suportados

**Featured (chips de acesso rápido):** Brasil, Argentina, México, Chile, Colômbia, Uruguai, Peru, Equador

**Lista completa (modal "Ver mais"):** Bolívia, Costa Rica, Cuba, El Salvador, Guatemala, Honduras, Nicarágua, Panamá, Paraguai, Porto Rico, República Dominicana, Venezuela, Portugal, Espanha

---

## 🚢 Deploy

O deploy é automático via **GitHub Actions** ao fazer push na branch principal. O Azure Static Web Apps publica o frontend e as Functions em conjunto.

Para configurar um novo ambiente, é necessário:
1. Criar um recurso **Azure Static Web Apps** no portal
2. Vincular ao repositório GitHub
3. Configurar as Application Settings com as variáveis do Cosmos DB e a chave admin

---

## 📄 Documentação adicional

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — Diagrama e detalhes de arquitetura
- [`docs/DESIGN.md`](docs/DESIGN.md) — Design system, cores e tipografia
- [`docs/PRD_BeyondSummit_v2.md`](docs/PRD_BeyondSummit_v2.md) — Product Requirements Document
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — Roadmap de funcionalidades

---

## ⚠️ Diretrizes de segurança

- Nunca commitar o arquivo `.env`
- A foto do usuário **nunca** é enviada a servidores externos
- A chave admin é mantida apenas em memória (estado React), nunca em `localStorage`
- Connection strings e API keys ficam somente no Azure Key Vault → Application Settings
