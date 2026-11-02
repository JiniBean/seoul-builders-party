import { useState } from "react";
import { Link } from "wouter";
import { Copy, Check, MessageSquare, Monitor, GitPullRequest, GitFork } from "lucide-react";
import { ORIGIN_REPO, PARTICIPANT_PROMPT } from "@/lib/party";
import { HostGuide } from "@/components/HostGuide";

export default function CreatePage() {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PARTICIPANT_PROMPT);
      setCopied(true); setCopyError(false);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false); setCopyError(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <span className="tape text-sm">참가자 실습 · 만드는 곳은 Replit Agent</span>
      <h1 className="font-display text-4xl md:text-6xl mt-4 leading-tight">캐릭터는 Agent에게,<br />결과 확인은 파티장에서</h1>
      <p className="mt-4 text-lg text-muted-foreground" data-testid="text-agent-workflow">참가자는 웹 편집·등록 폼을 사용하지 않습니다. 저장소를 연 Replit 작업 화면의 Agent 대화창에서 파일 추가를 요청하고, Preview에서 결과를 확인합니다.</p>

      <HostGuide title="제 옆자리는 여러분의 캐릭터 파일 하나로 채워져요." className="mt-8">
        <p>원본 저장소를 Fork하고, 아래 요청문을 Agent에게 보내고, 내 Preview에서 확인한 뒤 PR을 보내면 돼요. 병합과 다시 빌드는 제가 아니라 발표자가 합니다.</p>
      </HostGuide>

      <section className="ink-card p-5 md:p-6 mt-8" data-testid="panel-origin-repo">
        <h2 className="font-display text-2xl">0. 원본 저장소를 내 계정으로 Fork</h2>
        <p className="text-sm mt-2">발표자의 공개 원본 저장소입니다. 원본에는 직접 쓰지 않고, 내 Fork에서 작업한 뒤 PR로 제안합니다.</p>
        <p className="mt-3 font-mono text-sm break-all" data-testid="text-origin-repo">{ORIGIN_REPO.url}</p>
        <div className="flex flex-wrap gap-3 mt-4">
          <a href={ORIGIN_REPO.forkUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sun" data-testid="link-origin-fork"><GitFork size={16} />GitHub에서 Fork</a>
          <a href={ORIGIN_REPO.url} target="_blank" rel="noopener noreferrer" className="btn" data-testid="link-origin-repo">원본 저장소 보기</a>
        </div>
        <p className="text-sm text-muted-foreground mt-3">Fork 후 Replit Repos에서 내 Fork를 고르고 Use in chat을 누르면 그 저장소가 열린 Agent 대화창으로 이동합니다.</p>
      </section>

      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <div className="ink-card p-5"><MessageSquare className="mb-3 text-primary" /><h2 className="font-display text-xl">1. Agent에게 요청</h2><p className="text-sm mt-2">자신의 Fork를 Repos로 연 뒤, 아래 요청을 Agent 대화창에 붙여 넣습니다.</p></div>
        <div className="ink-card p-5"><Monitor className="mb-3 text-primary" /><h2 className="font-display text-xl">2. 내 Preview 확인</h2><p className="text-sm mt-2">Agent가 JSON을 추가하고 실행·검사합니다. 자신의 Preview에서 새 캐릭터를 눌러 확인합니다.</p></div>
        <div className="ink-card p-5"><GitPullRequest className="mb-3 text-primary" /><h2 className="font-display text-xl">3. 원본에 PR 제안</h2><p className="text-sm mt-2">발표자가 검토·병합하고 원본 사이트를 갱신해야 모두의 파티에도 등장합니다.</p></div>
      </div>

      <section className="ink-card p-5 md:p-6 mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-2xl">Agent에 붙여 넣을 요청</h2>
          <button className="btn btn-sun" onClick={copy} data-testid="button-copy-prompt">{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? "복사됨" : "요청문 복사"}</button>
        </div>
        <p className="text-sm text-muted-foreground mt-3">복사한 뒤 자신의 닉네임·관심 분야·원하는 모습을 덧붙이세요. 복사는 Agent 전송이나 실행이 아닙니다.</p>
        <p className="text-sm mt-3">예: “닉네임은 노을, 초록 네모 모양에 새싹을 달아 줘. 한마디는 ‘물리 실험 페이지를 만들어요’로 해 줘.”</p>
        <pre className="whitespace-pre-wrap break-words text-sm mt-4 bg-muted rounded-xl p-4 select-text" data-testid="text-prompt">{PARTICIPANT_PROMPT}</pre>
        {copyError && <p role="alert" className="mt-3 text-sm font-bold" data-testid="text-copy-error">브라우저에서 복사를 허용하지 않았습니다. 위 요청문을 직접 선택해 복사해 주세요.</p>}
        {copied && <p role="status" className="mt-3 text-sm font-bold">복사했습니다. Replit Agent 대화창에 붙여 넣으세요.</p>}
      </section>

      <aside className="ink-card p-5 bg-[#FFF1D6] mt-6">
        <h2 className="font-display text-xl">내 Preview와 모두의 파티는 다릅니다</h2>
        <p className="mt-2 text-sm">내 작업 브랜치의 Preview에 캐릭터가 보인다고 원본에도 등록된 것은 아닙니다. 원본 대상 PR → 담당자의 검토·병합 → 원본 코드 갱신·빌드가 필요합니다. 참가자 Fork에서 원본으로 PR을 보내는 경로는 현장 전 리허설로 확인합니다. 발표자용 로컬 연습은 브라우저 안의 시뮬레이션입니다.</p>
      </aside>
      <div className="flex flex-wrap gap-3 mt-8">
        <Link href="/" className="btn btn-hot" data-testid="link-create-room">파티장에서 결과 보기</Link>
        <Link href="/guide" className="btn" data-testid="link-to-guide">저장소 연결부터 전체 순서</Link>
        <Link href="/rehearsal" className="chip" data-testid="link-create-rehearsal">발표자용 로컬 연습</Link>
      </div>
    </div>
  );
}
