import { COLORS, SHAPES, ACCESSORIES, type Participant } from "@/lib/party";

const SHAPE_KO: Record<string, string> = { round: "동글", square: "네모", ghost: "유령" };
const ACC_KO: Record<string, string> = { none: "없음", cap: "모자", headphones: "헤드폰", sprout: "새싹", crown: "왕관" };

export function ParticipantEditor({ value, onChange, prefix = "edit" }: { value: Participant; onChange: (p: Participant) => void; prefix?: string }) {
  const set = <K extends keyof Participant>(k: K, v: Participant[K]) => onChange({ ...value, [k]: v });
  const text = (k: "id" | "name" | "role" | "message", label: string, max: number, hint?: string) => (
    <label className="block">
      <span className="flex justify-between text-sm font-bold mb-1"><span>{label}</span><span className="font-mono text-muted-foreground">{value[k].length}/{max}</span></span>
      <input className="field" value={value[k]} onChange={(e) => set(k, e.target.value)} data-testid={`input-${prefix}-${k}`} />
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
  return (
    <div className="space-y-4">
      {text("id", "ID (파일 이름)", 24, "영문 소문자로 시작, 영문·숫자·하이픈 3~24자")}
      {text("name", "이름", 12)}
      {text("role", "관심 분야", 16)}
      {text("message", "한마디", 36)}
      <div>
        <div className="text-sm font-bold mb-2">색상</div>
        <div className="flex gap-2 flex-wrap">
          {COLORS.map((c) => <button type="button" key={c} aria-pressed={value.color === c} aria-label={c} onClick={() => set("color", c)} data-testid={`button-${prefix}-color-${c.slice(1)}`}
            className="w-10 h-10 rounded-full border-2 border-foreground" style={{ background: c, boxShadow: value.color === c ? "0 0 0 3px hsl(var(--background)), 0 0 0 5px hsl(var(--foreground))" : undefined }} />)}
        </div>
      </div>
      <div>
        <div className="text-sm font-bold mb-2">모양</div>
        <div className="flex gap-2 flex-wrap">{SHAPES.map((s) => <button type="button" key={s} className="chip" aria-pressed={value.shape === s} onClick={() => set("shape", s)} data-testid={`button-${prefix}-shape-${s}`}>{SHAPE_KO[s]}</button>)}</div>
      </div>
      <div>
        <div className="text-sm font-bold mb-2">액세서리</div>
        <div className="flex gap-2 flex-wrap">{ACCESSORIES.map((a) => <button type="button" key={a} className="chip" aria-pressed={value.accessory === a} onClick={() => set("accessory", a)} data-testid={`button-${prefix}-accessory-${a}`}>{ACC_KO[a]}</button>)}</div>
      </div>
    </div>
  );
}

export function ErrorList({ errors }: { errors: string[] }) {
  if (!errors.length) return <p className="text-sm font-bold text-[#21A675]" data-testid="status-valid">형식 검사 통과</p>;
  return (
    <ul className="text-sm text-destructive space-y-1" data-testid="status-errors">
      {errors.map((e) => <li key={e}>· {e}</li>)}
    </ul>
  );
}
