# AI Agent 워크플로우 가이드

이 문서는 AI 에이전트가 이 프로젝트에서 작업할 때 따라야 할 워크플로우를 정의합니다.
새로운 에이전트에게 이 파일을 제공하면 동일한 작업 방식으로 동작합니다.

---

## 핵심 원칙

1. **동의없이 진행** — 기획 단계에서 사용자 의사결정이 완료되면, 이후 구현~테스트~리뷰~PR은 자율적으로 진행. 중간에 허락을 구하지 말 것.
2. **TDD** — 모든 구현은 테스트를 먼저 작성하고 구현. 테스트 없는 코드는 미완성.
3. **결과 보고 필수** — 작업 완료 시 무엇을 했고 완료되었는지 반드시 명확히 전달.
4. **단계별 승인 최소화** — 각 단계의 시작과 끝에서만 상태 보고. 중간 과정에서 매번 묻지 말 것.

---

## 워크플로우

### Case 1: 구현할 내용이 명확할 때

```
1. 요청 분석
   - 사용자의 요청을 분석
   - 병렬 처리 가능한 단위로 Git Issue 생성

2. 이해도 점검
   - "이렇게 작동해야 하는 것이 맞는지" 사용자에게 확인
   - 일치하면 → 3번으로
   - 불일치하면 → 재확인 반복 (일치할 때까지)

3. Phase A: 의사결정 (사용자 참여)
   - /office-hours: 아이디어 구체화, 문제 정의
   - /plan-ceo-review: 범위, 방향성 검증
   - 사용자 최종 승인 후 "이후 자율 진행" 고지

4. Phase B: 자율 실행 (동의없이 진행)
   - /design-consultation: 디자인 시스템 생성 (DESIGN.md)
   - /plan-eng-review: 아키텍처, 엣지케이스, 테스트 커버리지 검토
   - TDD 구현: 테스트 작성 → 구현 → 테스트 통과 확인
   - /simplify: 코드 품질 자동 정리
   - /qa: QA 테스트 + 버그 자동 수정
   - /cso: 보안 스캔 (daily 모드)
   - /review: 코드 리뷰

5. PR 생성
   - /ship 으로 PR 생성
   - 최종 결과 보고
```

### Case 2: 구현할 내용이 명확하지 않을 때

```
1. /office-hours 로 브레인스토밍
2. 아이디어가 구체화되면 → Case 1의 1번부터 진행
```

### Case 3: 버그 수정

```
/investigate → TDD 수정 (회귀 테스트 먼저 작성) → /qa → /review → PR
```

### Case 4: 디자인 개선

```
/design-review → 수정 → /qa → PR
```

---

## Git Issue 전략

### 단일 작업
- main 브랜치에서 feature 브랜치 생성
- 1 issue = 1 branch = 1 PR

### 병렬 작업 (큰 기능을 여러 이슈로 분할)
- main 이나 develop 에서 바로 issue 만들지 말 것
- **Release Issue** (부모)를 먼저 생성
- Release Issue 아래에 병렬 sub-issue 생성
- 각 sub-issue 별로 feature 브랜치 생성
- 모든 sub-issue PR이 완료되면 Release Issue 종료

```
예시:
Release Issue: "뮤직 플레이어 모션 추가" (#10)
├── Sub-issue: "리스트 애니메이션" (#11) → feature/list-animation
├── Sub-issue: "커버 회전 효과" (#12) → feature/cover-rotation
└── Sub-issue: "통계 대시보드" (#13) → feature/stats-dashboard
```

---

## gstack Skills 레퍼런스

### Phase A: 의사결정 단계

| Skill | 역할 | 사용자 참여 |
|-------|------|------------|
| `/office-hours` | 아이디어 구체화, 문제 정의, 타겟 사용자 분석 | O |
| `/plan-ceo-review` | 범위, 야망, 방향성 검증. 10-star product 사고방식 | O |

### Phase B: 자율 실행 단계

| Skill | 역할 | 사용자 참여 |
|-------|------|------------|
| `/design-consultation` | 디자인 시스템 생성 (DESIGN.md) | X |
| `/plan-design-review` | UI/UX 계획 리뷰 (구현 전) | X |
| `/plan-eng-review` | 아키텍처, 데이터플로우, 엣지케이스, 테스트 커버리지 | X |
| `/autoplan` | CEO + 디자인 + 엔지니어링 리뷰를 한번에 자동 실행 | X |
| TDD 구현 | 테스트 먼저 작성 → 구현 → 테스트 통과 | X |
| `/simplify` | 변경된 코드의 재사용성, 효율성, 품질 검토 + 자동 수정 | X |
| `/qa` | 체계적 QA 테스트 + 버그 자동 수정 | X |
| `/cso` | OWASP Top 10, STRIDE 위협 모델링, 의존성 공급망 검사 | X |
| `/review` | PR diff 분석, 구조적 이슈 체크 | X |
| `/ship` | PR 생성 | X |

### 보조 Skills

| Skill | 역할 |
|-------|------|
| `/investigate` | 버그 디버깅, 근본 원인 분석 |
| `/design-review` | 라이브 사이트 비주얼 QA |
| `/browse` | 헤드리스 브라우저 QA 테스트 |
| `/benchmark` | 성능 벤치마크 |
| `/retro` | 주간 회고 |
| `/careful` / `/freeze` / `/guard` / `/unfreeze` | 안전 모드 |
| `/codex` | 세컨드 오피니언 (코드 리뷰, 챌린지) |
| `/loop` | 명령 반복 실행 (예: `/loop 5m /canary`) |
| `/schedule` | cron 기반 원격 에이전트 스케줄링 |
| `/setup-browser-cookies` | 헤드리스 브라우저 쿠키 임포트 (인증 페이지 QA 전) |
| `/land-and-deploy` → `/canary` | 머지 & 배포 → 카나리 모니터링 |
| `/document-release` | README, CHANGELOG 자동 업데이트 |

---

## TDD 규칙

1. **Red**: 실패하는 테스트를 먼저 작성
2. **Green**: 테스트를 통과하는 최소한의 구현
3. **Refactor**: 코드 정리 (테스트는 계속 통과해야 함)

### 테스트 작성 기준
- 새로운 함수 → 해당 함수의 테스트 작성
- 버그 수정 → 버그를 재현하는 회귀 테스트 먼저 작성
- 에러 핸들링 추가 → 에러를 트리거하는 테스트 작성
- 조건 분기 (if/else, switch) → 모든 경로에 대한 테스트 작성
- 기존 테스트를 깨뜨리는 코드는 커밋하지 말 것

---

## 에이전트에게 이 파일을 적용하는 방법

새로운 AI 에이전트 세션 시작 시:

```
이 프로젝트의 WORKFLOW.md 와 CLAUDE.md 를 읽고 그 규칙에 따라 작업해줘.
```

또는 특정 프로젝트가 아닌 범용적으로 사용할 경우:

```
첨부한 WORKFLOW.md 의 워크플로우 규칙에 따라 작업해줘.
gstack skills 이 설치되어 있다면 해당 파이프라인을 활용할 것.
없다면 skills 호출 부분은 건너뛰고 나머지 워크플로우만 따를 것.
```
