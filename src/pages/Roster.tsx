import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Presentation, LayoutGrid, Search, X, Users, FileJson, GitPullRequest, RefreshCw, ExternalLink } from "lucide-react";
import { roster, COLORS, SHAPES, type Participant } from "@/lib/party";
import { Character } from "@/components/Character";
import { PartyRoom } from "@/components/PartyRoom";
import { MemberDetail } from "@/components/MemberDetail";
import { useCalm } from "@/components/Shell";

export const EXAMPLE_IDS = new Set(["blue-builder", "host-orange", "mint-maker", "pink-rookie", "purple-teacher", "yellow-spark"]);
const SHAPE_KO: Record<string, string> = { round: "동글", square: "네모", ghost: "유령" };
const EVENT_URL = "https://luma.com/7qdoj61s";

const STEPS = [
  { icon: FileJson, t: "1. Agent에게 내 캐릭터 요청", d: "Replit Agent 대화창에서 JSON 파일 하나를 추가하게 하고 내 Preview에서 확인합니다." },
  { icon: GitPullRequest, t: "2. 사람이 검토·병합", d: "테스트는 형식만 봐요. 내용은 저장소 담당자가 읽고 병합 여부를 정합니다." },
  { icon: RefreshCw, t: "3. 다시 빌드 후 새로고침", d: "자동 배포는 없어요. 호스트가 다시 빌드하면 이 방에 함께 들어옵니다." },
];

export default function RosterPage() {
  const calm = useCalm();
  const [q, setQ] = useState("");
  const [color, setColor] = useState<string | null>(null);
  const [shape, setShape] = useState<string | null>(null);
  const [selected, setSelected] = useState<Participant | null>(null);
  const [stage, setStage] = useState(false);
  const [view, setView] = useState<"room" | "list">("room");

  const list = useMemo(() => roster.filter((p) =>
    (!color || p.color === color) && (!shape || p.shape === shape) &&
    (!q.trim() || `${p.name} ${p.role} ${p.message} ${p.id}`.toLowerCase().includes(q.trim().toLowerCase()))), [q, color, shape]);
  const examples = roster.filter((p) => EXAMPLE_IDS.has(p.id)).length;

  return (
    <div className="max-w-6xl mx-auto px-4">
      <section className="pt-8 pb-5 flex flex-wrap items-end gap-4 justify-between">
        <div className="rise">
          <span className="tape text-sm">Replit Nexus Build Day Seoul · 3–5분 설명용 데모</span>
          <h1 className="font-display text-4xl md:text-6xl leading-[1.05] mt-3">각자의 JSON 하나가<br /><span className="text-primary">한 방</span>에 모여요</h1>
        </div>
        <div className="ink-card px-4 py-3 rise text-sm max-w-xs">
          <div className="flex items-end gap-2"><span className="font-display text-4xl" data-testid="text-roster-count">{roster.length}</span><span className="mb-1 font-bold">명 입장 (저장소 기준)</span></div>
          <p>이 중 <b>{examples}명은 발표자가 넣어 둔 예시</b>예요. 실제 참가자는 병합·재빌드 후에 나타납니다.</p>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div role="group" aria-label="보기 방식" className="flex gap-1.5">
          <button className="chip flex items-center gap-1" aria-pressed={view === "room"} onClick={() => setView("room")} data-testid="button-view-room"><Users size={14} />파티 룸</button>
          <button className="chip flex items-center gap-1" aria-pressed={view === "list"} onClick={() => setView("list")} data-testid="button-view-list"><LayoutGrid size={14} />명단 카드</button>
        </div>
        <Link href="/create" className="btn btn-hot ml-auto" data-testid="link-hero-create">Agent로 내 캐릭터 추가하기</Link>
        <Link href="/rehearsal" className="btn" data-testid="link-hero-rehearsal">발표자용 로컬 연습</Link>
        <button className="btn btn-sun" onClick={() => setStage(true)} data-testid="button-stage-mode"><Presentation size={16} />무대 모드</button>
      </div>

      {view === "room" ? (
        <PartyRoom members={roster} exampleIds={EXAMPLE_IDS} sourceLabel="저장소에 병합된 JSON만 · 예시 포함" onSelect={setSelected} />
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <label className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" />
              <input className="field pl-9" placeholder="이름, 관심 분야, 한마디로 찾기" value={q} onChange={(e) => setQ(e.target.value)} data-testid="input-search" />
            </label>
            <div className="flex gap-1.5">
              {COLORS.map((c) => (
                <button key={c} aria-pressed={color === c} aria-label={`색상 ${c}`} onClick={() => setColor(color === c ? null : c)} data-testid={`button-filter-color-${c.slice(1)}`}
                  className="w-8 h-8 rounded-full border-2 border-foreground transition-transform" style={{ background: c, transform: color === c ? "scale(1.2)" : undefined, boxShadow: color === c ? "0 0 0 3px hsl(var(--background)), 0 0 0 5px hsl(var(--foreground))" : undefined }} />
              ))}
            </div>
            <div className="flex gap-1.5">
              {SHAPES.map((s) => <button key={s} className="chip" aria-pressed={shape === s} onClick={() => setShape(shape === s ? null : s)} data-testid={`button-filter-shape-${s}`}>{SHAPE_KO[s]}</button>)}
            </div>
            {(q || color || shape) && <button className="chip flex items-center gap-1" onClick={() => { setQ(""); setColor(null); setShape(null); }} data-testid="button-clear-filters"><X size={14} />초기화</button>}
          </div>
          {list.length === 0 ? (
            <div className="ink-card p-10 text-center" data-testid="status-empty">
              <div className="flex justify-center"><Character look={{ color: "#3483EB", shape: "ghost", accessory: "none" }} size={100} animate={!calm} /></div>
              <p className="font-display text-2xl mt-3">조건에 맞는 빌더가 아직 없어요</p>
              <p className="text-muted-foreground mt-1">필터를 바꾸거나, 그 자리를 직접 채워 보세요.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {list.map((p, i) => (
                <button key={p.id} onClick={() => setSelected(p)} data-testid={`card-member-${p.id}`}
                  className="ink-card p-4 text-left rise hover:-translate-y-1 transition-transform relative" style={{ animationDelay: `${i * 60}ms`, transform: `rotate(${(i % 3 - 1) * 0.8}deg)` }}>
                  {EXAMPLE_IDS.has(p.id) && <span className="absolute top-3 right-3 text-[11px] font-bold px-2 py-0.5 rounded-full bg-muted border border-foreground">예시</span>}
                  <div className="flex justify-center py-2"><Character look={p} size={110} animate={!calm} title={p.name} /></div>
                  <div className="font-display text-xl">{p.name}</div>
                  <div className="text-sm text-muted-foreground">{p.role}</div>
                  <div className="mt-2 text-sm font-medium">“{p.message}”</div>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      <section className="mt-12" data-testid="section-how">
        <h2 className="font-display text-3xl">이 방에 들어오는 세 단계</h2>
        <ol className="grid md:grid-cols-[1fr_auto_1fr_auto_1fr] items-stretch gap-3 mt-4">
          {STEPS.map((s, i) => (
            <li key={s.t} className="contents">
              <div className="ink-card p-5" style={{ transform: `rotate(${(i - 1) * 0.7}deg)` }}>
                <s.icon className="text-primary" />
                <div className="font-display text-xl mt-2">{s.t}</div>
                <p className="text-sm mt-1 text-muted-foreground">{s.d}</p>
              </div>
              {i < 2 && <span aria-hidden="true" className="hidden md:grid place-items-center font-display text-3xl">→</span>}
            </li>
          ))}
        </ol>
        <p className="text-sm text-muted-foreground mt-3">이 앱은 PR을 만들거나 병합·배포하지 않아요. 모두 사람이 GitHub에서 직접 합니다.</p>
      </section>

      <section className="mt-12 ink-card p-6 grid md:grid-cols-[1.2fr_1fr] gap-6" data-testid="section-event">
        <div>
          <span className="tape text-sm">행사 정보</span>
          <h2 className="font-display text-3xl mt-3">Replit Nexus Build Day Seoul — Bring Your Own Repo</h2>
          <p className="mt-2 font-bold" data-testid="text-event-date">2026년 11월 3일 (화) 10:00–14:00 KST</p>
          <p className="mt-1 text-sm">장소: 커피식구 성수점 · 서울 성동구 아차산로13길 31 1층 <span className="text-muted-foreground">(안내 본문 기준 · 상단 지도는 아직 미정 표기)</span></p>
          <a href={EVENT_URL} target="_blank" rel="noreferrer" className="btn mt-4" data-testid="link-event">Luma 안내 페이지<ExternalLink size={14} /></a>
        </div>
        <ul className="text-sm space-y-2 list-disc pl-5">
          <li>저장소 커밋 권한이 있는 기존 제품의 개인·팀 대상, 최대 20명</li>
          <li>Replit의 Megan Ruan, Jeff Burke 데모와 Q&amp;A</li>
          <li>이 파티 룸은 실제 저장소 작업 전 3–5분 설명용 예시예요. 공식 일정 전체가 아니며, Replit의 공식 보증을 뜻하지 않습니다.</li>
        </ul>
      </section>

      {selected && <MemberDetail member={selected} isExample={EXAMPLE_IDS.has(selected.id)} onClose={() => setSelected(null)} />}

      {stage && (
        <div className="fixed inset-0 z-[60] bg-[#1B2036] text-[#F7F1E6] overflow-auto" data-testid="panel-stage">
          <div className="flex items-center justify-between px-6 py-4 gap-3">
            <span className="font-display text-2xl">서울 빌더즈 파티 — 저장소 명단 {roster.length}명 (예시 {examples}명 포함)</span>
            <button className="btn text-foreground" onClick={() => setStage(false)} data-testid="button-exit-stage"><LayoutGrid size={16} />나가기</button>
          </div>
          <div className="px-6 pb-6 max-w-[1500px] mx-auto">
            <PartyRoom members={roster} exampleIds={EXAMPLE_IDS} sourceLabel="저장소에 병합되어 빌드된 JSON만" onSelect={setSelected} big testid="panel-stage-room" idPrefix="stage-member" />
          </div>
        </div>
      )}
    </div>
  );
}
