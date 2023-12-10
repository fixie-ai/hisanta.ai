import React, { createContext, useContext, useEffect, useState } from 'react';
import { withLDProvider, useLDClient } from 'launchdarkly-react-client-sdk';

const LDContext = createContext(null);

export const LDProvider = ({ children }) => {
  const ldClient = useLDClient();
  const [flags, setFlags] = useState({});

  useEffect(() => {
    if (ldClient) {
      ldClient.on('ready', () => {
        setFlags(ldClient.allFlags());
      });

      ldClient.on('change', (changes) => {
        setFlags({ ...flags, ...changes });
      });
    }
  }, [ldClient]);

  return (
    <LDContext.Provider value={{ flags, ldClient }}>
      {children}
    </LDContext.Provider>
  );
};

export const useFlags = () => useContext(LDContext);

