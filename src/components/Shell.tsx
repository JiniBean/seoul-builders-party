import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Pause, Play } from "lucide-react";

const MotionCtx = createContext(false);
export const useCalm = () => useContext(MotionCtx);

const NAV = [
  { href: "/", label: "파티 명단" },
  { href: "/create", label: "Agent로 참가" },
  { href: "/guide", label: "참여 방법" },
  { href: "/rehearsal", label: "발표자 연습" },
];

export function Shell({ children }: { children: ReactNode }) {
  const [loc] = useLocation();
  const [calm, setCalm] = useState(() => {
    const saved = localStorage.getItem("party-calm");
    if (saved !== null) return saved === "1";
    return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  });
  useEffect(() => {
    document.documentElement.classList.toggle("calm", calm);
    localStorage.setItem("party-calm", calm ? "1" : "0");
  }, [calm]);

  return (
    <MotionCtx.Provider value={calm}>
      <div className="min-h-[100dvh] flex flex-col">
        <header className="sticky top-0 z-40 bg-background/85 backdrop-blur border-b-2 border-foreground">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
            <Link href="/" className="font-display text-xl flex items-center gap-2" data-testid="link-home">
              <span className="inline-block w-7 h-7 rounded-full bg-primary border-2 border-foreground" />
              서울 빌더즈 파티
            </Link>
            <nav className="order-3 md:order-none w-full md:w-auto md:ml-6 flex gap-1 overflow-x-auto">
              {NAV.map((n) => {
                const on = n.href === "/" ? loc === "/" : (loc === n.href || loc.startsWith(n.href + "/"));
                return (
                  <Link key={n.href} href={n.href} data-testid={`link-nav-${n.href.slice(1) || "home"}`}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-bold border-2 ${on ? "bg-foreground text-background border-foreground" : "border-transparent hover:border-foreground"}`}>
                    {n.label}
                  </Link>
                );
              })}
            </nav>
            <button className="ml-auto chip flex items-center gap-1.5" aria-pressed={calm} onClick={() => setCalm(!calm)} data-testid="button-toggle-motion">
              {calm ? <Play size={14} /> : <Pause size={14} />}{calm ? "움직임 켜기" : "움직임 줄이기"}
            </button>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t-2 border-foreground mt-16">
          <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-muted-foreground flex flex-wrap gap-x-6 gap-y-1">
            <span className="font-display text-foreground">서울 빌더즈 파티</span>
            <span>실제 GitHub 저장소 링크: 아직 설정되지 않음</span>
            <span>자동 배포: 설정되지 않음 — 병합 후 호스트를 다시 빌드해야 반영됩니다</span>
          </div>
        </footer>
      </div>
    </MotionCtx.Provider>
  );
}
