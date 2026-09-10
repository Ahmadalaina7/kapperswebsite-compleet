# Hood Barber Vlissingen | Herenkapsalon met online boeking

Complete fullstack website voor een **herenkapsalon** (uitsluitend mannen), met online boekingssysteem op echte beschikbaarheid. Gebouwd met Next.js 15, TypeScript, Tailwind CSS en Supabase.

## ✨ Features

- ✂️ **100% herenkapsalon**: diensten, teksten en aanbod volledig op mannen gericht
- 🎨 **Professionele UI**: modern, responsive, met nette barbershopfoto's (hero, Fikri, galerij)
- 📅 **Slim online boeken**: 3-stappen wizard met live vrije tijdsloten voor Fikri
- 🕐 **Beschikbaarheidslogica**: openingstijden, 30-min grid, 1 uur vooruit, overlap-check in de database
- 📧 **E-mail bevestigingen**: automatische confirmaties via Resend
- 🔒 **RLS beveiliging**: Row Level Security op alle tabellen
- 📊 **Admin dashboard**: afspraken beheren, statussen en statistieken
- ✅ **Validatie**: Zod schema validatie, server én client
- 🚫 **Geen dubbele boekingen**: overlap-check + exclusion constraint in Postgres

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend:** Supabase (Postgres, Auth, RLS)
- **E-mail:** Resend
- **Validatie:** Zod
- **Icons:** Lucide React

## 🚀 Quick Start

### 1. Installeer dependencies

```bash
npm install
```

### 2. Environment variables

Kopieer `.env.local.example` naar `.env.local` en vul in:

```bash
cp .env.local.example .env.local
```

### 3. Supabase setup

1. Maak een Supabase project aan op [supabase.com](https://supabase.com)
2. Voer `src/supabase/migrations/001_initial_schema.sql` uit in de SQL editor
3. Voer `src/supabase/migrations/002_men_only_schema.sql` uit (kapper-profiel + overlap-constraint)
4. Voer `src/supabase/seed.sql` uit voor demo data (mannelijk team + herendiensten)
4. Kopieer je project URL en keys naar `.env.local`

### 4. E-mail setup (optioneel)

1. Maak account op [resend.com](https://resend.com)
2. Kopieer API key naar `.env.local`
3. Verifieer je domein

### 5. Start development server

```bash
npm run dev
```

Ga naar [http://localhost:3000](http://localhost:3000)

## 📁 Projectstructuur

```
src/
├── app/                    # Next.js App Router
│   ├── (public)/          # Publieke pagina's
│   │   ├── page.tsx       # Homepagina (diensten, Fikri, galerij, FAQ, contact)
│   │   ├── boeken/        # Boekingsflow + bevestiging
│   │   └── login/         # Login pagina
│   ├── (dashboard)/       # Admin dashboard
│   │   └── dashboard/     # Dashboard pagina's
│   └── api/               # booking, availability, auth routes
├── components/            # React componenten
│   ├── ui/               # Herbruikbare UI componenten
│   ├── booking/          # Boekingscomponenten
│   ├── dashboard/        # Dashboard componenten
│   └── auth/             # Authenticatie componenten
├── lib/                   # Utilities en functies
│   ├── supabase/         # Supabase clients
│   ├── actions/          # Server actions
│   └── validations/      # Zod schemas
└── types/                # TypeScript types
```

## 📝 Belangrijke pagina's

- **Home:** `/`: Presentatie en diensten
- **Boeken:** `/boeken`: Online afspraak boeken
- **Login:** `/login`: Admin login
- **Dashboard:** `/dashboard`: Overzicht en beheer

## 🔐 Authenticatie

Admin toegang vereist een gebruiker met `role: admin` in Supabase Auth.

## 📧 E-mail templates

E-mails worden verzonden via Resend met professionele HTML templates.

## 🚢 Deployen

### Plesk / shared hosting (huidige setup)

Deze repo bouwt een **statische** site in de map `out/`.

1. Lokaal: `npm install` en `npm run build`
2. Commit + push (inclusief de map `out/` en `.htaccess`)
3. In Plesk: **Pull updates** op het subdomein

`.htaccess` stuurt bezoekers naar `out/`, zodat https://hoodbarber.webnestiq.nl/ de site toont.

### Vercel (voor live boekingen + dashboard)

```bash
npm run build
vercel --prod
```

Vergeet environment variables niet. Voor Vercel: zet `output: 'export'` uit en zet `src/legacy-api` terug naar `src/app/api`.

### Environment variables op production

Vul echte Supabase/Resend keys in `.env.local` vóór je bouwt (NEXT_PUBLIC_* komt in de static build).

## 📄 License

MIT

---

**Kapper Vlissingen**: Professionele kapservice sinds 2024
