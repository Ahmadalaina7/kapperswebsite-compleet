'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, Calendar, Instagram } from 'lucide-react';

const navLinks = [
  { href: '/#diensten', label: 'Diensten' },
  { href: '/#kapper', label: 'De kapper' },
  { href: '/#galerij', label: 'Galerij' },
  { href: '/#over', label: 'Over ons' },
  { href: '/#contact', label: 'Contact' },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3 text-xl font-bold tracking-tight text-slate-900" onClick={() => setOpen(false)}>
            <span className="overflow-hidden rounded-lg border border-slate-100 shadow-sm transition-all group-hover:shadow-glow">
              <Image src="/logo.jpg" alt="Hood Barber Logo" width={44} height={44} className="object-cover" />
            </span>
            <span>Hood Barber</span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium md:flex">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="text-slate-700 transition-colors hover:text-primary-700">
                {l.label}
              </Link>
            ))}
            <Link href="/boeken" className="btn-primary px-5 py-2.5">
              <Calendar className="mr-2 h-4 w-4" /> Boek direct
            </Link>
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <a href="tel:+31413123456" aria-label="Bel ons" className="rounded-xl border border-slate-200 p-2.5 text-slate-700 hover:bg-slate-100">
              <Phone className="h-5 w-5" />
            </a>
            <button
              type="button"
              aria-label={open ? 'Menu sluiten' : 'Menu openen'}
              onClick={() => setOpen(!open)}
              className="rounded-xl border border-slate-200 p-2.5 text-slate-700 hover:bg-slate-100"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="mt-4 flex flex-col gap-1 border-t border-slate-100 pt-4 pb-2 md:hidden">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                {l.label}
              </Link>
            ))}
            <Link href="/boeken" onClick={() => setOpen(false)} className="btn-primary mt-2 py-3">
              <Calendar className="mr-2 h-4 w-4" /> Boek direct
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <h3 className="mb-6 text-xl font-bold tracking-tight text-white">Hood Barber</h3>
            <p className="max-w-xs text-sm leading-relaxed">
              De herenkapsalon van Vlissingen. Alleen mannen, altijd vakwerk, van contouren tot haar knippen en baardverzorging.
            </p>
            <a
              href="https://instagram.com/hoodbarber"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300"
            >
              <Instagram className="h-5 w-5" /> @hoodbarber
            </a>
          </div>
          <div>
            <h3 className="mb-6 text-xl font-bold tracking-tight text-white">Contact</h3>
            <div className="space-y-4 text-sm">
              <p>Vlissingen<br />Zeeland</p>
              <p className="flex items-center gap-3 text-primary-400">
                <Phone className="h-5 w-5" />
                <a href="tel:+31413123456" className="hover:text-primary-300">0413 - 12 34 56</a>
              </p>
              <p>
                <a href="mailto:info@hoodbarber.nl" className="hover:text-primary-300">info@hoodbarber.nl</a>
              </p>
            </div>
          </div>
          <div>
            <h3 className="mb-6 text-xl font-bold tracking-tight text-white">Openingstijden</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-800 pb-2"><span>Ma - Vr:</span> <span className="text-white">09:00 - 17:30</span></div>
              <div className="flex justify-between border-b border-slate-800 pb-2"><span>Za:</span> <span className="text-white">09:00 - 16:30</span></div>
              <div className="flex justify-between pt-1"><span>Zo:</span> <span className="font-medium text-primary-500">Gesloten</span></div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-slate-800 pt-8 text-center text-sm text-slate-600">
          © {new Date().getFullYear()} Hood Barber · Herenkapsalon Vlissingen · Alle rechten voorbehouden
        </div>
      </div>
    </footer>
  );
}
