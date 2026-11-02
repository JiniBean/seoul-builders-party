import { Link } from "wouter";
import { Character } from "@/components/Character";

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <div className="flex justify-center"><Character look={{ color: "#8B5CF6", shape: "ghost", accessory: "none" }} size={140} /></div>
      <h1 className="font-display text-4xl mt-6">길을 잃었어요</h1>
      <p className="mt-2 text-muted-foreground">이 방은 파티 장소에 없어요. 입구로 돌아가 볼까요?</p>
      <Link href="/" className="btn btn-hot mt-6" data-testid="link-back-home">파티 명단으로</Link>
    </div>
  );
}
