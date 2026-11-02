import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";
import { ORIGIN_REPO } from "@/lib/party";
import { HostGuide } from "@/components/HostGuide";

const ROLES = [
  { n: "1 · 제안", who: "참가자 · 현장 담당자 · 교수자", note: "권한을 받은 경우", d: "AI와 준비하고, 내용과 Preview를 확인한 뒤 Draft PR을 보냅니다." },
  { n: "2 · 검토", who: "개발 · 운영 담당자", note: "오늘은 발표자", d: "바뀐 줄(diff), 테스트, 보안, 영향 범위를 확인합니다." },
  { n: "3 · 반영", who: "병합 권한자", note: "오늘은 발표자", d: "병합한 뒤 기존 운영 절차로 다시 빌드하거나 배포합니다." },
];

const QUESTIONS = [
  { q: "누가 고치나요?", a: "권한을 받은 제안자(오늘은 참가자)가 Agent와 함께 내 브랜치에서 고칩니다." },
  { q: "누가 받아들이나요?", a: "저장소의 병합 권한자(오늘은 발표자)가 PR을 읽고 결정합니다. 테스트 통과는 형식 확인일 뿐입니다." },
  { q: "언제 실제 화면이 바뀌나요?", a: "병합된 뒤 호스트가 다시 빌드·배포했을 때입니다. PR을 열거나 승인받는 것만으로는 바뀌지 않습니다." },
];

const DONE = ["내 Preview에서 결과 확인", "담당자에게 보여 줄 변경안 준비", "왜 바꿨는지 한 문장으로 설명"];

const STILL = [
  "검토는 사람의 몫입니다.",
  "원본과 충돌할 수 있고, 실행에도 컴퓨팅을 씁니다.",
  "접근 권한·비밀값·개인정보를 먼저 확인합니다.",
  "내 Preview는 리뷰어에게 자동으로 공유되지 않습니다.",
  "Repos는 early access라 계정별로 사용 가능 여부를 미리 확인합니다.",
];

const CASES = [
  { who: "고객 · 에이전시", flow: "홈페이지 문구 → 검토 → 운영 반영" },
  { who: "교사 · 학생", flow: "탐구 보고서 → 줄 단위 피드백 → 개정" },
  { who: "개발자 · 커뮤니티", flow: "버그 수정·레벨 기여 → 검토 → 병합" },
];

const STEPS = [
  { t: "내 Fork 만들기", d: "이 워크숍이 외부 참가자에게 제안하는 경로입니다. 발표자의 원본 저장소를 내 계정으로 Fork해 원본을 건드리지 않아요. Repos의 필수 조건은 아닙니다. 쓰기 권한이 있는 팀 저장소라면 브랜치에서 바로 작업할 수 있고, 실제 원본으로 PR을 보내는 경로는 현장 전에 미리 점검해야 합니다.", who: "나" },
  { t: "Repos로 가져오기", d: "내 Fork(또는 팀 저장소)를 Replit Repos에 연결해 Agent와 작업하는 제안 경로입니다. 발표자는 원본 저장소를 Repos로 열어 Draft PR까지 보낸 것을 확인했어요(2026.11.02). 참가자 Fork에서 원본으로 보내는 경로는 현장 전 리허설로 확인합니다.", who: "나" },
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
      <p className="mt-5 text-muted-foreground">이 페이지는 실제 참가 순서와 오늘 꼭 구분할 것들을 모았습니다. 기존 연동 방식·작업 공간 비교는 발표 자료에서 다룹니다.</p>
      <HostGuide title="먼저 세 가지만 구분해 볼게요." className="mt-8">
        <p>누가 고치는지, 누가 받아들이는지, 언제 실제 화면이 바뀌는지. 이 세 가지가 구분되면 오늘의 핵심을 이해한 거예요. 아래 순서를 따라가면서 확인해 보세요.</p>
      </HostGuide>

      <section className="mt-10" aria-labelledby="h-questions" data-testid="section-three-questions">
        <h2 id="h-questions" className="font-display text-3xl">오늘의 세 질문</h2>
        <ol className="grid md:grid-cols-3 gap-4 mt-4">
          {QUESTIONS.map((x, i) => (
            <li key={x.q} className="ink-card p-5" data-testid={`card-question-${i + 1}`}>
              <span className="font-display text-3xl text-primary">{i + 1}</span>
              <h3 className="font-display text-xl mt-1">{x.q}</h3>
              <p className="text-sm mt-2">{x.a}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10" aria-labelledby="h-roles" data-testid="section-roles">
        <h2 id="h-roles" className="font-display text-3xl">제안하는 사람은 넓히고, 반영 책임은 분명하게</h2>
        <p className="text-sm text-muted-foreground mt-1">조직이 허용한 저장소와 계정 안에서의 이야기입니다. 모두에게 쓰기 권한을 주는 것이 아닙니다.</p>
        <ol className="grid md:grid-cols-3 gap-4 mt-4">
          {ROLES.map((r, i) => (
            <li key={r.n} className={`ink-card p-5 ${i ? "bg-[#FFF1D6]" : ""}`} data-testid={`card-role-${i + 1}`}>
              <span className="chip text-xs">{r.n}</span>
              <h3 className="font-bold text-lg mt-2">{r.who}</h3>
              <p className="text-xs text-muted-foreground">{r.note}</p>
              <p className="text-sm mt-2">{r.d}</p>
            </li>
          ))}
        </ol>
        <p className="text-sm mt-3"><b>PR</b>은 수정안과 함께 보내는 검토 요청입니다. 제안 ≠ 승인 ≠ 병합 ≠ 배포. 요청자·작성자·테스터·병합자는 자동으로 같은 사람이 아닙니다.</p>
      </section>

      <h2 className="font-display text-3xl mt-12">참가 순서</h2>
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
            <p className="mt-2 text-sm text-muted-foreground">원본 저장소: <a href={ORIGIN_REPO.url} target="_blank" rel="noopener noreferrer" className="font-bold underline underline-offset-4 break-all" data-testid="link-guide-origin-repo">{ORIGIN_REPO.label}</a></p>
          </div>
        </div>
      </div>
      <section className="mt-10 grid md:grid-cols-2 gap-5" data-testid="section-first-change">
        <div className="ink-card p-6">
          <h2 className="font-display text-2xl">처음에는 작은 변경 하나만</h2>
          <p className="text-sm mt-2">요청을 구체적으로 적어 주세요.</p>
          <p className="mt-2 text-sm bg-muted rounded-xl p-3">“내 캐릭터의 한마디만 바꿔 줘. 다른 사람 파일은 건드리지 말고, 실행 결과와 검사 결과를 보여 줘.”</p>
          <h3 className="font-bold mt-4">완료 기준</h3>
          <ul className="mt-2 space-y-1.5">
            {DONE.map((d, i) => <li key={d} className="flex gap-2 text-sm" data-testid={`text-done-${i + 1}`}><span className="font-display text-primary">{i + 1}</span>{d}</li>)}
          </ul>
          <p className="text-xs text-muted-foreground mt-3">연결이 준비된 사람만 PR까지 실습하고, 나머지는 요청문과 검토 과정을 연습합니다.</p>
        </div>
        <div className="ink-card p-6" data-testid="section-still">
          <h2 className="font-display text-2xl">사람의 판단과 운영 절차는 남습니다</h2>
          <ul className="mt-3 space-y-2 list-disc pl-5 text-sm">
            {STILL.map((t) => <li key={t}>{t}</li>)}
          </ul>
          <p className="text-xs text-muted-foreground mt-3">오늘은 비밀값이 없는 샘플 저장소로 진행합니다.</p>
        </div>
      </section>

      <section className="mt-10 ink-card p-6" data-testid="section-cases">
        <h2 className="font-display text-2xl">캐릭터 대신 여러분의 결과물을 넣어 보세요</h2>
        <ul className="grid md:grid-cols-3 gap-3 mt-4">
          {CASES.map((c) => <li key={c.who} className="rounded-xl border-2 border-foreground p-4"><b className="block">{c.who}</b><span className="text-sm">{c.flow}</span></li>)}
        </ul>
        <p className="text-sm mt-4">홈페이지·인쇄·논문·수업·커뮤니티 사례는 발표 자료의 Repos 활용 지도에서 볼 수 있습니다. 실제 도입 성과가 아닌 적용 아이디어입니다.</p>
      </section>

      <div className="flex flex-wrap gap-3 mt-8">
        <Link href="/create" className="btn btn-hot" data-testid="link-guide-create">Agent 요청문 보기</Link>
        <Link href="/rehearsal" className="btn" data-testid="link-guide-rehearsal">발표자용 로컬 연습</Link>
      </div>
    </div>
  );
}
