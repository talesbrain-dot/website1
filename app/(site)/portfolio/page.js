import Link from 'next/link';
import { portfolioItems } from '@/lib/content';
import { ProductIllustration } from '@/components/ProductIcons';

export const metadata = {
  title: 'Portfolio | Kamboj Press',
  description: 'A showcase of print work from Kamboj Press — business, marketing, large format, packaging and event print.',
};

export default function PortfolioPage() {
  return (
    <>
      <section className="border-b border-ink/10">
        <div className="max-w-content mx-auto px-5 pt-14 pb-10">
          <p className="text-sm text-ink/55 mb-2">Print showcase</p>
          <h1 className="font-display text-4xl sm:text-5xl text-ink font-medium max-w-[18ch]">
            A few things we&rsquo;ve put in customers&rsquo; hands.
          </h1>
          <p className="mt-5 text-ink/70 max-w-[52ch] leading-relaxed">
            A cross-section of the work that comes through the press — swap in your own project
            photos here once you have a shoot done; for now this reflects the product range.
          </p>
        </div>
      </section>

      <section className="max-w-content mx-auto px-5 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {portfolioItems.map((item) => (
            <Link key={item.name} href={`/products/${item.slug}`} className="card-lift group border border-ink/10 bg-white/40 hover:border-brass">
              <div className="aspect-[4/3] bg-paper-dark border-b border-ink/10 flex items-center justify-center p-10">
                <div className="w-full h-full text-ink/70 group-hover:text-brass-dark transition-colors">
                  <ProductIllustration icon={item.icon} className="w-full h-full" />
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-medium text-ink">{item.name}</h3>
                <p className="text-sm text-ink/55 mt-1">{item.category}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-ink text-paper">
        <div className="max-w-content mx-auto px-5 py-16 text-center">
          <h2 className="font-display text-3xl text-paper font-medium mb-4">See something close to what you need?</h2>
          <p className="text-paper/65 max-w-[46ch] mx-auto mb-7 leading-relaxed">
            Tell us which piece caught your eye and what you&rsquo;d like to make.
          </p>
          <Link href="/enquiry" className="btn-primary">Start your enquiry</Link>
        </div>
      </section>
    </>
  );
}
