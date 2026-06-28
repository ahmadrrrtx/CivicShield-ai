export type ChatConfidenceLevel = 'high' | 'moderate' | 'low';

export type ChatCitation = {
  id: string;
  title: string;
  url: string;
  department: string;
  country: string;
  lastUpdated: string;
  summary: string;
  verified?: boolean;
  freshness?: 'fresh' | 'aging' | 'stale';
  traceId?: string;
};

export type ChatMessageRecord = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  confidence?: ChatConfidenceLevel;
  disclaimer?: string;
  citations?: ChatCitation[];
  isStreaming?: boolean;
  isError?: boolean;
  feedback?: 'helpful' | 'needs_review';
};

export const demoCitations: ChatCitation[] = [
  {
    id: 'src-1',
    title: 'Emergency Rental Assistance guidance',
    url: 'https://www.hud.gov/',
    department: 'U.S. Department of Housing and Urban Development',
    country: 'United States',
    lastUpdated: '2026-02-18',
    summary: 'Official housing-assistance guidance and links to rental support programs administered through public agencies.',
    verified: true,
    freshness: 'fresh',
    traceId: 'trusted-live-fetch:https://hud.gov/'
  },
  {
    id: 'src-2',
    title: 'SNAP eligibility and application information',
    url: 'https://www.fns.usda.gov/snap',
    department: 'U.S. Department of Agriculture',
    country: 'United States',
    lastUpdated: '2026-01-07',
    summary: 'Official SNAP overview, eligibility framing, and state application entry points.',
    verified: true,
    freshness: 'aging',
    traceId: 'trusted-live-fetch:https://fns.usda.gov/snap'
  },
  {
    id: 'src-3',
    title: 'LIHEAP energy assistance',
    url: 'https://www.acf.hhs.gov/ocs/low-income-home-energy-assistance-program-liheap',
    department: 'U.S. Department of Health & Human Services',
    country: 'United States',
    lastUpdated: '2025-11-30',
    summary: 'Federal home energy assistance program information and administrative guidance for low-income households.',
    verified: true,
    freshness: 'aging',
    traceId: 'trusted-live-fetch:https://acf.hhs.gov/ocs/low-income-home-energy-assistance-program-liheap'
  }
];

export const demoChatMessages: ChatMessageRecord[] = [
  {
    id: 'msg-1',
    role: 'user',
    content: 'I lost my job and I am behind on rent and electricity. What official support should I look at first?',
    timestamp: 'Today · 09:41'
  },
  {
    id: 'msg-2',
    role: 'assistant',
    content:
      'Based on the verified official sources currently attached, a careful first step is to check rental assistance, SNAP, and energy-assistance programs in your area. Start with your local housing authority or public benefits portal, then verify whether your state manages applications separately. If you are facing shutoff or eviction deadlines, gather any notices, income-change records, identification, and lease or utility account details before applying.',
    timestamp: 'Today · 09:42',
    confidence: 'moderate',
    citations: demoCitations.slice(0, 3)
  }
];
