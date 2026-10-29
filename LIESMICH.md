# VideoGameQuiz vom King

Ein Musikquiz für Videospiel-Soundtracks nach dem Vorbild von AMQ (Anime Music Quiz). Alles steckt in **einer Datei**: `index.html` (ca. 6 MB, weil die komplette Spieledatenbank drin ist).

## Was drin ist

**Quiz wie bei AMQ**
- Verdeckt abgespielte YouTube-Clips mit Countdown, danach Auflösung mit Video und Song-Info
- **Eintippen** mit Vorschlägen aus rund 85.000 Spielen – Zahlen und römische Ziffern gleichwertig („Final Fantasy 1“ → Final Fantasy, 10, 11 …), Kürzel wie „gta 5“ oder „botw“ funktionieren. Alternativ **4 Antworten**.
- **Gespielt-Anteil** (wie „Watched“ bei AMQ): 100 / 80 / 50 / 0 % der Songs aus angekreuzten Spielen
- **Punkte-Modi**: Normal, Schnellraten (3/2/1 Punkte nach Tempo), Leben (Last Man Standing)
- **Tempo**-Modifier (1,5×, 2×, Zufall), Startpunkt im Song, Ratezeit, Songanzahl
- **Filter**: Erscheinungsjahr von–bis, Konsolenfamilien, Songarten (Main Theme, Gebiet, Kampf, Gesang)
- **Skip**: Wenn alle skippen (Knopf oder Strg + Leertaste), geht es sofort weiter
- **Song-Info**: Cover, Jahr, „Erschienen für …“, wer das Spiel angekreuzt hat, Trefferquote des Songs
- **Mehrspieler** per Einladungslink mit **Chat**; jeder hört auf dem eigenen Gerät

**Verlauf**: Jeder Browser merkt sich, welche Songs gespielt wurden – mit Antwort, richtig/falsch und übersprungenen Songs samt Grund.

**Songs prüfen** (Tab „Songs“): testet alle Videos im eigenen Browser und deaktiviert auf Wunsch die, die nicht abspielbar sind.

**Meine Spiele**
- Rund 85.000 Spiele als **Cover zum Ankreuzen** – PS1 bis PS5, PSP, Vita, NES bis Switch 2, Game Boy bis 3DS, Xbox bis Series, PC, Sega und mehr
- Sortiert nach Verkaufs- und Spielerzahlen; mit Konsolenfilter nach den Verkäufen auf genau dieser Konsole
- Steam-Bibliothek per Proxy oder per eingefügter Liste automatisch ankreuzen

**Songs**: 468 Songs aus 244 Spielen – pro Spiel bis zu 5 der bekanntesten Stücke (Main Theme, Gebiete, Kämpfe, Gesang). Läuft ein Song auch in anderen Spielen (Remix, Remake, Smash Bros., Mario Kart …), zählen diese ebenfalls als richtige Antwort und werden bei der Auflösung unter „Auch in …“ gezeigt. Eigene YouTube-Links hinzufügen, kaputte deaktivieren, Listen mit Freunden teilen.

## Online stellen (nötig, damit YouTube abspielt)

**GitHub Pages (empfohlen, kostenlos):**
1. Konto auf github.com anlegen → „New repository“, z. B. `videogamequiz`, öffentlich.
2. „Add file → Upload files“ → `index.html` hochladen → „Commit“.
3. Settings → Pages → Branch `main`, Ordner `/ (root)` → Save.
4. Nach 1–2 Minuten läuft die Seite unter `https://DEINNAME.github.io/videogamequiz/`.

Direkt als Datei doppelgeklickt (file://) verweigert YouTube meist das Abspielen.

## Steam verknüpfen

Steam erlaubt keine direkten Abfragen aus dem Browser, darum gibt es `steam-worker.js` – einen Mini-Server für Cloudflare Workers (kostenlos). Die Schritte stehen oben in der Datei und auf der Seite unter „Hilfe“.
Ohne Proxy: `steamcommunity.com/my/games/?tab=all` öffnen, alles kopieren, unter „Meine Spiele“ einfügen.

## Datenquellen der Spieledatenbank

| Quelle | Liefert | Stand |
|---|---|---|
| [leinstay/steamdb](https://github.com/leinstay/steamdb) | ~195.000 Steam-Spiele mit Bewertungen, Besitzerzahlen, Bildern | nächtlich aktualisiert (genutzt: 24.10.2026) |
| [blawar/titledb](https://github.com/blawar/titledb) | Nintendo-Switch-eShop mit Icons | Okt. 2026 |
| VGChartz-Datensätze (2016 und 2024) | Konsolenspiele, Verkaufszahlen pro Konsole, Boxart | 2024 |
| [libretro-thumbnails](https://github.com/libretro-thumbnails) | Boxart für Retro-Konsolen (PS1, PS2, NES, SNES, N64, GameCube, Wii, GBA, DS, Sega …) | laufend |
| Wikipedia-Bestsellerlisten | aktuelle Verkaufszahlen für Switch, Switch 2, PS4, PS5, Xbox One | Okt. 2026 |

Aufgenommen sind alle Konsolenspiele aus diesen Quellen und alle Steam-Spiele mit mindestens 50 Bewertungen. Cover werden direkt von Steam, Nintendo, GitHub (libretro) bzw. VGChartz geladen; fehlt ein Bild, erscheint eine Titelkarte.

Zum Aktualisieren gibt es das Skript `build_catalog.py` (liegt im Projekt), das die Quellen neu zusammenführt.
