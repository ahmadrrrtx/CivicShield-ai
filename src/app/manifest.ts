import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CivicShield AI',
    short_name: 'CivicShield',
    description: 'Trusted AI guidance for public services, grounded in official sources.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f6f8fb',
    theme_color: '#2563eb',
    icons: [
      {
        src: '/icons/app-icon.svg',
        sizes: '512x512',
        type: 'image/svg+xml'
      }
    ]
  };
}
