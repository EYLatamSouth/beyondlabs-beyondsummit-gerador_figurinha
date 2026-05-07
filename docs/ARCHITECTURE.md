# ARCHITECTURE.md — Beyond Summit Figurinha Generator

> Versão alinhada ao PRD v2.1

---

## 1. Visão Geral

O frontend é **100% client-side** — sem login, sem autenticação, sem processamento de imagem no servidor. O backend é mínimo: uma única Azure Function acionada de forma assíncrona para registrar a participação no banco, sem bloquear nem atrasar a experiência do usuário.

---

## 2. Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                        BROWSER                              │
│                                                             │
│  ┌──────────┐    ┌──────────────────────┐                   │
│  │  Upload  │───▶│  @imgly/background-  │                   │
│  │  (File   │    │  removal (WASM)      │                   │
│  │   API)   │    │  100% local          │                   │
│  └──────────┘    └──────────┬───────────┘                   │
│                             │ blob URL                      │
│                             ▼                               │
│                    ┌─────────────────┐                      │
│                    │  StampCanvas    │                      │
│                    │  (Canvas API)   │                      │
│                    │                 │                      │
│                    │  layers:        │                      │
│                    │  1. bg.png      │                      │
│                    │  2. foto        │                      │
│                    │  3. overlay.png │                      │
│                    │  4. bandeira    │                      │
│                    │  5. textos      │                      │
│                    └────────┬────────┘                      │
│                             │                               │
│              ┌──────────────┴──────────────┐                │
│              │                             │                │
│              ▼                             ▼ (assíncrono)   │
│     ┌────────────────┐           ┌──────────────────┐       │
│     │  Download PNG  │           │ POST /api/register│       │
│     │  (client-side) │           │ fire and forget  │       │
│     └────────────────┘           └────────┬─────────┘       │
│                                           │                 │
└───────────────────────────────────────────┼─────────────────┘
                                            │
┌───────────────────────────────────────────┼─────────────────┐
│           AZURE STATIC WEB APPS           │                 │
│                                           ▼                 │
│  ┌─────────────────────┐   ┌────────────────────────────┐   │
│  │   React App (Vite)  │   │   Azure Functions          │   │
│  │   Bundle estático   │   │   POST /api/register       │   │
│  └─────────────────────┘   │   GET  /api/metrics        │   │
│                            └──────────────┬─────────────┘   │
│  SSL gratuito                             │                 │
│  https://[nome].azurestaticapps.net       │                 │
│  Deploy via GitHub Actions                │                 │
└───────────────────────────────────────────┼─────────────────┘
                                            │
                                            ▼
                          ┌─────────────────────────────────┐
                          │       AZURE COSMOS DB           │
                          │                                 │
                          │  collection: participants       │
                          │  {                              │
                          │    id, nome, email,             │
                          │    pais, paisCode, timestamp    │
                          │  }                              │
                          └─────────────────────────────────┘
```

---

## 3. Componentes do Frontend

### `src/pages/Home.tsx`
Página principal. Gerencia o estado global e orquestra as transições entre telas.

**Estado:**
```typescript
step: 'upload' | 'processing' | 'editor'
photoFile: File | null
processedPhotoUrl: string | null  // blob URL
stampData: StampData
```

### `src/pages/Admin.tsx`
Painel de indicadores para o time de Cultura. Rota `/admin`, protegida por senha. Consome `GET /api/metrics`.

### `src/components/UploadZone.tsx`
Drag-and-drop + clique para selecionar. Valida formato (JPG, PNG) e tamanho (5MB). Emite `File` via `onPhotoSelected`.

### `src/components/StampCanvas.tsx`
Renderiza o canvas da figurinha. Recebe `StampData` + `processedPhotoUrl`. Chama funções de `canvas.ts`. Re-renderiza a cada mudança no `StampData`. Expõe `downloadPNG()`.

### `src/components/StampForm.tsx`
Formulário com todos os campos. Emite `StampData` atualizado via `onChange` a cada alteração.

### `src/components/CountrySelect.tsx`
Dois níveis: chips visíveis (8 países principais) + modal "Ver mais" com campo de busca. Retorna `countryCode`.

### `src/components/DownloadButton.tsx`
Botão de download (chama `downloadPNG()`) e botão de compartilhamento no LinkedIn (LinkedIn Share API).

### `src/components/admin/AdminDashboard.tsx`
Total de participantes, gráfico por país, tabela de emails exportável em CSV.

### `src/hooks/useBackgroundRemoval.ts`
Orquestra `@imgly/background-removal`. Retorna `{ processImage, status, resultUrl, error }`.

Estados: `idle | processing | done | error`

### `src/hooks/useStampCanvas.ts`
Lógica de composição do canvas: carrega imagens, gerencia layers, exporta PNG.

### `src/lib/canvas.ts`
Funções puras de canvas:
- `loadImage(src): Promise<HTMLImageElement>`
- `composeLayers(canvas, stampData, photoUrl): Promise<void>`
- `drawText(ctx, text, x, y, options): void`
- `exportPNG(canvas, filename): void`

### `src/lib/countries.ts`
```typescript
export interface Country {
  code: string;        // ISO alpha-2, ex: 'br'
  codeDisplay: string; // ex: 'BRA'
  name: string;        // ex: 'Brasil'
  featured: boolean;   // true = chip visível no nível 1
}
```

### `src/lib/analytics.ts`
Registro assíncrono — fire and forget. Erros não afetam a UX:
```typescript
export async function registerParticipant(data: ParticipantRecord): Promise<void>
```

### `src/types/stamp.ts`
```typescript
export interface StampData {
  name: string;
  role: string;
  area: string;
  email: string;
  countryCode: string;
}

export interface ParticipantRecord {
  nome: string;
  email: string;
  pais: string;
  paisCode: string;
  timestamp: string;
}
```

---

## 4. API — Azure Functions

### `POST /api/register`

Registra a participação de um colaborador.

**Request body:**
```json
{
  "nome": "Denis Balaguer",
  "email": "denis@ey.com",
  "pais": "Brasil",
  "paisCode": "br",
  "timestamp": "2026-06-15T14:30:00.000Z"
}
```

**Response:** `{ "ok": true }`

**Comportamento no frontend:** chamada sem `await` na chain principal — download acontece independente do resultado.

**Validações no backend:**
- Email com formato válido
- País presente na lista suportada
- Campos obrigatórios presentes

---

### `GET /api/metrics`

Retorna indicadores para o painel `/admin`. Requer header `x-admin-key`.

**Response:**
```json
{
  "total": 847,
  "byCountry": [
    { "code": "br", "name": "Brasil", "count": 312 },
    { "code": "mx", "name": "México", "count": 201 }
  ],
  "participants": [
    {
      "nome": "Denis Balaguer",
      "email": "denis@ey.com",
      "pais": "Brasil",
      "timestamp": "2026-06-15T14:30:00.000Z"
    }
  ]
}
```

---

## 5. Banco de Dados — Azure Cosmos DB

**Collection:** `participants`
**Partition key:** `/paisCode`
**Índices adicionais:** `email`, `timestamp`

> Para o volume esperado (1.000–2.000 registros), o tier gratuito do Cosmos DB (400 RU/s) é suficiente.

---

## 6. Painel Admin (`/admin`)

- Rota React protegida por senha antes de exibir qualquer dado
- Funcionalidades: total de figurinhas geradas, gráfico por país, tabela de participantes, exportação CSV via `Blob` + `URL.createObjectURL`

### Fluxo de Autenticação do Admin

```
[1] Usuário acessa /admin
[2] AdminLogin.tsx exibe campo de senha
[3] Usuário digita a senha (o valor de ADMIN_KEY do Key Vault)
[4] AdminLogin guarda a senha em React state (memória — não persiste em localStorage)
[5] AdminDashboard chama GET /api/metrics com header { 'x-admin-key': senha }
[6] Azure Function compara o header com process.env.ADMIN_KEY
    → Correto: retorna os dados de métricas
    → Incorreto: retorna 401 { error: 'Unauthorized' }
[7] Se 401: AdminDashboard volta para AdminLogin com mensagem de erro
```

**Pontos importantes:**
- A senha não fica hardcoded no bundle JS — o usuário a digita a cada sessão
- `ADMIN_KEY` fica exclusivamente no Azure Key Vault → Function App Settings
- Sem cookies, sem tokens, sem sessionStorage — sessão dura enquanto o componente estiver montado
- Para o contexto de um evento pontual, esse nível de proteção é suficiente

---

## 7. Estrutura de Pastas

```
/
├── public/
│   ├── template/
│   │   ├── figurinha-bg.png         # Fundo (layer 1)
│   │   └── figurinha-overlay.png    # Overlay superior (layer 3)
│   ├── flags/                       # SVGs por código ISO alpha-2
│   │   ├── br.svg
│   │   ├── ar.svg
│   │   └── ...
│   └── assets/
│       ├── beyondlabs-logo.png      # Logo BeyondLabs (header)
│       └── soccer-pattern.svg       # Watermark sutil do fundo
│
├── src/
│   ├── components/
│   │   ├── UploadZone.tsx
│   │   ├── StampCanvas.tsx
│   │   ├── StampForm.tsx
│   │   ├── CountrySelect.tsx
│   │   ├── DownloadButton.tsx
│   │   └── admin/
│   │       ├── AdminLogin.tsx
│   │       ├── AdminDashboard.tsx
│   │       └── ParticipantTable.tsx
│   ├── hooks/
│   │   ├── useBackgroundRemoval.ts
│   │   └── useStampCanvas.ts
│   ├── lib/
│   │   ├── canvas.ts
│   │   ├── countries.ts
│   │   └── analytics.ts
│   ├── types/
│   │   └── stamp.ts
│   ├── pages/
│   │   ├── Home.tsx
│   │   └── Admin.tsx
│   ├── App.tsx
│   └── main.tsx
│
├── api/
│   ├── register/
│   │   ├── index.ts
│   │   └── function.json
│   └── metrics/
│       ├── index.ts
│       └── function.json
│
├── docs/
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── DESIGN.md
│   └── ROADMAP.md
│
├── .github/
│   ├── copilot-instructions.md
│   └── workflows/
│       └── azure-static-web-apps.yml
│
├── staticwebapp.config.json
├── package.json
└── vite.config.ts
```

---

## 8. Variáveis de Ambiente

| Variável | Onde | Descrição |
|---|---|---|
| `COSMOS_CONNECTION_STRING` | Azure Key Vault → Function App Settings | Connection string do Cosmos DB |
| `ADMIN_KEY` | Azure Key Vault → Function App Settings | Chave para autenticar `GET /api/metrics` |
| `VITE_API_BASE_URL` | `.env` / Static Web App config | URL base das Functions (dev: `http://localhost:7071`) |

> Nenhuma secret no código ou no repositório. Todas as secrets ficam no Azure Key Vault.

---

## 9. Deploy e CI/CD

**Serviço:** Azure Static Web Apps
**URL:** `https://[nome].azurestaticapps.net`
**SSL:** Gratuito e automático

```
git push main
  → GitHub Actions trigger
  → npm run build (Vite)
  → Deploy bundle para CDN global do Azure
  → Deploy Azure Functions (/api)
  → ✅ Live em ~2 min
```

Pull Requests geram preview URLs automáticas: `https://[nome]-pr-42.azurestaticapps.net`

---

## 10. Decisões de Arquitetura

| Decisão | Alternativa considerada | Motivo |
|---|---|---|
| `@imgly` local (WASM) | Remove.bg API | Zero custo, zero dado enviado externamente, sem limite de uso |
| Canvas API nativa | Fabric.js, Konva.js | Bundle menor, controle total, sem abstrações desnecessárias |
| Estado em `Home.tsx` | Zustand, Context | Escopo pequeno — state manager é overhead desnecessário no MVP |
| Azure Static Web Apps | Vercel, Netlify | Alinhamento com Azure da EY, Functions integradas, gratuito |
| Azure Cosmos DB | Table Storage, PostgreSQL | Escala automática, binding nativo com Functions, tier free suficiente |
| Fire and forget no registro | Await bloqueante | Registro nunca pode atrasar ou impedir o download da figurinha |
| Admin com senha simples via Key Vault | Azure AD | Elimina dependência de App Registration; adequado para evento pontual |
| Email obrigatório | Email opcional | Requisito do time de Cultura para identificação dos participantes — sem email o download não é liberado |
