// Cloudflare Worker — AI proxy for Tea Scan.
// Holds ANTHROPIC_API_KEY (Worker secret) so the static Firebase-hosted site
// never exposes it. Endpoints: POST /api/search, POST /api/recommend.
import { CATALOG, findMentionedTeaIds } from '../../mobile/src/lib/catalogContext';
import { buildGongfuSystemPrompt } from '../../mobile/src/lib/gongfuPrompt';

const MODEL = 'claude-sonnet-4-6';
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const MAX_TURNS = 4;

type Env = {
  ANTHROPIC_API_KEY: string;
  ALLOWED_ORIGIN?: string;
};

type AnthropicBlock = {
  type: string;
  text?: string;
  content?: Array<{ type: string; url?: string; title?: string }>;
};
type AnthropicResponse = {
  stop_reason?: string;
  content: AnthropicBlock[];
};

function cors(env: Env): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function json(data: unknown, env: Env, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors(env) },
  });
}

async function callAnthropic(apiKey: string, body: unknown): Promise<AnthropicResponse> {
  const res = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Anthropic ${res.status}: ${text.slice(0, 300)}`);
  }
  return (await res.json()) as AnthropicResponse;
}

function collectText(content: AnthropicBlock[]): string {
  return content
    .filter((b) => b.type === 'text' && b.text)
    .map((b) => b.text as string)
    .join('\n')
    .trim();
}

function collectSources(content: AnthropicBlock[]): Array<{ title: string; url: string }> {
  const out: Array<{ title: string; url: string }> = [];
  for (const block of content) {
    if (block.type === 'web_search_tool_result' && Array.isArray(block.content)) {
      for (const item of block.content) {
        if (item.type === 'web_search_result' && item.url) {
          out.push({ title: item.title || item.url, url: item.url });
        }
      }
    }
  }
  const seen = new Set<string>();
  return out.filter((s) => (seen.has(s.url) ? false : (seen.add(s.url), true)));
}

const SEARCH_TOOLS = [{ type: 'web_search_20250305', name: 'web_search', max_uses: 4 }];

async function handleSearch(request: Request, env: Env): Promise<Response> {
  let body: { query?: string; imageBase64?: string; imageMediaType?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body.' }, env, 400);
  }

  const query = (body.query ?? '').trim();
  if (!query && !body.imageBase64) {
    return json({ error: 'Provide a query or a photo.' }, env, 400);
  }

  const userContent: unknown[] = [];
  if (body.imageBase64) {
    userContent.push({
      type: 'image',
      source: {
        type: 'base64',
        media_type: body.imageMediaType || 'image/jpeg',
        data: body.imageBase64,
      },
    });
    userContent.push({
      type: 'text',
      text:
        query ||
        'Identify this tea from the photo (leaf, package, or steeped liquor) and tell me how to brew it Gongfu style.',
    });
  } else {
    userContent.push({ type: 'text', text: query });
  }

  const system = buildGongfuSystemPrompt();
  const messages: unknown[] = [{ role: 'user', content: userContent }];

  let response = await callAnthropic(env.ANTHROPIC_API_KEY, {
    model: MODEL,
    max_tokens: 1024,
    system,
    tools: SEARCH_TOOLS,
    messages,
  });

  let turns = 0;
  while (response.stop_reason === 'pause_turn' && turns < MAX_TURNS) {
    messages.push({ role: 'assistant', content: response.content });
    response = await callAnthropic(env.ANTHROPIC_API_KEY, {
      model: MODEL,
      max_tokens: 1024,
      system,
      tools: SEARCH_TOOLS,
      messages,
    });
    turns += 1;
  }

  if (response.stop_reason === 'refusal') {
    return json(
      {
        answer:
          'I can only help with Gongfu-style Chinese tea. Try asking about a specific tea or brewing question.',
        matchedTeaIds: [],
        sources: [],
      },
      env,
    );
  }

  const answer = collectText(response.content);
  return json(
    {
      answer,
      matchedTeaIds: findMentionedTeaIds(answer),
      sources: collectSources(response.content),
    },
    env,
  );
}

async function handleRecommend(request: Request, env: Env): Promise<Response> {
  let body: { answers?: Record<string, string>; teaIds?: string[] };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body.', explanation: '' }, env, 400);
  }

  const teaIds = body.teaIds ?? [];
  const answers = body.answers ?? {};
  const picks = CATALOG.filter((t) => teaIds.includes(t.id));
  if (picks.length === 0) {
    return json({ explanation: '' }, env);
  }

  const answerLines = Object.entries(answers)
    .map(([k, v]) => `- ${k}: ${v}`)
    .join('\n');
  const teaLines = picks.map((t) => `- ${t.name} (${t.category})`).join('\n');

  const response = await callAnthropic(env.ANTHROPIC_API_KEY, {
    model: MODEL,
    max_tokens: 600,
    system: buildGongfuSystemPrompt(),
    messages: [
      {
        role: 'user',
        content: `Based on the user's quiz answers, briefly explain why these teas suit them and how to brew each one Gongfu style. Be warm and concise (2-4 sentences per tea).

Quiz answers:
${answerLines || '- (none)'}

Recommended teas:
${teaLines}`,
      },
    ],
  });

  return json({ explanation: collectText(response.content) }, env);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors(env) });
    }
    if (!env.ANTHROPIC_API_KEY) {
      return json({ error: 'ANTHROPIC_API_KEY is not configured.' }, env, 500);
    }
    const { pathname } = new URL(request.url);
    try {
      if (request.method === 'POST' && pathname.endsWith('/api/search')) {
        return await handleSearch(request, env);
      }
      if (request.method === 'POST' && pathname.endsWith('/api/recommend')) {
        return await handleRecommend(request, env);
      }
      return json({ error: 'Not found' }, env, 404);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return json({ error: message }, env, 502);
    }
  },
};
