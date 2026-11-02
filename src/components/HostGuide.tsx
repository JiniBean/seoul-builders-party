import type { ReactNode } from "react";
import { Character } from "@/components/Character";
import { useCalm } from "@/components/Shell";
import { host } from "@/lib/party";

/** 파티 주인장 별빛이 화면마다 한 번 안내하는 말풍선. */
export function HostGuide({ title, children, testid = "panel-host-guide", className = "" }: { title: string; children: ReactNode; testid?: string; className?: string }) {
  const calm = useCalm();
  return (
    <aside className={`flex items-start gap-3 sm:gap-4 ${className}`} data-testid={testid} aria-label={`주인장 ${host.name}의 안내`}>
      <div className="shrink-0 flex flex-col items-center">
        <Character look={host} size={76} animate={!calm} title={`주인장 ${host.name}`} />
        <span className="chip text-[11px] py-0 px-2 -mt-1 bg-[#EDE5FF]">주인장 {host.name}</span>
      </div>
      <div className="relative ink-card px-4 py-3 sm:px-5 sm:py-4 min-w-0 flex-1 bg-[#FFFDF7]">
        <span aria-hidden className="absolute -left-[9px] top-6 w-4 h-4 rotate-45 bg-[#FFFDF7] border-l-2 border-b-2 border-foreground" />
        <p className="font-bold" data-testid={`${testid}-title`}>{title}</p>
        <div className="text-sm mt-1 space-y-1">{children}</div>
      </div>
    </aside>
  );
}

export default HostGuide;
