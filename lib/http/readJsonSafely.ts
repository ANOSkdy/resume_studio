export async function readJsonSafely(res: Response) {
  const ct = res.headers.get("content-type") ?? "";
  const text = await res.text();
  if (!ct.includes("application/json")) {
    throw new Error(`Expected JSON but got ${ct || "unknown"}: ${text.slice(0, 200)}`);
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error(`JSON parse failed: ${String(e)}\nBody: ${text.slice(0, 200)}`);
  }
}
