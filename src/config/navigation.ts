export const marketingNav = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Features', href: '#features' },
  { label: 'Security', href: '#security' },
  { label: 'FAQ', href: '#faq' }
] as const;

export const dashboardNav = [
  { label: 'Ask', href: '/app' },
  { label: 'Explore Benefits', href: '/app/explore' },
  { label: 'Emergency', href: '/app/emergency' },
  { label: 'Sources', href: '/app/sources' },
  { label: 'History', href: '/app/history' },
  { label: 'Review', href: '/app/review' },
  { label: 'Settings', href: '/app/settings' }
] as const;

export type DashboardNavItem = (typeof dashboardNav)[number];
