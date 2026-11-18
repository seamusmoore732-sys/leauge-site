// Cloudflare Pages Function: runs at /api on your site. Lets the page read Sleeper and ESPN data.
// Only these two data sources are allowed. Nothing is stored.
const OK = /^https:\/\/(api\.sleeper\.app|lm-api-reads\.fantasy\.espn\.com)\//;
const cors = { "access-control-allow-origin": "*", "access-control-allow-headers": "*", "access-control-allow-methods": "GET,OPTIONS" };
async function handle(req) {
  try {
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    const u = new URL(req.url);
    if (u.searchParams.get("ping")) return new Response("ok", { headers: cors });
    const t = u.searchParams.get("url");
    if (!t || !OK.test(t)) return new Response("bad url", { status: 400, headers: cors });
    const r = await fetch(t, { headers: { "user-agent": "Mozilla/5.0", accept: "application/json" }, cf: { cacheTtl: /\/players\//.test(t) ? 86400 : 60, cacheEverything: true } });
    return new Response(r.body, { status: r.status, headers: { ...cors, "content-type": "application/json" } });
  } catch (e) {
    return new Response("proxy error: " + e.message, { status: 502, headers: cors });
  }
}
export const onRequest = ({ request }) => handle(request);
