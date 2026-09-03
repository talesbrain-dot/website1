import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllProducts, getProductBySlug, getRelatedProducts, categories } from '@/lib/content';
import { ProductIllustration } from '@/components/ProductIcons';
import { ArrowRightIcon, CheckIcon } from '@/components/icons';

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }) {
  const product = getProductBySlug(params.slug);
  if (!product) return { title: 'Product not found | Kamboj Press' };
  return {
    title: `${product.name} | Kamboj Press`,
    description: `${product.name} from Kamboj Press — ${product.categoryDescription}`,
  };
}

const GENERIC_HIGHLIGHTS = [
  'Guidance on the right paper, material and finish for your use case',
  'A proof or sample shared before the full run goes to print',
  'Small and bulk quantities both handled — ask about your specific number',
  'Custom sizes and one-off variations considered on request',
];

export default function ProductPage({ params }) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const category = categories.find((c) => c.slug === product.categorySlug);
  const related = getRelatedProducts(product, 4);

  return (
    <>
      <section className="border-b border-ink/10">
        <div className="max-w-content mx-auto px-5 pt-8">
          <nav className="flex items-center flex-wrap gap-1.5 text-xs text-ink/50 py-4">
            <Link href="/" className="hover:text-ink transition-colors">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-ink transition-colors">Services</Link>
            <span>/</span>
            <Link href={`/services#${product.categorySlug}`} className="hover:text-ink transition-colors">{product.categoryLabel}</Link>
            <span>/</span>
            <span className="text-ink/70">{product.name}</span>
          </nav>
        </div>

        <div className="max-w-content mx-auto px-5 pb-14 grid lg:grid-cols-[0.55fr_1fr] gap-12 items-center animate-fade-up">
          <div className="crop-frame bg-paper-dark aspect-square flex items-center justify-center p-12">
            <span className="crop-tl" /><span className="crop-br" />
            <div className="w-full h-full text-ink/70">
              <ProductIllustration icon={product.icon} className="w-full h-full" />
            </div>
          </div>

          <div>
            <p className="text-sm text-ink/55 mb-2">{product.categoryLabel}</p>
            <h1 className="font-display text-4xl sm:text-5xl text-ink font-medium max-w-[18ch] mb-5">
              {product.name}
            </h1>
            <p className="text-ink/70 leading-relaxed max-w-[52ch] mb-8">
              {category?.description} Tell us your quantity, size and deadline for {product.name.toLowerCase()}
              {' '}and we&rsquo;ll come back with a specific, workable recommendation.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={{ pathname: '/enquiry', query: { category: product.categoryLabel, product: product.name } }}
                className="btn-primary"
              >
                Enquire about this
              </Link>
              <Link href="/services" className="btn-outline">Back to catalogue</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-content mx-auto px-5 py-16 grid lg:grid-cols-[1fr_0.7fr] gap-14">
        <div>
          <h2 className="font-display text-2xl text-ink font-medium mb-6">What you can expect</h2>
          <ul className="space-y-4">
            {GENERIC_HIGHLIGHTS.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-brass/15 text-brass-dark flex items-center justify-center shrink-0 mt-0.5">
                  <CheckIcon className="w-3 h-3" />
                </span>
                <span className="text-ink/75 leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 border border-ink/12 bg-white/40 p-6">
            <h3 className="font-medium text-ink mb-2">Not sure about specifications?</h3>
            <p className="text-sm text-ink/60 leading-relaxed mb-4">
              That&rsquo;s normal — most customers don&rsquo;t arrive with exact print specs. Describe
              what {product.name.toLowerCase()} is for and roughly how many you need; we&rsquo;ll suggest
              sizes, material and finish that fit the budget and purpose.
            </p>
            <Link
              href={{ pathname: '/enquiry', query: { category: product.categoryLabel, product: product.name } }}
              className="text-sm font-medium text-brass-dark border-b border-brass pb-0.5"
            >
              Start your enquiry for {product.name.toLowerCase()}
            </Link>
          </div>
        </div>

        <div className="border-l border-ink/10 pl-8 hidden lg:block">
          <h3 className="text-sm font-semibold text-ink mb-4">More in {product.categoryLabel}</h3>
          <ul className="space-y-1">
            {related.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/products/${item.slug}`}
                  className="flex items-center gap-3 py-2.5 text-sm text-ink/70 hover:text-ink border-b border-ink/6"
                >
                  <span className="w-5 h-5 text-ink/40 shrink-0">
                    <ProductIllustration icon={item.icon} className="w-full h-full" />
                  </span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <Link href={`/services#${product.categorySlug}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-brass-dark mt-5">
            See all of {product.categoryLabel}
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* Mobile: related products as a horizontal section instead of sidebar */}
      <section className="lg:hidden max-w-content mx-auto px-5 pb-16 -mt-8">
        <h3 className="text-sm font-semibold text-ink mb-4">More in {product.categoryLabel}</h3>
        <div className="grid grid-cols-2 gap-3">
          {related.map((item) => (
            <Link key={item.slug} href={`/products/${item.slug}`} className="card-lift flex items-center gap-3 border border-ink/10 bg-white/40 p-3">
              <span className="w-6 h-6 text-ink/50 shrink-0">
                <ProductIllustration icon={item.icon} className="w-full h-full" />
              </span>
              <span className="text-sm text-ink/80">{item.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-ink text-paper">
        <div className="max-w-content mx-auto px-5 py-16 text-center">
          <h2 className="font-display text-3xl text-paper font-medium mb-4">Ready to talk about {product.name.toLowerCase()}?</h2>
          <p className="text-paper/65 max-w-[46ch] mx-auto mb-7 leading-relaxed">
            Send your requirement — quantity, size, deadline — and we&rsquo;ll take it from there.
          </p>
          <Link
            href={{ pathname: '/enquiry', query: { category: product.categoryLabel, product: product.name } }}
            className="btn-primary"
          >
            Start your enquiry
          </Link>
        </div>
      </section>
    </>
  );
}
