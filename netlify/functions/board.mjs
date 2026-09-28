import { getStore } from "@netlify/blobs";

export default async (req) => {
  const store = getStore("vorstandsboard");

  if (req.method === "GET") {
    const data = await store.get("board", { type: "json" });
    return new Response(JSON.stringify(data || { projects: [] }), {
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }

  if (req.method === "POST") {
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response("Ungültige Daten", { status: 400 });
    }
    if (!body || !Array.isArray(body.projects)) {
      return new Response("Ungültige Daten", { status: 400 });
    }
    await store.setJSON("board", body);
    return new Response(JSON.stringify({ status: "ok" }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Nicht erlaubt", { status: 405 });
};

export const config = { path: "/api/board" };

