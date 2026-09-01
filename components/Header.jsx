'use client';

import { useState } from 'react';
import Link from 'next/link';
import { contactInfo } from '@/lib/content';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur border-b border-ink/10">
      <div className="hidden sm:flex justify-center gap-4 bg-ink text-paper/80 text-xs py-1.5 px-4">
        <span>Established {contactInfo.established} · Dehradun, Uttarakhand</span>
        <span className="text-brass-light">·</span>
        <a href={`tel:${contactInfo.phone}`} className="hover:text-paper">{contactInfo.phone}</a>
        <span className="text-brass-light">·</span>
        <a href={`mailto:${contactInfo.email}`} className="hover:text-paper">{contactInfo.email}</a>
      </div>

      <div className="max-w-content mx-auto flex items-center justify-between px-5 py-3.5">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="w-9 h-9 rounded-sm bg-ink text-brass-light flex items-center justify-center font-display font-semibold text-lg">
            K
          </span>
          <span className="leading-tight">
            <span className="block font-display font-semibold text-lg text-ink">Kamboj Press</span>
            <span className="block text-[11px] tracking-wide text-ink/60">Pvt. Ltd. · Printing Solutions</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-ink/80 hover:text-ink transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/enquiry" className="hidden sm:inline-flex btn-primary !px-5 !py-2.5 text-sm">
            Start an enquiry
          </Link>
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center border border-ink/20 rounded-sm"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span className="sr-only">Menu</span>
            <div className="w-4 flex flex-col gap-1">
              <span className={`h-[1.5px] bg-ink transition-transform ${open ? 'translate-y-[5.5px] rotate-45' : ''}`} />
              <span className={`h-[1.5px] bg-ink transition-opacity ${open ? 'opacity-0' : ''}`} />
              <span className={`h-[1.5px] bg-ink transition-transform ${open ? '-translate-y-[5.5px] -rotate-45' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-ink/10 bg-paper px-5 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="py-2.5 text-ink/85 font-medium border-b border-ink/5 last:border-b-0"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/enquiry" onClick={() => setOpen(false)} className="btn-primary justify-center mt-3 text-sm">
            Start an enquiry
          </Link>
        </div>
      )}
    </header>
  );
}
