# ⚽ Beyond Summit 2026 — Gerador de Figurinha
## Product Requirements Document — v2.1

| Campo | Valor |
|---|---|
| **Produto** | Beyond Summit Figurinha Generator |
| **Versão do PRD** | 2.1 |
| **Status** | Aprovado — Pronto para desenvolvimento |
| **Público-alvo** | Evento corporativo interno — América Latina |
| **Estimativa de usuários** | 1.000+ participantes |
| **Plataforma** | Web App (Desktop + Mobile) |
| **Arquitetura** | 100% client-side — sem backend, sem autenticação |

> **Nota de versão:** A v2.1 adiciona o requisito de coleta de indicadores para o time de Cultura (quantidade de participantes, emails e distribuição por país), introduzindo um backend mínimo via Azure Functions. A v2.0 permanece como referência da arquitetura client-side pura.

---

## 1. Visão Geral do Produto

O **Beyond Summit Figurinha Generator** é uma web application temática de Copa do Mundo 2026, desenvolvida para a edição latino-americana do evento corporativo interno Beyond Summit. O produto permite que qualquer participante gere uma **figurinha digital personalizada no estilo do álbum Beyond Summit**, a partir do upload de uma foto própria, preenchimento de informações e download do resultado em PNG.

Toda a experiência acontece no browser, sem login, sem backend e sem dependências externas além do hosting. A remoção de fundo da foto é processada localmente no dispositivo do usuário via modelo de machine learning embarcado na biblioteca `@imgly/background-removal`.

---

## 2. Objetivos e Métricas de Sucesso

### 2.1 Objetivos de Negócio

- Aumentar o engajamento dos participantes durante o evento online
- Gerar conteúdo orgânico nas redes sociais, especialmente LinkedIn, com menção ao Beyond Summit
- Fortalecer o espírito de equipe latino-americano do evento
- Criar um artefato digital memorável e compartilhável que represente o colaborador
- **Fornecer ao time de Cultura indicadores de participação:** total de figurinhas geradas, emails dos participantes e distribuição por país

### 2.2 Métricas de Sucesso (KPIs)

| Métrica | Meta |
|---|---|
| **Adesão** | Mínimo de 40% dos participantes gerando sua figurinha |
| **Downloads** | Mínimo de 60% das figurinhas geradas sendo baixadas |
| **Compartilhamentos** | Mínimo de 20% sendo compartilhadas no LinkedIn |
| **Performance** | Remoção de fundo concluída em < 10s em desktop |
| **Disponibilidade** | Uptime de 99,5% durante o período do evento |
| **Cobertura de dados** | 100% das figurinhas geradas registradas no painel de indicadores |
| **Distribuição geográfica** | Dashboard com participantes segmentados por país disponível ao time de Cultura |

---

## 3. Contexto e Motivação

O Beyond Summit é um evento corporativo interno de alcance latino-americano. A edição de 2026 tem como tema a **Copa do Mundo FIFA 2026**. O evento acontece no formato online, com participantes de múltiplos países da América Latina.

O Gerador de Figurinha é uma ativação digital leve e compartilhável que transforma cada colaborador em uma figurinha do álbum oficial do evento — no estilo visual do template **Beyond Summit Innovation Cup**.

### 3.1 Decisões de Arquitetura

**Por que sem autenticação?**
O App Registration no Azure AD é um processo que depende de aprovação do time de TI corporativo e não pode ser iniciado sem um produto funcional para apresentar. A abordagem sem autenticação permite desenvolver e lançar o MVP imediatamente, e adicionar a integração com Microsoft Graph em versões futuras.

**Por que remoção de fundo client-side?**
A biblioteca `@imgly/background-removal` executa um modelo de segmentação de imagem diretamente no browser via WebAssembly, sem enviar dados para nenhum servidor externo. Isso elimina custos de API, limites de uso, dependências externas e preocupações de privacidade. A qualidade é suficiente para fotos de rosto com iluminação razoável.

**Por que sem domínio customizado?**
O Azure Static Web Apps fornece gratuitamente uma URL pública com SSL no formato `https://[nome].azurestaticapps.net`. Para o contexto de um evento interno, essa URL é suficiente e elimina o custo e burocracia de aquisição de domínio.

**Por que introduzir um backend mínimo para os indicadores?**
O requisito de coleta de email, contagem de participantes e distribuição por país não pode ser atendido em uma arquitetura 100% client-side — dados no browser não persistem entre sessões. A solução adotada é um backend mínimo via **Azure Functions + Azure Cosmos DB**, acionado apenas no momento em que o usuário clica em "Gerar figurinha". O frontend continua sem autenticação e sem alteração no fluxo do usuário. O email é coletado como campo opcional no formulário, com consentimento explícito informado na interface.

---

## 4. Usuários e Personas

### 4.1 Público Principal

| Campo | Detalhe |
|---|---|
| **Perfil** | Colaboradores corporativos participantes do Beyond Summit 2026 |
| **Localização** | América Latina (Brasil, México, Argentina, Chile, Colômbia e outros) |
| **Estimativa** | 1.000+ participantes durante o evento |
| **Dispositivos** | Desktop (primário), Mobile (secundário) |
| **Autenticação** | Nenhuma — acesso público via URL |
| **Familiaridade técnica** | Variada — UX deve ser intuitiva em até 3 passos |

### 4.2 Personas

**Persona 1 — O Colaborador Engajado**
Quer participar de tudo, compartilha no LinkedIn, vai indicar pro time. Precisa de resultado rápido e bonito. Comportamento: sobe foto, preenche dados, baixa e compartilha.

**Persona 2 — O Participante Casual**
Acessa se for fácil. Não vai repetir o processo se travar. Precisa de fluxo em menos de 3 cliques. Comportamento: sobe foto, preenche o mínimo, baixa.

**Persona 3 — O Líder / Gestor**
Quer dar o exemplo e engajar o time. Alta chance de postar no LinkedIn. Precisa de qualidade visual e texto de compartilhamento pronto.

---

## 5. Funcionalidades e Requisitos

### 5.1 Upload de Foto

- Campo de upload com drag-and-drop e clique para selecionar
- Formatos aceitos: JPG, JPEG, PNG
- Tamanho máximo: 5MB
- Validação com mensagem de erro amigável caso o arquivo seja inválido
- Preview imediato da foto original após o upload antes do processamento

### 5.2 Remoção de Fundo

- Processada 100% no browser via `@imgly/background-removal`
- Executada automaticamente após o upload, sem ação adicional do usuário
- Animação de loading com feedback de progresso durante o processamento
- Resultado: imagem PNG com fundo transparente, pronta para composição no canvas
- Em caso de resultado insatisfatório, o usuário pode fazer novo upload

### 5.3 Campos da Figurinha

Todos os campos são preenchidos manualmente pelo usuário diretamente no preview interativo:

| Campo | Tipo | Observação |
|---|---|---|
| **Nome** | Texto livre | Obrigatório |
| **Cargo** | Texto livre | Obrigatório |
| **Área** | Texto livre | Obrigatório |
| **País** | Select com bandeirinha | Lista com países da América Latina + Portugal + Espanha. Obrigatório. |
| **Email** | Texto livre (email) | Obrigatório. Coletado para o time de Cultura. Informar ao usuário a finalidade antes de preencher. |

### 5.4 Preview Interativo

- A figurinha é renderizada em tempo real no canvas conforme os campos são preenchidos
- O usuário vê exatamente como ficará o resultado final antes de baixar
- Os campos de texto são editáveis diretamente no painel lateral ao preview
- O país selecionado atualiza a bandeirinha exibida na figurinha em tempo real
- A foto com fundo removido é posicionada automaticamente na área da silhueta do template

### 5.5 Geração da Figurinha no Canvas

A figurinha é composta no canvas na seguinte ordem de layers:

1. **Fundo** — template PNG base do Beyond Summit (fundo verde degradê)
2. **Foto** — imagem do usuário com fundo removido, posicionada e redimensionada na área da silhueta
3. **Overlay** — camadas gráficas superiores do template (logo BS, troféu, elementos decorativos)
4. **Bandeirinha** — flag do país selecionado + código (ex: BRA)
5. **Textos** — Nome, Cargo e Área renderizados com as fontes e posições do template

**Especificações técnicas do canvas:**
- Dimensões de exportação: proporção do template original (referência: ~900x1200px)
- Fonte do Nome: bold, grande, cor preta — fiel ao template
- Fonte de Cargo e Área: regular, menor, sobre fundo verde claro — fiel ao template
- Renderização fiel ao template visual aprovado

### 5.6 Download

- Botão **"Baixar minha figurinha"** exporta o canvas como PNG de alta resolução
- Nome do arquivo: `figurinha_beyondsummit2026.png`
- Download processado 100% no cliente via `canvas.toDataURL()`
- Feedback visual (animação ou toast) confirmando o download

### 5.7 Coleta de Indicadores para o Time de Cultura

No momento em que o usuário clica em **"Gerar minha figurinha"**, o app envia silenciosamente um registro para o backend com os seguintes dados:

| Dado | Origem | Finalidade |
|---|---|---|
| **Email** | Campo do formulário (opcional) | Identificação do participante |
| **País** | Select do formulário | Distribuição geográfica |
| **Timestamp** | Gerado no servidor | Linha do tempo de participação |
| **Nome** | Campo do formulário | Identificação (não obrigatório para o painel) |

**Regras:**
- O envio é feito via `POST /api/register` (Azure Function) de forma assíncrona — não bloqueia nem atrasa a geração da figurinha
- Se o envio falhar (sem conexão, erro no servidor), a figurinha é gerada normalmente — a coleta de dados nunca impede a experiência principal
- O campo de email é **obrigatório** e acompanhado de uma mensagem clara: *"Seu email será usado apenas para fins internos de mensuração do evento"*
- Nenhum dado de imagem ou foto é enviado ao servidor

**Painel de indicadores (admin):**
- Rota protegida por senha simples: `/admin` (sem necessidade de Azure AD)
- Exibe: total de figurinhas geradas, lista de emails coletados (exportável em CSV), gráfico de participantes por país
- Implementado como página React separada, acessível apenas por quem tiver a senha definida no ambiente

### 5.8 Compartilhamento no LinkedIn

- Botão **"Compartilhar no LinkedIn"** abre a LinkedIn Share API com texto pré-preenchido
- Texto sugerido: *"Essa é minha figurinha do Beyond Summit 2026! O maior evento interno da EY para a América Latina. #BeyondSummit2026 #CopadoMundo2026 #EY"*
- O usuário pode anexar a figurinha baixada manualmente na janela do LinkedIn
- Não requer autenticação ou OAuth

---

## 6. User Journey — Fluxo Principal

```
[1] ACESSO
    Usuário recebe a URL do app nas comunicações do evento.
    Acessa direto no browser — sem login, sem cadastro.

[2] BOAS-VINDAS
    Tela inicial temática Beyond Summit com CTA "Criar minha figurinha".

[3] UPLOAD
    Usuário clica no campo de upload ou arrasta uma foto.
    Preview da foto original é exibido imediatamente.

[4] REMOÇÃO DE FUNDO  (~5–10s)
    Processamento automático com animação de loading.
    "Preparando sua foto..."
    Foto com fundo removido é posicionada na silhueta da figurinha.

[5] PERSONALIZAÇÃO
    Preview da figurinha é exibido com a foto já posicionada.
    Painel lateral com os campos: Nome, Cargo, Área, País.
    Campo opcional: Email — com mensagem de finalidade visível.
    A figurinha atualiza em tempo real conforme os campos são preenchidos.

[6] GERAÇÃO + REGISTRO
    Usuário clica em "Gerar minha figurinha".
    → Canvas exporta o PNG (client-side, instantâneo)
    → App envia registro silencioso ao backend: email, país, nome, timestamp
       (assíncrono — não bloqueia nem atrasa o download)

[7] DOWNLOAD
    PNG é gerado e baixado automaticamente.
    Toast de confirmação: "Figurinha salva!"

[8] COMPARTILHAMENTO (opcional)
    Botão "Compartilhar no LinkedIn" abre janela com texto pré-preenchido.
    Usuário anexa a figurinha baixada e publica.
```

---

## 7. Arquitetura Técnica

### 7.1 Visão Geral

O frontend é 100% client-side. O backend é mínimo — uma única Azure Function para registro de participação, acionada assincronamente sem impactar a experiência do usuário.

```
[ Browser ]
  → React App (Vite)
  → Upload da foto (File API)
  → @imgly/background-removal (WebAssembly, local)
  → HTML5 Canvas API (composição da figurinha)
  → canvas.toDataURL() → download PNG
  → POST /api/register → Azure Function (assíncrono, não-bloqueante)

[ Azure Function — POST /api/register ]
  → Recebe: { nome, email, pais, timestamp }
  → Salva no Azure Cosmos DB
  → Sem retorno aguardado pelo frontend (fire and forget)

[ Azure Cosmos DB ]
  → Armazena registros de participação
  → Consultado pelo painel /admin

[ Painel /admin ]
  → Rota React protegida por senha simples
  → Total de participantes
  → Lista de emails (exportável em CSV)
  → Distribuição por país

[ Azure Static Web Apps ]
  → Serve o bundle React estático + Azure Functions integradas
  → SSL gratuito
  → URL: https://[nome].azurestaticapps.net
  → Deploy via GitHub Actions
```

### 7.2 Assets Estáticos (bundled na aplicação)

- Template PNG da figurinha (camadas separadas: fundo, overlay)
- SVGs ou PNGs das bandeiras dos países da América Latina + PT + ES
- Fontes utilizadas no template (devem ser as mesmas do design original)

### 7.3 Estrutura de Pastas do Projeto

```
/
├── public/
│   ├── template/
│   │   ├── figurinha-bg.png       # Fundo do template
│   │   └── figurinha-overlay.png  # Camada superior (logo, elementos)
│   └── flags/                     # Bandeiras em SVG ou PNG
│       ├── br.svg
│       ├── mx.svg
│       └── ...
├── src/
│   ├── components/
│   │   ├── UploadZone.tsx         # Campo de upload com drag-and-drop
│   │   ├── StampCanvas.tsx        # Canvas da figurinha (composição)
│   │   ├── StampForm.tsx          # Formulário lateral (nome, cargo, área, país, email)
│   │   ├── CountrySelect.tsx      # Select de países com bandeirinha
│   │   ├── DownloadButton.tsx     # Botão de download + compartilhar
│   │   └── admin/
│   │       ├── AdminLogin.tsx     # Tela de senha do painel
│   │       ├── AdminDashboard.tsx # Painel de indicadores
│   │       └── ParticipantTable.tsx # Tabela exportável em CSV
│   ├── hooks/
│   │   ├── useBackgroundRemoval.ts # Hook para @imgly/background-removal
│   │   └── useStampCanvas.ts       # Hook para composição do canvas
│   ├── lib/
│   │   ├── countries.ts            # Lista de países com código e nome
│   │   ├── canvas.ts               # Utilitários de composição do canvas
│   │   └── analytics.ts            # Função de registro assíncrono no backend
│   ├── types/
│   │   └── stamp.ts                # Tipos TypeScript (StampData, ParticipantRecord)
│   ├── pages/
│   │   ├── Home.tsx                # Fluxo principal (upload → editor → download)
│   │   └── Admin.tsx               # Painel de indicadores (rota /admin)
│   ├── App.tsx
│   └── main.tsx
├── api/                            # Azure Functions
│   └── register/
│       └── index.ts                # POST /api/register — salva registro no Cosmos DB
├── docs/
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── DESIGN.md
│   └── ROADMAP.md
├── .github/
│   ├── copilot-instructions.md
│   └── workflows/
│       └── azure-static-web-apps.yml
└── staticwebapp.config.json
```

---

## 8. Stack Tecnológica

| Tecnologia | Versão | Uso |
|---|---|---|
| **React** | 18 | Framework UI |
| **TypeScript** | 5.x | Tipagem estática |
| **Vite** | 5.x | Bundler e dev server |
| **Tailwind CSS** | 3.x | Estilização |
| **shadcn/ui** | latest | Componentes base (Select, Toast, Button, Input) |
| **@imgly/background-removal** | latest | Remoção de fundo client-side |
| **HTML5 Canvas API** | nativa | Composição e exportação da figurinha |
| **Azure Functions** | v4 (Node.js) | Endpoint de registro de participação (`POST /api/register`) |
| **Azure Cosmos DB** | — | Armazenamento dos registros de participação |
| **Azure Static Web Apps** | — | Hosting gratuito com SSL + Functions integradas |
| **GitHub Actions** | — | CI/CD para deploy automático |

---

## 9. Diretrizes de Design

### 9.1 Template Visual (referência aprovada)

O template da figurinha está definido e aprovado. As especificações visuais extraídas do template:

| Elemento | Especificação |
|---|---|
| **Fundo** | Verde degradê — verde escuro no topo, verde claro no corpo |
| **Logo** | "BS" + troféu Copa do Mundo — canto superior esquerdo |
| **Título** | "BEYOND SUMMIT / INNOVATION CUP" — canto superior direito, bold, branco |
| **Bandeirinha** | Flag do país + código (ex: BRA) — destaque no topo direito, fundo branco |
| **Área da foto** | Silhueta branca centralizada — foto recortada e posicionada dentro dela |
| **Nome** | Bold, grande, preto — parte inferior da figurinha |
| **Cargo** | Tag com fundo verde claro, texto escuro — abaixo do nome |
| **Área** | Tag com fundo verde médio, texto escuro — ao lado do cargo |
| **Proporção** | Portrait, aproximadamente 3:4 |

### 9.2 Interface do App (fora da figurinha)

- Tema escuro ou temático Copa do Mundo para a interface do app
- Identidade visual alinhada com o Beyond Summit (verde + branco + dourado)
- Tipografia moderna e legível
- Animações suaves no loading da remoção de fundo
- Layout responsivo: sidebar em desktop, stacked em mobile

### 9.3 UX

- Máximo de 3 passos perceptíveis para o usuário
- Loading state claro durante a remoção de fundo (é o momento mais demorado)
- Todos os campos com placeholder indicando o que preencher
- Botão de download em destaque visual — é o CTA principal
- Mensagens de erro amigáveis em português

---

## 10. Países Suportados

América Latina completa + Portugal e Espanha:

Argentina, Bolívia, Brasil, Chile, Colômbia, Costa Rica, Cuba, República Dominicana, Equador, El Salvador, Guatemala, Honduras, México, Nicarágua, Panamá, Paraguai, Peru, Porto Rico, Uruguai, Venezuela, Portugal, Espanha.

---

## 11. Requisitos Não Funcionais

| Requisito | Detalhe |
|---|---|
| **Performance** | Remoção de fundo < 10s em desktop. Carregamento inicial < 3s. |
| **Compatibilidade** | Chrome, Firefox, Edge, Safari — últimas 2 versões. iOS Safari e Chrome Android. |
| **Mobile** | Funcional em mobile, experiência principal otimizada para desktop. |
| **Privacidade** | Nenhuma foto ou dado é enviado a servidores externos. Processamento 100% local. |
| **Acessibilidade** | Contraste adequado (WCAG AA), labels nos campos de formulário. |
| **Bundle size** | Bundle JS inicial < 500KB gzipped (excluindo o modelo WASM do @imgly). |
| **Offline** | Não necessário — o evento é online com conectividade garantida. |

---

## 12. Fases de Desenvolvimento

### Fase 1 — MVP (escopo atual deste PRD)

**Objetivo:** App funcional do zero ao download, com coleta de indicadores para o time de Cultura.

- [ ] Setup do projeto (Vite + React + TypeScript + Tailwind + shadcn)
- [ ] Componente de upload com drag-and-drop
- [ ] Integração do `@imgly/background-removal`
- [ ] Canvas da figurinha com template base
- [ ] Composição dos layers (fundo + foto + overlay + bandeira + textos)
- [ ] Preview em tempo real
- [ ] Formulário de personalização (nome, cargo, área, país, email — todos obrigatórios)
- [ ] Download em PNG
- [ ] Azure Function `POST /api/register` — salva registro no Cosmos DB
- [ ] Envio assíncrono do registro ao clicar em "Gerar figurinha" (fire and forget)
- [ ] Painel `/admin` com senha simples — total, emails exportáveis em CSV, gráfico por país
- [ ] Deploy no Azure Static Web Apps
- [ ] Testes em desktop e mobile

### Fase 2 — Engajamento (pós-evento, se validado)

- Compartilhamento direto no LinkedIn com imagem
- Mural coletivo (requer backend — Azure Functions + Blob Storage)
- Envio por email (requer Azure Functions + ACS)

### Fase 3 — Integração Corporativa (quando App Registration aprovado)

- Login via Azure AD (MSAL.js)
- Preenchimento automático via Microsoft Graph API (nome, cargo, foto)
- Área preenchida via `department` do perfil AD

---

## 13. Riscos e Mitigações

| Risco | Impacto | Mitigação |
|---|---|---|
| Remoção de fundo com qualidade baixa em fotos com fundo complexo | Médio | Instruções claras de qual tipo de foto usar (fundo neutro, rosto centralizado). Botão de refazer upload. |
| Performance lenta do `@imgly` em dispositivos móveis antigos | Médio | Loading state claro. Avisar que o processamento pode levar até 15–20s em mobile. |
| Template PNG muito pesado aumentando o bundle | Baixo | Otimizar os assets com pngquant/squoosh antes de adicionar ao repositório. |
| Fontes do template não disponíveis como web font | Médio | Identificar as fontes exatas do template e configurar como `@font-face` no projeto. |
| Usuário sobe foto em formato não suportado (HEIC, WebP) | Baixo | Validação no upload com mensagem clara dos formatos aceitos. |
| Falha no envio do registro ao backend durante pico de acesso | Baixo | O registro é fire and forget — falhas não impactam a geração da figurinha. Cosmos DB escala automaticamente. |
| Usuário resistente a fornecer email corporativo | Baixo | Campo obrigatório com mensagem clara de finalidade (uso interno do evento). Sem email, o botão de download não é liberado. |
| Acesso não autorizado ao painel /admin | Baixo | Senha definida via variável de ambiente. Para o contexto do evento, isso é suficiente sem necessidade de Azure AD. |

---

## 14. Checklist Pré-Launch

### Técnico
- [ ] Build de produção sem erros ou warnings críticos
- [ ] Testado em Chrome, Firefox, Edge e Safari
- [ ] Testado em iOS Safari e Chrome Android
- [ ] Download funcional em todos os browsers testados
- [ ] Remoção de fundo testada com diferentes tipos de foto
- [ ] Assets do template otimizados (PNG comprimido)
- [ ] Azure Function `POST /api/register` testada e respondendo
- [ ] Cosmos DB configurado e recebendo registros
- [ ] Painel `/admin` acessível com senha correta e bloqueado sem ela
- [ ] Export CSV do painel validado com dados reais
- [ ] Deploy no Azure Static Web Apps funcionando via GitHub Actions
- [ ] URL final validada e SSL ativo

### Conteúdo
- [ ] Template PNG em alta resolução adicionado ao projeto
- [ ] Todas as bandeiras dos países adicionadas
- [ ] Texto de compartilhamento LinkedIn revisado e aprovado
- [ ] Fontes do template configuradas corretamente no canvas

### Comunicação
- [ ] URL do app incluída nas comunicações do evento
- [ ] Instrução de uso (foto com fundo neutro, rosto centralizado) comunicada aos participantes

---

## 15. Glossário

| Termo | Definição |
|---|---|
| **@imgly/background-removal** | Biblioteca JavaScript open-source que executa remoção de fundo de imagens via modelo de ML rodando em WebAssembly no browser, sem envio de dados a servidores externos. |
| **Canvas API** | API nativa dos browsers para renderização e manipulação gráfica 2D via JavaScript. Usada para compor os layers da figurinha e exportar como PNG. |
| **Azure Static Web Apps** | Serviço de hosting gratuito da Microsoft para aplicações web estáticas. Inclui SSL, CDN global, deploy automático via GitHub Actions e suporte a Azure Functions integradas. |
| **Azure Functions** | Serviço de computação serverless da Microsoft. Usado para o endpoint `POST /api/register` que salva os registros de participação. |
| **Azure Cosmos DB** | Banco de dados NoSQL gerenciado da Microsoft. Armazena os registros de participação (nome, email, país, timestamp). |
| **WebAssembly (WASM)** | Formato de código binário que permite executar código de alta performance (como modelos de ML) diretamente no browser. |
| **Layer / Camada** | Cada elemento gráfico individual que compõe a figurinha final (fundo, foto, overlay, bandeira, textos). Compostos em ordem no canvas. |
| **client-side** | Processamento que ocorre inteiramente no dispositivo do usuário, sem comunicação com servidores externos. |
| **fire and forget** | Padrão de chamada assíncrona onde o cliente envia uma requisição sem aguardar a resposta. Usado no registro de participação para não bloquear o download da figurinha. |
| **Drag-and-drop** | Interação de interface onde o usuário pode arrastar um arquivo do seu sistema de arquivos e soltar na área de upload da aplicação. |

---

*Beyond Summit 2026 — Gerador de Figurinha | PRD v2.1 | Documento interno*
