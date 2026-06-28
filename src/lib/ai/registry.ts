import { groqProvider } from '@/lib/ai/providers/groq';
import type { AIProviderAdapter, AIProviderId } from '@/lib/ai/types';

const disabledPlaceholder = (id: Exclude<AIProviderId, 'groq'>, label: string): AIProviderAdapter => ({
  id,
  label,
  enabled: false,
  supportsStreaming: true,
  healthCheck: async () => ({
    provider: id,
    available: false,
    message: `${label} is not enabled in this MVP build.`
  })
});

export const aiProviders: AIProviderAdapter[] = [
  groqProvider,
  disabledPlaceholder('gemini', 'Gemini'),
  disabledPlaceholder('mistral', 'Mistral'),
  disabledPlaceholder('cerebras', 'Cerebras'),
  disabledPlaceholder('openrouter', 'OpenRouter'),
  disabledPlaceholder('ollama', 'Ollama')
];

export function getAIProvider(providerId: AIProviderId) {
  return aiProviders.find((provider) => provider.id === providerId) ?? null;
}
