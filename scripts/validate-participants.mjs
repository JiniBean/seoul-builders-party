import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const allowedColors = ["#FF5934", "#8B5CF6", "#21A675", "#3483EB", "#F2B93B", "#EC6B9E"];
const shapes = ["round", "square", "ghost"];
const accessories = ["none", "cap", "headphones", "sprout", "crown"];
export function validateParticipant(p, filename, used = new Set()) {
  const errors = [];
  if (!p || typeof p !== "object" || Array.isArray(p)) return ["JSON 객체가 필요합니다."];
  if (typeof p.id !== "string" || !/^[a-z][a-z0-9-]{2,23}$/.test(p.id)) errors.push("ID 형식 오류");
  if (filename !== `${p.id}.json`) errors.push("파일명과 ID 불일치");
  if (used.has(p.id)) errors.push("중복 ID");
  for (const [key, max] of [["name", 12], ["role", 16], ["message", 36]]) {
    if (typeof p[key] !== "string" || !p[key].trim() || p[key].length > max) errors.push(`${key}: 1~${max}자 필요`);
  }
  if (!allowedColors.includes(p.color)) errors.push("색상 오류");
  if (!shapes.includes(p.shape)) errors.push("모양 오류");
  if (!accessories.includes(p.accessory)) errors.push("액세서리 오류");
  for (const key of Object.keys(p)) if (!["id", "name", "role", "message", "color", "shape", "accessory"].includes(key)) errors.push(`추가 필드 금지: ${key}`);
  return errors;
}
export async function validateDirectory(directory) {
  const files = (await readdir(directory)).filter(f => f.endsWith(".json")).sort();
  const used = new Set();
  const errors = [];
  for (const filename of files) {
    try {
      const member = JSON.parse(await readFile(path.join(directory, filename), "utf8"));
      errors.push(...validateParticipant(member, filename, used).map(e => `${filename}: ${e}`));
      used.add(member.id);
    } catch (error) {
      errors.push(`${filename}: ${error.message}`);
    }
  }
  if (!files.length) errors.push("캐릭터 파일이 없습니다.");
  return { count: files.length, errors };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await validateDirectory(fileURLToPath(new URL("../src/participants", import.meta.url)));
  if (result.errors.length) {
    console.error(result.errors.join("\n"));
    process.exitCode = 1;
  } else {
    console.info(`${result.count}개 캐릭터 검증 통과. 화면 품질·GitHub 권한을 검사한 것은 아닙니다.`);
  }
}
