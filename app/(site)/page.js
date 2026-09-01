import Link from 'next/link';
import { categories, whyPoints, portfolioItems, contactInfo } from '@/lib/content';

export default function HomePage() {
  return (
    <>
      {/* HERO — signature moment: an abstract CMYK color-separation mark stands
          in for a photo, framed with the registration crop marks. */}
      <section className="relative overflow-hidden border-b border-ink/10">
        <div className="max-w-content mx-auto px-5 pt-14 pb-20 grid lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
          <div>
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

          <div className="crop-frame">
            <span className="crop-tl" />
            <span className="crop-br" />
            <HeroMark />
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
              className="group border border-ink/12 bg-white/40 p-6 flex flex-col justify-between min-h-[220px] hover:border-brass hover:bg-white transition-colors"
            >
              <div>
                <h3 className="font-display text-xl text-ink font-medium mb-2">{cat.label}</h3>
                <p className="text-sm text-ink/65 leading-relaxed">{cat.tagline}</p>
              </div>
              <span className="text-sm font-medium text-brass-dark mt-6 group-hover:text-brass-dark">
                Explore category
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
            <div key={item.name} className="aspect-[4/5] bg-ink/[0.06] border border-ink/10 flex items-end p-4">
              <span className="text-sm font-medium text-ink">{item.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* LOCATION */}
      <section className="border-t border-ink/10 bg-white/50">
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
    <Link href={href} className="group border border-ink/12 p-6 bg-white/40 hover:border-brass hover:bg-white transition-colors">
      <h3 className="font-medium text-ink mb-1.5">{title}</h3>
      <p className="text-sm text-ink/60 leading-relaxed mb-3">{body}</p>
      <span className="text-sm text-brass-dark font-medium">Go</span>
    </Link>
  );
}

// Abstract stand-in for a hero photograph: four offset "plates" evoking
// CMYK color separation on a press sheet — grounded in the actual craft
// rather than a generic gradient blob.
function HeroMark() {
  return (
    <svg viewBox="0 0 480 520" className="w-full h-auto" role="img" aria-label="Layered color-separation illustration">
      <rect width="480" height="520" fill="#EDE6D6" />
      <g opacity="0.9">
        <rect x="70" y="70" width="260" height="340" fill="#12213A" opacity="0.85" />
        <rect x="100" y="100" width="260" height="340" fill="#B23A2E" opacity="0.55" style={{ mixBlendMode: 'multiply' }} />
        <rect x="130" y="130" width="260" height="340" fill="#C08A2E" opacity="0.6" style={{ mixBlendMode: 'multiply' }} />
        <rect x="160" y="160" width="260" height="340" fill="#EDE6D6" opacity="0.35" style={{ mixBlendMode: 'multiply' }} />
      </g>
      <g stroke="#12213A" strokeWidth="1" opacity="0.4">
        <line x1="160" y1="40" x2="160" y2="480" />
        <line x1="40" y1="160" x2="440" y2="160" />
      </g>
      <circle cx="160" cy="160" r="16" fill="none" stroke="#B23A2E" strokeWidth="1.5" />
      <line x1="160" y1="142" x2="160" y2="178" stroke="#B23A2E" strokeWidth="1.2" />
      <line x1="142" y1="160" x2="178" y2="160" stroke="#B23A2E" strokeWidth="1.2" />
    </svg>
  );
}
