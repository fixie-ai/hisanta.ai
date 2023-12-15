import React from 'react';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { useCopyToClipboard } from 'react-use';
import { useToast } from '../ui/use-toast';
import { datadogRum } from '@datadog/browser-rum';

/** Copies the provided value to the clipboard when clicked. */
export function CopyToClipboard({ value, children }: { value: string; children: React.ReactNode }) {
  const [, copyToClipboard] = useCopyToClipboard();
  const { toast } = useToast();

  const onClick = () => {
    datadogRum.addAction('share-copied', { value });
    copyToClipboard(value);
    toast({
      title: 'Copied to clipboard!',
    });
  };

  return (
    <button onClick={onClick}>
      <div className="flex flex-row">
        {children}
        <DocumentDuplicateIcon className="h-6 w68 ml-2" />
      </div>
    </button>
  );
}
