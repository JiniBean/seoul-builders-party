# 캐릭터 하나로 첫 PR 보내기

이 프로젝트는 Repos·GitHub 기여 흐름을 배우기 위한 독립 워크숍 작품입니다.

1. 발표자의 공개 원본 저장소를 자신의 GitHub 계정으로 Fork합니다.
2. Repos에서 **내 Fork**를 연결하고 실행합니다. 원본에 쓰기 권한을 주는 방식이 아닙니다.
3. `src/participants`에 새 JSON 파일 하나를 만듭니다. 파일명과 id는 같아야 합니다.
4. 닉네임·관심 분야·한마디·색상·모양·액세서리를 정합니다. 다른 사람의 파일은 고치지 않습니다.
5. `npm test`, `npm run build`를 실행하고 내 캐릭터와 모바일 화면을 확인합니다.
6. 전용 기여 브랜치에 커밋하고 **발표자 원본 저장소**의 main을 대상으로 Draft PR을 엽니다.
7. 발표자의 리뷰를 받고 같은 브랜치에 수정합니다.
8. 발표자가 검토 후 병합합니다. 발표자 화면 반영은 별도의 최신 코드 가져오기·호스트 빌드/갱신이 필요합니다.

Fork → Repos → upstream PR 연결 경로는 실제 계정으로 사전 확인해야 합니다.
Repos에서 upstream 대상으로 PR을 만들기 어려우면 GitHub의 Compare & pull request로 마지막 단계를 진행합니다.

## JSON 예시

```json
{
  "id": "my-builder",
  "name": "나의 빌더",
  "role": "처음 온 메이커",
  "message": "작은 아이디어부터 함께 만들어요!",
  "color": "#FF5934",
  "shape": "round",
  "accessory": "headphones"
}
```

- id: 영문 소문자로 시작하는 3~24자의 소문자·숫자·하이픈. 다른 사람과 겹치지 않아야 합니다.
- name: 1~12자, role: 1~16자, message: 1~36자.
- color: #FF5934 / #8B5CF6 / #21A675 / #3483EB / #F2B93B / #EC6B9E.
- shape: round / square / ghost.
- accessory: none / cap / headphones / sprout / crown.

실명·연락처·민감정보는 올리지 않습니다. 공개 저장소에 올린 내용과 이력은 공개될 수 있습니다.
발표자에게 원본 쓰기 권한이나 계정 공유를 요구하지 마세요.
화면의 리허설은 이 브라우저의 연습일 뿐 실제 GitHub 승인·병합이 아닙니다.
