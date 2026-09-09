import { LoginForm } from '@/components/auth/login-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Scissors } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto py-16">
      <Card>
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-slate-900 text-white mb-4">
            <Scissors className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">Inloggen</CardTitle>
          <CardDescription>Log in om je afspraken te beheren</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
