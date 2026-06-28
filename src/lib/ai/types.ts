export type AIProviderId = 'groq' | 'gemini' | 'mistral' | 'cerebras' | 'openrouter' | 'ollama';

export type AIMessageRole = 'system' | 'user' | 'assistant';

export interface AIMessage {
  role: AIMessageRole;
  content: string;
}

export interface AICitation {
  title: string;
  url: string;
  excerpt: string;
  country?: string;
  department?: string;
  lastUpdated?: string;
  verified?: boolean;
  freshness?: 'fresh' | 'aging' | 'stale';
  traceId?: string;
}

export interface AIResponseEnvelope {
  text: string;
  confidence: number;
  grounded: boolean;
  citations: AICitation[];
  provider: AIProviderId;
  model: string;
}

export interface AIHealthStatus {
  provider: AIProviderId;
  available: boolean;
  latencyMs?: number;
  message: string;
}

export interface AIChatRequest {
  messages: AIMessage[];
  country?: string;
  departmentHint?: string;
  conversationId?: string;
}

export interface VerifiedEvidenceItem {
  id: string;
  title: string;
  url: string;
  hostname: string;
  excerpt: string;
  passage?: string;
  country: string;
  department: string;
  lastUpdated: string;
  trusted: boolean;
  score: number;
  sourceType: 'catalog' | 'live';
  provider: string;
  verification: 'verified' | 'unverified' | 'rejected';
  fetchedAt?: string;
  freshness?: 'fresh' | 'aging' | 'stale';
  traceId?: string;
}

export interface AIProviderAdapter {
  id: AIProviderId;
  label: string;
  enabled: boolean;
  supportsStreaming: boolean;
  healthCheck: () => Promise<AIHealthStatus>;
  generateResponse?: (
    input: AIChatRequest,
    evidence?: VerifiedEvidenceItem[],
    options?: {
      apiKey?: string;
    }
  ) => Promise<AIResponseEnvelope>;
}
