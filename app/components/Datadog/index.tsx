"use client";

import { datadogRum } from '@datadog/browser-rum';

datadogRum.init({
    applicationId: '2112f744-f970-4c9c-83b2-2874b28b12e4',
    clientToken: 'pubd70e012dd5e4acb963a65b45cb0d921a',
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

