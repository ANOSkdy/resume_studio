# Resume Studio — Codex Runbook

## 0. Repository Context
- Stack: Next.js 15 / TypeScript / React Hook Form / Server Actions
- Integrations: Gemini API (`GEMINI_API_KEY`), GAS WebApp (`GAS_WEB_APP_URL`), (optional) `GAS_WEB_APP_TOKEN`
- App Router 直下: `app/`, UI: `components/`, 型: `types/`

## 1. Branch / PR
- Branch: `codex/<type>-<slug>-<YYYYMMDD-HHmm>` 例: `codex/feat-tabs-a11y-20251101-2230`
- PR title: `feat: <summary>` / `fix: <summary>` / `chore: <summary>`
- Labels (目安): `frontend`, `server`, `infra/ci`, `documentation`, `no-code-change`

## 2. Change Policy
- 破壊的変更NG。**最小差分**・未使用削除は避ける。
- 触ってよい場所: `app/**`, `components/**`, `types/**`, `docs/**`, `.github/**`, `codex.md`
- 触ってはいけない: `.env*` の新規追加、秘匿値埋め込み、外部秘匿の直書き
- 依存追加が必要な場合は根拠をPRに明記（サイズ・代替比較）。

## 3. ENV（参照のみ）
- 必須: `GEMINI_API_KEY`
- 場合によって: `GAS_WEB_APP_URL`, `GAS_WEB_APP_TOKEN`, `GEMINI_MODEL`
- クライアント露出防止: `NEXT_PUBLIC_` は付けない

## 4. Definition of Done
- `pnpm typecheck` / `pnpm build` が通る
- 主要画面（フォーム→PDF生成）フローが動作
- a11y: フォーカス遷移とラベルが機能
- 変更箇所のスクショ/説明をPRに添付

## 5. CI 要求（GitHub Actions）
- Node 20.x / pnpm 9 で `pnpm install -> typecheck -> build` を実行
- キャッシュ: pnpm store + Node modules

## 6. Commit style（例）
- `feat(ui): add a11y Tabs and Field`
- `fix(pdf): handle GAS error response`
- `chore(ci): add Node 20 + pnpm 9 workflow`

## 7. 修正プロンプト（テンプレ）
1) **目的**：<何のための修正かを一文で>
2) **修正内容**：
   - 箇条書きで具体的な変更点
3) **作業指示**：
   - branch名（`codex/...`）、変更対象ファイル、最小差分、テスト観点
4) **コミットメッセージ**：
   - `feat: ...` / `fix: ...` / `chore: ...`