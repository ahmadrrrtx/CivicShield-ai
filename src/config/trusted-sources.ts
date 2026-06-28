import { normalizeHostname, normalizeUrl } from '@/lib/retrieval/normalize';

export type TrustedSource = {
  id: string;
  title: string;
  url: string;
  hostname: string;
  country: string;
  department: string;
  trusted: true;
  topics: string[];
  summary: string;
  lastUpdated: string;
};

export const trustedSources: TrustedSource[] = [
  {
    id: 'hud-rental-assistance',
    title: 'U.S. Department of Housing and Urban Development',
    url: 'https://www.hud.gov/',
    hostname: 'www.hud.gov',
    country: 'United States',
    department: 'U.S. Department of Housing and Urban Development',
    trusted: true,
    topics: ['housing', 'rent', 'rental assistance', 'eviction', 'homelessness', 'shelter'],
    summary: 'Official federal housing assistance information, rental support references, and housing program entry points.',
    lastUpdated: '2026-02-18'
  },
  {
    id: 'usda-snap',
    title: 'SNAP eligibility and application information',
    url: 'https://www.fns.usda.gov/snap',
    hostname: 'www.fns.usda.gov',
    country: 'United States',
    department: 'U.S. Department of Agriculture',
    trusted: true,
    topics: ['snap', 'food', 'nutrition', 'benefits', 'groceries', 'eligibility'],
    summary: 'Official SNAP overview, eligibility guidance, and state application entry points.',
    lastUpdated: '2026-01-07'
  },
  {
    id: 'hhs-liheap',
    title: 'LIHEAP energy assistance',
    url: 'https://www.acf.hhs.gov/ocs/low-income-home-energy-assistance-program-liheap',
    hostname: 'www.acf.hhs.gov',
    country: 'United States',
    department: 'U.S. Department of Health & Human Services',
    trusted: true,
    topics: ['utility', 'electricity', 'heating', 'cooling', 'energy assistance', 'liheap'],
    summary: 'Official federal home energy assistance program information for low-income households.',
    lastUpdated: '2025-11-30'
  },
  {
    id: 'benefits-portal',
    title: 'Benefits.gov public benefits portal',
    url: 'https://www.benefits.gov/',
    hostname: 'www.benefits.gov',
    country: 'United States',
    department: 'Benefits.gov',
    trusted: true,
    topics: ['benefits', 'assistance', 'program finder', 'public services', 'eligibility'],
    summary: 'Official benefits portal helping residents identify public assistance programs and application paths.',
    lastUpdated: '2026-03-02'
  },
  {
    id: 'usa-emergency',
    title: 'USA.gov help and emergency information',
    url: 'https://www.usa.gov/',
    hostname: 'www.usa.gov',
    country: 'United States',
    department: 'USA.gov',
    trusted: true,
    topics: ['emergency', 'government services', 'help', 'contacts', 'public information'],
    summary: 'Official government services directory and trusted public information gateway.',
    lastUpdated: '2026-02-04'
  }
];

export function isTrustedHostname(hostname: string) {
  const normalized = normalizeHostname(hostname);
  return trustedSources.some((source) => normalizeHostname(source.hostname) === normalized);
}

export function isTrustedUrl(url: string) {
  const normalized = normalizeUrl(url);
  return trustedSources.some((source) => normalizeUrl(source.url) === normalized);
}
