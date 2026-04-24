# ROADMAP — Mural de Figurinhas + Foto de Time

> Features de engajamento para o Beyond Summit 2026.
> Cada fase foi dimensionada para ser implementada em uma única janela de contexto.
> **Pré-requisito geral:** o MVP da aplicação (Fase 1 do ROADMAP.md) deve estar funcional antes de iniciar qualquer fase abaixo.

---

## Visão Geral das Fases

```
Fase 1 — Backend & Infraestrutura   → Blob Storage + novos endpoints
Fase 2 — Opt-in "Enviar pro Mural"  → botão + upload client-side
Fase 3 — Página do Mural            → galeria com filtros
Fase 4 — Seleção para o Time        → UI de seleção no mural
Fase 5 — Composição da Foto de Time → canvas + template + download
```

---

## Fase 1 — Backend & Infraestrutura

> **Objetivo:** preparar o backend para armazenar PNGs de figurinhas e listá-las.
> **Contexto necessário:** `api/`, `ARCHITECTURE.md`, `api/register/index.ts`

### Assets necessários (você fornece antes de iniciar)
- Nenhum. Apenas acesso ao Azure para criar os recursos.

### Recursos Azure a criar
- [ ] Azure Blob Storage container: `stickers` (acesso público de leitura por blob)
- [ ] Adicionar `BLOB_CONNECTION_STRING` ao Azure Key Vault e Function App Settings
- [ ] Adicionar `BLOB_ACCOUNT_NAME` ao Function App Settings

### Nova Azure Function: `POST /api/upload-sticker`

**Contrato:**
```
Request:  multipart/form-data
  - file: Blob (PNG, max 2MB)
  - participantId: string (ID do registro no Cosmos DB)

Response 200: { ok: true, stickerUrl: string, stickerId: string }
Response 400: { error: string }
Response 500: { error: string }
```

**Lógica:**
- Validar que `file` é PNG e ≤ 2MB
- Validar que `participantId` existe no Cosmos DB
- Fazer upload do PNG para o Blob Storage com nome `{stickerId}.png`
- Atualizar o documento no Cosmos DB adicionando `{ stickerUrl, sharedToMural: true }`
- Retornar a URL pública do blob

### Nova Azure Function: `GET /api/stickers`

**Contrato:**
```
Query params (todos opcionais):
  - name: string      → filtro parcial, case-insensitive
  - area: string      → filtro exato
  - cargo: string     → filtro exato (campo "role" no Cosmos)
  - country: string   → ISO alpha-2, filtro exato

Response 200: {
  stickers: Array<{
    id: string
    stickerUrl: string
    nome: string
    cargo: string
    area: string
    paisCode: string
    pais: string
  }>
}
```

**Lógica:**
- Query no Cosmos DB: `SELECT * FROM c WHERE c.sharedToMural = true`
- Aplicar filtros opcionais no resultado (ou via query parametrizada)
- Não retornar campo `email` — nunca expor email publicamente
- Limitar a 200 resultados por request (sem paginação na Fase 1)

### Atualização: schema do Cosmos DB

Adicionar campos ao documento de participante ao fazer upload:
```typescript
{
  // campos existentes...
  sharedToMural: boolean   // default: false no registro inicial
  stickerUrl: string       // URL do Blob Storage, populado no upload
  cargo: string            // role do StampData — adicionar ao POST /api/register também
  area: string             // area do StampData — adicionar ao POST /api/register também
}
```

> ⚠️ `cargo` e `area` precisam ser adicionados ao `POST /api/register` existente também — o Cosmos DB precisa ter esses campos para os filtros do mural funcionarem.

### Arquivos a criar/modificar
```
api/
  upload-sticker/
    index.ts              ← CRIAR (nova Function)
  stickers/
    index.ts              ← CRIAR (nova Function)
  register/
    index.ts              ← MODIFICAR (adicionar cargo + area ao documento salvo)
```

---

## Fase 2 — Opt-in "Enviar pro Mural"

> **Objetivo:** adicionar o botão de compartilhamento voluntário após gerar a figurinha.
> **Contexto necessário:** `src/App.tsx`, `src/lib/analytics.ts`, `src/types/stamp.ts`, `src/components/` (botões existentes)

### Assets necessários
- Nenhum.

### Atualizações de tipos (`src/types/stamp.ts`)

```typescript
// Adicionar ao StampData
interface StampData {
  name: string
  role: string     // já existe
  area: string     // já existe
  email: string
  countryCode: string
}

// Novo tipo para upload
interface StickerUploadResult {
  ok: boolean
  stickerUrl?: string
  stickerId?: string
  error?: string
}
```

### Nova função: `src/lib/sticker-upload.ts`

```typescript
// uploadSticker(pngBlob, participantId): Promise<StickerUploadResult>
// fire-and-possibility: mesma filosofia do registerParticipant()
// Em caso de erro: console.error em dev, silencioso em prod
```

### Modificações em `src/App.tsx`

No estado de "download disponível", após `downloadPNG()`:

```
[Baixar Figurinha ↓]   [Enviar pro Mural 🌐]
```

**UX do botão "Enviar pro Mural":**
- Estado inicial: ativo (preto/outline)
- Estado: `uploading` → spinner + texto "Enviando..."
- Estado: `done` → ícone ✓ + texto "No mural!" + botão desativado (não reenviar)
- Estado: `error` → toast de erro + botão volta ao estado inicial (retry possível)
- Toast de sucesso: "Sua figurinha foi adicionada ao mural! 🎉"
- Toast de erro: "Não foi possível enviar para o mural. Tente novamente."

### Atualização em `registerParticipant()` / `analytics.ts`

- Passar `cargo` e `area` junto com os dados existentes no POST `/api/register`
- Guardar o `participantId` retornado pelo `/api/register` no estado do App para usar no upload

> ⚠️ O `participantId` precisa ser retornado pelo `POST /api/register` — adicionar ao response `{ ok: true, id: string }`.

### Arquivos a criar/modificar
```
src/
  lib/
    sticker-upload.ts     ← CRIAR
    analytics.ts          ← MODIFICAR (passar cargo + area, receber id no response)
  types/
    stamp.ts              ← MODIFICAR (StickerUploadResult)
  App.tsx                 ← MODIFICAR (botão + estado upload)
```

---

## Fase 3 — Página do Mural

> **Objetivo:** criar a galeria pública de figurinhas com filtros.
> **Contexto necessário:** `src/pages/`, `src/App.tsx` (rotas), `src/types/stamp.ts`, componentes shadcn disponíveis

### Assets necessários
- Nenhum.

### Nova página: `src/pages/MuralPage.tsx`

**Layout:**
```
Header (logo + link "← Criar minha figurinha")
──────────────────────────────────────────────
Barra de filtros:
  [🔍 Buscar por nome...]  [Cargo ▾]  [Área ▾]  [País ▾]  [Limpar]

Contador: "42 figurinhas no mural"

Grid responsivo de cards:
  ┌─────────┐ ┌─────────┐ ┌─────────┐
  │figurinha│ │figurinha│ │figurinha│
  │  Nome   │ │  Nome   │ │  Nome   │
  │Cargo|Ar │ │Cargo|Ar │ │Cargo|Ar │
  └─────────┘ └─────────┘ └─────────┘
  (5 colunas desktop / 3 tablet / 2 mobile)

Footer: botão "Montar Time" (aparece quando ≥ 1 selecionado — implementado na Fase 4)
```

**Estados:**
- `loading`: skeleton grid de 10 cards
- `empty` (sem figurinhas): ilustração + "Nenhuma figurinha ainda. Seja o primeiro!"
- `empty` (filtros sem resultado): "Nenhuma figurinha encontrada para esses filtros."
- `error`: toast de erro + botão retry

### Hook: `src/hooks/useMuralStickers.ts`

```typescript
// Busca GET /api/stickers com debounce de 300ms no filtro de nome
// Retorna: { stickers, isLoading, error, refetch }
// Re-busca automaticamente ao mudar filtros
```

### Roteamento (`src/App.tsx`)

Adicionar rota `/mural` → `<MuralPage />` (lazy import para não impactar bundle da tela principal)

### Componente: `src/components/StickerCard.tsx`

```
Props: { sticker: MuralSticker, selected?: boolean, onSelect?: () => void }
- Thumbnail da figurinha (img com lazy loading)
- Nome + cargo + área abaixo
- Bandeira do país no canto
- Borda verde quando selecionado (Fase 4 usa isso)
```

### Arquivos a criar/modificar
```
src/
  pages/
    MuralPage.tsx         ← CRIAR
  hooks/
    useMuralStickers.ts   ← CRIAR
  components/
    StickerCard.tsx        ← CRIAR
  App.tsx                  ← MODIFICAR (adicionar rota /mural)
  types/
    stamp.ts               ← MODIFICAR (adicionar MuralSticker interface)
```

---

## Fase 4 — Seleção para o Time

> **Objetivo:** permitir que o usuário selecione até 11 figurinhas no mural para montar o time.
> **Contexto necessário:** `src/pages/MuralPage.tsx` (Fase 3), `src/components/StickerCard.tsx` (Fase 3), `src/types/stamp.ts`

### Assets necessários
- Nenhum.

### Modificações em `MuralPage.tsx`

Adicionar modo de seleção:

```
Estado: selectedIds: string[]  (máx 11)

Comportamento:
- Click em card: toggle seleção
- Se já tem 11 selecionados e tenta selecionar mais: toast "Máximo de 11 jogadores atingido"
- Card selecionado: borda verde + ícone ✓ no canto + overlay sutil

Barra inferior fixa (aparece quando ≥ 1 selecionado):
┌─────────────────────────────────────────────────┐
│  👥 5 de 11 jogadores selecionados    [Limpar]  │
│              [⚽ Montar Time]                    │
└─────────────────────────────────────────────────┘
```

**UX detalhada:**
- Barra desliza de baixo ao selecionar o primeiro card (animação CSS)
- "Limpar" deseleciona todos
- "Montar Time" desativado visualmente se < 2 selecionados (com tooltip "Selecione pelo menos 2 jogadores")
- Ao clicar "Montar Time" → abre TeamPhotoModal (Fase 5)

### Modificações em `StickerCard.tsx`

```typescript
// Props adicionais:
selectable?: boolean     // ativa modo seleção
selected?: boolean       // estado selecionado
onToggle?: () => void    // callback de toggle
```

### Arquivos a criar/modificar
```
src/
  pages/
    MuralPage.tsx         ← MODIFICAR (estado de seleção + barra inferior)
  components/
    StickerCard.tsx        ← MODIFICAR (props de seleção)
    SelectionBar.tsx       ← CRIAR (barra fixa inferior)
```

---

## Fase 5 — Composição da Foto de Time

> **Objetivo:** compor e exportar a foto de time com os rostos dos usuários no template.
> **Contexto necessário:** `src/lib/canvas.ts`, `src/hooks/useStampCanvas.ts`, Fases 3 e 4 completas.

### Assets necessários (você fornece antes de iniciar esta fase)

```
/public/template/team-template.png
```

**Especificações do template:**
- Dimensão recomendada: **1600×1000px** (landscape, proporção de foto de time)
- Fundo: campo/estádio estilizado com identidade Beyond Summit
- 11 corpos de jogadores com uniforme EY (verde), **sem cabeças**
- Disposição sugerida (formação 4-3-3):
  ```
  Fileira de trás  (6 jogadores): posições 1–6  → de pé
  Fileira da frente (5 jogadores): posições 7–11 → ajoelhados/abaixados
  ```
- Cada slot de cabeça: círculo vazio de ~120px de diâmetro
- Fornecer junto um arquivo JSON com as coordenadas:

```json
// /public/template/team-slots.json
{
  "slots": [
    { "id": 1, "x": 120, "y": 80,  "size": 120 },
    { "id": 2, "x": 320, "y": 80,  "size": 120 },
    ...
  ]
}
```

> Se preferir, forneça o template e eu extraio as coordenadas manualmente.

### Nova lib: `src/lib/team-canvas.ts`

Funções puras:

```typescript
loadTeamSlots(): Promise<TeamSlot[]>
// Carrega /public/template/team-slots.json

extractFace(stickerUrl: string, slotSize: number): Promise<HTMLCanvasElement>
// Faz fetch do PNG da figurinha
// Recorta os ~40% superiores (região do rosto/busto)
// Aplica máscara oval
// Redimensiona para slotSize × slotSize

composeTeamPhoto(
  selected: MuralSticker[],   // máx 11
  slots: TeamSlot[],
): Promise<Blob>
// Cria canvas 1600×1000
// Desenha team-template.png como fundo
// Para cada slot preenchido: extrai rosto e encaixa na posição
// Para slots vazios: desenha silhueta cinza + ícone "?"
// Abaixo de cada slot: nome do jogador (Barlow Condensed, branca)
// Retorna Blob PNG
```

### Novo hook: `src/hooks/useTeamCanvas.ts`

```typescript
// Estado: idle | composing | done | error
// Ao receber lista de stickers selecionados:
//   1. Chama composeTeamPhoto()
//   2. Quando done: disponibiliza blobUrl para download
// Retorna: { status, blobUrl, compose, reset }
```

### Novo componente: `src/components/TeamPhotoModal.tsx`

```
Props: { open, onClose, selectedStickers: MuralSticker[] }

Conteúdo:
- Estado "composing": spinner + "Montando o time..."
- Estado "done":
    Preview da foto de time (img do blobUrl)
    Botão "⬇ Baixar foto do time" → download PNG "time_beyondsummit2026.png"
    Botão "Voltar ao mural"
- Estado "error":
    "Não foi possível montar a foto. Tente novamente."
    Botão retry
```

### Arquivos a criar/modificar
```
public/
  template/
    team-template.png     ← VOCÊ FORNECE
    team-slots.json       ← VOCÊ FORNECE (ou extraído manualmente do template)

src/
  lib/
    team-canvas.ts        ← CRIAR
  hooks/
    useTeamCanvas.ts      ← CRIAR
  components/
    TeamPhotoModal.tsx     ← CRIAR
  pages/
    MuralPage.tsx          ← MODIFICAR (abrir TeamPhotoModal ao clicar "Montar Time")
```

---

## Dependências entre Fases

```
Fase 1 (Backend)
    └─► Fase 2 (Opt-in upload)
            └─► Fase 3 (Galeria mural)
                    └─► Fase 4 (Seleção)
                                └─► Fase 5 (Composição)
                                    ⚠️  Requer template art do usuário
```

---

## Checklist de Assets por Fase

| Fase | Asset necessário | Responsável |
|------|-----------------|-------------|
| 1 | Nenhum | — |
| 2 | Nenhum | — |
| 3 | Nenhum | — |
| 4 | Nenhum | — |
| 5 | `team-template.png` + `team-slots.json` | **Você** |

---

## Variáveis de Ambiente Novas

| Variável | Onde | Descrição |
|---|---|---|
| `BLOB_CONNECTION_STRING` | Azure Key Vault → Function App | Connection string do Azure Blob Storage |
| `BLOB_ACCOUNT_NAME` | Function App Settings | Nome da conta de storage (para montar URLs públicas) |
| `BLOB_CONTAINER_NAME` | Function App Settings | Nome do container (ex: `stickers`) |

> Adicionar também ao `.env.example` do projeto (sem valores reais).

---

## Notas de Arquitetura

- **Privacidade:** o PNG só vai para o Blob Storage quando o usuário clicar explicitamente em "Enviar pro Mural". O download local nunca aciona o upload.
- **Sem processamento server-side de imagem:** toda composição (mural cards + foto de time) acontece no browser via Canvas API, reutilizando o mesmo padrão do `canvas.ts` existente.
- **Email nunca exposto:** `GET /api/stickers` não retorna o campo `email` — ele existe apenas internamente no Cosmos DB para o painel admin.
- **URLs do Blob Storage:** as figurinhas ficam em URLs públicas de leitura. Não há autenticação para visualizar — isso é intencional para que o mural e a foto de time funcionem sem login.
