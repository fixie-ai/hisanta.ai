'use client';

import { datadogRum } from '@datadog/browser-rum';

datadogRum.init({
  applicationId: process.env.NEXT_PUBLIC_DATADOG_APP_ID || '',
  clientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN || '',
  site: 'datadoghq.com',
  service: 'hisanta.ai',
  env: 'prod',
  version: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'unknown',
  sessionSampleRate: 100,
  sessionReplaySampleRate: 20,
  trackUserInteractions: true,
  trackResources: true,
  trackLongTasks: true,
  defaultPrivacyLevel: 'mask-user-input',
});

datadogRum.startSessionReplayRecording();

// This is a placeholder for now.
export function Datadog() {
  return null;
}
