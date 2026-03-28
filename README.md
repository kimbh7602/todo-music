# Todo Music

TODO 리스트를 뮤직 플레이어처럼 다루는 앱.
할 일을 "재생"하고, 완료하면 축하받고, 스트릭이 쌓입니다.

**Live:** https://todo-music.vercel.app/

## 왜 Todo Music인가

- **지루한 체크리스트가 아닌 경험** — TODO를 Play하면 음악이 흐르고, 비닐판이 돌아가고, 완료하면 confetti가 터집니다.
- **성취감이 쌓이는 구조** — 매일 TODO를 완료하면 스트릭이 카운트되고, 통계 대시보드에서 진행 현황을 확인할 수 있습니다.
- **Apple Music 스타일 UI** — Liquid Glass 디자인으로 모든 인터랙션이 부드럽고 자연스럽습니다. SVG 굴절 필터, specular highlight, noise 텍스처가 적용된 유리 효과.
- **모든 동작에 모션** — TODO 추가/삭제 시 슬라이드 애니메이션, 플레이어 등장/퇴장 시 spring 트랜지션, 탭 전환 시 crossfade.
- **반응형** — 태블릿 이상에서는 왼쪽 플레이어 + 오른쪽 리스트, 모바일에서는 상단 플레이어 + 하단 리스트.
- **저작권 걱정 없는 음원** — CC0 라이선스 로파이 앰비언트 트랙 6곡 내장 (Loyalty Freak Music, Internet Archive).

## 주요 기능

| 기능 | 설명 |
|------|------|
| TODO CRUD | 추가, 삭제, 완료 처리 |
| 뮤직 플레이어 | TODO 활성화 시 음악 재생, Play/Pause, Seek |
| 비닐 커버 회전 | 재생 중 커버 이미지가 레코드판처럼 회전 |
| Confetti | TODO 완료 시 골드/실버 파티클 |
| 스트릭 카운터 | 연속 완료일 카운트, 뱃지 표시 |
| 통계 대시보드 | Today / Streak / Total / Best 4칸 그리드 |
| 랜덤 컬러/이미지/트랙 | 활성화할 때마다 배경색, 커버, 음악이 랜덤 변경 |
| Liquid Glass UI | 반투명 블러 + SVG 굴절 + specular highlight |
| 활성화 잠금 | 이미 재생 중인 TODO가 있으면 다른 TODO 재생 불가 |
| Active/Completed 탭 | 완료된 TODO는 별도 탭에서 확인 |

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | Next.js 15+ (App Router, Full CSR) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State | Zustand (persist + skipHydration) |
| Animation | Framer Motion |
| Audio | HTML5 Audio API |
| Effects | canvas-confetti |
| Deploy | Vercel |

## 시작하기

```bash
# 설치
npm install

# 개발 서버
npm run dev

# 빌드
npm run build

# 프로덕션 실행
npm start
```

http://localhost:3000 에서 확인할 수 있습니다.

## 프로젝트 구조

```
src/
├── app/
│   ├── globals.css        # Liquid Glass CSS + vinyl rotation
│   ├── layout.tsx         # SVG 굴절 필터 정의
│   └── page.tsx           # 메인 레이아웃 (반응형, 모션)
├── components/
│   ├── MusicPlayer.tsx    # 뮤직 플레이어 (오디오 재생, 커버 회전)
│   ├── TodoList.tsx       # TODO 리스트 (AnimatePresence, confetti)
│   └── StatsCard.tsx      # 통계 대시보드
├── store/
│   └── useTodoStore.ts    # Zustand 스토어 (CRUD, streak, stats)
└── utils/
    ├── confetti.ts        # confetti 설정
    └── date.ts            # 날짜 유틸리티
```

## 라이선스

MIT
