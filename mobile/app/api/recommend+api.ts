import Anthropic from '@anthropic-ai/sdk';
import { CATALOG } from '../../src/lib/catalogContext';
import { buildGongfuSystemPrompt } from '../../src/lib/gongfuPrompt';

const MODEL = 'claude-sonnet-4-6';

type RecommendBody = {
  answers?: Record<string, string>;
  teaIds?: string[];
};

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request: Request): Promise<Response> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Graceful: quiz still works locally without an explanation.
    return jsonResponse({ explanation: '' });
  }

  let body: RecommendBody;
  try {
    body = (await request.json()) as RecommendBody;
  } catch {
    return jsonResponse({ error: 'Invalid JSON body.' }, 400);
  }

  const teaIds = body.teaIds ?? [];
  const answers = body.answers ?? {};
  const picks = CATALOG.filter((t) => teaIds.includes(t.id));
  if (picks.length === 0) {
    return jsonResponse({ explanation: '' });
  }

  const answerLines = Object.entries(answers)
    .map(([k, v]) => `- ${k}: ${v}`)
    .join('\n');
  const teaLines = picks.map((t) => `- ${t.name} (${t.category})`).join('\n');

  const client = new Anthropic({ apiKey });

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 600,
      system: buildGongfuSystemPrompt(),
      messages: [
        {
          role: 'user',
          content: `Based on the user's quiz answers, briefly explain why these teas suit them and how to brew each one Gongfu style. Be warm and concise (2–4 sentences per tea).

Quiz answers:
${answerLines || '- (none)'}

Recommended teas:
${teaLines}`,
        },
      ],
    });

    const explanation = response.content
      .filter((b): b is Anthropic.Messages.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
      .trim();

    return jsonResponse({ explanation });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return jsonResponse({ error: `Recommendation failed: ${message}`, explanation: '' }, 200);
  }
}
