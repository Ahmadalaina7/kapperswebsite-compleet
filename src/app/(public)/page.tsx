import Link from 'next/link';
import Image from 'next/image';
import {
  Scissors, Clock, Star, Phone, MapPin, Calendar, Sparkles,
  ShieldCheck, User, ChevronDown, Instagram, Mail, CheckCircle2, UserCheck,
} from 'lucide-react';
import { SITE } from '@/lib/booking-data';

const services = [
  { name: 'Contouren', duration: 20, price: 500, description: 'Haarlijn strak zetten: nek, slapen en bovenlip bijgewerkt.', tag: 'Snel & scherp' },
  { name: 'Haar knippen', duration: 30, price: 1500, description: 'Complete knipbeurt, gewassen en gestyled naar wens.', tag: 'Meest geboekt' },
  { name: 'Haar + baard', duration: 45, price: 1800, description: 'Knipbeurt plus baard trimmen en vormgeven.', tag: 'Populair' },
];

const testimonials = [
  { name: 'Mark de Vries', text: 'Eindelijk een kapper die mannen echt begrijpt. Elke keer weer een strak kapsel.', rating: 5 },
  { name: 'Ahmed Yilmaz', text: 'De knipbeurt van Fikri is gewoon de beste in de regio. Ik ga nergens anders heen.', rating: 5 },
  { name: 'Daan Bakker', text: 'Vriendelijke gasten, goede koffie en altijd op tijd. Dit is hoe het hoort.', rating: 5 },
];

const faqs = [
  {
    q: 'Knippen jullie ook vrouwen?',
    a: 'Nee. Hood Barber is een herenkapsalon: het volledige aanbod is speciaal gericht op mannen en jongens.',
  },
  {
    q: 'Moet ik een afspraak maken?',
    a: 'We werken met en zonder afspraak, maar online boeken garandeert jouw tijdslot. Zonder afspraak kan het voorkomen dat je even moet wachten.',
  },
  {
    q: 'Kan ik mijn afspraak verzetten?',
    a: 'Ja, bel of app ons minimaal 2 uur van tevoren, dan zetten we je kosteloos om naar een ander moment.',
  },
  {
    q: 'Tot wanneer kan ik terecht?',
    a: 'Maandag tot en met vrijdag van 09:00 tot 17:30 en zaterdag van 09:00 tot 16:30. Zondag zijn we gesloten.',
  },
  {
    q: 'Hebben jullie ook kinderkapsels?',
    a: 'Ja, jongens zijn van harte welkom voor contouren of een gewone knipbeurt. We nemen rustig de tijd.',
  },
];

const openingHours = [
  { d: 'Maandag', h: '09:00 - 17:30' },
  { d: 'Dinsdag', h: '09:00 - 17:30' },
  { d: 'Woensdag', h: '09:00 - 17:30' },
  { d: 'Donderdag', h: '09:00 - 17:30' },
  { d: 'Vrijdag', h: '09:00 - 17:30' },
  { d: 'Zaterdag', h: '09:00 - 16:30' },
  { d: 'Zondag', h: 'Gesloten', closed: true },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-slate-950 text-white">
        <Image
          src="/images/hero-barber.jpg"
          alt="Barber aan het werk bij Hood Barber"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30" />
        <div className="relative mx-auto max-w-7xl px-4 py-32 md:py-48">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center rounded-full border border-primary-500/30 bg-primary-500/10 px-3 py-1 text-sm text-primary-300">
              <Star className="mr-2 h-4 w-4" /> Premium herenkapper in Vlissingen sinds 2019
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-7xl">
              De kapper voor <br />
              <span className="bg-gradient-to-r from-primary-300 to-primary-500 bg-clip-text text-transparent">
                echte mannen
              </span>
            </h1>
            <p className="mb-10 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
              Haar knippen, contouren en baardverzorging door één vaste barber.
              Eerlijk advies, strak vakwerk en altijd een plek om even bij te komen.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/boeken" className="btn-primary px-8 py-4 text-base">
                <Calendar className="mr-2 h-5 w-5" /> Maak een afspraak
              </Link>
              <a href={SITE.phoneHref} className="btn-secondary border border-white/10 bg-white/5 px-8 py-4 text-base text-white hover:bg-white/10">
                <Phone className="mr-2 h-5 w-5" /> {SITE.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-b border-slate-200/60 bg-white py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 md:grid-cols-4">
          {[
            { icon: UserCheck, label: '100% herenkapsalon' },
            { icon: User, label: 'Eén vaste barber' },
            { icon: ShieldCheck, label: 'Vakkundig & gecertificeerd' },
            { icon: Sparkles, label: 'Premium producten' },
          ].map((f) => (
            <div key={f.label} className="flex items-center justify-center gap-3 text-sm font-medium text-slate-700">
              <f.icon className="h-5 w-5 text-primary-600" />
              {f.label}
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="diensten" className="scroll-mt-28 py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-16 max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-widest text-primary-600">Onze diensten</span>
            <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">Alles voor de moderne man</h2>
            <p className="mt-4 text-lg text-slate-600">
              Van strakke contouren tot een complete knipbeurt met baard. Alle prijzen incl. stylingadvies.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.name}
                className="card group relative p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-900/5"
              >
                {service.tag && (
                  <span className="badge-info absolute right-6 top-6 rounded-full text-xs">{service.tag}</span>
                )}
                <div className="mb-6 inline-flex items-center justify-center rounded-2xl bg-slate-100 p-3 text-slate-500 transition-colors group-hover:bg-primary-100 group-hover:text-primary-700">
                  <Scissors className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">{service.name}</h3>
                <p className="mt-2 text-slate-500">{service.description}</p>
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
                  <span className="inline-flex items-center gap-2 font-medium text-slate-500">
                    <Clock className="h-5 w-5" /> {service.duration} min
                  </span>
                  <span className="text-2xl font-bold text-slate-900">
                    €{(service.price / 100).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-16 text-center">
            <Link href="/boeken" className="btn-primary px-8 py-4 text-base">Boek je behandeling</Link>
          </div>
        </div>
      </section>

      {/* De kapper */}
      <section id="kapper" className="scroll-mt-28 bg-slate-950 py-24 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-16 max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-widest text-primary-400">De kapper</span>
            <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">Eén kapper. Eén standaard.</h2>
            <p className="mt-4 text-lg text-slate-400">
              Bij Hood Barber zit Fikri zelf achter de stoel: persoonlijk, vakkundig en altijd tijd voor een goed gesprek.
            </p>
          </div>
          <div className="mx-auto grid max-w-4xl items-center gap-10 md:grid-cols-2">
            <div className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-slate-800">
              <Image
                src="/images/barber-fikri.jpg"
                alt="Fikri, eigenaar en barber van Hood Barber"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
            </div>
            <div>
              <h3 className="text-3xl font-bold">Fikri</h3>
              <p className="mt-2 text-primary-300">Eigenaar & barber</p>
              <p className="mt-6 leading-relaxed text-slate-400">
                Sinds dag één achter de stoel bij Hood Barber. Geen haast en geen half werk. Elke
                knipbeurt krijgt de tijd die het verdient, van strakke contouren tot een complete
                knipbeurt met baardverzorging.
              </p>
              <ul className="mt-8 space-y-3 text-sm text-slate-300">
                {[
                  'Specialist in strakke contouren en moderne herenkapsels',
                  'Strak werk op haar én baard',
                  'Persoonlijk stylingadvies bij elke knipbeurt',
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary-400" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="galerij" className="scroll-mt-28 py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-16 max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-widest text-primary-600">Galerij</span>
            <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">Ons vak, onze sfeer</h2>
          </div>
          <div className="grid auto-rows-[180px] grid-cols-2 gap-4 md:auto-rows-[220px] md:grid-cols-4">
            {[
              { src: '/images/gallery-shop.jpg', alt: 'Professioneel interieur van Hood Barber', cls: 'row-span-2' },
              { src: '/images/gallery-tools.jpg', alt: 'Professioneel gereedschap van de barber', cls: '' },
              { src: '/images/gallery-beard.jpg', alt: 'Verzorgde baardbehandeling bij Hood Barber', cls: '' },
            ].map((img) => (
              <div key={img.src} className={`relative overflow-hidden rounded-2xl ${img.cls}`}>
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Over ons */}
      <section id="over" className="scroll-mt-28 bg-white py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
            <Image src="/images/gallery-tools.jpg" alt="Gereedschap van de barber" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          </div>
          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-primary-600">Over ons</span>
            <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">Ambacht sinds 2019</h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              Hood Barber is geboren uit een simpele overtuiging: mannen verdienen een kapsalon waar ze
              zich thuis voelen. Geen gedoe en geen chichi, gewoon vakmanschap, een goed gesprek en een
              kapsel dat wekelijks weer klopt.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                'Alleen heren: van eerste knipbeurt tot grijze stylish man',
                'Een rustige sfeer, goede koffie en een plek om even te ontspannen',
                'Strakke planning, je wordt op tijd geholpen',
              ].map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
                  <span className="text-slate-700">{point}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex items-center gap-6">
              <div>
                <div className="text-4xl font-bold text-slate-900">500+</div>
                <div className="text-sm text-slate-500">tevreden klanten per maand</div>
              </div>
              <div className="h-12 w-px bg-slate-200" />
              <div>
                <div className="text-4xl font-bold text-slate-900">4,9<span className="text-lg text-slate-400">/5</span></div>
                <div className="text-sm text-slate-500">gemiddelde beoordeling</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-16 text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-primary-600">Reviews</span>
            <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">Wat klanten zeggen</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.name} className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
                <div className="mb-6 flex gap-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary-400 text-primary-400" />
                  ))}
                </div>
                <blockquote className="text-lg italic leading-relaxed text-slate-700">“{t.text}”</blockquote>
                <figcaption className="mt-6 font-semibold text-slate-900">{t.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-28 bg-slate-50 py-24">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-12 text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-primary-600">Veelgestelde vragen</span>
            <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">Goed om te weten</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-slate-200 bg-white p-6 open:shadow-md">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900">
                  {f.q}
                  <ChevronDown className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-4 leading-relaxed text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-8 text-center text-white sm:p-12 md:p-20">
            <Image
              src="/images/gallery-shop.jpg"
              alt=""
              fill
              sizes="100vw"
              className="object-cover opacity-20"
            />
            <div className="relative z-10">
              <h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">Klaar voor een frisse knip?</h2>
              <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-300">
                Boek vandaag nog je afspraak bij Hood Barber. Binnen 30 seconden geregeld.
              </p>
              <Link href="/boeken" className="btn-primary px-10 py-4 text-lg">
                <Calendar className="mr-2 h-6 w-6" /> Maak afspraak
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="scroll-mt-28 bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <span className="text-sm font-semibold uppercase tracking-widest text-primary-600">Contact</span>
              <h2 className="mt-3 text-4xl font-bold tracking-tight">Bezoek ons</h2>
              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="mt-1 h-6 w-6 text-primary-600" />
                  <div>
                    <h3 className="font-semibold">Locatie</h3>
                    <p className="text-slate-600">{SITE.street}<br />{SITE.city}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="mt-1 h-6 w-6 text-primary-600" />
                  <div>
                    <h3 className="font-semibold">Bel of app</h3>
                    <a href={SITE.phoneHref} className="text-slate-600 hover:text-primary-700">{SITE.phone}</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="mt-1 h-6 w-6 text-primary-600" />
                  <div>
                    <h3 className="font-semibold">E-mail</h3>
                    <a href={`mailto:${SITE.email}`} className="text-slate-600 hover:text-primary-700">{SITE.email}</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Instagram className="mt-1 h-6 w-6 text-primary-600" />
                  <div>
                    <h3 className="font-semibold">Instagram</h3>
                    <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-primary-700">
                      @hoodbarber
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="card p-8">
              <h3 className="mb-6 text-xl font-bold">Openingstijden</h3>
              <div className="space-y-3">
                {openingHours.map((o) => (
                  <div key={o.d} className="flex justify-between border-b border-slate-100 pb-3 last:border-0">
                    <span className="text-slate-600">{o.d}</span>
                    <span className={`font-medium ${o.closed ? 'text-red-600' : 'text-slate-900'}`}>{o.h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
