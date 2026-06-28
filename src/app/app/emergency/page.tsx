import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function EmergencyPage() {
  return (
    <div className="space-y-6">
      <Card className="border-rose-200/70 bg-rose-50/80 p-6 dark:border-rose-950/40 dark:bg-rose-950/20">
        <h1 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">Emergency mode</h1>
        <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-300">
          If someone is in immediate danger, contact local emergency services now. CivicShield AI should not be used as a substitute for emergency response.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button variant="danger">Get official emergency contacts</Button>
          <Button variant="secondary">Return to dashboard</Button>
        </div>
      </Card>
    </div>
  );
}
