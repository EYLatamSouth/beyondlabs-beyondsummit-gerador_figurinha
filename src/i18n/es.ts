import type { Locale } from './types'

export const es: Locale = {
  languagePicker: {
    title: 'Elige tu idioma',
    subtitle: 'Choose your language · Escolha seu idioma',
  },

  landing: {
    title: 'Completa el Quiz y gana',
    subtitle: 'tu figurita exclusiva del evento',
    description:
      'BeyondSummit es el gran encuentro de innovación de EY en América Latina, reuniendo talentos, ideas y tendencias que están transformando el futuro de los negocios. Es el momento de ponerse la camiseta de la innovación y jugar juntos, ¡en vivo los días 16, 17 y 18 de junio!',
    learnMoreLabel: 'Más información en:',
    emailLabel: 'Correo corporativo',
    emailPlaceholder: 'nombre.apellido@br.',
    emailHint: 'Usado únicamente para fines internos de medición del evento',
    startButton: 'Comenzar Quiz',
    quizHint: '5 preguntas rápidas para descubrir cuál es tu posición en el campo',
  },

  quiz: {
    progressLabel: (current, total) => `Pregunta ${current} de ${total}`,
    tiebreakerBadge: '🥅 ¡Es penal! Hora del desempate',
    questions: [
      {
        id: 1,
        text: 'Empieza el partido y el equipo está un poco perdido. ¿Qué haces primero?',
        options: [
          { letter: 'A', text: 'Pido el balón, organizo el esquema de juego y pongo a cada uno en su lugar.' },
          { letter: 'B', text: 'Voy al frente e intento una jugada rápida para probar al rival desde el inicio.' },
          { letter: 'C', text: 'Ajusto la estrategia: quién marca a quién, dónde están los riesgos y cómo mantener el control.' },
          { letter: 'D', text: 'Motivo al equipo, elevo la energía y alinio la actitud: "juntos, enfocados y confiados".' },
        ],
      },
      {
        id: 2,
        text: '¿Qué tipo de jugada es más "tu estilo"?',
        options: [
          { letter: 'A', text: 'Un pase perfecto en profundidad que deja al equipo mano a mano con el portero.' },
          { letter: 'B', text: 'Arrancada, regate y remate — aprender haciendo.' },
          { letter: 'C', text: 'Robar el balón, recuperar y distribuir con seguridad para construir el ataque.' },
          { letter: 'D', text: 'Guiar a todo el equipo, mantener la línea firme y garantizar que todos jueguen como uno.' },
        ],
      },
      {
        id: 3,
        text: 'Cuando el plan no funciona, tiendes a…',
        options: [
          { letter: 'A', text: 'Revisar el mapa del juego: hipótesis, rutas, prioridades y claridad del objetivo.' },
          { letter: 'B', text: 'Cambiar el enfoque y probar rápidamente otra solución en la práctica.' },
          { letter: 'C', text: 'Reequilibrar: gobernanza, recursos, decisiones y plan de ejecución.' },
          { letter: 'D', text: 'Trabajar la adhesión: rituales, comunicación y comportamiento del equipo en el campo.' },
        ],
      },
      {
        id: 4,
        text: 'En el momento de presión (¡eliminatoria!), ¿cuál es tu "instinto ganador"?',
        options: [
          { letter: 'A', text: 'Crear la jugada correcta en el momento correcto — visión y método.' },
          { letter: 'B', text: 'Hacer que suceda — prototipo, prueba, intento y gol.' },
          { letter: 'C', text: 'Garantizar consistencia — ritmo, disciplina táctica y decisiones.' },
          { letter: 'D', text: 'Hacer que el equipo crea y mantener la cohesión — cultura, mentalidad y coraje.' },
        ],
      },
      {
        id: 5,
        text: 'Si fueras conocido(a) por una frase en el vestuario, sería:',
        options: [
          { letter: 'A', text: '"Déjame a mí: organizo y llegamos ahí con claridad."' },
          { letter: 'B', text: '"¡Vamos a probarlo ahora! — aprendemos rápido y ajustamos en tiempo real."' },
          { letter: 'C', text: '"Vamos con calma y firmeza: prioridad, alineación y ejecución."' },
          { letter: 'D', text: '"Juntos somos más fuertes: actitud, confianza y consistencia cada día."' },
        ],
      },
    ],
    tiebreaker: {
      id: 6,
      text: '¿Cuál de estas victorias te da más orgullo?',
      options: [
        { letter: 'A', text: '"El equipo entendió el juego y tomó la decisión correcta."' },
        { letter: 'B', text: '"Probamos, aprendimos y pusimos algo en funcionamiento."' },
        { letter: 'C', text: '"Se volvió rutina: operando, escalando y entregando."' },
        { letter: 'D', text: '"Cambió el comportamiento — y se quedó."' },
      ],
    },
    results: {
      A: {
        title: 'Camiseta 10 | Mediocampista Creativo(a)',
        fullLabel: 'Camiseta 10 | Mediocampista Creativo(a) — Innovation Core Methods',
        area: 'Innovation Core Methods',
        description:
          'Eres quien diseña el juego: estructura el problema, crea claridad, conduce al equipo y convierte las conexiones en jugadas.',
        superpower: 'Visión + método + facilitación',
      },
      B: {
        title: 'Extremo/Delantero(a) | Finalizador(a)',
        fullLabel: 'Extremo/Delantero(a) | Finalizador(a) — Experimental Engineering',
        area: 'Experimental Engineering',
        description:
          'Eres quien hace que las cosas sucedan: prototipa, prueba, acelera y aprende en el mundo real.',
        superpower: 'Velocidad + experimentación + prueba de valor',
      },
      C: {
        title: 'Volante | Maestro del Equilibrio',
        fullLabel: 'Volante | Maestro del Equilibrio — Innovation Management',
        area: 'Innovation Management',
        description:
          'Mantienes al equipo en pie y en control: defines prioridades, gobernas la ejecución y garantizas la escala.',
        superpower: 'Estrategia aplicada + gobernanza + ejecución sostenible',
      },
      D: {
        title: 'Defensor(a)/Capitán(a) | Líder de Cohesión',
        fullLabel: 'Defensor(a)/Capitán(a) | Líder de Cohesión — Culture Change',
        area: 'Culture Change',
        description:
          'Garantizas que el equipo juegue unido: movilizas, creas adhesión, cambias comportamientos y sostienes la mentalidad.',
        superpower: 'Compromiso + cultura + adopción',
      },
    },
    resultBadge: 'Tu resultado',
    superpowerLabel: 'Superpoder:',
    createStampTitle: '¡Ahora crea tu figurita!',
    createStampSubtitle: 'Sube una foto para generar tu figurita exclusiva del evento',
    uploadPhotoHint: 'Usa una foto con fondo neutro y rostro centrado para mejor resultado',
  },

  processing: {
    title: 'Preparando tu figurita...',
    messages: ['Analizando tu foto...', 'Eliminando el fondo...', '¡Casi listo!'],
    hint: 'Esto puede tardar unos segundos',
  },

  photoAdjust: {
    title: 'Ajusta tu foto',
    hint: 'Arrastra para reposicionar · scroll o pinch para zoom',
    dragHint: 'Arrastra para ajustar',
    confirmButton: 'Confirmar posición',
    replacePhoto: 'Subir otra foto',
    skipButton: 'Saltar ajuste',
  },

  editor: {
    formTitle: 'Completa tus datos',
    yourResult: 'Tu resultado',
    nameLabel: 'Nombre',
    namePlaceholder: 'Tu nombre completo',
    canvasNamePlaceholder: 'TU NOMBRE',
    countryLabel: 'País',
    downloadButton: 'Descargar Figurita',
    resetButton: 'Nueva foto',
  },

  uploadZone: {
    dragHere: 'Arrastra tu foto aquí',
    dropHere: 'Suelta la foto aquí',
    clickToSelect: 'o haz clic para seleccionar',
    formatHint: 'JPG o PNG · hasta 5MB',
    changePhoto: 'Cambiar foto',
    previewAlt: 'Vista previa de la foto seleccionada',
    errorInvalidFormat: 'Formato no compatible. Usa JPG o PNG.',
    errorTooBig: 'Archivo muy grande. Usa una foto de hasta 5MB.',
  },

  countrySelect: {
    seeMore: '+ Ver más países',
    modalTitle: 'Otros países',
    modalSubtitle: 'Selecciona tu país de origen',
    searchPlaceholder: 'Buscar país...',
    noResults: 'Ningún país encontrado',
  },

  countries: {
    br: 'Brasil',
    ar: 'Argentina',
    mx: 'México',
    cl: 'Chile',
    co: 'Colombia',
    uy: 'Uruguay',
    pe: 'Perú',
    ec: 'Ecuador',
    bo: 'Bolivia',
    cr: 'Costa Rica',
    cu: 'Cuba',
    sv: 'El Salvador',
    gt: 'Guatemala',
    hn: 'Honduras',
    ni: 'Nicaragua',
    pa: 'Panamá',
    py: 'Paraguay',
    pr: 'Puerto Rico',
    do: 'República Dominicana',
    ve: 'Venezuela',
    pt: 'Portugal',
    es: 'España',
  },

  toasts: {
    emailRequired: 'Ingresa tu correo corporativo antes de comenzar el quiz.',
    rareStamp: '⭐ ¡Conseguiste una figurita rara!',
    stampDownloaded: '¡Figurita descargada con éxito!',
    bgRemovalError: 'No se pudo eliminar el fondo. Intenta con otra foto.',
  },
}
