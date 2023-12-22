'use client';
import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const clientId = "paqlf3OKgtS93LANVs4FpBiXJYI6f9sp";
  return (
    <Auth0Provider
      domain="llamalabs.us.auth0.com"
      clientId={clientId}
      authorizationParams={{
        redirect_uri: "http://localhost:3000",
      }}
    >
      {children}
    </Auth0Provider>
  );
}
