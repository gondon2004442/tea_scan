import { TEAS, type Tea } from '../data/teas';

export type QuizOption = { id: string; label: string };
export type QuizQuestion = {
  id: string;
  prompt: string;
  options: QuizOption[];
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'time',
    prompt: 'When will you brew?',
    options: [
      { id: 'morning', label: 'Morning' },
      { id: 'afternoon', label: 'Afternoon' },
      { id: 'evening', label: 'Evening' },
    ],
  },
  {
    id: 'flavor',
    prompt: 'What flavour are you after?',
    options: [
      { id: 'fresh', label: 'Fresh & green' },
      { id: 'floral', label: 'Floral & light' },
      { id: 'roasted', label: 'Roasted & rich' },
      { id: 'earthy', label: 'Earthy & deep' },
    ],
  },
  {
    id: 'caffeine',
    prompt: 'Caffeine?',
    options: [
      { id: 'high', label: 'Energise me' },
      { id: 'low', label: 'Keep it gentle' },
    ],
  },
];

// Maps flavour answers to catalog categories (Gongfu-friendly groupings).
const FLAVOR_CATEGORIES: Record<string, string[]> = {
  fresh: ['Green', 'Yellow'],
  floral: ['White', 'Oolong', 'Scented'],
  roasted: ['Oolong', 'Red'],
  earthy: ['Pu-erh', 'Dark', 'Red'],
};

function score(tea: Tea, answers: Record<string, string>): number {
  let s = 0;
  const time = answers.time;
  if (time && tea.timeToDrink.toLowerCase().includes(time.toLowerCase())) {
    s += 2;
  }
  const cats = FLAVOR_CATEGORIES[answers.flavor ?? ''] ?? [];
  if (cats.some((c) => tea.category.toLowerCase() === c.toLowerCase())) {
    s += 3;
  }
  // Caffeine heuristic: greens/whites read as gentler; reds/pu-erh as stronger.
  const gentle = ['Green', 'White', 'Yellow'];
  const strong = ['Red', 'Pu-erh', 'Dark', 'Oolong'];
  if (answers.caffeine === 'low' && gentle.includes(tea.category)) s += 1;
  if (answers.caffeine === 'high' && strong.includes(tea.category)) s += 1;
  return s;
}

/** Pick the best 3 catalog teas for the given quiz answers. */
export function matchQuiz(answers: Record<string, string>): Tea[] {
  const ranked = TEAS.map((tea) => ({ tea, s: score(tea, answers) }))
    .sort((a, b) => b.s - a.s);
  const top = ranked.filter((r) => r.s > 0).slice(0, 3).map((r) => r.tea);
  // Fallback so we always return something.
  return top.length > 0 ? top : TEAS.slice(0, 3);
}
