# Beyond Summit Figurinha Generator

## What This Is

Web app para geração de figurinhas digitais temáticas Copa do Mundo 2026 para o evento corporativo interno Beyond Summit da EY América Latina. O usuário faz upload de uma foto, o app remove o fundo localmente via WASM, preenche seus dados e gera uma figurinha personalizada para download. Dados de participação são registrados anonimamente para o time de Cultura via backend mínimo (Azure Functions + Cosmos DB).

## Core Value

O usuário consegue gerar e baixar sua figurinha personalizada em menos de 3 minutos, sem login, sem dependências externas para o processamento da foto.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Upload de foto com drag-and-drop, validação de formato/tamanho, preview
- [ ] Remoção de fundo client-side via @imgly/background-removal (WASM)
- [ ] Canvas com composição de layers em tempo real (bg + foto + overlay + bandeira + textos)
- [ ] Formulário: Nome, Cargo, Área, Email, País — todos obrigatórios
- [ ] Select de países com chips (featured) + modal de busca completa
- [ ] Download do PNG via canvas.toDataURL()
- [ ] Botão de compartilhamento no LinkedIn (Share API, sem OAuth)
- [ ] Registro de participação assíncrono: POST /api/register (fire and forget)
- [ ] Painel /admin protegido por senha: total, tabela exportável em CSV, gráfico por país
- [ ] Deploy no Azure Static Web Apps via GitHub Actions

### Out of Scope

- Login/autenticação Azure AD — aguarda aprovação do TI (Fase 3 futura)
- Mural coletivo — pós-evento, se validado (Fase 2)
- Envio de figurinha por email — pós-evento (Fase 2)
- Compartilhamento direto com imagem no LinkedIn (requer OAuth) — Fase 2
- Upload de foto para servidor externo — privacidade, processamento é 100% local

## Context

- Evento interno da EY América Latina com ~1.000+ participantes
- Template da figurinha já aprovado pelo time de design
- Assets pendentes: figurinha-bg.png, figurinha-overlay.png, bandeiras SVG, logo BeyondLabs
- Fontes: Barlow Condensed (canvas/display) + DM Sans (interface)
- Sem domínio customizado — usar URL padrão azurestaticapps.net
- Backend mínimo introduzido na v2.1 para atender requisito de coleta de indicadores do time de Cultura

## Constraints

- **Tech Stack**: React 18 + TypeScript 5 + Vite 5 + Tailwind CSS 3 + shadcn/ui — fixado
- **Privacy**: Nenhuma foto ou dado de imagem enviado a servidor externo
- **Performance**: Remoção de fundo < 10s desktop, bundle JS inicial < 500KB gzipped
- **Compatibility**: Chrome, Firefox, Edge, Safari (últimas 2 versões) + iOS Safari + Chrome Android
- **Backend**: Azure Functions v4 (Node.js) + Azure Cosmos DB — plataforma EY
- **No localStorage/sessionStorage**: Proibido por convenção do projeto

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Remoção de fundo client-side (@imgly WASM) | Privacidade + sem custos de API + sem dependência externa | — Pending |
| Backend mínimo (Azure Functions) apenas para analytics | Download nunca bloqueado pelo registro; fire and forget | — Pending |
| Sem autenticação no MVP | App Registration Azure AD depende de aprovação TI | — Pending |
| Azure Static Web Apps | Hosting gratuito com SSL + Functions integradas + GitHub Actions | — Pending |
| Canvas 900x1200px | Proporção 3:4 do template aprovado | — Pending |

---
*Last updated: 2026-04-07 after initialization*
