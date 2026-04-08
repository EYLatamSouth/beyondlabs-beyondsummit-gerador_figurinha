# Roadmap: Beyond Summit Figurinha Generator

**Milestone:** v1.0 — MVP completo e deployado
**Requirements:** 52 v1 requirements | 8 phases

---

## Phase 1: Project Setup & Foundation

**Goal:** Projeto inicializado, configurado e pronto para desenvolvimento com todos os assets e estrutura de pastas.

**Requirements:** SETUP-01..08, DATA-01..04

**Success Criteria:**
1. `npm run dev` sobe o app sem erros
2. Tailwind CSS variables do design system funcionando (cores e fontes corretas na UI)
3. shadcn/ui operacional com Button, Input, Select, Sonner, Dialog disponíveis
4. Assets de template e bandeiras acessíveis em /public/
5. Tipos TypeScript compilando sem erros

---

## Phase 2: Upload & Background Removal

**Goal:** Usuário consegue fazer upload de uma foto e ver o resultado com fundo removido.

**Requirements:** UPLOAD-01..05, BG-01..04

**Success Criteria:**
1. Drag-and-drop e clique funcionando para seleção de arquivo
2. Validação rejeita arquivos não-JPG/PNG com toast em português
3. Validação rejeita arquivos > 5MB com toast em português
4. Preview da foto original exibido após upload
5. Fundo removido com @imgly e blob URL retornada corretamente
6. Loading state claro durante o processamento (não trava a UI)
7. Toast de erro amigável se remoção de fundo falhar

---

## Phase 3: Country Select & Form

**Goal:** Usuário consegue selecionar seu país e preencher todos os campos da figurinha.

**Requirements:** COUNTRY-01..04, FORM-01..04

**Success Criteria:**
1. Grid com 8 chips de países featured exibido corretamente com bandeira + nome
2. Chip selecionado com estado visual distinto
3. Modal "Ver mais" abre com campo de busca funcional filtrando os 22 países
4. StampForm emite StampData atualizado a cada keystroke
5. Botão de download desabilitado enquanto qualquer campo obrigatório estiver vazio
6. Mensagem de finalidade do email visível no formulário

---

## Phase 4: Canvas Engine

**Goal:** Figurinha renderizada em tempo real no canvas com todos os layers corretos.

**Requirements:** CANVAS-01..09

**Success Criteria:**
1. Canvas 900x1200px renderizado com os 5 layers na ordem correta
2. Foto do usuário (fundo removido) posicionada na silhueta do template
3. Bandeira do país atualiza em tempo real ao mudar a seleção
4. Nome renderizado em Barlow Condensed bold grande
5. Bloco CARGO | ÁREA com fundo verde claro renderizado corretamente
6. exportPNG() gera um arquivo PNG válido e sem artefatos
7. Preview em tempo real sem delay perceptível ao digitar

---

## Phase 5: Download, Share & Analytics

**Goal:** Usuário baixa a figurinha e a participação é registrada anonimamente.

**Requirements:** DL-01..03, ANALYTICS-01..06

**Success Criteria:**
1. Clique no botão inicia download imediato do PNG com nome correto
2. Toast de confirmação "Figurinha salva!" exibido após download
3. Botão LinkedIn abre Share API com texto pré-preenchido correto
4. POST /api/register chamado de forma assíncrona (não bloqueia o download)
5. Falha no registro não exibe nenhum erro ao usuário nem atrasa o download
6. Registro chegando corretamente no Cosmos DB com nome, email, país, timestamp

---

## Phase 6: Admin Panel

**Goal:** Time de Cultura consegue acessar indicadores de participação e exportar dados.

**Requirements:** ADMIN-01..05

**Success Criteria:**
1. Rota /admin protegida — acesso bloqueado sem a senha correta
2. Dashboard exibe total de participantes atualizado
3. Tabela de participantes com nome, email, país, horário
4. Botão "Exportar CSV" gera arquivo válido no browser
5. Gráfico de distribuição por país renderizado
6. GET /api/metrics rejeitando requisições sem header x-admin-key

---

## Phase 7: App Composition & Design Polish

**Goal:** Experiência completa integrada com navegação entre telas, responsividade e polimento visual.

**Requirements:** APP-01..08

**Success Criteria:**
1. Fluxo completo funciona: upload → loading → editor → download → nova foto
2. Loading screen com progress bar e mensagens rotativas exibido durante remoção de fundo
3. Layout desktop: canvas à esquerda, formulário à direita (2 colunas)
4. Layout mobile: preview acima, formulário abaixo (stack vertical)
5. Formas orgânicas decorativas nos cantos renderizadas corretamente
6. Watermark de padrão de futebol no fundo sutil e visível
7. Header com logo BeyondLabs presente em todas as telas

---

## Phase 8: Deploy & Testing

**Goal:** App deployado no Azure Static Web Apps e validado em todos os browsers e dispositivos alvo.

**Requirements:** DEPLOY-01..05

**Success Criteria:**
1. Azure Static Web App conectado ao repositório com deploy automático via GitHub Actions
2. Azure Cosmos DB recebendo registros com a collection participants
3. URL pública acessível com SSL ativo
4. Download funcional em Chrome, Firefox, Edge e Safari
5. App funcional em iOS Safari e Chrome Android
6. Remoção de fundo testada com: foto com fundo simples, fundo complexo, selfie
7. Painel /admin acessível com senha correta e bloqueado sem ela

---

## Phase Summary

| # | Phase | Requirements | Key Outcome |
|---|-------|--------------|-------------|
| 1 | Project Setup & Foundation | SETUP-01..08, DATA-01..04 | Dev environment pronto |
| 2 | Upload & Background Removal | UPLOAD-01..05, BG-01..04 | Foto processada no browser |
| 3 | Country Select & Form | COUNTRY-01..04, FORM-01..04 | Dados da figurinha coletados |
| 4 | Canvas Engine | CANVAS-01..09 | Preview em tempo real funcionando |
| 5 | Download, Share & Analytics | DL-01..03, ANALYTICS-01..06 | Download + registro de participação |
| 6 | Admin Panel | ADMIN-01..05 | Painel de indicadores para Cultura |
| 7 | App Composition & Polish | APP-01..08 | UX completa e responsiva |
| 8 | Deploy & Testing | DEPLOY-01..05 | App no ar validado |

---
*Roadmap created: 2026-04-07*
