import { PhoneCall, Home, HeartPulse, TriangleAlert } from 'lucide-react';
import { Card } from '@/components/ui/card';

const shortcuts = [
  { title: 'Housing risk', description: 'Start with eviction, shelter, and emergency housing guidance.', icon: Home },
  { title: 'Health access', description: 'Find urgent public health and care access information.', icon: HeartPulse },
  { title: 'Immediate danger', description: 'Use local emergency services for imminent threats.', icon: TriangleAlert },
  { title: 'Official contact help', description: 'Find agency channels and verified public contact options.', icon: PhoneCall }
];

export function EmergencyShortcuts() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {shortcuts.map((shortcut) => {
        const Icon = shortcut.icon;
        return (
          <Card key={shortcut.title} className="p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-950 dark:text-white">{shortcut.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{shortcut.description}</p>
          </Card>
        );
      })}
    </div>
  );
}
