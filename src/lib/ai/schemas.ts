import { z } from 'zod';

export const aiMessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string().min(1).max(4000)
});

export const chatRequestSchema = z.object({
  messages: z.array(aiMessageSchema).min(1).max(20),
  country: z.string().trim().min(2).max(80).optional(),
  departmentHint: z.string().trim().min(2).max(120).optional(),
  conversationId: z.string().min(1).max(120).optional()
});

export const aiCitationSchema = z.object({
  title: z.string().min(1).max(300),
  url: z.string().url(),
  excerpt: z.string().min(1).max(1200),
  country: z.string().min(1).max(120).optional(),
  department: z.string().min(1).max(200).optional(),
  lastUpdated: z.string().min(1).max(80).optional(),
  verified: z.boolean().optional(),
  freshness: z.enum(['fresh', 'aging', 'stale']).optional(),
  traceId: z.string().min(1).max(200).optional()
});

export const aiResponseEnvelopeSchema = z.object({
  text: z.string().min(1).max(8000),
  confidence: z.number().min(0).max(1),
  grounded: z.boolean(),
  citations: z.array(aiCitationSchema).max(12),
  provider: z.enum(['groq', 'gemini', 'mistral', 'cerebras', 'openrouter', 'ollama']),
  model: z.string().min(1).max(200)
});

export type ChatRequestInput = z.infer<typeof chatRequestSchema>;
export type AIResponseEnvelopeInput = z.infer<typeof aiResponseEnvelopeSchema>;
