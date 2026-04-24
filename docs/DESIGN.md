# DESIGN.md — Beyond Summit Figurinha Generator

> Referências visuais: template da figurinha (`assets/template-figurinha.webp`). Logos disponíveis em `assets/`.

---

## 1. Identidade Visual do Evento

### 1.1 Logos

Todos os arquivos abaixo estão em `assets/` com **fundo transparente (PNG)**.

| Arquivo | Conteúdo | Uso recomendado |
|---|---|---|
| `logo-beyondlabs.png` | Logo BeyondLabs em **branco** (texto/ícone branco, fundo transparente) | Header da interface — sobre fundo verde escuro (`#1A5C2A`) |
| `logo-beyondSummit_fonte_branca.png` | Símbolo BS amarelo + troféu + texto "BEYOND SUMMIT / INNOVATION CUP" em **branco** | ✅ **Canvas da figurinha** (layer overlay) — funciona sobre fundo verde |
| `logo-beyondSummit_fonte_preta.png` | Símbolo BS amarelo + troféu + texto "BEYOND SUMMIT / INNOVATION CUP" em **preto** | Uso em fundos claros (documentos, prints, etc.) — não usar no canvas |
| `logo-BS_semfonte.png` | Apenas símbolo BS amarelo + troféu, sem texto | Ícone, favicon, variação compacta |
| `template-figurinha.webp` | Template completo da figurinha (referência visual) | Referência — extrair `figurinha-bg.png` e `figurinha-overlay.png` daqui |

> **Para o canvas (`composeLayers`):**
> - Layer 1 — fundo: extrair o fundo verde (`figurinha-bg.png`) do template
> - Layer 3 — overlay: usar `logo-beyondSummit_fonte_branca.png` (texto branco legível sobre verde)
>
> **Para o header da interface:**
> - Usar `logo-beyondlabs.png` (branco) sobre o fundo verde do header

---

## 2. Paleta de Cores

### 2.1 Cores Primárias da Interface

A interface usa verde escuro e dourado como base — cores da figurinha — com branco como fundo dominante.

| Nome | Hex | Uso |
|---|---|---|
| **Verde Escuro** | `#1A5C2A` | Cor primária — botões principais, headers, elementos de destaque |
| **Verde Médio** | `#3D9A52` | Hover de botões, tags, badges |
| **Verde Claro** | `#7DC48A` | Backgrounds secundários, estados desabilitados |
| **Dourado** | `#C9A84C` | Acentos dourados, ícones especiais, destaques |
| **Branco** | `#FFFFFF` | Background principal da interface |
| **Cinza Claro** | `#F5F5F5` | Background de cards, inputs |
| **Cinza Texto** | `#374151` | Texto secundário |
| **Preto** | `#111111` | Texto principal, títulos |

### 2.2 Cores de Acento — Identidade do Evento

Usadas como elementos decorativos: cantos, formas orgânicas, bordas, separadores. **Não usar como cor de fundo dominante nem em texto.** O objetivo é trazer vivacidade e alegria à interface sem comprometer a legibilidade.

| Nome | Hex | Uso sugerido |
|---|---|---|
| **Roxo/Violeta** | `#6B3FA0` | Canto superior esquerdo, forma orgânica decorativa |
| **Azul Celeste** | `#4BBFDB` | Canto superior direito, detalhe de borda |
| **Rosa/Vermelho** | `#E8365D` | Elemento decorativo inferior esquerdo |
| **Verde Limão** | `#8DC63F` | Elemento decorativo inferior direito |
| **Amarelo/Dourado** | `#F5C518` | Destaque pontual, elemento de canto |

### 2.3 Cores de Estado

| Estado | Hex | Uso |
|---|---|---|
| **Erro** | `#EF4444` | Mensagens de erro, border de input inválido |
| **Sucesso** | `#22C55E` | Toast de confirmação, ícone de check |
| **Loading** | `#3D9A52` | Spinner, progress indicator |

---

## 3. Tipografia

### 3.1 Fontes da Interface

> Usar fontes do Google Fonts. Evitar Inter, Roboto, Arial.

| Fonte | Peso | Uso |
|---|---|---|
| **Barlow Condensed** | 700 (Bold), 800 (ExtraBold) | Títulos, headlines, CTAs |
| **DM Sans** | 400 (Regular), 500 (Medium), 600 (SemiBold) | Corpo de texto, labels, inputs |

```css
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
```

### 3.2 Escala Tipográfica

| Elemento | Fonte | Tamanho | Peso | Cor |
|---|---|---|---|---|
| **Título hero** | Barlow Condensed | 48–56px | 800 | `#111111` |
| **Subtítulo** | Barlow Condensed | 28–32px | 700 | `#1A5C2A` |
| **Label de seção** | DM Sans | 14px | 600 | `#374151` uppercase |
| **Corpo** | DM Sans | 16px | 400 | `#374151` |
| **Caption / helper** | DM Sans | 13px | 400 | `#6B7280` |
| **Botão** | Barlow Condensed | 18px | 700 | Dependente do botão |

### 3.3 Fontes da Figurinha (Canvas)

> Devem ser as mesmas fontes usadas no template original. Candidatas prováveis baseadas na referência visual:

| Elemento | Fonte sugerida | Peso | Observação |
|---|---|---|---|
| **NOME** | Barlow Condensed | 800 ExtraBold | Maiúsculas, grande |
| **CARGO \| ÁREA** | Barlow Condensed | 700 Bold | Maiúsculas, menor |
| **"BEYOND SUMMIT"** | Barlow Condensed | 700 | Branco |
| **"INNOVATION CUP"** | DM Sans | 500 | Branco, menor |
| **Código do país (BRA)** | Barlow Condensed | 800 | Preto |

---

## 4. Layout da Interface

### 4.1 Fundo e Estilo Geral

- Fundo branco (`#FFFFFF`) dominante
- Formas orgânicas coloridas nos cantos (estilo dos slides) — implementadas via SVG absoluto ou CSS clip-path
- Sombras sutis em cards: `box-shadow: 0 2px 8px rgba(0,0,0,0.08)`
- Bordas arredondadas: `16px` em cards, `12px` em inputs, `8px` em botões menores

```
┌──────────────────────────────────────────────────┐
│ ██ roxo                            azul celeste ██│  ← formas orgânicas decorativas
│                                                  │
│              CONTEÚDO PRINCIPAL                  │
│                                                  │
│ ██ rosa                          verde limão ██  │  ← formas orgânicas decorativas
└──────────────────────────────────────────────────┘
```

### 4.2 Header

- Fundo branco com borda inferior sutil (`1px solid #E5E7EB`)
- **Esquerda:** Logo BeyondLabs (bússola estilizada), height 36px
- **Centro:** "BEYOND SUMMIT INNOVATION CUP" em Barlow Condensed 700
- **Direita:** vazio ou badge do ano (2026)
- Height: `64px` desktop, `56px` mobile

### 4.3 Tela 1 — Boas-vindas + Upload

```
┌──────────────────────────────────────────────────┐
│                                                  │
│        ⚽  BEYOND SUMMIT 2026                    │  Barlow Condensed 800, 52px
│     Crie sua figurinha do evento                 │  DM Sans 400, 18px, cinza
│                                                  │
│  ┌───────────────────────────────────────────┐   │
│  │                  [ ↑ ]                    │   │
│  │         Arraste sua foto aqui             │   │  borda pontilhada verde
│  │         ou clique para selecionar         │   │  bg verde bem claro #F0FDF4
│  │         JPG ou PNG  •  Máx. 5MB           │   │
│  └───────────────────────────────────────────┘   │
│                                                  │
│  💡 Use uma foto com fundo neutro e rosto        │
│     centralizado para melhor resultado           │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Upload Zone:**
- Borda: `2px dashed #3D9A52`, border-radius `20px`, padding `60px 40px`
- Background: `#F0FDF4` (verde bem claro)
- Hover: borda sólida `#1A5C2A` + `scale(1.01)`
- Drag-over: borda `#C9A84C` dourada + background `#FFFBEB`
- Ícone lucide `Upload`, 40px, cor `#1A5C2A`

### 4.4 Tela 2 — Loading (Remoção de Fundo)

```
┌──────────────────────────────────────────────────┐
│                                                  │
│              Preparando sua figurinha...         │
│                                                  │
│    ████████████████░░░░░░░  70%                  │  progress bar verde
│                                                  │
│    Removendo o fundo da sua foto                 │
│    Isso pode levar alguns segundos               │
│                                                  │
└──────────────────────────────────────────────────┘
```

- Progress bar: `#1A5C2A`, height `8px`, border-radius pill, animação suave
- Mensagem rotaciona entre 3 estados com fade: "Analisando sua foto..." → "Removendo o fundo..." → "Quase lá..."

### 4.5 Tela 3 — Editor (Preview + Formulário)

```
Desktop (> 1024px):
┌──────────────────────┬───────────────────────────┐
│                      │  Preencha seus dados       │
│   PREVIEW            │                           │
│   DA FIGURINHA       │  Nome *                   │
│   (~380x507px)       │  [______________________] │
│                      │                           │
│   [label: Preview]   │  Cargo *                  │
│                      │  [______________________] │
│                      │                           │
│                      │  Área *                   │
│                      │  [______________________] │
│                      │                           │
│                      │  Email *                  │
│                      │  [______________________] │
│                      │  ℹ uso interno do evento  │
│                      │                           │
│                      │  País *                   │
│                      │  [chips de países]        │
│                      │  [+ Ver mais países]      │
│                      │                           │
│                      │  ┌────────────────────┐   │
│                      │  │ ⬇  BAIXAR FIGURINHA│   │  CTA verde escuro
│                      │  └────────────────────┘   │
│                      │  [↗ Compartilhar]  [↺ Nova foto] │
└──────────────────────┴───────────────────────────┘
```

### 4.6 Select de Países — Dois Níveis

**Nível 1 — Chips em destaque:**
```
[🇧🇷 Brasil] [🇦🇷 Argentina] [🇲🇽 México] [🇨🇱 Chile]
[🇨🇴 Colômbia] [🇺🇾 Uruguai] [🇵🇪 Peru] [🇪🇨 Equador]

                  [ + Ver mais países ]
```

- Chip selecionado: `background #1A5C2A`, texto branco, borda verde escura
- Chip não selecionado: `background #F5F5F5`, texto `#374151`, borda `#D1D5DB`
- Hover: `background #F0FDF4`, borda `#3D9A52`
- Transition: `150ms ease`

**Nível 2 — Modal "Ver mais países":**
- Input de busca no topo
- Lista scrollável com todos os países restantes
- Filtro em tempo real pelo nome do país
- Países: Bolívia, Costa Rica, Cuba, El Salvador, Guatemala, Honduras, Nicarágua, Panamá, Paraguai, Porto Rico, República Dominicana, Venezuela, Portugal, Espanha

---

## 5. Componentes de UI

### 5.1 Botões

| Variante | Background | Texto | Borda | Uso |
|---|---|---|---|---|
| **Primary** | `#1A5C2A` | Branco, Barlow Condensed 700 18px | — | Download — ação principal |
| **Secondary** | Transparente | `#1A5C2A`, Barlow Condensed 700 | `2px solid #1A5C2A` | Compartilhar LinkedIn |
| **Ghost** | Transparente | `#374151`, DM Sans 500 | — | Nova foto, ações terciárias |

- Todos: `border-radius: 8px`, `padding: 12px 24px`, `transition: all 0.2s ease`
- **Primary grande (download):** `padding: 16px 32px`, `font-size: 20px`, largura 100%
- Hover Primary: `background: #3D9A52` + `translateY(-2px)` + sombra
- Ícone lucide `Download` à esquerda no botão Primary

### 5.2 Inputs

```
Estado normal:   border 1.5px solid #D1D5DB, border-radius 10px
Estado focus:    border #1A5C2A + ring rgba(26,92,42,0.1)
Estado erro:     border #EF4444 + ring rgba(239,68,68,0.1)
Estado filled:   sem mudança visual além do conteúdo
```

- Font: DM Sans 16px (mínimo — evita zoom iOS)
- Padding: `12px 16px`
- Label acima: DM Sans 14px SemiBold, `#374151`
- Asterisco obrigatório: `#EF4444`

### 5.3 Toasts (shadcn Sonner)

| Tipo | Situação | Cor borda esq. |
|---|---|---|
| Sucesso | Download concluído | `#1A5C2A` verde |
| Erro | Formato/tamanho inválido | `#EF4444` vermelho |
| Erro | Falha na remoção de fundo | `#EF4444` vermelho |
| Info | Registro enviado ao Cultura | `#4BBFDB` azul |

---

## 6. Elementos Decorativos

### 6.1 Formas Orgânicas nos Cantos

SVGs com `position: fixed` ou `position: absolute`, `z-index: 0`, atrás de todo o conteúdo:

| Posição | Cor | Tamanho aprox. |
|---|---|---|
| Canto superior esquerdo | `#6B3FA0` roxo | 160x160px |
| Canto superior direito | `#4BBFDB` azul celeste | 120x120px |
| Canto inferior esquerdo | `#E8365D` rosa | 140x140px |
| Canto inferior direito | `#8DC63F` verde limão | 150x150px |

Formas arredondadas, orgânicas — referenciar o estilo dos slides (quarto de círculo, ondas).

### 6.2 Padrão de Bola de Futebol (Watermark)

Baseado nos slides que mostram um watermark sutil de bola de futebol/Copa do Mundo no fundo:

```css
.background-pattern {
  background-image: url('/assets/soccer-pattern.svg');
  background-size: 120px;
  background-repeat: repeat;
  opacity: 0.04;
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
```

---

## 7. Template da Figurinha (Canvas)

### 7.1 Layers (ordem de renderização)

```
1. figurinha-bg.png      → Fundo verde com silhueta do "B" e "S"
2. foto do usuário       → PNG fundo removido, posicionado na silhueta
3. figurinha-overlay.png → Logo BS+troféu, "BEYOND SUMMIT", molduras superiores
4. bandeira + código     → Flag SVG/PNG + "BRA" no canto superior direito
5. NOME                  → Barlow Condensed 800, preto, maiúsculas
6. CARGO | ÁREA          → Barlow Condensed 700, sobre fundo verde claro
```

### 7.2 Posicionamento no Canvas (900x1200px)

| Elemento | X (px) | Y (px) | Largura | Altura | Notas |
|---|---|---|---|---|---|
| Fundo template | 0 | 0 | 900 | 1200 | Full canvas |
| Foto do usuário | ~162 | ~216 | ~558 | ~558 | Centralizar na silhueta |
| Logo BS+troféu | 27 | 36 | ~180 | auto | Canto sup esq |
| "BEYOND SUMMIT" | ~495 | 48 | auto | auto | Barlow 700, branco, ~28px |
| "INNOVATION CUP" | ~495 | 84 | auto | auto | DM Sans 500, branco, ~18px |
| Bandeira | ~468 | 126 | ~396 | auto | Flag + código BRA |
| NOME | 45 | 996 | 810 | auto | Barlow 800, ~72px |
| CARGO \| ÁREA | 45 | 1080 | 810 | ~72px | Barlow 700, ~22px, bg verde |

> **Nota:** Calibrar os valores exatos em desenvolvimento testando visualmente contra o template.

### 7.3 Separador Cargo e Área

```
DIRECTOR | BEYONDSUMMIT
```
- Caractere `|` com espaço em ambos os lados
- Tudo em maiúsculas
- Fundo verde claro cobrindo toda a linha horizontalmente

### 7.4 Exportação

- `canvas.toDataURL('image/png')` — sem compressão
- Nome do arquivo: `figurinha_beyondsummit2026.png`
- Preview na interface: escalonado via CSS, canvas real permanece 900x1200

---

## 8. Países

### 8.1 Chips Visíveis (nível 1)

Brasil, Argentina, México, Chile, Colômbia, Uruguai, Peru, Equador

### 8.2 Lista Completa "Ver mais" (nível 2)

Bolívia, Costa Rica, Cuba, El Salvador, Guatemala, Honduras, Nicarágua, Panamá, Paraguai, Porto Rico, República Dominicana, Venezuela, Portugal, Espanha

### 8.3 Bandeiras

Usar `country-flag-icons` (npm) ou SVGs do `circle-flags` (GitHub open source).
Código de cada país no formato ISO 3166-1 alpha-2 (ex: `br`, `ar`, `mx`).
Exibir código em maiúsculas na figurinha (ex: `BRA`, `ARG`, `MEX`).

---

## 9. Animações

| Momento | Animação | Duração |
|---|---|---|
| Entrada da página | Fade in + slide up 8px | 400ms ease-out |
| Upload zone drag-over | Scale 1.02 + borda dourada | 150ms ease |
| Transição upload → loading | Fade cross | 300ms ease-in-out |
| Progress bar | Width animado | Contínuo linear |
| Transição loading → editor | Slide da direita | 400ms ease-out |
| Figurinha pronta | Scale 0.95→1 + fade | 300ms ease-out |
| Chip de país selecionado | Background fill | 150ms ease |
| Hover botão download | TranslateY -2px + shadow | 150ms ease |

---

## 10. Responsividade

| Breakpoint | Comportamento |
|---|---|
| **Mobile** < 768px | Stack vertical. Preview 100% width. Formulário abaixo. Botão download sticky ou logo abaixo do preview. Chips de país em grid 2x4. |
| **Tablet** 768–1024px | Preview 280px + formulário ao lado. |
| **Desktop** > 1024px | Preview ~380px + formulário. Max-width 1100px centralizado na tela. |

---

## 11. CSS Variables

```css
:root {
  /* Cores primárias */
  --color-green-dark:    #1A5C2A;
  --color-green-mid:     #3D9A52;
  --color-green-light:   #7DC48A;
  --color-green-bg:      #F0FDF4;
  --color-gold:          #C9A84C;

  /* Neutros */
  --color-white:         #FFFFFF;
  --color-gray-light:    #F5F5F5;
  --color-gray-border:   #D1D5DB;
  --color-gray-text:     #374151;
  --color-black:         #111111;

  /* Acentos decorativos */
  --color-accent-purple: #6B3FA0;
  --color-accent-blue:   #4BBFDB;
  --color-accent-pink:   #E8365D;
  --color-accent-lime:   #8DC63F;
  --color-accent-yellow: #F5C518;

  /* Estados */
  --color-error:         #EF4444;
  --color-success:       #22C55E;

  /* Tipografia */
  --font-display:        'Barlow Condensed', sans-serif;
  --font-body:           'DM Sans', sans-serif;

  /* Border radius */
  --radius-sm:           8px;
  --radius-md:           12px;
  --radius-lg:           16px;
  --radius-xl:           20px;

  /* Sombras */
  --shadow-sm:           0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-md:           0 4px 16px rgba(0, 0, 0, 0.12);
}
```

---

## 12. Assets Necessários

| Asset | Formato | Origem | Status |
|---|---|---|---|
| `figurinha-bg.png` | PNG | Template em `assets/template-figurinha.webp` — exportar camada de fundo | ⚠️ Exportar do template |
| `figurinha-overlay.png` | PNG transparente | Template em `assets/template-figurinha.webp` — exportar camada overlay | ⚠️ Exportar do template |
| `beyondlabs-logo.png` | PNG fundo transparente | Extrair do slide — aguardando upload | 🔲 Pendente |
| `beyond-summit-logo.png` | PNG fundo transparente | Extrair do slide — aguardando upload | 🔲 Pendente |
| `flags/[code].svg` | SVG | `circle-flags` (open source) | 🔲 A baixar |
| `soccer-pattern.svg` | SVG | Criar ou open source | 🔲 A criar/buscar |
