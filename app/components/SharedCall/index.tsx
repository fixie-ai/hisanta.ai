'use client';
import { useEffect, useState } from 'react';
import EpicButton from '../Buttons';
import { getCharacter } from '@/lib/config';
import { PlayIcon, PauseIcon } from '@heroicons/react/20/solid';
import ReactPlayer from 'react-player';
import { uuidToShareKey, shareKeyToUuid } from '../Sharing';
import Link from 'next/link';
import { set } from 'lodash';
import { error } from 'console';

function PlaybackError() {
  return (
    <div className="flex flex-col mx-auto justify-center items-center text-center p-4">
      <div className="mt-8 text-2xl text-Holiday-Red">Invalid link</div>
      <div className="mt-8 text-lg text-Holiday-Green">The link you are trying to access does not exist.</div>
      <div className="mx-auto mt-12">
        <Link href="/">
          <EpicButton type="secondaryGreen" className="w-full">
            Back home
          </EpicButton>
        </Link>
      </div>
    </div>
  );
}

export function SharedCall({ shareKey }: { shareKey: string }) {
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  console.log(`Share key: ${shareKey}`);

  if (!errorOccurred && !videoUrl) {
    try {
      const uuid = shareKeyToUuid(shareKey);
      console.log(`Share UUID: ${uuid}`);
      setVideoUrl(`https://wsapi.fixie.ai/recording/Fixie_${uuid}`);
    } catch (e) {
      console.error("Error occurred while trying to get video URL", e);
      setErrorOccurred(true);
    }
    console.log(`Video URL: ${videoUrl}`);
  }

  const onReady = () => {
    setReady(true);
  };

  return (
    <div className="bg-White-75 rounded-jumbo border-black border flex flex-col mx-auto md:mt-4 w-[340px] h-[500px] justify-start overflow-x-hidden overflow-y-hidden">
      {errorOccurred ? (
        <PlaybackError />
      ) : (
        <>
          <div className="mt-4 mx-auto text-3xl text-Holiday-Red">Recorded call</div>
          {videoUrl && (
            <>
              <div className="mx-auto relative">
                <ReactPlayer
                  onReady={onReady}
                  onError={() => setErrorOccurred(true)}
                  playing={playing}
                  width={340}
                  controls={false}
                  url={videoUrl}
                />
              </div>
              <div className="my-auto h-full" />
              <div className="m-4">
                <EpicButton
                  disabled={!ready}
                  type="secondaryGreen"
                  className="w-full"
                  onClick={() => setPlaying((p) => !p)}
                >
                  <div className="flex flex-row mx-auto justify-center">
                    {ready ? (
                      playing ? (
                        <>
                          <PauseIcon className="w-6 h-6 mr-2" />
                          <div>Pause</div>
                        </>
                      ) : (
                        <>
                          <PlayIcon className="w-6 h-6 mr-2" />
                          <div>Play recording</div>
                        </>
                      )
                    ) : (
                      <>
                        <PlayIcon className="w-6 h-6 mr-2 text-gray-500" />
                        <div className="text-gray-500">Loading...</div>
                      </>
                    )}
                  </div>
                </EpicButton>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
