import { Suspense } from 'react';
import EnquiryForm from '@/components/EnquiryForm';
import { contactInfo } from '@/lib/content';

export const metadata = {
  title: 'Start an Enquiry | Kamboj Press',
  description: 'Tell Kamboj Press what you need printed and get guidance on the right format and finish.',
};

export default function EnquiryPage() {
  return (
    <section className="max-w-content mx-auto px-5 py-14 grid lg:grid-cols-[0.85fr_1.15fr] gap-14">
      <div>
        <p className="text-sm text-ink/55 mb-2">Start an enquiry</p>
        <h1 className="font-display text-4xl text-ink font-medium mb-6 max-w-[16ch]">
          Tell us what you&rsquo;re printing.
        </h1>
        <p className="text-ink/70 leading-relaxed mb-8 max-w-[42ch]">
          The more detail you give us — quantity, size, material, deadline — the faster we can come
          back with a specific, useful recommendation instead of a generic price list.
        </p>

        <ul className="space-y-4 text-sm text-ink/65 border-t border-ink/10 pt-6">
          <li className="flex gap-3"><span className="reg-mark mt-1 shrink-0" /> No online pricing — every job gets a real answer from our team.</li>
          <li className="flex gap-3"><span className="reg-mark mt-1 shrink-0" /> Custom sizes and one-off jobs are welcome.</li>
          <li className="flex gap-3"><span className="reg-mark mt-1 shrink-0" /> Prefer to talk it through? Call {contactInfo.phone}.</li>
        </ul>
      </div>

      <div className="border border-ink/12 bg-white/40 p-7 sm:p-9">
        <Suspense fallback={<p className="text-ink/50 text-sm">Loading form…</p>}>
          <EnquiryForm />
        </Suspense>
      </div>
    </section>
  );
}
