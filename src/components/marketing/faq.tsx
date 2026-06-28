import { HelpCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Reveal } from '@/components/marketing/motion-reveal';

const faqs = [
  {
    q: 'Is CivicShield AI legal, medical, or government advice?',
    a: 'No. CivicShield explains public information and points users toward official sources. Final decisions always belong to agencies, qualified professionals, or emergency services.'
  },
  {
    q: 'What makes it safer than a normal chatbot?',
    a: 'The assistant is designed to answer only from verified source material, show citations, label confidence, and refuse when it cannot verify enough evidence.'
  },
  {
    q: 'Can someone use it without technical knowledge?',
    a: 'Yes. Users can ask in plain language, choose suggested prompts, and read step-by-step next actions without understanding AI, databases, or public-agency systems.'
  },
  {
    q: 'What sources does it use?',
    a: 'The MVP focuses on an approved set of official U.S. public-service sources such as HUD, USDA SNAP, HHS LIHEAP, Benefits.gov, and USA.gov.'
  },
  {
    q: 'What happens when the AI is unsure?',
    a: 'It should say it cannot confidently verify the information, lower confidence, avoid citations, and guide the user back to official channels.'
  },
  {
    q: 'Why does it have reviewer tools?',
    a: 'Civic questions can affect real decisions. Reviewer queues and audit exports help teams inspect low-confidence or flagged conversations instead of leaving AI quality invisible.'
  }
];

export function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
      <Reveal className="max-w-2xl">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-600 dark:text-blue-300">FAQ</p>
        <h2 className="mt-4 text-4xl font-black tracking-[-0.06em] text-slate-950 dark:text-white sm:text-5xl">
          Clear limits create real trust.
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        {faqs.map((faq, index) => (
          <Reveal key={faq.q} delay={index * 0.035}>
            <Card className="h-full p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_70px_rgba(15,23,42,0.10)]">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300">
                  <HelpCircle className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold tracking-[-0.025em] text-slate-950 dark:text-white">{faq.q}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{faq.a}</p>
                </div>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
