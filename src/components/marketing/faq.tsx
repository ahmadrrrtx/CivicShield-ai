import { Card } from '@/components/ui/card';

const faqs = [
  {
    q: 'Does CivicShield AI make eligibility decisions?',
    a: 'No. It explains official public information and can help users understand likely next steps. Final decisions always belong to the relevant authority.'
  },
  {
    q: 'What sources does it use?',
    a: 'The system is designed to answer from official government and public-agency sources in its approved knowledge base. If it cannot verify something from official sources, it should say so clearly.'
  },
  {
    q: 'Can I use it without an account?',
    a: 'Yes. Guest mode is part of the product foundation so users can ask questions without immediately creating an account.'
  },
  {
    q: 'Does it support my own AI API key?',
    a: 'Yes. The initial MVP is Groq-first, with an architecture prepared for future providers like Gemini, Mistral, Cerebras, OpenRouter, and Ollama.'
  }
];

export function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">FAQ</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white sm:text-4xl">
          Clear limits create real trust.
        </h2>
      </div>
      <div className="mt-10 grid gap-4">
        {faqs.map((faq) => (
          <Card key={faq.q} className="p-6">
            <h3 className="text-base font-semibold text-slate-950 dark:text-white">{faq.q}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{faq.a}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
