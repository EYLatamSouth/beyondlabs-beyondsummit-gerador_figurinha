import { Crown, Scale, Target, Zap } from 'lucide-react'
import type { QuizQuestion, QuizAnswers, QuizLetter, QuizResultData } from '@/types/quiz'

export const QUIZ_QUESTIONS: QuizQuestion[] = [
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
]

export const TIEBREAKER_QUESTION: QuizQuestion = {
  id: 6,
  text: 'Qual dessas vitórias te dá mais orgulho?',
  options: [
    { letter: 'A', text: '"O time entendeu o jogo e tomou a decisão certa."' },
    { letter: 'B', text: '"A gente testou, aprendeu e colocou algo funcionando."' },
    { letter: 'C', text: '"Virou rotina: operando, escalando e entregando."' },
    { letter: 'D', text: '"Mudou o comportamento — e ficou."' },
  ],
}

export const QUIZ_RESULTS: Record<QuizLetter, QuizResultData> = {
  A: {
    letter: 'A',
    title: 'Camisa 10 | Meia Armador(a)',
    fullLabel: 'Camisa 10 | Meia Armador(a) — Innovation Core Methods',
    area: 'Innovation Core Methods',
    icon: Target,
    description:
      'Você é quem desenha o jogo: estrutura o problema, cria clareza, conduz o time e faz a conexão que vira jogada.',
    superpower: 'Visão + método + facilitação',
    color: '#C9A84C',
    colorBg: '#FBF5E6',
  },
  B: {
    letter: 'B',
    title: 'Ponta/Atacante | Finalizador(a)',
    fullLabel: 'Ponta/Atacante | Finalizador(a) — Experimental Engineering',
    area: 'Experimental Engineering',
    icon: Zap,
    description:
      'Você é quem faz acontecer: prototipa, testa, acelera e aprende no mundo real.',
    superpower: 'Velocidade + experimentação + prova de valor',
    color: '#E8365D',
    colorBg: '#FEF0F3',
  },
  C: {
    letter: 'C',
    title: 'Volante | Maestro do Equilíbrio',
    fullLabel: 'Volante | Maestro do Equilíbrio — Innovation Management',
    area: 'Innovation Management',
    icon: Scale,
    description:
      'Você mantém o time de pé e no controle: define prioridades, governa a execução e garante escala.',
    superpower: 'Estratégia aplicada + governança + execução sustentável',
    color: '#4BBFDB',
    colorBg: '#EFF9FC',
  },
  D: {
    letter: 'D',
    title: 'Zagueiro(a)/Capitão(ã) | Líder da Coesão',
    fullLabel: 'Zagueiro(a)/Capitão(ã) | Líder da Coesão — Culture Change',
    area: 'Culture Change',
    icon: Crown,
    description:
      'Você garante que o time jogue junto: mobiliza, cria adesão, muda comportamento e sustenta a mentalidade.',
    superpower: 'Engajamento + cultura + adoção',
    color: '#6B3FA0',
    colorBg: '#F4EFF9',
  },
}

/**
 * Counts how many times each letter was chosen.
 * Returns the winning letter, or null if there is a tie.
 */
export function calculateResult(answers: QuizAnswers): QuizLetter | null {
  const counts: Record<QuizLetter, number> = { A: 0, B: 0, C: 0, D: 0 }
  for (const letter of Object.values(answers)) {
    counts[letter]++
  }

  const max = Math.max(...Object.values(counts))
  const winners = (Object.keys(counts) as QuizLetter[]).filter((l) => counts[l] === max)

  if (winners.length === 1) return winners[0]
  return null // tie
}
