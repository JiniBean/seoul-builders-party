import type { Participant } from "@/lib/party";

type Look = Pick<Participant, "color" | "shape" | "accessory">;

export function Character({ look, size = 120, animate = true, title }: { look: Look; size?: number; animate?: boolean; title?: string }) {
  const ink = "#1B2036";
  const { color, shape, accessory } = look;
  const body =
    shape === "square" ? <rect x="22" y="34" width="76" height="70" rx="18" fill={color} stroke={ink} strokeWidth="3.5" />
    : shape === "ghost" ? <path d="M24 70 C24 44 40 32 60 32 C80 32 96 44 96 70 L96 104 L86 96 L76 104 L66 96 L56 104 L46 96 L36 104 L24 96 Z" fill={color} stroke={ink} strokeWidth="3.5" strokeLinejoin="round" />
    : <ellipse cx="60" cy="70" rx="38" ry="36" fill={color} stroke={ink} strokeWidth="3.5" />;
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label={title ?? "캐릭터"} className={animate ? "bob" : undefined} style={{ overflow: "visible" }}>
      <ellipse cx="60" cy="112" rx="30" ry="4" fill={ink} opacity=".15" />
      {body}
      <ellipse cx="44" cy="54" rx="9" ry="5" fill="#fff" opacity=".35" />
      <g className={animate ? "eye" : undefined}>
        <circle cx="48" cy="66" r="5" fill={ink} /><circle cx="72" cy="66" r="5" fill={ink} />
        <circle cx="49.5" cy="64.5" r="1.6" fill="#fff" /><circle cx="73.5" cy="64.5" r="1.6" fill="#fff" />
      </g>
      <circle cx="40" cy="77" r="4.5" fill="#FF9DB5" opacity=".75" /><circle cx="80" cy="77" r="4.5" fill="#FF9DB5" opacity=".75" />
      <path d="M53 78 Q60 85 67 78" fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" />
      {accessory === "cap" && <g stroke={ink} strokeWidth="3" strokeLinejoin="round"><path d="M32 42 Q60 14 88 42 Z" fill="#1B2036" /><path d="M78 40 L104 44 L84 47 Z" fill="#1B2036" /><circle cx="60" cy="24" r="3" fill="#F2B93B" /></g>}
      {accessory === "headphones" && <g stroke={ink} strokeWidth="3.5" fill="none"><path d="M24 64 Q24 22 60 22 Q96 22 96 64" /><rect x="15" y="58" width="13" height="22" rx="6" fill="#F2B93B" /><rect x="92" y="58" width="13" height="22" rx="6" fill="#F2B93B" /></g>}
      {accessory === "sprout" && <g stroke={ink} strokeWidth="3" strokeLinejoin="round"><path d="M60 34 L60 18" fill="none" /><path d="M60 22 Q46 8 38 18 Q48 28 60 22Z" fill="#7DD87A" /><path d="M60 18 Q72 4 82 12 Q74 24 60 18Z" fill="#7DD87A" /></g>}
      {accessory === "crown" && <path d="M38 38 L40 16 L50 28 L60 12 L70 28 L80 16 L82 38 Z" fill="#F2B93B" stroke={ink} strokeWidth="3" strokeLinejoin="round" />}
    </svg>
  );
}

export default Character;
