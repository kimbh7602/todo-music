# Todo Music Project

## 개발 워크플로우 (gstack skills 파이프라인)

이 프로젝트는 gstack skills을 유기적으로 활용하여 기획부터 배포까지 진행합니다.

### 파이프라인 단계

1. **기획** — `/office-hours`
   - 아이디어 구체화, 문제 정의, 타겟 사용자 분석

2. **전략 리뷰** — `/plan-ceo-review`
   - 범위, 야망, 방향성 검증
   - 10-star product 사고방식

3. **디자인 시스템** — `/design-consultation`
   - 디자인 시스템 생성 (DESIGN.md)
   - 타이포그래피, 컬러, 레이아웃, 스페이싱, 모션

4. **디자인 리뷰** — `/plan-design-review`
   - UI/UX 계획 리뷰 (구현 전)

5. **엔지니어링 리뷰** — `/plan-eng-review`
   - 아키텍처, 데이터플로우, 엣지케이스, 테스트 커버리지

6. **자동 리뷰** — `/autoplan`
   - CEO + 디자인 + 엔지니어링 리뷰를 한번에 자동 실행

7. **구현** — 코딩
   - 계획에 따라 구현 진행

8. **코드 정리** — `/simplify`
   - 변경된 코드의 재사용성, 효율성, 품질 검토 + 자동 수정

9. **QA 테스트** — `/qa`
   - 체계적 QA 테스트 + 버그 자동 수정
   - `/qa-only`로 리포트만 생성 가능
   - 인증 페이지 테스트 시 `/setup-browser-cookies`로 쿠키 임포트 선행

10. **보안 감사** — `/cso`
    - OWASP Top 10, STRIDE 위협 모델링, 의존성 공급망 검사
    - daily (빠른 스캔) / comprehensive (월간 정밀 스캔) 두 모드

11. **코드 리뷰** — `/review`
    - PR diff 분석, SQL 안전성, 구조적 이슈 체크

12. **배포 설정** — `/setup-deploy` (최초 1회)
    - 배포 플랫폼 자동 감지, 프로덕션 URL, 헬스체크 설정

13. **배포** — `/ship` → `/land-and-deploy` → `/canary`
    - PR 생성 → 머지 & 배포 → 카나리 모니터링

14. **문서화** — `/document-release`
    - README, CHANGELOG 등 자동 업데이트

### 보조 skills

- `/investigate` — 버그 디버깅, 근본 원인 분석
- `/design-review` — 라이브 사이트 비주얼 QA
- `/browse` — 헤드리스 브라우저 QA 테스트
- `/benchmark` — 성능 벤치마크
- `/retro` — 주간 회고
- `/careful` / `/freeze` / `/guard` / `/unfreeze` — 안전 모드
- `/codex` — 세컨드 오피니언 (코드 리뷰, 챌린지)
- `/loop` — 명령 반복 실행 (예: `/loop 5m /canary`)
- `/schedule` — cron 기반 원격 에이전트 스케줄링
- `/setup-browser-cookies` — 헤드리스 브라우저 쿠키 임포트 (인증 페이지 QA 전)

### 진행 순서 가이드

새 기능을 추가할 때:
```
/office-hours → /plan-ceo-review → /design-consultation → /plan-eng-review → 구현 → /simplify → /qa → /cso → /review → /ship
```

버그를 수정할 때:
```
/investigate → 수정 → /qa → /review → /ship
```

디자인 개선할 때:
```
/design-review → 수정 → /qa → /ship
```

## 기술 스택

- **Framework**: Next.js 15+ (App Router, Full CSR)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand (persist + skipHydration)
- **Testing**: Vitest + Playwright
- **Deploy**: Vercel

## 프로젝트 상태

- [ ] 기획 (`/office-hours`)
- [ ] 전략 리뷰 (`/plan-ceo-review`)
- [ ] 디자인 시스템 (`/design-consultation`)
- [ ] 엔지니어링 리뷰 (`/plan-eng-review`)
- [ ] 구현
- [ ] 코드 정리 (`/simplify`)
- [ ] QA 테스트
- [ ] 보안 감사 (`/cso`)
- [ ] 코드 리뷰 (`/review`)
- [ ] 배포 설정 (`/setup-deploy`)
- [ ] 배포
