import { useEffect, useState } from "react";
import { PartyRoom } from "@/components/PartyRoom";
import { MemberDetail } from "@/components/MemberDetail";
import { EXAMPLE_IDS } from "@/pages/Roster";
import { MonitorSmartphone, RotateCcw, Send, MessageSquareWarning, CheckCircle2, PartyPopper } from "lucide-react";
import { defaultParticipant, participantErrors, roster, type Participant } from "@/lib/party";
import { Character } from "@/components/Character";
import { ParticipantEditor, ErrorList } from "@/components/ParticipantEditor";
import { useCalm } from "@/components/Shell";

type Stage = "draft" | "proposed" | "changes" | "accepted";
type Log = { kind: "propose" | "request" | "resubmit" | "accept"; text: string; at: string };
type State = { stage: Stage; draft: Participant; log: Log[]; accepted: Participant[] };
const KEY = "party-rehearsal-v1";
const fresh = (): State => ({ stage: "draft", draft: defaultParticipant, log: [], accepted: [] });
const now = () => new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });

function load(): State {
  try { const s = localStorage.getItem(KEY); return s ? { ...fresh(), ...JSON.parse(s) } : fresh(); } catch { return fresh(); }
}

const STEP_LABELS: [Stage, string][] = [["draft", "제안 작성"], ["proposed", "검토 대기"], ["changes", "변경 요청됨"], ["accepted", "로컬 명단에 추가"]];

export default function RehearsalPage() {
  const calm = useCalm();
  const [s, setS] = useState<State>(load);
  const [sel, setSel] = useState<Participant | null>(null);
  const [showParty, setShowParty] = useState(false);
  const [feedback, setFeedback] = useState("한마디를 조금 더 구체적으로 바꿔 볼까요?");
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(s)); }, [s]);

  const ids = new Set([...roster.map((r) => r.id), ...s.accepted.map((a) => a.id)]);
  const errors = [...participantErrors(s.draft), ...(ids.has(s.draft.id) ? ["ID: 이미 명단에 있는 ID예요."] : [])];
  const resubmit = s.log.some((l) => l.kind === "request");
  const add = (stage: Stage, log: Log, extra: Partial<State> = {}) => setS((o) => ({ ...o, stage, log: [...o.log, log], ...extra }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="ink-card p-4 bg-[#1B2036] text-[#F7F1E6] flex flex-wrap items-center gap-3" data-testid="text-local-banner">
        <MonitorSmartphone className="text-[#F2B93B]" />
        <b className="font-display text-xl">발표자용 연습 · GitHub PR 아님 · 이 브라우저만</b>
        <span className="text-sm opacity-80">이 연습은 이 브라우저의 저장소(localStorage)에만 남아요. 실제 저장소 명단·다른 사람의 화면은 바뀌지 않습니다.</span>
      </div>

      <div className="flex flex-wrap justify-between items-end gap-4 mt-8">
        <div><span className="tape text-sm">로컬 리허설 · 참가자 실습과 별개</span><h1 className="font-display text-4xl md:text-6xl mt-3">제안하고, 고치고, 받아들이기</h1><p className="text-sm text-muted-foreground mt-3">실제 참가자는 Replit Agent에서 파일을 추가합니다. 아래 폼은 발표자가 검토 과정을 설명하기 위한 로컬 시뮬레이션입니다.</p></div>
        <button className="btn" onClick={() => { localStorage.removeItem(KEY); setS(fresh()); }} data-testid="button-reset-rehearsal"><RotateCcw size={16} />리허설 초기화</button>
      </div>

      <div className="flex flex-wrap gap-2 mt-6">
        {STEP_LABELS.map(([k, l], i) => <span key={k} className="chip" aria-pressed={s.stage === k} data-testid={`status-stage-${k}`}>{i + 1}. {l}</span>)}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <section className="ink-card p-6">
          <h2 className="font-display text-2xl mb-1">참가자 역할</h2>
          {(s.stage === "draft" || s.stage === "changes") ? (
            <>
              {s.stage === "changes" && <p className="mb-4 p-3 rounded-xl bg-[#FFF1D6] text-sm"><b>검토자 의견:</b> {s.log.filter((l) => l.kind === "request").at(-1)?.text}</p>}
              <ParticipantEditor value={s.draft} onChange={(draft) => setS((o) => ({ ...o, draft }))} prefix="rehearsal" />
              <div className="mt-4"><ErrorList errors={errors} /></div>
              <button className="btn btn-hot mt-4" disabled={errors.length > 0} data-testid="button-propose"
                onClick={() => add("proposed", { kind: resubmit ? "resubmit" : "propose", text: `${s.draft.name} (${s.draft.id}) — “${s.draft.message}”`, at: now() })}>
                <Send size={16} />{resubmit ? "수정해서 다시 제안" : "로컬 제안 보내기"}
              </button>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="flex justify-center"><Character look={s.draft} size={140} animate={!calm} /></div>
              <p className="mt-3 text-muted-foreground">{s.stage === "proposed" ? "검토자의 답을 기다리는 중이에요." : "로컬 명단에 들어갔어요. 새 캐릭터로 다시 연습할 수 있어요."}</p>
              {s.stage === "accepted" && <button className="btn btn-hot mt-4 mr-2" onClick={() => { setShowParty(true); setTimeout(() => document.getElementById("local-party")?.scrollIntoView({ behavior: "smooth" }), 50); }} data-testid="button-open-local-party"><PartyPopper size={16} />내 캐릭터 입장 보기</button>}
              {s.stage === "accepted" && <button className="btn mt-4" onClick={() => setS((o) => ({ ...o, stage: "draft", log: [], draft: { ...defaultParticipant, id: `my-builder-${o.accepted.length + 1}` } }))} data-testid="button-new-round">새로 연습하기</button>}
            </div>
          )}
        </section>

        <section className="ink-card p-6">
          <h2 className="font-display text-2xl mb-1">검토자 역할</h2>
          <p className="text-sm text-muted-foreground mb-4">테스트는 형식만 확인해요. 내용이 이 모임에 맞는지는 사람이 읽고 판단합니다.</p>
          {s.stage === "proposed" ? (
            <div className="space-y-3">
              <textarea className="field min-h-24" aria-label="검토자 의견" value={feedback} onChange={(e) => setFeedback(e.target.value)} data-testid="input-feedback" />
              <div className="flex flex-wrap gap-3">
                <button className="btn btn-sun" disabled={!feedback.trim()} onClick={() => add("changes", { kind: "request", text: feedback.trim(), at: now() })} data-testid="button-request-changes"><MessageSquareWarning size={16} />변경 요청</button>
                <button className="btn btn-hot" onClick={() => add("accepted", { kind: "accept", text: `${s.draft.name}을(를) 로컬 명단에 추가`, at: now() }, { accepted: [...s.accepted, s.draft] })} data-testid="button-accept"><CheckCircle2 size={16} />로컬 명단에 받아들이기</button>
              </div>
            </div>
          ) : <p className="text-sm bg-muted rounded-xl p-3">{s.stage === "accepted" ? "이번 제안은 처리됐어요." : "제안이 도착하면 여기서 의견을 남길 수 있어요."}</p>}
          <ol className="mt-5 space-y-2" data-testid="list-log">
            {s.log.map((l, i) => (
              <li key={i} className="text-sm border-l-4 pl-3" style={{ borderColor: l.kind === "request" ? "#F2B93B" : l.kind === "accept" ? "#21A675" : "#3483EB" }}>
                <span className="font-mono text-xs text-muted-foreground">{l.at} · {{ propose: "제안", request: "변경 요청", resubmit: "재제안", accept: "수락" }[l.kind]}</span><br />{l.text}
              </li>
            ))}
          </ol>
        </section>
      </div>

      {(showParty || s.stage === "accepted") && s.accepted.length > 0 && (
        <section id="local-party" className="mt-10" data-testid="panel-local-party">
          <h2 className="font-display text-3xl">내 브라우저 속 파티 룸 <span className="text-sm font-sans rounded-full bg-[#1B2036] text-[#F7F1E6] px-2 py-0.5 align-middle">LOCAL · 이 브라우저만</span></h2>
          <p className="text-sm text-muted-foreground mt-1 mb-4">예시 캐릭터와 같은 방에 들어온 모습을 미리 봐요. 실제 저장소 명단과 메인 파티 룸은 바뀌지 않습니다.</p>
          <PartyRoom members={[...roster, ...s.accepted]} exampleIds={EXAMPLE_IDS} localIds={new Set(s.accepted.map((a) => a.id))} sourceLabel="LOCAL 리허설 · 저장소 아님" onSelect={setSel} testid="panel-local-room" idPrefix="local-room-member" />
        </section>
      )}
      {sel && <MemberDetail member={sel} isExample={EXAMPLE_IDS.has(sel.id)} isLocal={s.accepted.some((a) => a.id === sel.id)} onClose={() => setSel(null)} />}

      <section className="mt-10">
        <h2 className="font-display text-3xl">로컬 명단 <span className="text-base font-sans text-muted-foreground">이 브라우저에만 보여요 · 저장소 명단 {roster.length}명은 그대로</span></h2>
        {s.accepted.length === 0 ? <p className="ink-card p-6 mt-4 text-muted-foreground" data-testid="status-local-empty">아직 받아들인 캐릭터가 없어요.</p> : (
          <div className="flex flex-wrap gap-4 mt-4">
            {s.accepted.map((p) => (
              <div key={p.id} className="ink-card p-4 w-44 text-center" data-testid={`card-local-${p.id}`}>
                <div className="flex justify-center"><Character look={p} size={100} animate={!calm} /></div>
                <div className="font-display text-lg">{p.name}</div><div className="text-xs text-muted-foreground">로컬 연습 결과</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
