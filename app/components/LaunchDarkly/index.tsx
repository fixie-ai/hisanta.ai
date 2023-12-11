"use client";

import React from "react";
import { LDProvider, LDContext } from "launchdarkly-react-client-sdk";

const LAUNCHDARKLY_CLIENT_ID = "6575fdd3e610640ff1d6ee6b";

const context: LDContext = {
    kind: "user",
    anonymous: true,
};

export const LaunchDarklyProvider = ({ children } : { children: React.ReactNode } ) => {
  return (
    <LDProvider clientSideID={LAUNCHDARKLY_CLIENT_ID} context={context}>
        {children}
    </LDProvider>
  );
}