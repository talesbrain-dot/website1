'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { contactInfo } from '@/lib/content';
import { PhoneIcon, MailIcon } from '@/components/icons';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/faq', label: 'FAQs' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur border-b border-ink/10">
      <div className="hidden sm:flex justify-center items-center gap-4 bg-ink text-paper/80 text-xs py-1.5 px-4">
        <span>Established {contactInfo.established} · Dehradun, Uttarakhand</span>
        <span className="text-brass-light">·</span>
        <a href={`tel:${contactInfo.phone}`} className="flex items-center gap-1.5 hover:text-paper transition-colors">
          <PhoneIcon className="w-3 h-3" /> {contactInfo.phone}
        </a>
        <span className="text-brass-light">·</span>
        <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-1.5 hover:text-paper transition-colors">
          <MailIcon className="w-3 h-3" /> {contactInfo.email}
        </a>
      </div>

      <div className="max-w-content mx-auto flex items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="relative w-11 h-11 shrink-0">
            <Image src="/logo-mark.png" alt="Kamboj Press logo" fill className="object-contain" priority />
          </span>
          <span className="leading-tight">
            <span className="block font-display font-semibold text-lg text-ink">Kamboj Press</span>
            <span className="block text-[11px] tracking-wide text-ink/60">Pvt. Ltd. · Printing Solutions</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative group text-sm font-medium transition-colors py-1 ${
                  active ? 'text-ink' : 'text-ink/70 hover:text-ink'
                }`}
              >
                {link.label}
                <span
                  className={`absolute left-0 -bottom-0.5 h-[1.5px] bg-brass transition-all duration-300 ${
                    active ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            );
          })}
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
              <span className={`h-[1.5px] bg-ink transition-transform duration-200 ${open ? 'translate-y-[5.5px] rotate-45' : ''}`} />
              <span className={`h-[1.5px] bg-ink transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
              <span className={`h-[1.5px] bg-ink transition-transform duration-200 ${open ? '-translate-y-[5.5px] -rotate-45' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out border-t border-ink/10 bg-paper ${
          open ? 'max-h-96' : 'max-h-0 border-t-0'
        }`}
      >
        <div className="px-5 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="py-2.5 text-ink/85 font-medium border-b border-ink/5 last:border-b-0"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/enquiry" className="btn-primary justify-center mt-3 text-sm">
            Start an enquiry
          </Link>
        </div>
      </div>
    </header>
  );
}
