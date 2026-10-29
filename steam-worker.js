/**
 * VideoGameQuiz Steam-Proxy – Cloudflare Worker (kostenloser Tarif reicht)
 *
 * Holt die Spieleliste eines öffentlichen Steam-Profils und gibt sie an die Quiz-Seite weiter.
 * Nötig, weil die Steam-Web-API keine Anfragen direkt aus dem Browser erlaubt und der
 * API-Schlüssel geheim bleiben muss.
 *
 * Einrichtung:
 *  1. Schlüssel holen: https://steamcommunity.com/dev/apikey
 *  2. Cloudflare → Workers & Pages → Create → Worker → diesen Code einfügen → Deploy
 *  3. Worker → Settings → Variables and Secrets → Secret "STEAM_API_KEY" anlegen
 *  4. Optional: Variable "ALLOWED_ORIGIN" = Adresse deiner Quiz-Seite (z. B. https://tim.github.io),
 *     dann darf nur deine Seite den Proxy benutzen.
 *
 * Aufruf: GET https://<worker>.workers.dev/?profile=<Profil-Link, Vanity-Name oder SteamID64>
 * Antwort: { steamid, count, games: [{ appid, name, minutes }] }
 */
export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowed = env.ALLOWED_ORIGIN ? (origin === env.ALLOWED_ORIGIN ? origin : "null") : "*";
    const cors = {
      "Access-Control-Allow-Origin": allowed,
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=300"
    };
    const reply = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: cors });

    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "GET") return reply({ error: "Nur GET erlaubt" }, 405);
    if (!env.STEAM_API_KEY) return reply({ error: "STEAM_API_KEY fehlt im Worker" }, 500);
    if (env.ALLOWED_ORIGIN && origin && origin !== env.ALLOWED_ORIGIN) return reply({ error: "Diese Seite darf den Proxy nicht benutzen" }, 403);

    const profile = (new URL(request.url).searchParams.get("profile") || "").trim();
    if (!profile) return reply({ error: "Parameter profile fehlt" }, 400);

    try {
      const steamid = await resolveSteamId(profile, env.STEAM_API_KEY);
      if (!steamid) return reply({ error: "Steam-Profil nicht gefunden" }, 404);

      const url = "https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?" + new URLSearchParams({
        key: env.STEAM_API_KEY, steamid, include_appinfo: "1", include_played_free_games: "1", format: "json"
      });
      const res = await fetch(url);
      if (!res.ok) return reply({ error: "Steam antwortet mit " + res.status }, 502);
      const data = await res.json();
      const games = ((data.response && data.response.games) || []).map((g) => ({
        appid: g.appid, name: g.name, minutes: g.playtime_forever || 0
      }));
      return reply({ steamid, count: games.length, games });
    } catch (err) {
      return reply({ error: "Fehler beim Abruf: " + err.message }, 500);
    }
  }
};

async function resolveSteamId(input, key) {
  if (/^\d{17}$/.test(input)) return input;
  const byId = input.match(/profiles\/(\d{17})/);
  if (byId) return byId[1];
  const vanity = (input.match(/\/id\/([^/?#]+)/) || [])[1] || (/^[\w-]{2,32}$/.test(input) ? input : null);
  if (!vanity) return null;
  const url = "https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?" + new URLSearchParams({ key, vanityurl: vanity });
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  return data.response && data.response.success === 1 ? data.response.steamid : null;
}
