import Link from 'next/link';
import { categories } from '@/lib/content';
import { ProductIllustration } from '@/components/ProductIcons';
import { ArrowRightIcon } from '@/components/icons';

export const metadata = {
  title: 'Our Services | Kamboj Press',
  description: 'Browse the full Kamboj Press catalogue — business printing, marketing, flex and large format, packaging, events and custom jobs.',
};

export default function ServicesPage() {
  return (
    <>
      <section className="border-b border-ink/10">
        <div className="max-w-content mx-auto px-5 pt-14 pb-10">
          <p className="text-sm text-ink/55 mb-2">Our services</p>
          <h1 className="font-display text-4xl sm:text-5xl text-ink font-medium max-w-[18ch]">
            One catalogue, every kind of print job.
          </h1>
          <p className="mt-5 text-ink/70 max-w-[52ch] leading-relaxed">
            {categories.length} categories, 80+ products. If something you need isn&rsquo;t listed here,
            it&rsquo;s still worth asking — a large share of our work is custom.
          </p>
        </div>
      </section>

      <section className="max-w-content mx-auto px-5 py-16">
        <div className="flex flex-col gap-16">
          {categories.map((cat, i) => (
            <div key={cat.slug} id={cat.slug} className="scroll-mt-24 grid lg:grid-cols-[0.7fr_1.3fr] gap-8 border-t border-ink/10 pt-10">
              <div>
                <span className="text-xs text-ink/45 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <div className="w-10 h-10 text-brass-dark mt-2 mb-1">
                  <ProductIllustration icon={cat.icon} className="w-full h-full" />
                </div>
                <h2 className="font-display text-2xl text-ink font-medium mt-1">{cat.label}</h2>
                <p className="text-ink/60 mt-2 leading-relaxed max-w-[36ch]">{cat.description}</p>
                <Link
                  href={{ pathname: '/enquiry', query: { category: cat.label } }}
                  className="inline-flex items-center gap-1.5 mt-5 text-sm font-medium text-brass-dark border-b border-brass pb-0.5"
                >
                  Enquire about {cat.label.toLowerCase()}
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
              <ul className="grid sm:grid-cols-2 gap-3 content-start">
                {cat.items.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/products/${item.slug}`}
                      className="card-lift group flex items-center gap-3 py-3 px-3 -mx-3 border-b border-ink/8 text-ink/80 hover:border-brass/40 hover:bg-white/60"
                    >
                      <span className="w-6 h-6 text-ink/50 group-hover:text-brass-dark transition-colors shrink-0">
                        <ProductIllustration icon={item.icon} className="w-full h-full" />
                      </span>
                      <span className="flex-1">{item.name}</span>
                      <ArrowRightIcon className="w-3.5 h-3.5 text-ink/30 group-hover:text-brass-dark group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink text-paper">
        <div className="max-w-content mx-auto px-5 py-16 text-center">
          <h2 className="font-display text-3xl text-paper font-medium mb-4">Not sure which category fits?</h2>
          <p className="text-paper/65 max-w-[46ch] mx-auto mb-7 leading-relaxed">
            Describe what you&rsquo;re making and we&rsquo;ll point you to the right product and finish.
          </p>
          <Link href="/enquiry" className="btn-primary">Start your enquiry</Link>
        </div>
      </section>
    </>
  );
}
