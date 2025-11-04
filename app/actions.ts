"use server";

import { readJsonSafely } from "@/lib/http/readJsonSafely";

export async function generateAiTextAction(prompt: string): Promise<string> {
  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) throw new Error("Gemini APIキーが設定されていません。");

  const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.7, topK: 1, topP: 1, maxOutputTokens: 8192 },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
    ]
  };

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
    cache: "no-store"
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`APIリクエストエラー (コード: ${res.status}): ${errorBody}`);
  }

  const json = (await readJsonSafely(res)) as any;
  if (json?.promptFeedback?.blockReason) {
    throw new Error(`AIへのリクエストがブロック: ${json.promptFeedback.blockReason}`);
  }
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("APIレスポンスに有効なテキストがありません。");
  return String(text).trim();
}
