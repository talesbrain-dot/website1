import Link from 'next/link';
import { contactInfo, categories } from '@/lib/content';

export default function Footer() {
  return (
    <footer className="bg-ink text-paper/80 mt-24">
      <div className="max-w-content mx-auto px-5 py-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-8 h-8 rounded-sm bg-brass text-ink-dark flex items-center justify-center font-display font-semibold">
              K
            </span>
            <span className="font-display font-semibold text-paper text-base">Kamboj Press</span>
          </div>
          <p className="text-sm leading-relaxed text-paper/60">
            Established {contactInfo.established}. A complete printing solution for businesses,
            organisations, events and individuals in Dehradun.
          </p>
        </div>

        <div>
          <h3 className="text-paper text-sm font-semibold mb-4">Services</h3>
          <ul className="space-y-2.5 text-sm">
            {categories.slice(0, 5).map((c) => (
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
            <li><Link href="/contact" className="text-paper/60 hover:text-paper transition-colors">Contact</Link></li>
            <li><Link href="/enquiry" className="text-paper/60 hover:text-paper transition-colors">Start an enquiry</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-paper text-sm font-semibold mb-4">Get in touch</h3>
          <ul className="space-y-2.5 text-sm text-paper/60">
            <li><a href={`tel:${contactInfo.phone}`} className="hover:text-paper transition-colors">{contactInfo.phone}</a></li>
            <li><a href={`mailto:${contactInfo.email}`} className="hover:text-paper transition-colors">{contactInfo.email}</a></li>
            <li>{contactInfo.address}</li>
            <li className="flex gap-4 pt-1">
              <a href={contactInfo.instagram} className="hover:text-paper transition-colors">Instagram</a>
              <a href={contactInfo.facebook} className="hover:text-paper transition-colors">Facebook</a>
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
