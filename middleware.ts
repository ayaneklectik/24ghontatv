import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware() {
    return undefined;
  },
  {
    pages: {
      signIn: '/admin/login',
    },
    callbacks: {
      // The login page itself must remain public; all other /admin routes require a session.
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname === '/admin/login') {
          return true;
        }

        return Boolean(token);
      },
    },
  },
);

export const config = {
  matcher: ['/admin/:path*'],
};
