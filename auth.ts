import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const laravelAdminUrl = process.env.LARAVEL_API_URL;

if (!laravelAdminUrl) {
  console.warn('LARAVEL_API_URL is not configured. Admin login will be unavailable until it is set.');
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 8,
    updateAge: 60 * 30,
  },
  pages: {
    signIn: '/admin/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Laravel Admin',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        device_name: { label: 'Device', type: 'text' },
      },
      async authorize(credentials) {
        if (!laravelAdminUrl) return null;

        const email = String(credentials?.email ?? '').trim().toLowerCase();
        const password = String(credentials?.password ?? '');

        if (!email || !password) return null;

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10_000);

        try {
          const response = await fetch(`${laravelAdminUrl}/login`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              password,
              device_name: String(credentials?.device_name ?? '24ghonta-web'),
            }),
            cache: 'no-store',
            signal: controller.signal,
          });

          const payload = await response.json().catch(() => null);

          if (!response.ok || !payload?.data?.token || !payload?.data?.user) {
            console.error('[admin-login] Laravel auth rejected', {
              status: response.status,
              responseKeys:
                payload && typeof payload === 'object' ? Object.keys(payload) : [],
              exception:
                typeof payload?.exception === 'string'
                  ? payload.exception.split('\\').pop()
                  : undefined,
              sourceFile:
                typeof payload?.file === 'string'
                  ? payload.file.split(/[\\/]/).pop()
                  : undefined,
              sourceLine:
                Number.isInteger(payload?.line) ? payload.line : undefined,
              hasData: Boolean(payload?.data),
              hasToken: Boolean(payload?.data?.token),
              hasUser: Boolean(payload?.data?.user),
            });
            return null;
          }

          const user = payload.data.user;

          return {
            id: String(user.id),
            name: user.name ?? null,
            email: user.email ?? email,
            role: user.user_type ?? null,
            permissions: user.user_role ?? null,
            laravelToken: payload.data.token,
          } as any;
        } catch (error) {
          console.error('[admin-login] Laravel API request failed', {
            error: error instanceof Error ? error.name : 'UnknownError',
          });
          return null;
        } finally {
          clearTimeout(timeout);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = (user as any).role ?? null;
        token.permissions = (user as any).permissions ?? null;
        token.laravelToken = (user as any).laravelToken ?? null;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.sub ?? '');
        session.user.name = token.name ?? null;
        session.user.email = token.email ?? null;
        (session.user as any).role = token.role ?? null;
        (session.user as any).permissions = token.permissions ?? null;
      }

      return session;
    },
  },
};

export default NextAuth(authOptions);
