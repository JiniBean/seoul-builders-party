import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";

const STEPS = [
  { t: "내 Fork 만들기", d: "이 워크숍이 외부 참가자에게 제안하는 경로입니다. 발표자의 원본 저장소를 내 계정으로 Fork해 원본을 건드리지 않아요. Repos의 필수 조건은 아닙니다. 쓰기 권한이 있는 팀 저장소라면 브랜치에서 바로 작업할 수 있고, 실제 원본으로 PR을 보내는 경로는 현장 전에 미리 점검해야 합니다.", who: "나" },
  { t: "Repos로 가져오기", d: "내 Fork(또는 팀 저장소)를 Replit Repos에 연결해 Agent와 작업하는 제안 경로입니다. 원격 저장소 연결은 이 사이트에서 아직 실제로 검증하지 않았어요.", who: "나" },
  { t: "Agent에게 캐릭터 추가 요청", d: "웹 편집기가 아니라 Replit Agent 대화창에서 요청합니다. Agent가 src/participants/에 내 JSON 파일 하나를 추가하고, 나는 내 Preview에서 확인합니다.", who: "나 + 에이전트" },
  { t: "테스트와 빌드", d: "npm test와 npm run build를 실행하고, 실제로 확인한 것과 확인하지 못한 것을 나눠 적습니다.", who: "에이전트" },
  { t: "원본 저장소로 PR", d: "전용 브랜치에 커밋하고 Draft PR을 엽니다. 대상이 발표자의 원본 저장소인지 꼭 확인하세요.", who: "나" },
  { t: "사람의 검토", d: "발표자가 파일을 읽고 변경을 요청하거나 승인합니다. 테스트가 통과해도 의도는 사람이 확인해요.", who: "발표자" },
  { t: "병합", d: "검토가 끝난 PR만 원본 저장소에 병합됩니다.", who: "발표자" },
  { t: "호스트 다시 빌드", d: "병합된 코드로 사이트를 다시 빌드하거나 재시작해야 공개 명단에 나타납니다.", who: "발표자" },
];

export default function GuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <span className="tape text-sm">참여 방법</span>
      <h1 className="font-display text-4xl md:text-6xl mt-3">파일 하나가<br />명단에 오르기까지</h1>
      <ol className="mt-10 relative border-l-4 border-dashed border-foreground/30 ml-4 space-y-6">
        {STEPS.map((s, i) => (
          <li key={s.t} className="pl-8 relative rise" style={{ animationDelay: `${i * 70}ms` }} data-testid={`step-guide-${i + 1}`}>
            <span className="absolute -left-[22px] top-3 w-10 h-10 rounded-full grid place-items-center font-display text-lg border-2 border-foreground" style={{ background: i >= 5 ? "hsl(var(--accent))" : "hsl(var(--card))" }}>{i + 1}</span>
            <div className="ink-card p-5">
              <div className="flex flex-wrap items-center gap-2"><h2 className="font-display text-2xl">{s.t}</h2><span className="chip text-xs">{s.who}</span></div>
              <p className="mt-2 text-muted-foreground">{s.d}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="ink-card p-6 mt-10 bg-[#FFF1D6]" data-testid="text-sync-warning">
        <div className="flex gap-3"><AlertTriangle className="shrink-0 text-primary" />
          <div>
            <h2 className="font-display text-2xl">PR을 보내도 사이트는 바로 바뀌지 않아요</h2>
            <p className="mt-2">PR을 열거나 승인받는 것만으로 공개 사이트가 자동으로 갱신되지 않습니다. 원본 저장소에 <b>병합</b>되고, 설정된 호스트를 <b>다시 빌드하거나 재시작</b>해야 모두가 보는 명단이 바뀝니다. 현재 자동 배포는 설정되어 있지 않습니다.</p>
            <p className="mt-2 text-sm text-muted-foreground">원본 저장소의 GitHub 주소는 발표자가 현장에서 안내합니다. 이 사이트에는 아직 설정되어 있지 않아요.</p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 mt-8">
        <Link href="/create" className="btn btn-hot" data-testid="link-guide-create">Agent 요청문 보기</Link>
        <Link href="/rehearsal" className="btn" data-testid="link-guide-rehearsal">발표자용 로컬 연습</Link>
      </div>
    </div>
  );
}
