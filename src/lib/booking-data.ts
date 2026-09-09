export interface Barber {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  specialty?: string | null;
  experience_years?: number | null;
}

export interface Service {
  id: string;
  name: string;
  description: string | null;
  duration_min: number;
  price_cents: number;
  active: boolean;
}

export const SITE = {
  name: 'Hood Barber',
  phone: '0413 - 12 34 56',
  phoneHref: 'tel:+31413123456',
  email: 'info@hoodbarber.nl',
  street: 'Vlissingen',
  city: 'Zeeland',
  instagram: 'https://instagram.com/hoodbarber',
};
