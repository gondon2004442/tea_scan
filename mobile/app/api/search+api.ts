import Anthropic from '@anthropic-ai/sdk';
import { findMentionedTeaIds } from '../../src/lib/catalogContext';
import { buildGongfuSystemPrompt } from '../../src/lib/gongfuPrompt';

const MODEL = 'claude-sonnet-4-6';
const MAX_TURNS = 4;

type SearchBody = {
  query?: string;
  imageBase64?: string;
  imageMediaType?: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';
};

type Source = { title: string; url: string };

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function collectText(content: Anthropic.Messages.ContentBlock[]): string {
  return content
    .filter((b): b is Anthropic.Messages.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
    .trim();
}

function collectSources(content: Anthropic.Messages.ContentBlock[]): Source[] {
  const sources: Source[] = [];
  for (const block of content as any[]) {
    if (block.type === 'web_search_tool_result' && Array.isArray(block.content)) {
      for (const item of block.content) {
        if (item?.type === 'web_search_result' && item.url) {
          sources.push({ title: item.title ?? item.url, url: item.url });
        }
      }
    }
  }
  // de-dup by url
  const seen = new Set<string>();
  return sources.filter((s) => (seen.has(s.url) ? false : (seen.add(s.url), true)));
}

export async function POST(request: Request): Promise<Response> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return jsonResponse({ error: 'AI search is not configured on the server.' }, 500);
  }

  let body: SearchBody;
  try {
    body = (await request.json()) as SearchBody;
  } catch {
    return jsonResponse({ error: 'Invalid JSON body.' }, 400);
  }

  const query = (body.query ?? '').trim();
  if (!query && !body.imageBase64) {
    return jsonResponse({ error: 'Provide a query or a photo.' }, 400);
  }

  const client = new Anthropic({ apiKey });

  const userContent: Anthropic.Messages.ContentBlockParam[] = [];
  if (body.imageBase64) {
    userContent.push({
      type: 'image',
      source: {
        type: 'base64',
        media_type: body.imageMediaType ?? 'image/jpeg',
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

  const messages: Anthropic.Messages.MessageParam[] = [
    { role: 'user', content: userContent },
  ];

  try {
    let response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: buildGongfuSystemPrompt(),
      tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 4 }],
      messages,
    });

    // Resume the server-side tool loop if it paused.
    let turns = 0;
    while (response.stop_reason === 'pause_turn' && turns < MAX_TURNS) {
      messages.push({ role: 'assistant', content: response.content });
      response = await client.messages.create({
        model: MODEL,
        max_tokens: 1024,
        system: buildGongfuSystemPrompt(),
        tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 4 }],
        messages,
      });
      turns += 1;
    }

    if (response.stop_reason === 'refusal') {
      return jsonResponse({
        answer:
          'I can only help with Gongfu-style Chinese tea. Try asking about a specific tea or brewing question.',
        matchedTeaIds: [],
        sources: [],
      });
    }

    const answer = collectText(response.content);
    return jsonResponse({
      answer,
      matchedTeaIds: findMentionedTeaIds(answer),
      sources: collectSources(response.content),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return jsonResponse({ error: `AI search failed: ${message}` }, 502);
  }
}
