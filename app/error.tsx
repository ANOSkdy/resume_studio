"use client";
import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: any; reset: () => void }) {
  useEffect(() => {
    console.error("RSC error", error);
  }, [error]);
  return (
    <html>
      <body>
        <h2>エラーが発生しました</h2>
        <p>digest: {error?.digest ?? "n/a"}</p>
        <button onClick={reset}>再試行</button>
      </body>
    </html>
  );
}
