"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { CharacterType } from "@/lib/types";
import { MicrophoneIcon } from "@heroicons/react/24/outline";
import { VoiceSession, VoiceSessionState } from "fixie/src/voice";
import EpicButton from "../Buttons";
import Image from "next/image";

function Conversation({
  character,
  onCallEnd,
  voiceSession,
  onDebugOpen,
}: {
  character: CharacterType;
  onCallEnd: () => void;
  voiceSession: VoiceSession;
  onDebugOpen: () => void;
}) {
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
      <Visualizer
        character={character}
        voiceSession={voiceSession}
        onDebugOpen={onDebugOpen}
      />
      <button onClick={handleStop} className="m-4">
        <EpicButton type="secondaryRed" className="w-full">
          End call
        </EpicButton>
      </button>
    </>
  );
}

function Visualizer({
  character,
  voiceSession,
  onDebugOpen,
}: {
  character: CharacterType;
  voiceSession: VoiceSession;
  onDebugOpen: () => void;
}) {
  const inputCanvasRef = useRef<HTMLCanvasElement>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement>(null);
  const voiceSessionRef = useRef(voiceSession);
  const [taps, setTaps] = useState(0);

  const [initializedInputAnalyzer, setInitializedInputAnalyzer] =
    useState(false);
  const [initializedOutputAnalyzer, setInitializedOutputAnalyzer] =
    useState(false);

  const [inputFreqData, setInputFreqData] = useState<number[]>([]);
  const [outputFreqData, setOutputFreqData] = useState<number[]>([]);

  // This polling is a little silly, but we don't know when the VoiceSession's
  // input or output analyzers will change (it really should emit signals for us).

  useEffect(() => {
    console.log(`Visualizer: Setting up input analyzer polling`);
    const inputPollInterval = setInterval(() => {
      if (!voiceSession.inputAnalyzer) return;
      if (!initializedInputAnalyzer) {
        voiceSession.inputAnalyzer.fftSize = 64;
        voiceSession.inputAnalyzer.maxDecibels = 0;
        voiceSession.inputAnalyzer.minDecibels = -70;
        setInitializedInputAnalyzer(true);
      }
      let inputData = new Uint8Array(
        voiceSession.inputAnalyzer.frequencyBinCount
      );
      voiceSession.inputAnalyzer.getByteFrequencyData(inputData);
      inputData = inputData.slice(0, 16);
      setInputFreqData([...inputData]);
    }, 20);
    return () => {
      clearInterval(inputPollInterval);
    };
  }, [voiceSession, initializedInputAnalyzer]);

  useEffect(() => {
    console.log(`Visualizer: Setting up output analyzer polling`);
    const outputPollInterval = setInterval(() => {
      if (!voiceSession.outputAnalyzer) return;
      if (!initializedOutputAnalyzer) {
        voiceSession.outputAnalyzer.fftSize = 256;
        voiceSession.outputAnalyzer.maxDecibels = 0;
        voiceSession.outputAnalyzer.minDecibels = -70;
        setInitializedOutputAnalyzer(true);
      }
      let outputData = new Uint8Array(
        voiceSession.outputAnalyzer.frequencyBinCount
      );
      voiceSession.outputAnalyzer.getByteFrequencyData(outputData);
      outputData = outputData.slice(0, 16);
      setOutputFreqData([...outputData]);
    }, 20);
    return () => {
      clearInterval(outputPollInterval);
    };
  }, [voiceSession, initializedOutputAnalyzer]);

  // Visualize output data on its canvas.
  const visualizeOutput = (freqData?: number[]) => {
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
    grd.addColorStop(1, "rgb(13,87,83,0.3)");
    ctx.fillStyle = grd;
    if (freqData) {
      const vu = Math.max(...freqData);
      if (vu < 1) return;
      const radius = Math.floor(canvas.width / 5 + (vu / 256) * canvas.width);
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
    if (!inputCanvasRef.current) return;
    const canvas = inputCanvasRef.current;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (voiceSessionRef.current.state !== VoiceSessionState.LISTENING) {
      // Don't show anything when not listening.
      return;
    }
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

  const handleTap = () => {
    setTaps(taps + 1);
    if (taps >= 4) {
      onDebugOpen();
      setTaps(0);
    }
  };

  return (
    <>
      {/* Output indicator */}
      <div className="mx-auto relative w-full h-[400px] overflow-x-hidden overflow-y-hidden">
        <canvas
          className="absolute top-0 left-0 w-full h-full z-25 overflow-y-hidden"
          ref={outputCanvasRef}
          width={400}
          height={400}
        />
        <div className="absolute top-[60px] left-0 w-full h-full z-30">
          <Image
            className="mx-auto my-auto drop-shadow-md"
            src={`/images/${character.image}`}
            alt={`${character.name} image`}
            width={200}
            height={200}
            onClick={handleTap}
          />
        </div>
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
  onDebugOpen,
  voiceSession,
}: {
  character: CharacterType;
  onCallEnd: () => void;
  onDebugOpen: () => void;
  voiceSession: VoiceSession;
}) {
  return (
    <>
      <div className="bg-slate-100 rounded-jumbo border border-black flex flex-col w-11/12 mx-auto md:mt-4 gap-4 w-[340px] h-[600px] justify-between">
        <div className="mt-4 mx-auto text-3xl text-[#881425]">
          {character.name}
        </div>
        <Conversation
          voiceSession={voiceSession}
          character={character}
          onCallEnd={onCallEnd}
          onDebugOpen={onDebugOpen}
        />
      </div>
    </>
  );
}
