// Client-side wrappers around the server API routes. The base URL is
// configurable so the proxy can be hosted separately from the static app.
const BASE = process.env.EXPO_PUBLIC_CHAT_API_URL ?? '';

export type AiSource = { title: string; url: string };

export type AiSearchResult = {
  answer: string;
  matchedTeaIds: string[];
  sources: AiSource[];
};

export type SearchInput = {
  query?: string;
  imageBase64?: string;
  imageMediaType?: string;
};

export async function aiSearch(input: SearchInput): Promise<AiSearchResult> {
  const res = await fetch(`${BASE}/api/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error ?? `Search failed (${res.status})`);
  }
  return {
    answer: data.answer ?? '',
    matchedTeaIds: data.matchedTeaIds ?? [],
    sources: data.sources ?? [],
  };
}

export async function aiExplainQuiz(
  answers: Record<string, string>,
  teaIds: string[],
): Promise<string> {
  try {
    const res = await fetch(`${BASE}/api/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers, teaIds }),
    });
    const data = await res.json();
    return data?.explanation ?? '';
  } catch {
    // Quiz still works without an AI explanation.
    return '';
  }
}
