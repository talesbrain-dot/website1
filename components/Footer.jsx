import Link from 'next/link';
import Image from 'next/image';
import { contactInfo, categories } from '@/lib/content';
import { InstagramIcon, FacebookIcon, WhatsAppIcon, MapPinIcon, PhoneIcon, MailIcon } from '@/components/icons';

export default function Footer() {
  return (
    <footer className="bg-ink text-paper/80 mt-24">
      <div className="max-w-content mx-auto px-5 py-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <span className="relative w-9 h-9 shrink-0">
              <Image src="/logo-mark.png" alt="Kamboj Press logo" fill className="object-contain" />
            </span>
            <span className="font-display font-semibold text-paper text-base">Kamboj Press</span>
          </div>
          <p className="text-sm leading-relaxed text-paper/60 mb-5">
            Established {contactInfo.established}. A complete printing solution for businesses,
            organisations, events and individuals in Dehradun.
          </p>
          <div className="flex items-center gap-3">
            <a
              href={contactInfo.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Kamboj Press on Instagram"
              className="w-9 h-9 flex items-center justify-center border border-paper/20 rounded-full text-paper/70 hover:text-brass-light hover:border-brass-light transition-colors"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a
              href={contactInfo.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Kamboj Press on Facebook"
              className="w-9 h-9 flex items-center justify-center border border-paper/20 rounded-full text-paper/70 hover:text-brass-light hover:border-brass-light transition-colors"
            >
              <FacebookIcon className="w-4 h-4" />
            </a>
            <a
              href={contactInfo.whatsapp}
              target="_blank"
              rel="noreferrer"
              aria-label="Message Kamboj Press on WhatsApp"
              className="w-9 h-9 flex items-center justify-center border border-paper/20 rounded-full text-paper/70 hover:text-brass-light hover:border-brass-light transition-colors"
            >
              <WhatsAppIcon className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-paper text-sm font-semibold mb-4">Services</h3>
          <ul className="space-y-2.5 text-sm">
            {categories.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link href={`/services#${c.slug}`} className="text-paper/60 hover:text-paper transition-colors">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-paper text-sm font-semibold mb-4">Company</h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/about" className="text-paper/60 hover:text-paper transition-colors">About us</Link></li>
            <li><Link href="/portfolio" className="text-paper/60 hover:text-paper transition-colors">Portfolio</Link></li>
            <li><Link href="/faq" className="text-paper/60 hover:text-paper transition-colors">FAQs</Link></li>
            <li><Link href="/contact" className="text-paper/60 hover:text-paper transition-colors">Contact</Link></li>
            <li><Link href="/enquiry" className="text-paper/60 hover:text-paper transition-colors">Start an enquiry</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-paper text-sm font-semibold mb-4">Get in touch</h3>
          <ul className="space-y-3 text-sm text-paper/60">
            <li className="flex items-center gap-2.5">
              <PhoneIcon className="w-4 h-4 shrink-0 text-brass-light" />
              <a href={`tel:${contactInfo.phone}`} className="hover:text-paper transition-colors">{contactInfo.phone}</a>
            </li>
            <li className="flex items-center gap-2.5">
              <MailIcon className="w-4 h-4 shrink-0 text-brass-light" />
              <a href={`mailto:${contactInfo.email}`} className="hover:text-paper transition-colors">{contactInfo.email}</a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPinIcon className="w-4 h-4 shrink-0 text-brass-light mt-0.5" />
              <span>{contactInfo.address}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <div className="max-w-content mx-auto px-5 py-5 flex flex-col sm:flex-row justify-between gap-2 text-xs text-paper/45">
          <span>&copy; {new Date().getFullYear()} Kamboj Press Pvt. Ltd. All rights reserved.</span>
          <Link href="/admin/login" className="hover:text-paper/70 transition-colors">Staff login</Link>
        </div>
      </div>
    </footer>
  );
}
