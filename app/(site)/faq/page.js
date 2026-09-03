import Link from 'next/link';
import { faqs, contactInfo } from '@/lib/content';
import FaqAccordion from '@/components/FaqAccordion';

export const metadata = {
  title: 'FAQs | Kamboj Press',
  description: 'Common questions about ordering print from Kamboj Press — pricing, proofs, quantities, timelines and delivery.',
};

export default function FaqPage() {
  return (
    <section className="max-w-content mx-auto px-5 py-14 grid lg:grid-cols-[0.8fr_1.2fr] gap-14">
      <div>
        <p className="text-sm text-ink/55 mb-2">FAQs</p>
        <h1 className="font-display text-4xl text-ink font-medium mb-6 max-w-[16ch]">
          Common questions, answered.
        </h1>
        <p className="text-ink/70 leading-relaxed mb-8 max-w-[42ch]">
          Can&rsquo;t find what you&rsquo;re looking for? Send us your question directly.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href="/enquiry" className="btn-primary">Start an enquiry</Link>
          <a href={`tel:${contactInfo.phone}`} className="btn-outline">Call {contactInfo.phone}</a>
        </div>
      </div>

      <FaqAccordion faqs={faqs} />
    </section>
  );
}
