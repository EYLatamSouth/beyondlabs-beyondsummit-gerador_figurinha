# Requirements: Beyond Summit Figurinha Generator

**Defined:** 2026-04-07
**Core Value:** O usuário consegue gerar e baixar sua figurinha personalizada em menos de 3 minutos, sem login, sem dependências externas para o processamento da foto.

## v1 Requirements

### Setup

- [ ] **SETUP-01**: Projeto inicializado com Vite + React 18 + TypeScript 5
- [ ] **SETUP-02**: Tailwind CSS 3 configurado com CSS variables do design system
- [ ] **SETUP-03**: shadcn/ui inicializado com componentes: Button, Input, Select, Sonner, Dialog
- [ ] **SETUP-04**: Fontes Barlow Condensed (700, 800) + DM Sans (400, 500, 600) carregadas via Google Fonts
- [ ] **SETUP-05**: Dependências instaladas: @imgly/background-removal, lucide-react
- [ ] **SETUP-06**: Estrutura de pastas criada (components/, hooks/, lib/, types/, pages/)
- [ ] **SETUP-07**: Assets em /public/: template/figurinha-bg.png, template/figurinha-overlay.png, flags/[code].svg, assets/beyondlabs-logo.png
- [ ] **SETUP-08**: staticwebapp.config.json configurado para SPA routing

### Types & Data

- [ ] **DATA-01**: Interface StampData tipada em src/types/stamp.ts
- [ ] **DATA-02**: Interface ParticipantRecord tipada em src/types/stamp.ts
- [ ] **DATA-03**: Interface Country tipada com code, codeDisplay, name, featured
- [ ] **DATA-04**: src/lib/countries.ts com lista completa de 22 países (8 featured)

### Upload

- [ ] **UPLOAD-01**: UploadZone.tsx com drag-and-drop e clique para selecionar
- [ ] **UPLOAD-02**: Estados visuais: idle / drag-over / selected
- [ ] **UPLOAD-03**: Validação de formato (JPG, PNG) com toast de erro em português
- [ ] **UPLOAD-04**: Validação de tamanho máximo (5MB) com toast de erro
- [ ] **UPLOAD-05**: Preview da foto original após seleção

### Background Removal

- [ ] **BG-01**: useBackgroundRemoval.ts integrado com @imgly/background-removal
- [ ] **BG-02**: Estados gerenciados: idle | processing | done | error
- [ ] **BG-03**: Retorna blob URL da imagem com fundo removido
- [ ] **BG-04**: Toast de erro amigável em caso de falha

### Country Select

- [ ] **COUNTRY-01**: CountrySelect.tsx com grid de 8 chips featured (bandeira + nome)
- [ ] **COUNTRY-02**: Estados dos chips: selecionado / hover / padrão
- [ ] **COUNTRY-03**: Botão "+ Ver mais países"
- [ ] **COUNTRY-04**: Dialog com campo de busca e lista completa filtrada em tempo real

### Form

- [ ] **FORM-01**: StampForm.tsx com campos: Nome, Cargo, Área, Email, País
- [ ] **FORM-02**: Todos os campos obrigatórios com validação antes de liberar download
- [ ] **FORM-03**: Mensagem de finalidade do email visível abaixo do campo
- [ ] **FORM-04**: Emite StampData via onChange a cada alteração

### Canvas

- [ ] **CANVAS-01**: src/lib/canvas.ts com funções puras de composição
- [ ] **CANVAS-02**: loadImage(src): Promise<HTMLImageElement> implementada
- [ ] **CANVAS-03**: composeLayers() na ordem correta: bg → foto → overlay → bandeira → textos
- [ ] **CANVAS-04**: drawText() com suporte a fonte, tamanho, cor e alinhamento
- [ ] **CANVAS-05**: Bloco CARGO | ÁREA com fundo verde claro renderizado
- [ ] **CANVAS-06**: Bandeira do país renderizada no canvas
- [ ] **CANVAS-07**: useStampCanvas.ts orquestrando a composição
- [ ] **CANVAS-08**: StampCanvas.tsx com preview em tempo real
- [ ] **CANVAS-09**: exportPNG() via canvas.toDataURL('image/png')

### Download & Share

- [ ] **DL-01**: DownloadButton.tsx com download PNG: figurinha_beyondsummit2026.png
- [ ] **DL-02**: Toast de confirmação após download
- [ ] **DL-03**: Botão "Compartilhar no LinkedIn" com Share API e texto pré-preenchido

### Analytics

- [ ] **ANALYTICS-01**: src/lib/analytics.ts com registerParticipant() — fire and forget
- [ ] **ANALYTICS-02**: Azure Function POST /api/register em /api/register/index.ts
- [ ] **ANALYTICS-03**: Validações no backend: email válido, país na lista, campos obrigatórios
- [ ] **ANALYTICS-04**: Integração com Azure Cosmos DB
- [ ] **ANALYTICS-05**: Registro acionado no clique do botão de download (sem await)
- [ ] **ANALYTICS-06**: Falha no registro não impacta o download

### Admin Panel

- [ ] **ADMIN-01**: src/pages/Admin.tsx na rota /admin
- [ ] **ADMIN-02**: AdminLogin.tsx com tela de senha simples
- [ ] **ADMIN-03**: Azure Function GET /api/metrics protegida por header x-admin-key
- [ ] **ADMIN-04**: AdminDashboard.tsx: total de participantes + gráfico por país
- [ ] **ADMIN-05**: ParticipantTable.tsx com dados exportáveis em CSV

### App & UI

- [ ] **APP-01**: Home.tsx com estado global: step, photoFile, processedPhotoUrl, stampData
- [ ] **APP-02**: Tela 1 — hero + upload zone
- [ ] **APP-03**: Tela 2 — loading com progress bar e mensagens rotativas
- [ ] **APP-04**: Tela 3 — preview canvas (esquerda) + formulário + botões (direita)
- [ ] **APP-05**: Botão "Nova foto" — volta à tela de upload e limpa estado
- [ ] **APP-06**: Rotas configuradas: / → Home, /admin → Admin
- [ ] **APP-07**: Formas orgânicas decorativas nos cantos (SVG absoluto)
- [ ] **APP-08**: Layout responsivo: desktop 2 colunas / mobile stack vertical

### Deploy

- [ ] **DEPLOY-01**: Azure Static Web App conectado ao repositório GitHub
- [ ] **DEPLOY-02**: Azure Cosmos DB configurado com collection participants
- [ ] **DEPLOY-03**: Secrets configurados no Azure Key Vault
- [ ] **DEPLOY-04**: Deploy validado com URL pública e SSL
- [ ] **DEPLOY-05**: Testes cross-browser: Chrome, Firefox, Edge, Safari, iOS, Android

## v2 Requirements

### Engagement (pós-evento, se validado)

- **V2-01**: Mural coletivo — Azure Blob Storage + página de exibição com lazy loading
- **V2-02**: Envio da figurinha por email — Azure Functions + Azure Communication Services
- **V2-03**: Compartilhamento direto com imagem no LinkedIn (requer OAuth)

### Corporate Integration (quando App Registration aprovado pelo TI)

- **V3-01**: Login via Azure AD (MSAL.js)
- **V3-02**: Preenchimento automático via Microsoft Graph API (nome, cargo, email, foto)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Login / autenticação | App Registration Azure AD depende de aprovação do TI — Fase 3 futura |
| Upload de foto para servidor | Privacidade — processamento 100% local via WASM |
| Domínio customizado | URL azurestaticapps.net suficiente para evento interno |
| Real-time collaboration | Fora do escopo do evento |
| localStorage / sessionStorage | Proibido por convenção do projeto |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SETUP-01..08 | Phase 1 | Pending |
| DATA-01..04 | Phase 1 | Pending |
| UPLOAD-01..05 | Phase 2 | Pending |
| BG-01..04 | Phase 2 | Pending |
| COUNTRY-01..04 | Phase 3 | Pending |
| FORM-01..04 | Phase 3 | Pending |
| CANVAS-01..09 | Phase 4 | Pending |
| DL-01..03 | Phase 5 | Pending |
| ANALYTICS-01..06 | Phase 5 | Pending |
| ADMIN-01..05 | Phase 6 | Pending |
| APP-01..08 | Phase 7 | Pending |
| DEPLOY-01..05 | Phase 8 | Pending |

**Coverage:**
- v1 requirements: 52 total
- Mapped to phases: 52
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-07*
*Last updated: 2026-04-07 after initial definition*
