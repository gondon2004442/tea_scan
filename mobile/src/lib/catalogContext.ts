// Server-safe catalog helpers. Imports ONLY the plain data seeds so this module
// can be bundled into API routes without pulling in React Native assets/theme.
import { TEA_SEEDS, type TeaSeed } from '../data/teas.generated';

export type CatalogTea = {
  id: string;
  name: string;
  category: string;
  timeToDrink: string;
  steeping: string;
  temperature: string;
  leafRatio: string;
  story: string;
};

export const CATALOG: CatalogTea[] = TEA_SEEDS.map((seed: TeaSeed) => ({
  id: seed.id,
  name: seed.name,
  category: seed.category,
  timeToDrink: seed.timeToDrink,
  steeping: seed.steeping,
  temperature: seed.temperature,
  leafRatio: seed.leafRatio,
  story: seed.story,
}));

/** Compact catalog rendered for the model's system prompt. */
export function buildCatalogContext(): string {
  return CATALOG.map(
    (t) =>
      `- ${t.name} [id:${t.id}] | ${t.category} | ${t.timeToDrink} | ${t.temperature} | ${t.leafRatio} | steeping ${t.steeping}`,
  ).join('\n');
}

/** Find catalog tea ids whose name is mentioned in an arbitrary text. */
export function findMentionedTeaIds(text: string): string[] {
  const lower = text.toLowerCase();
  const ids: string[] = [];
  for (const tea of CATALOG) {
    if (lower.includes(tea.name.toLowerCase())) {
      ids.push(tea.id);
    }
  }
  return Array.from(new Set(ids));
}

/** Local keyword match over the catalog (name, category, story). */
export function localSearch(query: string): string[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);
  const scored = CATALOG.map((tea) => {
    const haystack = `${tea.name} ${tea.category} ${tea.timeToDrink} ${tea.story}`.toLowerCase();
    const score = terms.reduce((acc, term) => (haystack.includes(term) ? acc + 1 : acc), 0);
    return { id: tea.id, score };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.id);
}
