import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold">Dashboard</h1>
        <p className="text-slate-600">Beheer van afspraken</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hosting zonder Node.js</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-slate-600">
          <p>
            Deze site draait als statische export op Plesk. Het admin-dashboard met live
            Supabase-data vereist een Node.js-host (bijv. Vercel).
          </p>
          <p>
            De publieke website en boekingsflow werken wel. Voor live afsprakenbeheer:
            deploy naar Vercel of schakel Node.js in bij je host.
          </p>
          <Link href="/" className="btn-primary inline-flex">
            Naar homepage
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
