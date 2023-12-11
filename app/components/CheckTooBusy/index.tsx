import { useFlags } from "launchdarkly-react-client-sdk";
import Image from "next/image";

export function TooBusyPage() {
  return (
    <div className="mx-auto w-4/5 flex flex-col justify-center items-center h-screen">
        <div className="text-4xl font-bold text-center">Oops!</div>
        <div className="text-2xl font-bold text-center mb-4">The North Pole is offline!</div>
        <Image src="/images/igloo.png" alt="Too Busy Image" width={200} height={200} className="w-4/5" />
      <div className="text-center text-xl mt-4">Santa&apos;s elves are working to get the North Pole back online.</div>
      <div className="text-center text-xl mt-4">Please try again later!</div>
    </div>
  );
}

export function CheckTooBusy({ children } : {children: React.ReactNode}) {
  const { tooBusy } = useFlags();
  console.log("CheckTooBusy: tooBusy = ", tooBusy);
  if (tooBusy === true) {
    return <TooBusyPage />;
  }
  return <>{children}</>;
}