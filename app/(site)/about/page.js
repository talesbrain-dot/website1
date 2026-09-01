import Link from 'next/link';
import { contactInfo } from '@/lib/content';

export const metadata = {
  title: 'About Us | Kamboj Press',
  description: 'Kamboj Press has been a local printing press in Dehradun since 1996.',
};

const process = [
  { title: 'Tell us the job', body: 'Share what you\u2019re printing, roughly how many, and when you need it.' },
  { title: 'We recommend the format', body: 'We suggest the right paper, finish and print method for the use case and budget.' },
  { title: 'You approve a proof', body: 'Nothing goes to press until you\u2019ve seen and signed off on a proof.' },
  { title: 'We print and deliver', body: 'Collect from the press or arrange delivery, depending on the job.' },
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-ink/10">
        <div className="max-w-content mx-auto px-5 pt-14 pb-14 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-start">
          <div>
            <p className="text-sm text-ink/55 mb-2">About Kamboj Press</p>
            <h1 className="font-display text-4xl sm:text-5xl text-ink font-medium max-w-[16ch] mb-6">
              A press built on repeat customers, not one-off sales.
            </h1>
            <p className="text-ink/70 leading-relaxed max-w-[52ch] mb-4">
              Kamboj Press Pvt. Ltd. has been printing for businesses, institutions and families in
              Dehradun since {contactInfo.established}. What started as a general printing press has
              grown into a full catalogue covering business essentials, marketing material,
              large-format flex and signage, packaging, and event print.
            </p>
            <p className="text-ink/70 leading-relaxed max-w-[52ch]">
              What hasn&rsquo;t changed is how we work: we&rsquo;d rather understand what you&rsquo;re
              actually trying to print than push you through a generic order form. That means a real
              conversation before a quote, and a proof before anything goes to press.
            </p>
          </div>
          <div className="crop-frame border border-ink/10 bg-white/50 p-8">
            <span className="crop-tl" /><span className="crop-br" />
            <dl className="space-y-6">
              <div>
                <dt className="text-xs text-ink/50 mb-1">Founded</dt>
                <dd className="font-display text-2xl text-ink">{contactInfo.established}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink/50 mb-1">Based in</dt>
                <dd className="font-display text-2xl text-ink">Dehradun</dd>
              </div>
              <div>
                <dt className="text-xs text-ink/50 mb-1">Catalogue size</dt>
                <dd className="font-display text-2xl text-ink">80+ products</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="max-w-content mx-auto px-5 py-16 border-b border-ink/10">
        <p className="text-sm text-ink/55 mb-2">How a job runs</p>
        <h2 className="font-display text-3xl text-ink font-medium mb-10 max-w-[18ch]">
          From first message to finished print.
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {process.map((step, i) => (
            <div key={step.title} className="border-t-2 border-brass pt-4">
              <span className="text-xs text-ink/40 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="font-medium text-ink mt-2 mb-1.5">{step.title}</h3>
              <p className="text-sm text-ink/60 leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink text-paper">
        <div className="max-w-content mx-auto px-5 py-16 text-center">
          <h2 className="font-display text-3xl text-paper font-medium mb-4">Want to talk through a job?</h2>
          <p className="text-paper/65 max-w-[46ch] mx-auto mb-7 leading-relaxed">
            Send us the details, or call the press directly.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/enquiry" className="btn-primary">Start your enquiry</Link>
            <a href={`tel:${contactInfo.phone}`} className="btn-ghost-paper">Call {contactInfo.phone}</a>
          </div>
        </div>
      </section>
    </>
  );
}
