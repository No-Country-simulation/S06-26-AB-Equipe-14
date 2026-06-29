// services/aiService.ts
// Cliente da view "Busca por AI". Fala com o Agente de AI do backend.
//
// CONTRATO ESPERADO DO BACKEND (a implementar pela equipa de backend):
//
//   POST /api/ai/query
//     body: { "query": string, "history"?: {role, content}[] }
//
//   Resposta — duas opções suportadas por este cliente:
//   (A) Streaming de texto (preferido p/ efeito "a escrever"):
//       Content-Type: text/plain  ou  text/event-stream
//       O corpo é enviado em chunks de texto à medida que o modelo gera.
//   (B) JSON simples (não-streaming):
//       Content-Type: application/json
//       { "answer": string }   // (também aceita "response" | "content")
//
// Enquanto o endpoint não existir, cai num mock local para a UI continuar a funcionar.

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '/api';
const AI_ENDPOINT = `${API_BASE}/ai/query`;

export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

export interface AskOptions {
  /** Histórico para dar contexto ao agente. */
  history?: ChatMessage[];
  /** Chamado a cada pedaço de texto recebido (streaming). */
  onToken?: (chunk: string) => void;
  /** Permite cancelar o pedido. */
  signal?: AbortSignal;
}

/** Mapeia o nosso "ai" para o "assistant" habitual nas APIs de chat. */
function toApiRole(role: ChatMessage['role']): 'user' | 'assistant' {
  return role === 'ai' ? 'assistant' : 'user';
}

/**
 * Envia a pergunta ao Agente de AI e devolve a resposta completa.
 * Se `onToken` for fornecido e a resposta for streaming, emite os pedaços.
 */
export async function askAI(query: string, opts: AskOptions = {}): Promise<string> {
  try {
    const res = await fetch(AI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        history: (opts.history ?? []).map((m) => ({
          role: toApiRole(m.role),
          content: m.content,
        })),
      }),
      signal: opts.signal,
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const contentType = res.headers.get('content-type') ?? '';

    // (B) Resposta JSON não-streaming.
    if (contentType.includes('application/json')) {
      const data = await res.json();
      const answer: string = data.answer ?? data.response ?? data.content ?? '';
      opts.onToken?.(answer);
      return answer;
    }

    // (A) Resposta em streaming (text/plain ou text/event-stream).
    if (res.body) {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = '';
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        if (chunk) {
          full += chunk;
          opts.onToken?.(chunk);
        }
      }
      return full;
    }

    // Sem corpo legível → cai para texto simples.
    const text = await res.text();
    opts.onToken?.(text);
    return text;
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err;
    // Endpoint ainda não disponível → mock para não bloquear o frontend.
    return mockStream(query, opts);
  }
}

/* ------------------------------------------------------------------ */
/* Mock temporário (removível quando o backend estiver pronto)        */
/* ------------------------------------------------------------------ */

const MOCK_PREFIX = '[modo offline] ';

function buildMockAnswer(query: string): string {
  return (
    `${MOCK_PREFIX}O Agente de AI ainda não está ligado ao backend. ` +
    `Assim que o endpoint POST /api/ai/query existir, esta resposta passa a ser real. ` +
    `A tua pergunta foi: "${query}".`
  );
}

/** Simula streaming token-a-token enquanto o backend não responde. */
async function mockStream(query: string, opts: AskOptions): Promise<string> {
  const answer = buildMockAnswer(query);
  const tokens = answer.split(' ');
  for (let i = 0; i < tokens.length; i++) {
    if (opts.signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    await new Promise((r) => setTimeout(r, 45));
    opts.onToken?.((i === 0 ? '' : ' ') + tokens[i]);
  }
  return answer;
}

export default { askAI };
