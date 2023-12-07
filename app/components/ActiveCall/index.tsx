"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { CharacterType } from "@/lib/types";
import { MicrophoneIcon } from "@heroicons/react/24/outline";
import { VoiceSession, VoiceSessionState } from "fixie/src/voice";
import { clear } from "console";
import { set } from "lodash";
import { init } from "next/dist/compiled/webpack/webpack";

function Conversation({
  character,
  onCallEnd,
  voiceSession,
}: {
  character: CharacterType;
  onCallEnd: () => void;
  voiceSession: VoiceSession;
}) {
  console.log("Conversation: rendering");

  // Handle end call event.
  const handleStop = async () => {
    await voiceSession.stop();
    onCallEnd();
  };

  // Handle interrupt click.
  const onInterruptClick = () => {
    if (voiceSession.state != VoiceSessionState.IDLE) {
      voiceSession.interrupt();
    }
  };

  return (
    <>
      <Visualizer character={character} voiceSession={voiceSession} />
      <button onClick={handleStop}>
        <div className="bg-white rounded-3xl align-middle text-[#881425] justify-center w-11/12 p-2 flex flex-row mx-auto mb-4 border-[#881425] border">
          <div className="text-lg mt-1">&nbsp;End call</div>
        </div>
      </button>
    </>
  );
}

function Visualizer({
  character,
  voiceSession,
}: {
  character: CharacterType;
  voiceSession: VoiceSession;
}) {
  const inputCanvasRef = useRef<HTMLCanvasElement>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement>(null);
  const voiceSessionRef = useRef(voiceSession);

  const [initializedInputAnalyzer, setInitializedInputAnalyzer] =
    useState(false);
  const [initializedOutputAnalyzer, setInitializedOutputAnalyzer] =
    useState(false);

  const [inputFreqData, setInputFreqData] = useState<number[]>([]);
  const [outputFreqData, setOutputFreqData] = useState<number[]>([]);

  // if (voiceSession.inputAnalyzer) {
  //   voiceSession.inputAnalyzer.fftSize = 64;
  //   voiceSession.inputAnalyzer.maxDecibels = 0;
  //   voiceSession.inputAnalyzer.minDecibels = -70;
  // }

  // if (voiceSession.outputAnalyzer) {
  //   voiceSession.outputAnalyzer.fftSize = 64;
  //   voiceSession.outputAnalyzer.maxDecibels = 0;
  //   voiceSession.outputAnalyzer.minDecibels = -70;
  // }

  // XXX XXX XXX MDW STOPPING HERE.
  // I think this is not going to work, because there's no way for the React component
  // to know whether the input or output analyzers have changed on the underlying voiceSession
  // (which changes internally without any signal that we can detect).

  // useEffect(() => {
  //   console.log(`Visualizer: Setting up input analyzer polling`);

  //   const pollInput = () => {
  //     requestAnimationFrame(pollInput);
  //     if (!voiceSessionRef.current.inputAnalyzer) return;
  //     let inputData = new Uint8Array(
  //       voiceSessionRef.current.inputAnalyzer.frequencyBinCount
  //     );
  //     console.log(`Visualizer: inputData length: ${inputData.length}`);
  //     voiceSessionRef.current.inputAnalyzer.getByteFrequencyData(inputData);
  //     inputData = inputData.slice(0, 16);
  //     console.log(`Visualizer: GOT inputData: ${JSON.stringify([...inputData])}`);
  //     setInputFreqData([...inputData]);
  //   };
  //   pollInput();
  //   // const inputPollInterval = setInterval(() => {
  //   //   // We need to poll continually here, since the VoiceSession doesn't tell us when its
  //   //   // inputAnalyzer has been set, and because it is accessed via a getter, React can't
  //   //   // tell, either.
  //   //   if (!voiceSessionRef.current.inputAnalyzer) return;
  //   //   if (!initializedInputAnalyzer) {
  //   //     voiceSessionRef.current.inputAnalyzer.fftSize = 64;
  //   //     voiceSessionRef.current.inputAnalyzer.maxDecibels = 0;
  //   //     voiceSessionRef.current.inputAnalyzer.minDecibels = -70;
  //   //     setInitializedInputAnalyzer(true);
  //   //   }
  //   //   let inputData = new Uint8Array(
  //   //     voiceSessionRef.current.inputAnalyzer.frequencyBinCount
  //   //   );
  //   //   console.log(`Visualizer: inputData length: ${inputData.length}`);
  //   //   voiceSessionRef.current.inputAnalyzer.getByteFrequencyData(inputData);
  //   //   inputData = inputData.slice(0, 16);
  //   //   console.log(`Visualizer: GOT inputData: ${JSON.stringify([...inputData])}`);
  //   //   setInputFreqData([...inputData]);
  //   // }, 100);
  //   // return () => {
  //   //   clearInterval(inputPollInterval);
  //   // };
  // }, [voiceSession, initializedInputAnalyzer]);

  useEffect(() => {
    console.log(`Visualizer: Setting up output analyzer polling`);
    const pollOutput = () => {
      requestAnimationFrame(pollOutput);
      if (!voiceSessionRef.current.outputAnalyzer) return;
      let outputData = new Uint8Array(
        voiceSessionRef.current.outputAnalyzer.frequencyBinCount
      );
      console.log(`Visualizer: outputData length: ${outputData.length}`);
      voiceSessionRef.current.outputAnalyzer.getByteFrequencyData(outputData);
      outputData = outputData.slice(0, 16);
      console.log(`Visualizer: GOT outputData: ${JSON.stringify([...outputData])}`);
      setOutputFreqData([...outputData]);
    };
    pollOutput();
  }, [voiceSession, initializedOutputAnalyzer]);

  // Visualize output data on its canvas.
  const visualizeOutput = (freqData?: number[]) => {
    console.log(`Visualizer: visualizeOutput with ${JSON.stringify(freqData)}`);
    if (!outputCanvasRef.current) return;
    const canvas = outputCanvasRef.current;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const grd = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      20,
      canvas.width / 2,
      canvas.height / 2,
      canvas.width / 2
    );
    grd.addColorStop(0, "rgb(13,87,83,1)");
    grd.addColorStop(1, "rgb(13,87,83,0)");
    ctx.fillStyle = grd;

    if (freqData) {
      const vu = Math.floor(
        freqData.reduce((a, b) => a + b, 0) / freqData.length
      );
      const radius = canvas.width / 5 + (vu / 128) * canvas.width * 2;
      ctx.beginPath();
      ctx.ellipse(
        canvas.width / 2,
        canvas.height / 2,
        radius,
        radius,
        0,
        0,
        2 * Math.PI
      );
      ctx.fill();
    }
  };

  // Visualize input data on its canvas.
  const visualizeInput = (freqData?: number[]) => {
    console.log(`Visualizer: visualizeInput with ${JSON.stringify(freqData)}`);
    if (!inputCanvasRef.current) return;
    const canvas = inputCanvasRef.current;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (freqData) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const vu =
        Math.floor(freqData.reduce((a, b) => a + b, 0) / freqData.length) * 2;
      ctx.fillStyle = "rgb(13,87,83,0.5)";
      ctx.fillRect(0, canvas.height - vu, canvas.width, vu);
    }
  };

  useEffect(() => {
    visualizeOutput(outputFreqData);
  }, [outputFreqData]);

  useEffect(() => {
    visualizeInput(inputFreqData);
  }, [inputFreqData]);

  const showState = () => {
    if (voiceSessionRef.current.state === VoiceSessionState.IDLE) {
      return "Calling...";
    } else if (voiceSessionRef.current.state === VoiceSessionState.LISTENING) {
      return "Listening...";
    } else {
      return "Speaking...";
    }
  };

  return (
    <>
      {/* Output indicator */}
      <div className="mx-auto relative w-[40vmin] h-[40vmin]">
        <canvas
          className="absolute top-0 left-0 w-full h-full z-25"
          ref={outputCanvasRef}
          width={300}
          height={300}
        />
        {/* <div className="absolute top-0 left-0 w-full h-full z-30">
          <img
            className="mx-auto my-auto w-[250px] h-full"
            src={`/images/${character.image}`}
            alt="Santa Image"
            width={250}
            height={250}
          />
        </div> */}
      </div>

      {/* Speaking indicator */}
      <div className="bg-white relative mx-auto w-11/12 h-12 rounded-full items-center">
        <canvas
          className="absolute top-0 left-0 w-full h-full z-25 rounded-full"
          ref={inputCanvasRef}
          width={300}
          height={300}
        />
        <div className="absolute top-0 left-0 w-full h-full z-10">
          <div className="flex flex-row justify-center items-center align-middle p-2">
            <MicrophoneIcon className="w-6 h-6" />
            <div className="text-lg mt-1">{showState()}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function ActiveCall({
  character,
  onCallEnd,
  voiceSession,
}: {
  character: CharacterType;
  onCallEnd: () => void;
  voiceSession: VoiceSession;
}) {
  console.log("ActiveCall: rendering");
  return (
    <div className="bg-slate-100 rounded-3xl border-black border-2 flex flex-col w-11/12 mx-auto md:mt-4 gap-4">
      <div className="mt-4 mx-auto text-3xl text-[#881425]">
        {character.name}
      </div>
      <Conversation
        voiceSession={voiceSession}
        character={character}
        onCallEnd={onCallEnd}
      />
    </div>
  );
}
