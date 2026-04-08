# ROADMAP.md — Beyond Summit Figurinha Generator

> Versão alinhada ao PRD v2.1. Tasks em ordem de desenvolvimento recomendada.

---

## Fase 1 — MVP (escopo atual)

### 1.1 Setup do Projeto

- [ ] Criar repositório no GitHub
- [ ] Inicializar: `npm create vite@latest -- --template react-ts`
- [ ] Instalar e configurar Tailwind CSS
- [ ] Instalar e configurar shadcn/ui (`npx shadcn@latest init`)
- [ ] Adicionar componentes shadcn: `Button`, `Input`, `Select`, `Sonner`, `Dialog`
- [ ] Instalar dependências: `@imgly/background-removal`, `country-flag-icons`, `lucide-react`
- [ ] Configurar fontes Google: Barlow Condensed (700, 800) + DM Sans (400, 500, 600) em `index.css`
- [ ] Configurar CSS variables em `index.css` conforme `DESIGN.md`
- [ ] Criar estrutura de pastas conforme `ARCHITECTURE.md`
- [ ] Adicionar `copilot-instructions.md` em `.github/`
- [ ] Adicionar `staticwebapp.config.json` para SPA routing
- [ ] Otimizar e adicionar assets em `/public/`: `figurinha-bg.png`, `figurinha-overlay.png`, `beyondlabs-logo.png`, bandeiras SVG em `/public/flags/`

### 1.2 Tipos e Dados Base

- [ ] Criar `src/types/stamp.ts` com interfaces `StampData` e `ParticipantRecord`
- [ ] Criar `src/lib/countries.ts` com array completo (featured + lista completa com busca)

### 1.3 Componente: Upload

- [ ] Criar `UploadZone.tsx` com área drag-and-drop + clique para selecionar
- [ ] Estados visuais: idle / drag-over / selected
- [ ] Validação de formato (JPG, PNG) com toast de erro em português
- [ ] Validação de tamanho máximo (5MB) com toast de erro
- [ ] Preview da foto original após seleção

### 1.4 Hook: Remoção de Fundo

- [ ] Criar `useBackgroundRemoval.ts`
- [ ] Integrar `@imgly/background-removal`
- [ ] Gerenciar estados: `idle | processing | done | error`
- [ ] Retornar blob URL da imagem com fundo removido
- [ ] Tratamento de erro com toast amigável

### 1.5 Componente: Select de Países

- [ ] Criar `CountrySelect.tsx`
- [ ] Nível 1: grid de chips com 8 países em destaque (bandeira + nome)
- [ ] Estados dos chips: selecionado / hover / padrão (conforme `DESIGN.md`)
- [ ] Botão "+ Ver mais países"
- [ ] Nível 2: Dialog com campo de busca e lista completa filtrada em tempo real

### 1.6 Componente: Formulário

- [ ] Criar `StampForm.tsx`
- [ ] Campos: Nome, Cargo, Área, Email, País — todos obrigatórios
- [ ] Integrar `CountrySelect.tsx`
- [ ] Validação antes de liberar o botão de download
- [ ] Mensagem de finalidade do email visível abaixo do campo ("Seu email será usado apenas para fins internos de mensuração do evento")
- [ ] Emitir `StampData` via `onChange` a cada alteração

### 1.7 Canvas da Figurinha

- [ ] Criar `src/lib/canvas.ts` com funções puras
- [ ] Implementar `loadImage(src): Promise<HTMLImageElement>`
- [ ] Implementar `composeLayers()` na ordem correta de layers
- [ ] Implementar `drawText()` com suporte a fonte, tamanho, cor e alinhamento
- [ ] Renderizar bloco CARGO | ÁREA com fundo verde claro
- [ ] Renderizar bandeira do país no canvas
- [ ] Criar `useStampCanvas.ts` para orquestrar a composição
- [ ] Criar `StampCanvas.tsx` com preview em tempo real
- [ ] Calibrar posicionamento de todos os elementos contra o template visual
- [ ] Implementar `exportPNG()` via `canvas.toDataURL('image/png')`

### 1.8 Download e Compartilhamento

- [ ] Criar `DownloadButton.tsx`
- [ ] Botão "Baixar figurinha": download PNG com nome `figurinha_beyondsummit2026.png`
- [ ] Toast de confirmação após download
- [ ] Botão "Compartilhar no LinkedIn": LinkedIn Share API com texto pré-preenchido aprovado pelo time do evento

### 1.9 Registro de Participação (Analytics para o time de Cultura)

- [ ] Criar `src/lib/analytics.ts` com `registerParticipant()` — fire and forget
- [ ] Criar Azure Function `POST /api/register` em `/api/register/index.ts`
- [ ] Validações no backend: email válido, país na lista suportada, campos obrigatórios
- [ ] Integração com Azure Cosmos DB
- [ ] Configurar `COSMOS_CONNECTION_STRING` no Azure Key Vault
- [ ] Chamar `registerParticipant()` no clique do botão de download (sem await — não bloqueia)
- [ ] Confirmar que falha no registro não impacta o download da figurinha

### 1.10 Painel Admin

- [ ] Criar `src/pages/Admin.tsx` na rota `/admin`
- [ ] Criar `AdminLogin.tsx`: tela de senha antes de acessar os dados
- [ ] Criar Azure Function `GET /api/metrics` protegida por header `x-admin-key`
- [ ] Configurar `ADMIN_KEY` no Azure Key Vault
- [ ] Criar `AdminDashboard.tsx`: total de participantes + gráfico de distribuição por país
- [ ] Criar `ParticipantTable.tsx`: tabela com nome, email, país, horário
- [ ] Botão "Exportar CSV" — gera arquivo no browser via Blob + URL.createObjectURL

### 1.11 Composição da App e Telas

- [ ] Criar `Home.tsx` com estado global: `step`, `photoFile`, `processedPhotoUrl`, `stampData`
- [ ] Tela 1: hero + upload zone
- [ ] Tela 2: loading com progress bar e mensagens rotativas
- [ ] Tela 3: preview canvas (esquerda) + formulário + botões (direita)
- [ ] Transições entre telas conforme animações do `DESIGN.md`
- [ ] Botão "Nova foto" — volta à tela de upload e limpa o estado
- [ ] Configurar rotas: `/` → Home, `/admin` → Admin

### 1.12 Design e Responsividade

- [ ] Formas orgânicas decorativas nos cantos (SVG absoluto) conforme `DESIGN.md`
- [ ] Watermark sutil de padrão de futebol no fundo
- [ ] Header com logo BeyondLabs à esquerda
- [ ] Layout desktop (> 1024px): duas colunas
- [ ] Layout tablet (768–1024px): colunas mais estreitas
- [ ] Layout mobile (< 768px): stack vertical, preview acima, formulário abaixo
- [ ] Inputs com `font-size: 16px` mínimo (evita zoom automático no iOS)

### 1.13 Deploy e Testes

- [ ] Criar Azure Static Web App e conectar ao repositório GitHub
- [ ] Validar workflow do GitHub Actions gerado automaticamente
- [ ] Criar Azure Cosmos DB e configurar collection `participants`
- [ ] Configurar secrets no Azure Key Vault
- [ ] Primeiro deploy e validar URL pública com SSL
- [ ] Testar remoção de fundo: foto com fundo simples, fundo complexo, selfie
- [ ] Testar download em: Chrome, Firefox, Edge, Safari
- [ ] Testar em: iOS Safari, Chrome Android
- [ ] Testar painel `/admin`: acesso com senha correta, bloqueio sem senha, exportação CSV
- [ ] Confirmar chegada dos registros no Cosmos DB
- [ ] Smoke test: simular 50+ gerações seguidas e verificar estabilidade

---

## Fase 2 — Engajamento (pós-MVP, se validado)

- [ ] Mural coletivo: Azure Blob Storage para armazenar figurinhas + página de exibição com lazy loading
- [ ] Envio da figurinha por email (Azure Functions + Azure Communication Services)
- [ ] Compartilhamento direto com imagem no LinkedIn (requer OAuth)

---

## Fase 3 — Integração Corporativa (quando App Registration aprovado pelo TI)

- [ ] Login via Azure AD (MSAL.js)
- [ ] Preenchimento automático de nome, cargo e email via Microsoft Graph API
- [ ] Foto de perfil puxada do Teams automaticamente (sem upload)
- [ ] Área/equipe via campo `department` do AD

---

## Ordem de Desenvolvimento Recomendada

```
1.  Setup + estrutura de pastas + assets
2.  Tipos e dados (stamp.ts, countries.ts)
3.  UploadZone (validação e preview — sem remoção de fundo ainda)
4.  useBackgroundRemoval (testar isolado, logar blob URL no console)
5.  CountrySelect (chips nível 1 + modal com busca nível 2)
6.  StampForm (campos + validação — sem canvas ainda)
7.  canvas.ts (funções puras com dados mockados, verificar no console)
8.  StampCanvas (integrar canvas.ts, ver preview funcionando)
9.  Home.tsx (conectar tudo — estado + transições entre telas)
10. DownloadButton (download + LinkedIn)
11. analytics.ts + Azure Function POST /api/register
12. Painel admin + Azure Function GET /api/metrics
13. Polimento visual (formas decorativas, watermark, responsividade)
14. Deploy Azure + testes cross-browser
```
