import { redirectIfAuthenticated } from '@/lib/auth-guards';
import { AuthForm } from '@/components/auth/auth-form';

export default async function SignInPage() {
  await redirectIfAuthenticated();
  return <div className="px-4 py-10 sm:px-6 lg:px-8"><AuthForm mode="sign-in" /></div>;
}
