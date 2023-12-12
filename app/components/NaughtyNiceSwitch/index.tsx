"use client";

import { Switch } from "../ui/switch";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function NaughtyNiceSwitch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const naughty = searchParams.get("nice") == "0" || false;
  if (pathname !== "/") {
    // We don't show the toggle on the character page.
    return null;
  }

  const onChange = (nice: boolean) => {
    if (nice) {
      router.push("/?nice=1");
    } else {
      router.push("/?nice=0");
    }
  };

  return (
    <div className="flex flex-row gap-2 items-center">
      <span className="text-sm text-Holiday-Red">Naughty</span>
      <Switch
        checked={!naughty}
        onCheckedChange={onChange}
        className="data-[state=checked]:bg-Holiday-Green data-[state=unchecked]:bg-Holiday-Red"
      />
      <span className="text-sm text-Holiday-Green">Nice</span>
    </div>
  );
}
