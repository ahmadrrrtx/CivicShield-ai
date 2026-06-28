import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { db } from '@/lib/db';
import { env, serverEnv } from '@/lib/env';

export const auth = betterAuth({
  appName: env.NEXT_PUBLIC_APP_NAME,
  secret: serverEnv.BETTER_AUTH_SECRET,
  baseURL: env.NEXT_PUBLIC_APP_URL,
  database: prismaAdapter(db, {
    provider: 'postgresql'
  }),
  emailAndPassword: {
    enabled: true
  },
  plugins: [nextCookies()]
});
