import type { Locale } from './types'

export const ptBR: Locale = {
  languagePicker: {
    title: 'Escolha seu idioma',
    subtitle: 'Choose your language · Elige tu idioma',
  },

  landing: {
    title: 'Complete o Quiz e ganhe',
    subtitle: 'sua figurinha exclusiva do evento',
    description:
      'O BeyondSummit é o grande encontro de inovação da EY na América Latina, reunindo talentos, ideias e tendências que estão transformando o futuro dos negócios. É o momento de vestir a camisa da inovação e jogar junto, ao vivo nos dias 16, 17 e 18 de junho!',
    learnMoreLabel: 'Saiba mais em:',
    emailLabel: 'Email corporativo',
    emailPlaceholder: 'nome.sobrenome@br.',
    emailHint: 'Usado apenas para fins internos de mensuração do evento',
    startButton: 'Começar Quiz',
    quizHint: '5 perguntas rápidas para descobrir qual é a sua posição em campo',
  },

  quiz: {
    progressLabel: (current, total) => `Pergunta ${current} de ${total}`,
    tiebreakerBadge: '🥅 É Pênalti! Hora do desempate',
    questions: [
      {
        id: 1,
        text: 'Começa o jogo e o time está meio perdido. O que você faz primeiro?',
        options: [
          { letter: 'A', text: 'Peço a bola, organizo o desenho do jogo e coloco cada um no lugar certo.' },
          { letter: 'B', text: 'Parto pra cima e tento uma jogada rápida pra testar o adversário logo de cara.' },
          { letter: 'C', text: 'Ajusto a estratégia: quem marca quem, onde estão os riscos e como manter o controle.' },
          { letter: 'D', text: 'Puxo o time, subo a energia e alinho atitude: "vamos juntos, foco e confiança".' },
        ],
      },
      {
        id: 2,
        text: 'Qual tipo de lance é mais "a sua cara"?',
        options: [
          { letter: 'A', text: 'Enfiada de bola perfeita que deixa o time na cara do gol.' },
          { letter: 'B', text: 'Arrancada, drible e finalização — aprender fazendo.' },
          { letter: 'C', text: 'Roubar a bola, recuperar e distribuir com segurança pra construir o ataque.' },
          { letter: 'D', text: 'Orientar o time inteiro, manter a linha firme e garantir que todo mundo jogue como um só.' },
        ],
      },
      {
        id: 3,
        text: 'Quando o plano não está funcionando, você tende a…',
        options: [
          { letter: 'A', text: 'Rever o mapa do jogo: hipóteses, rotas, prioridades e clareza do objetivo.' },
          { letter: 'B', text: 'Trocar a abordagem e testar rápido outra solução na prática.' },
          { letter: 'C', text: 'Reequilibrar: governança, recursos, decisões e plano de execução.' },
          { letter: 'D', text: 'Trabalhar a adesão: rituais, comunicação e comportamento do time em campo.' },
        ],
      },
      {
        id: 4,
        text: 'Na hora da pressão (mata-mata!), qual é seu "instinto de vitória"?',
        options: [
          { letter: 'A', text: 'Criar a jogada certa no momento certo — visão e método.' },
          { letter: 'B', text: 'Fazer acontecer — protótipo, teste, tentativa e gol.' },
          { letter: 'C', text: 'Garantir consistência — ritmo, disciplina tática e decisões.' },
          { letter: 'D', text: 'Fazer o time acreditar e manter a coesão — cultura, mentalidade e coragem.' },
        ],
      },
      {
        id: 5,
        text: 'Se você fosse conhecido(a) por uma frase no vestiário, seria:',
        options: [
          { letter: 'A', text: '"Deixa comigo: eu organizo e a gente chega lá com clareza."' },
          { letter: 'B', text: '"Bora testar agora — a gente aprende rápido e ajusta em tempo real."' },
          { letter: 'C', text: '"Vamos com calma e firmeza: prioridade, alinhamento e execução."' },
          { letter: 'D', text: '"Juntos somos mais fortes: atitude, confiança e consistência todo dia."' },
        ],
      },
    ],
    tiebreaker: {
      id: 6,
      text: 'Qual dessas vitórias te dá mais orgulho?',
      options: [
        { letter: 'A', text: '"O time entendeu o jogo e tomou a decisão certa."' },
        { letter: 'B', text: '"A gente testou, aprendeu e colocou algo funcionando."' },
        { letter: 'C', text: '"Virou rotina: operando, escalando e entregando."' },
        { letter: 'D', text: '"Mudou o comportamento — e ficou."' },
      ],
    },
    results: {
      A: {
        title: 'Camisa 10 | Meia Armador(a)',
        fullLabel: 'Camisa 10 | Meia Armador(a) — Innovation Core Methods',
        area: 'Innovation Core Methods',
        description:
          'Você é quem desenha o jogo: estrutura o problema, cria clareza, conduz o time e faz a conexão que vira jogada.',
        superpower: 'Visão + método + facilitação',
      },
      B: {
        title: 'Ponta/Atacante | Finalizador(a)',
        fullLabel: 'Ponta/Atacante | Finalizador(a) — Experimental Engineering',
        area: 'Experimental Engineering',
        description:
          'Você é quem faz acontecer: prototipa, testa, acelera e aprende no mundo real.',
        superpower: 'Velocidade + experimentação + prova de valor',
      },
      C: {
        title: 'Volante | Maestro do Equilíbrio',
        fullLabel: 'Volante | Maestro do Equilíbrio — Innovation Management',
        area: 'Innovation Management',
        description:
          'Você mantém o time de pé e no controle: define prioridades, governa a execução e garante escala.',
        superpower: 'Estratégia aplicada + governança + execução sustentável',
      },
      D: {
        title: 'Zagueiro(a)/Capitão(ã) | Líder da Coesão',
        fullLabel: 'Zagueiro(a)/Capitão(ã) | Líder da Coesão — Culture Change',
        area: 'Culture Change',
        description:
          'Você garante que o time jogue junto: mobiliza, cria adesão, muda comportamento e sustenta a mentalidade.',
        superpower: 'Engajamento + cultura + adoção',
      },
    },
    resultBadge: 'Seu resultado',
    superpowerLabel: 'Superpoder:',
    createStampTitle: 'Agora crie sua figurinha!',
    createStampSubtitle: 'Envie uma foto para gerar sua figurinha exclusiva do evento',
    uploadPhotoHint: 'Use uma foto com fundo neutro e rosto centralizado para melhor resultado',
  },

  processing: {
    title: 'Preparando sua figurinha...',
    messages: ['Analisando sua foto...', 'Removendo o fundo...', 'Quase lá...'],
    hint: 'Isso pode levar alguns segundos',
  },

  photoAdjust: {
    title: 'Ajuste sua foto',
    hint: 'Arraste para reposicionar · scroll ou pinch para zoom',
    dragHint: 'Arraste para ajustar',
    confirmButton: 'Confirmar posição',
    replacePhoto: 'Subir outra foto',
    skipButton: 'Pular ajuste',
  },

  editor: {
    formTitle: 'Preencha seus dados',
    yourResult: 'Seu resultado',
    nameLabel: 'Nome',
    namePlaceholder: 'Seu nome completo',
    canvasNamePlaceholder: 'NOME AQUI',
    countryLabel: 'País',
    downloadButton: 'Baixar Figurinha',
    resetButton: 'Nova foto',
  },

  uploadZone: {
    dragHere: 'Arraste sua foto aqui',
    dropHere: 'Solte a foto aqui',
    clickToSelect: 'ou clique para selecionar',
    formatHint: 'JPG ou PNG · até 5MB',
    changePhoto: 'Trocar foto',
    previewAlt: 'Preview da foto selecionada',
    errorInvalidFormat: 'Formato não suportado. Use JPG ou PNG.',
    errorTooBig: 'Arquivo muito grande. Use uma foto de até 5MB.',
  },

  countrySelect: {
    seeMore: '+ Ver mais países',
    modalTitle: 'Outros países',
    modalSubtitle: 'Selecione o seu país de origem',
    searchPlaceholder: 'Buscar país...',
    noResults: 'Nenhum país encontrado',
  },

  countries: {
    br: 'Brasil',
    ar: 'Argentina',
    mx: 'México',
    cl: 'Chile',
    co: 'Colômbia',
    uy: 'Uruguai',
    pe: 'Peru',
    ec: 'Equador',
    bo: 'Bolívia',
    cr: 'Costa Rica',
    cu: 'Cuba',
    sv: 'El Salvador',
    gt: 'Guatemala',
    hn: 'Honduras',
    ni: 'Nicarágua',
    pa: 'Panamá',
    py: 'Paraguai',
    pr: 'Porto Rico',
    do: 'República Dominicana',
    ve: 'Venezuela',
    pt: 'Portugal',
    es: 'Espanha',
  },

  toasts: {
    emailRequired: 'Informe seu email corporativo antes de começar o quiz.',
    rareStamp: '⭐ Você ganhou uma figurinha rara!',
    stampDownloaded: 'Figurinha baixada com sucesso!',
    bgRemovalError: 'Não foi possível remover o fundo. Tente com outra foto.',
  },
}
