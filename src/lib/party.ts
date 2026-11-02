export const COLORS = ["#FF5934", "#8B5CF6", "#21A675", "#3483EB", "#F2B93B", "#EC6B9E"] as const;
export const SHAPES = ["round", "square", "ghost"] as const;
export const ACCESSORIES = ["none", "cap", "headphones", "sprout", "crown"] as const;
export type Participant = {
  id: string;
  name: string;
  role: string;
  message: string;
  color: typeof COLORS[number];
  shape: typeof SHAPES[number];
  accessory: typeof ACCESSORIES[number];
};

export function participantErrors(value: unknown): string[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) return ["캐릭터 객체가 필요합니다."];
  const p = value as Record<string, unknown>;
  const errors: string[] = [];
  if (typeof p.id !== "string" || !/^[a-z][a-z0-9-]{2,23}$/.test(p.id)) errors.push("ID: 영문 소문자로 시작하는 3~24자의 영문·숫자·하이픈");
  for (const [field, label, max] of [["name", "이름", 12], ["role", "관심 분야", 16], ["message", "한마디", 36]] as const) {
    if (typeof p[field] !== "string" || !(p[field] as string).trim() || (p[field] as string).length > max) errors.push(`${label}: 1~${max}자`);
  }
  if (!COLORS.includes(p.color as Participant["color"])) errors.push("지원하는 색상을 선택하세요.");
  if (!SHAPES.includes(p.shape as Participant["shape"])) errors.push("지원하는 모양을 선택하세요.");
  if (!ACCESSORIES.includes(p.accessory as Participant["accessory"])) errors.push("지원하는 액세서리를 선택하세요.");
  for (const key of Object.keys(p)) {
    if (!["id", "name", "role", "message", "color", "shape", "accessory"].includes(key)) errors.push(`허용되지 않은 필드: ${key}`);
  }
  return errors;
}

const files = import.meta.glob<Participant>("../participants/*.json", { eager: true, import: "default" });
const ids = new Set<string>();
export const roster: Participant[] = Object.entries(files).sort(([a], [b]) => a.localeCompare(b)).map(([file, member]) => {
  const errors = participantErrors(member);
  if (!file.endsWith(`/${member.id}.json`)) errors.push("파일명과 ID가 다릅니다.");
  if (ids.has(member.id)) errors.push("중복 ID");
  ids.add(member.id);
  if (errors.length) throw new Error(`${file}: ${errors.join(", ")}`);
  return member;
});

export const defaultParticipant: Participant = {
  id: "my-builder", name: "나의 빌더", role: "처음 온 메이커", message: "작은 아이디어부터 함께 만들어요!",
  color: "#FF5934", shape: "round", accessory: "headphones",
};

export const PARTICIPANT_PROMPT = `이 저장소의 AGENTS.md를 읽어 주세요.
내 닉네임, 관심 분야, 한마디, 원하는 캐릭터 모습이 아직 없으면 먼저 물어봐 주세요.
대화에서 정한 내용으로만 작업하고, 기존 참가자와 겹치지 않는 고유 ID를 사용해 주세요.
src/participants/에 내 닉네임에 해당하는 새 JSON 파일 하나만 만들어 주세요.
이름, 관심 분야, 한마디, 색상, 모양, 액세서리를 정하고 기존 예시 형식을 따르세요.
다른 참가자의 파일과 공통 코드는 수정하지 마세요.
npm test와 npm run build를 실행하고, 실제 수행한 검사와 미검증 항목을 구분해 주세요.
미리보기에서 내 캐릭터와 모바일 화면을 확인해 주세요.
검토 후 전용 브랜치에 커밋하고 Draft PR을 요청하되, 병합·배포는 하지 마세요.
Fork를 사용했다면 PR 대상이 발표자의 원본 저장소인지 GitHub에서 확인해 주세요.`;
