import { cookies } from "next/headers";

// Server components can hit the API via absolute URLs without losing auth cookies.
export async function postPdfWithCookies(path: string, body: unknown) {
  const base =
    process.env.NEXT_PUBLIC_BASE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  return fetch(new URL(path, base), {
    method: "POST",
    headers: {
      cookie: cookies().toString(),
      "content-type": "application/json",
      accept: "application/pdf"
    },
    body: JSON.stringify(body),
    cache: "no-store",
    redirect: "manual"
  });
}
