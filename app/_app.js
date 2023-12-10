import React from 'react';
import { withLDProvider } from 'launchdarkly-react-client-sdk';
import { LDProvider } from '../lib/ldprovider';

function MyApp({ Component, pageProps }) {
  return (
    <LDProvider>
      <Component {...pageProps} />
    </LDProvider>
  );
}

const LAUNCHDARKLY_CLIENT_ID = '6575fdd3e610640ff1d6ee6b';

export default withLDProvider({
  clientSideID: LAUNCHDARKLY_CLIENT_ID,
})(MyApp);