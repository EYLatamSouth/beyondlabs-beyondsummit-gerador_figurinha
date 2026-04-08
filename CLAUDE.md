# GitHub Copilot Instructions — Beyond Summit Figurinha Generator

## Contexto do Projeto

Web app para geração de figurinhas digitais temáticas Copa do Mundo 2026 para o evento corporativo interno Beyond Summit da EY América Latina. O usuário faz upload de uma foto, o app remove o fundo automaticamente no browser, o usuário preenche seus dados, e gera uma figurinha personalizada para download. Os dados de participação são registrados anonimamente para o time de Cultura via backend mínimo.

Referências visuais: `docs/DESIGN.md` | Arquitetura: `docs/ARCHITECTURE.md` | PRD: `docs/PRD_BeyondSummit_v2.md`

---

## Stack

| Tecnologia | Uso |
|---|---|
| React 18 + TypeScript 5 | Framework UI |
| Vite 5 | Bundler e dev server |
| Tailwind CSS 3 | Estilização |
| shadcn/ui | Componentes base |
| @imgly/background-removal | Remoção de fundo client-side (WASM) |
| HTML5 Canvas API | Composição e exportação da figurinha |
| Azure Functions v4 (Node.js) | Backend mínimo: POST /api/register, GET /api/metrics |
| Azure Cosmos DB | Armazenamento de registros de participação |
| Azure Static Web Apps | Hosting + Functions integradas |
| GitHub Actions | CI/CD |

---

## Convenções de Código

### Geral
- Idioma dos comentários, variáveis e funções: **inglês**
- Idioma de toda a UI, mensagens ao usuário, labels e toasts: **português brasileiro**
- Sem `any` — tipar tudo explicitamente
- Funções pequenas e com responsabilidade única
- Nomes descritivos — sem abreviações desnecessárias

### React
- Apenas **function components** com hooks — sem class components
- Props tipadas com `interface`, não `type`
- Hooks customizados em `/src/hooks/` com prefixo `use`
- Componentes em `/src/components/` com PascalCase
- Um componente por arquivo
- Nunca usar `document.getElementById` ou manipulação direta do DOM fora do canvas

### Estilização
- **Tailwind CSS** para tudo — sem CSS modules, sem styled-components
- **shadcn/ui** para componentes base (Button, Input, Select, Dialog, Sonner)
- Usar as CSS variables definidas em `index.css` para cores e tipografia
- Classes Tailwind na ordem: layout → spacing → sizing → colors → typography → effects
- Valores dinâmicos que Tailwind não cobre (ex: posicionamento calculado no canvas): usar `style={{}}` inline
- Nunca criar classe CSS customizada quando Tailwind ou CSS variable resolve

### Canvas
- Toda lógica de composição fica em `src/lib/canvas.ts` — funções puras
- `StampCanvas.tsx` apenas chama as funções de `canvas.ts`
- Sempre `await loadImage()` antes de desenhar qualquer imagem no canvas
- Usar `useRef` para referenciar o elemento canvas

### Backend (Azure Functions)
- Validar todos os campos no backend — nunca confiar só no frontend
- Nunca logar dados pessoais (email, nome) em produção
- Connection strings e API keys apenas via Azure Key Vault → Function App Settings
- Retornar sempre `{ ok: true }` ou `{ error: string }` com status HTTP adequado

---

## Tipos Principais

```typescript
// src/types/stamp.ts

interface StampData {
  name: string;
  role: string;
  area: string;
  email: string;
  countryCode: string;
}

interface ParticipantRecord {
  nome: string;
  email: string;
  pais: string;
  paisCode: string;
  timestamp: string; // ISO 8601
}

interface Country {
  code: string;        // ISO alpha-2, ex: 'br'
  codeDisplay: string; // ex: 'BRA'
  name: string;        // ex: 'Brasil'
  featured: boolean;   // true = chip visível no nível 1
}
```

---

## O que NUNCA fazer

- Nunca usar `localStorage` ou `sessionStorage`
- Nunca enviar a foto ou blob URL do usuário para qualquer servidor externo
- Nunca colocar secrets, connection strings ou API keys no código ou `.env` commitado
- Nunca usar `@ts-ignore` ou `as any`
- Nunca usar `alert()` ou `confirm()` — usar toasts do shadcn Sonner
- Nunca bloquear o download da figurinha aguardando o retorno do `POST /api/register`
- Nunca criar CSS customizado quando Tailwind resolve
- Nunca importar bibliotecas pesadas sem verificar o impacto no bundle size

---

## Fluxo Principal da Aplicação

```
Upload foto
  → useBackgroundRemoval (@imgly WASM, local)
  → blob URL com fundo transparente
  → StampCanvas compõe layers em tempo real
  → Usuário preenche StampForm (nome, cargo, área, email, país)
  → Clique em "Baixar figurinha"
      → canvas.toDataURL() → download PNG (síncrono, imediato)
      → registerParticipant() → POST /api/register (assíncrono, fire and forget)
```

---

## Layers do Canvas (ordem obrigatória)

```
1. figurinha-bg.png       — /public/template/figurinha-bg.png
2. Foto do usuário        — blob URL com fundo removido
3. figurinha-overlay.png  — /public/template/figurinha-overlay.png
4. Bandeira do país       — /public/flags/[countryCode].svg
5. Textos                 — NOME (bold grande) + CARGO | ÁREA (tag verde)
```

---

## Assets e Paths

```
/public/template/figurinha-bg.png       # Layer 1 — fundo verde com silhueta BS
/public/template/figurinha-overlay.png  # Layer 3 — logo BS+troféu, "BEYOND SUMMIT"
/public/flags/[code].svg                # Bandeiras por código ISO alpha-2
/public/assets/beyondlabs-logo.png      # Logo BeyondLabs (header da interface)
/public/assets/soccer-pattern.svg       # Watermark sutil do fundo
```

---

## Design System (resumo — ver DESIGN.md para detalhes completos)

**Fontes:**
- Display/títulos/canvas: `'Barlow Condensed'` (700, 800)
- Corpo/inputs/labels: `'DM Sans'` (400, 500, 600)

**Cores primárias da interface:**
- `--color-green-dark: #1A5C2A` — botões, headers
- `--color-green-mid: #3D9A52` — hover, tags
- `--color-gold: #C9A84C` — acentos dourados
- `--color-white: #FFFFFF` — fundo principal

**Cores de acento decorativo (cantos, formas orgânicas — não usar em texto):**
- Roxo `#6B3FA0`, Azul `#4BBFDB`, Rosa `#E8365D`, Verde limão `#8DC63F`, Amarelo `#F5C518`

**Canvas — dimensões:** 900x1200px

---

## Países Suportados

**Featured (chips visíveis):** Brasil (br), Argentina (ar), México (mx), Chile (cl), Colômbia (co), Uruguai (uy), Peru (pe), Equador (ec)

**Lista completa (modal "Ver mais"):** Bolívia, Costa Rica, Cuba, El Salvador, Guatemala, Honduras, Nicarágua, Panamá, Paraguai, Porto Rico, República Dominicana, Venezuela, Portugal, Espanha

Código de exibição na figurinha: ISO alpha-2 em maiúsculas + terceira letra do nome (ex: `br` → `BRA`, `ar` → `ARG`)

---

## API Endpoints

| Endpoint | Método | Auth | Descrição |
|---|---|---|---|
| `/api/register` | POST | Nenhuma | Registra participação no Cosmos DB |
| `/api/metrics` | GET | Header `x-admin-key` | Retorna indicadores para o painel admin |

Em desenvolvimento local, usar `swa-cli` para emular o ambiente do Azure Static Web Apps com as Functions.

---

## Tratamento de Erros

- Erros de upload: toast de erro com mensagem clara em português
- Erro na remoção de fundo: toast de erro + botão para novo upload
- Erro no `registerParticipant()`: logar no console em dev, silencioso em produção — nunca mostrar ao usuário
- Sempre usar `try/catch` em operações assíncronas
- Nunca deixar erros silenciosos sem pelo menos um `console.error` em desenvolvimento
