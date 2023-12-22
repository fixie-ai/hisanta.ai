import NextAuth from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";

const authOptions = {
  providers: [
    Auth0Provider({
        clientId: process.env.AUTH0_ID || '',
        clientSecret: process.env.AUTH0_SECRET || '',
        issuer: 'https://llamalabs.us.auth0.com',
      }),
  ],
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };