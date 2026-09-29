import type { DefaultSession } from 'next-auth';
import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role?: string | null;
      permissions?: Record<string, unknown> | null;
    } & DefaultSession['user'];
  }

  interface User {
    role?: string | null;
    permissions?: Record<string, unknown> | null;
    laravelToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string | null;
    permissions?: Record<string, unknown> | null;
    laravelToken?: string | null;
  }
}
