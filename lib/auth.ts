import NextAuth from 'next-auth';
import Auth0Provider from 'next-auth/providers/auth0';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_ID || '',
      clientSecret: process.env.AUTH0_SECRET || '',
      issuer: 'llamalabs.us.auth0.com',
    }),
  ],
});
