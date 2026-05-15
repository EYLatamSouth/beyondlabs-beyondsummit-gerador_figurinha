import type { Locale } from './types'

export const en: Locale = {
  languagePicker: {
    title: 'Choose your language',
    subtitle: 'Elige tu idioma · Escolha seu idioma',
  },

  landing: {
    title: 'Take the Quiz and get',
    subtitle: 'your exclusive event sticker',
    description:
      'BeyondSummit is EY Latin America\'s major innovation gathering, bringing together talents, ideas, and trends that are transforming the future of business. More than an event — it\'s the moment to put on the innovation jersey and play together. Watch it live on June 16, 17, and 18!',
    learnMoreLabel: 'Learn more at:',
    emailLabel: 'Corporate email',
    emailPlaceholder: 'firstname.lastname@br.',
    emailHint: 'Used solely for internal event measurement purposes',
    startButton: 'Start Quiz',
    quizHint: '5 quick questions to discover your position on the field',
  },

  quiz: {
    progressLabel: (current, total) => `Question ${current} of ${total}`,
    tiebreakerBadge: '🥅 Penalty shootout! Tiebreaker time',
    questions: [
      {
        id: 1,
        text: 'The game starts and the team is a bit lost. What do you do first?',
        options: [
          { letter: 'A', text: 'I call for the ball, organize the game plan, and put everyone in their place.' },
          { letter: 'B', text: 'I go for it and try a quick play to test the opponent right away.' },
          { letter: 'C', text: 'I adjust the strategy: who marks who, where the risks are, and how to maintain control.' },
          { letter: 'D', text: 'I rally the team, boost the energy, and align attitudes: "together, focused, confident."' },
        ],
      },
      {
        id: 2,
        text: 'What type of play is most "you"?',
        options: [
          { letter: 'A', text: 'A perfect through ball that puts the team one-on-one with the keeper.' },
          { letter: 'B', text: 'Sprint, dribble, and finish — learning by doing.' },
          { letter: 'C', text: 'Win the ball back, recover, and distribute safely to build the attack.' },
          { letter: 'D', text: 'Guide the whole team, hold the line firm, and ensure everyone plays as one.' },
        ],
      },
      {
        id: 3,
        text: "When the plan isn't working, you tend to…",
        options: [
          { letter: 'A', text: 'Review the game map: hypotheses, routes, priorities, and clarity of objective.' },
          { letter: 'B', text: 'Switch the approach and quickly test another solution in practice.' },
          { letter: 'C', text: 'Rebalance: governance, resources, decisions, and execution plan.' },
          { letter: 'D', text: 'Work on buy-in: rituals, communication, and team behavior on the field.' },
        ],
      },
      {
        id: 4,
        text: 'Under pressure (knockout stage!), what\'s your "winning instinct"?',
        options: [
          { letter: 'A', text: 'Create the right play at the right moment — vision and method.' },
          { letter: 'B', text: 'Make it happen — prototype, test, attempt, and goal.' },
          { letter: 'C', text: 'Ensure consistency — rhythm, tactical discipline, and decisions.' },
          { letter: 'D', text: 'Make the team believe and maintain cohesion — culture, mindset, and courage.' },
        ],
      },
      {
        id: 5,
        text: 'If you were known for a phrase in the locker room, it would be:',
        options: [
          { letter: 'A', text: '"Leave it to me: I\'ll organize and we\'ll get there with clarity."' },
          { letter: 'B', text: '"Let\'s test it now — we learn fast and adjust in real time."' },
          { letter: 'C', text: '"Steady and firm: priority, alignment, and execution."' },
          { letter: 'D', text: '"Together we\'re stronger: attitude, confidence, and consistency every day."' },
        ],
      },
    ],
    tiebreaker: {
      id: 6,
      text: 'Which of these victories makes you most proud?',
      options: [
        { letter: 'A', text: '"The team understood the game and made the right call."' },
        { letter: 'B', text: '"We tested, learned, and got something working."' },
        { letter: 'C', text: '"It became routine: operating, scaling, and delivering."' },
        { letter: 'D', text: '"It changed the behavior — and it stuck."' },
      ],
    },
    results: {
      A: {
        title: 'Shirt 10 | Playmaker',
        fullLabel: 'Shirt 10 | Playmaker — Innovation Core Methods',
        area: 'Innovation Core Methods',
        description:
          "You're the one who designs the game: structures the problem, creates clarity, leads the team, and turns connections into plays.",
        superpower: 'Vision + method + facilitation',
      },
      B: {
        title: 'Winger/Forward | Finisher',
        fullLabel: 'Winger/Forward | Finisher — Experimental Engineering',
        area: 'Experimental Engineering',
        description:
          "You're the one who makes things happen: prototype, test, accelerate, and learn in the real world.",
        superpower: 'Speed + experimentation + proof of value',
      },
      C: {
        title: 'Defensive Mid | Balance Master',
        fullLabel: 'Defensive Mid | Balance Master — Innovation Management',
        area: 'Innovation Management',
        description:
          "You keep the team standing and in control: define priorities, govern execution, and ensure scalability.",
        superpower: 'Applied strategy + governance + sustainable execution',
      },
      D: {
        title: 'Defender/Captain | Cohesion Leader',
        fullLabel: 'Defender/Captain | Cohesion Leader — Culture Change',
        area: 'Culture Change',
        description:
          "You ensure the team plays together: mobilize, build buy-in, change behavior, and sustain the mindset.",
        superpower: 'Engagement + culture + adoption',
      },
    },
    resultBadge: 'Your result',
    superpowerLabel: 'Superpower:',
    createStampTitle: 'Now create your sticker!',
    createStampSubtitle: 'Upload a photo to generate your exclusive event sticker',
    uploadPhotoHint: 'Use a photo with a neutral background and centered face for best results',
  },

  processing: {
    title: 'Preparing your sticker...',
    messages: ['Analyzing your photo...', 'Removing the background...', 'Almost done...'],
    hint: 'This may take a few seconds',
  },

  photoAdjust: {
    title: 'Adjust your photo',
    hint: 'Drag to reposition · scroll or pinch to zoom',
    dragHint: 'Drag to adjust',
    confirmButton: 'Confirm position',
    replacePhoto: 'Upload another photo',
    skipButton: 'Skip adjustment',
  },

  editor: {
    formTitle: 'Fill in your details',
    yourResult: 'Your result',
    nameLabel: 'Name',
    namePlaceholder: 'Your full name',
    canvasNamePlaceholder: 'YOUR NAME',
    countryLabel: 'Country',
    downloadButton: 'Download Sticker',
    resetButton: 'New photo',
  },

  uploadZone: {
    dragHere: 'Drag your photo here',
    dropHere: 'Drop the photo here',
    clickToSelect: 'or click to select',
    formatHint: 'JPG or PNG · up to 5MB',
    changePhoto: 'Change photo',
    previewAlt: 'Preview of selected photo',
    errorInvalidFormat: 'Unsupported format. Use JPG or PNG.',
    errorTooBig: 'File too large. Use a photo up to 5MB.',
  },

  countrySelect: {
    seeMore: '+ See more countries',
    modalTitle: 'Other countries',
    modalSubtitle: 'Select your country of origin',
    searchPlaceholder: 'Search country...',
    noResults: 'No country found',
  },

  countries: {
    br: 'Brazil',
    ar: 'Argentina',
    mx: 'Mexico',
    cl: 'Chile',
    co: 'Colombia',
    uy: 'Uruguay',
    pe: 'Peru',
    ec: 'Ecuador',
    bo: 'Bolivia',
    cr: 'Costa Rica',
    cu: 'Cuba',
    sv: 'El Salvador',
    gt: 'Guatemala',
    hn: 'Honduras',
    ni: 'Nicaragua',
    pa: 'Panama',
    py: 'Paraguay',
    pr: 'Puerto Rico',
    do: 'Dominican Republic',
    ve: 'Venezuela',
    pt: 'Portugal',
    es: 'Spain',
  },

  toasts: {
    emailRequired: 'Please enter your corporate email before starting the quiz.',
    rareStamp: '⭐ You got a rare sticker!',
    stampDownloaded: 'Sticker downloaded successfully!',
    bgRemovalError: 'Could not remove the background. Try with another photo.',
  },
}
