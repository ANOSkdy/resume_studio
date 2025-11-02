# Resume Studio PDF 出力ガイド

このプロジェクトでは Next.js (App Router) を用いて履歴書・職務経歴書の PDF を生成します。テンプレートは React-PDF ベースで実装され、`/api/pdf` エンドポイントから呼び出せます。

## テンプレートキー

| type        | 説明             |
|-------------|------------------|
| `resume`    | 履歴書 (日本語)  |
| `career`    | 職務経歴書       |
| `resume_jp` | 履歴書 (日本語) - `resume` と同一 | 

## API 仕様

- パス: `/api/pdf`
- メソッド: `GET` / `POST`
- リクエスト形式: JSON (`{ "type": "resume", "payload": { ... } }`)
- レスポンス: PDF バイナリ (成功時) / JSON (エラーまたはデバッグ時)

### 例: PDF を取得

```bash
curl -X POST http://localhost:3000/api/pdf \
  -H "Content-Type: application/json" \
  -d @examples/pdf/resume.sample.json \
  --output resume.pdf
```

### 例: デバッグモード

`debug=1` クエリ、もしくは `X-PDF-Debug: 1` ヘッダーを付与すると、解決済みの payload とテンプレートキーを JSON で返します。

```bash
curl "http://localhost:3000/api/pdf?type=resume&debug=1"
```

## 検証手順

1. `pnpm install`
2. `pnpm dev`
3. 上記 curl コマンドで PDF を生成するか、画面の「PDF生成」ボタンから `type`/`payload` を送信します。

## ログ

サーバーログには `type`・`debug` フラグ・主要フィールド数が INFO レベルで出力されます。Vercel などのホスティングでも原因追跡に利用できます。

## サンプルデータ

- `examples/pdf/resume.sample.json`
- `examples/pdf/career.sample.json`

これらのファイルを `curl` で送信することでテンプレートのレイアウト確認ができます。
