import Link from 'next/link';
import { categories, whyPoints, portfolioItems, contactInfo, reviews } from '@/lib/content';
import { ProductIllustration } from '@/components/ProductIcons';
import { ArrowRightIcon } from '@/components/icons';

export default function HomePage() {
  return (
    <>
      {/* HERO — signature moment: a grid of real product illustrations,
          framed with registration crop marks, replacing an abstract motif
          with imagery that actually shows what the press makes. */}
      <section className="relative overflow-hidden border-b border-ink/10">
        <div className="max-w-content mx-auto px-5 pt-14 pb-20 grid lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
          <div className="animate-fade-up">
            <div className="flex items-center gap-2 text-sm text-ink/60 mb-6">
              <span className="reg-mark" />
              A complete printing solution · Dehradun
            </div>
            <h1 className="font-display text-[2.75rem] sm:text-6xl leading-[1.05] text-ink font-medium max-w-[14ch]">
              Print that makes your business look better.
            </h1>
            <p className="mt-6 text-lg text-ink/70 max-w-[52ch] leading-relaxed">
              From everyday business essentials to bold flex, signage, packaging and events —
              one press, one point of contact, and a straightforward way to get started.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link href="/enquiry" className="btn-primary">Start your enquiry</Link>
              <Link href="/services" className="btn-outline">Browse the catalogue</Link>
            </div>

            <dl className="mt-14 grid grid-cols-3 max-w-md border-t border-ink/10 pt-6">
              <div>
                <dt className="text-2xl font-display font-medium text-ink">{contactInfo.established}</dt>
                <dd className="text-xs text-ink/55 mt-1">Established</dd>
              </div>
              <div>
                <dt className="text-2xl font-display font-medium text-ink">80+</dt>
                <dd className="text-xs text-ink/55 mt-1">Products &amp; solutions</dd>
              </div>
              <div>
                <dt className="text-2xl font-display font-medium text-ink">Dehradun</dt>
                <dd className="text-xs text-ink/55 mt-1">Local support</dd>
              </div>
            </dl>
          </div>

          <div className="crop-frame animate-fade-up" style={{ animationDelay: '120ms' }}>
            <span className="crop-tl" />
            <span className="crop-br" />
            <HeroCollage />
          </div>
        </div>
      </section>

      {/* QUICK PATHS */}
      <section className="max-w-content mx-auto px-5 py-14 grid sm:grid-cols-3 gap-5">
        <QuickPath
          href="/services"
          title="Explore the catalogue"
          body="Find the exact product you need across 80+ items."
        />
        <QuickPath
          href="/enquiry"
          title="Tell us your requirement"
          body="Get guidance and a quote suited to the job."
        />
        <QuickPath
          href="/contact"
          title="Visit the press"
          body="Near Sunanda Hospital, Shimla Bypass Road."
        />
      </section>

      {/* CATEGORIES */}
      <section className="max-w-content mx-auto px-5 py-16 border-t border-ink/10">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-sm text-ink/55 mb-2">Made for real print requirements</p>
            <h2 className="font-display text-3xl sm:text-4xl text-ink font-medium max-w-[16ch]">
              Everything from business cards to big-format.
            </h2>
          </div>
          <Link href="/services" className="text-sm font-medium text-ink border-b border-brass pb-0.5 hover:text-brass-dark transition-colors">
            See all services
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.slice(0, 6).map((cat) => (
            <Link
              key={cat.slug}
              href={`/services#${cat.slug}`}
              className="card-lift group border border-ink/12 bg-white/40 p-6 flex flex-col justify-between min-h-[240px] hover:border-brass hover:bg-white"
            >
              <div>
                <div className="w-11 h-11 text-ink/70 group-hover:text-brass-dark transition-colors mb-4">
                  <ProductIllustration icon={cat.icon} className="w-full h-full" />
                </div>
                <h3 className="font-display text-xl text-ink font-medium mb-2">{cat.label}</h3>
                <p className="text-sm text-ink/65 leading-relaxed">{cat.tagline}</p>
              </div>
              <span className="flex items-center gap-1.5 text-sm font-medium text-brass-dark mt-6">
                Explore category
                <ArrowRightIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* WHY US */}
      <section className="border-t border-ink/10 bg-white/50">
        <div className="max-w-content mx-auto px-5 py-16 grid lg:grid-cols-[0.85fr_1.15fr] gap-14">
          <div>
            <p className="text-sm text-ink/55 mb-2">Why customers choose Kamboj Press</p>
            <h2 className="font-display text-3xl sm:text-4xl text-ink font-medium max-w-[15ch] mb-6">
              A simpler way to get print done.
            </h2>
            <p className="text-ink/70 leading-relaxed max-w-[42ch] mb-8">
              Tell us what you are making, how much you need and when you need it. We help you
              choose the right format, finish and print approach — without forcing you through a
              complicated checkout.
            </p>
            <Link href="/enquiry" className="btn-primary">Start a guided enquiry</Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
            {whyPoints.map((point) => (
              <div key={point.title} className="border-l-2 border-brass/40 pl-5">
                <h3 className="font-medium text-ink mb-1.5">{point.title}</h3>
                <p className="text-sm text-ink/60 leading-relaxed">{point.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO STRIP */}
      <section className="max-w-content mx-auto px-5 py-16 border-t border-ink/10">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-sm text-ink/55 mb-2">Print showcase</p>
            <h2 className="font-display text-3xl sm:text-4xl text-ink font-medium max-w-[16ch]">
              A few things we can put in your hands.
            </h2>
          </div>
          <Link href="/portfolio" className="text-sm font-medium text-ink border-b border-brass pb-0.5 hover:text-brass-dark transition-colors">
            Open showcase
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {portfolioItems.slice(0, 5).map((item) => (
            <Link
              key={item.name}
              href={`/products/${item.slug}`}
              className="card-lift group aspect-[4/5] bg-white/50 border border-ink/10 flex flex-col hover:border-brass overflow-hidden"
            >
              <div className="flex-1 flex items-center justify-center p-6 text-ink/60 group-hover:text-brass-dark transition-colors">
                <ProductIllustration icon={item.icon} className="w-full h-full" />
              </div>
              <span className="text-sm font-medium text-ink px-4 pb-4">{item.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="border-t border-ink/10 bg-white/50">
        <div className="max-w-content mx-auto px-5 py-16">
          <p className="text-sm text-ink/55 mb-2">What customers say</p>
          <h2 className="font-display text-3xl sm:text-4xl text-ink font-medium max-w-[16ch] mb-10">
            Trusted by businesses and families across Dehradun.
          </h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {reviews.map((r) => (
              <div key={r.name} className="card-lift border border-ink/12 bg-white p-6">
                <div className="flex gap-1 mb-4" aria-label={`${r.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} filled={i < r.rating} />
                  ))}
                </div>
                <p className="text-ink/75 leading-relaxed mb-5">&ldquo;{r.quote}&rdquo;</p>
                <div>
                  <p className="text-sm font-medium text-ink">{r.name}</p>
                  <p className="text-xs text-ink/50">{r.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section className="border-t border-ink/10">
        <div className="max-w-content mx-auto px-5 py-16 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-sm text-ink/55 mb-2">Find us in Dehradun</p>
            <h2 className="font-display text-3xl text-ink font-medium mb-4 max-w-[18ch]">
              Near Sunanda Hospital, right on Shimla Bypass Road.
            </h2>
            <p className="text-ink/70 leading-relaxed mb-7 max-w-[46ch]">
              Our press is listed as <strong className="text-ink">Kamboj Printing Press</strong> near
              Sunanda Hospital, Shimla Bypass Road, Dehradun. Open the map for directions to the
              specific listing.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href={contactInfo.mapsUrl} target="_blank" rel="noreferrer" className="btn-primary">
                Open on Google Maps
              </a>
              <Link href="/contact" className="btn-outline">Contact us</Link>
            </div>
          </div>
          <div className="crop-frame h-[320px] border border-ink/10 overflow-hidden">
            <span className="crop-tl" /><span className="crop-br" />
            <iframe
              title="Kamboj Press location"
              src={contactInfo.mapsEmbedUrl}
              className="w-full h-full grayscale-[15%]"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink text-paper">
        <div className="max-w-content mx-auto px-5 py-16 grid lg:grid-cols-2 gap-10">
          <div className="border-r-0 lg:border-r border-paper/15 lg:pr-10">
            <p className="text-sm text-paper/55 mb-2">Ready when you are</p>
            <h2 className="font-display text-3xl text-paper font-medium mb-4">Have a print requirement?</h2>
            <p className="text-paper/65 mb-7 max-w-[40ch] leading-relaxed">
              Send the details. We will take it from there.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/enquiry" className="btn-primary">Enquire now</Link>
              <a href={`tel:${contactInfo.phone}`} className="btn-ghost-paper">Call {contactInfo.phone}</a>
            </div>
          </div>
          <div className="lg:pl-10">
            <p className="text-sm text-paper/55 mb-2">Need something custom?</p>
            <h2 className="font-display text-3xl text-paper font-medium mb-4">
              Tell us what you need. We&rsquo;ll help you plan the print.
            </h2>
            <p className="text-paper/65 mb-7 max-w-[40ch] leading-relaxed">
              Custom sizes, materials, finishing, bulk requirements and more.
            </p>
            <a href={contactInfo.whatsapp} target="_blank" rel="noreferrer" className="btn-ghost-paper">
              WhatsApp us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function QuickPath({ href, title, body }) {
  return (
    <Link href={href} className="card-lift group border border-ink/12 p-6 bg-white/40 hover:border-brass hover:bg-white">
      <h3 className="font-medium text-ink mb-1.5">{title}</h3>
      <p className="text-sm text-ink/60 leading-relaxed mb-3">{body}</p>
      <span className="flex items-center gap-1.5 text-sm text-brass-dark font-medium">
        Go <ArrowRightIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

function StarIcon({ filled }) {
  return (
    <svg viewBox="0 0 20 20" className={`w-4 h-4 ${filled ? 'text-brass' : 'text-ink/15'}`} fill="currentColor">
      <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6L1.3 7.7l6.1-.6z" />
    </svg>
  );
}

// A framed grid of real product illustrations — replaces the old abstract
// CMYK-plate motif with imagery that actually shows what the press makes.
function HeroCollage() {
  const items = [
    { icon: 'card', label: 'Business cards' },
    { icon: 'banner', label: 'Flex banners' },
    { icon: 'box', label: 'Packaging' },
    { icon: 'book', label: 'Albums & books' },
    { icon: 'stamp', label: 'Stamps' },
    { icon: 'idcard', label: 'ID cards' },
  ];
  return (
    <div className="bg-paper-dark p-8 sm:p-10">
      <div className="grid grid-cols-3 gap-4 sm:gap-6">
        {items.map((item, i) => (
          <div
            key={item.icon}
            className="aspect-square bg-white/70 border border-ink/8 flex flex-col items-center justify-center gap-2 p-3 animate-fade-up"
            style={{ animationDelay: `${180 + i * 60}ms` }}
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 text-ink/75">
              <ProductIllustration icon={item.icon} className="w-full h-full" />
            </div>
            <span className="text-[10px] sm:text-xs text-ink/55 text-center leading-tight">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
