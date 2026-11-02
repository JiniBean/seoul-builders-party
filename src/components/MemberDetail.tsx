import { useEffect } from "react";
import { X } from "lucide-react";
import { HOST_ID, type Participant } from "@/lib/party";
import { Character } from "@/components/Character";
import { useCalm } from "@/components/Shell";

export function MemberDetail({ member, isExample, isLocal, onClose }: { member: Participant; isExample?: boolean; isLocal?: boolean; onClose: () => void }) {
  const calm = useCalm();
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[80] bg-foreground/50 grid place-items-center p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={`${member.name} 자세히`} className="ink-card p-6 max-w-md w-full rise max-h-[90dvh] overflow-auto text-foreground" onClick={(e) => e.stopPropagation()} data-testid="panel-member-detail">
        <div className="flex justify-between items-start">
          <span className="font-mono text-xs">{isLocal ? "이 브라우저 localStorage" : `src/participants/${member.id}.json`}</span>
          <button autoFocus onClick={onClose} aria-label="닫기" data-testid="button-close-detail"><X /></button>
        </div>
        <div className="flex justify-center py-4" style={{ background: `${member.color}22`, borderRadius: 18 }}><Character look={member} size={170} animate={!calm} /></div>
        <h2 className="font-display text-3xl mt-4">{member.name}</h2>
        <p className="text-muted-foreground">{member.role}</p>
        <p className="text-lg mt-3">“{member.message}”</p>
        {member.id === HOST_ID ? <p className="mt-3 text-sm bg-[#EDE5FF] rounded-xl p-3" data-testid="text-host-note"><b>파티 주인장</b>입니다. 발표자가 준비한 안내 캐릭터로, 화면마다 순서를 안내해요. 실제 참가자가 아니에요.</p>
          : isExample && <p className="mt-3 text-sm bg-muted rounded-xl p-3">주인장이 불러온 <b>예시 친구</b>입니다. 실제 참가자가 아니에요.</p>}
        {isLocal && <p className="mt-3 text-sm bg-[#1B2036] text-[#F7F1E6] rounded-xl p-3"><b>LOCAL · 이 브라우저 전용</b> 리허설 결과예요. 저장소 명단에는 없습니다.</p>}
        <pre className="mt-4 text-xs bg-foreground text-background rounded-xl p-3 overflow-auto">{JSON.stringify(member, null, 2)}</pre>
      </div>
    </div>
  );
}
