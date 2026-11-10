# KuryCup – webové stránky

Moderní web pro organizátora hokejových turnajů KuryCup.

## Spuštění

```bash
python -m http.server 8080
```

Poté otevřete `http://localhost:8080`.

## Struktura

- `index.html` – domovská stránka
- `o-nas.html` – o organizátorovi
- `turnaje.html` – proběhlé a nastávající turnaje
- `turnaj.html` – detail turnaje a přihláška týmu
- `galerie.html` – fotogalerie
- `prispevky.html` / `prispevek.html` – příspěvky a novinky
- `merch.html` / `produkt.html` – e-shop merch
- `css/styles.css` – styly
- `js/data.js` – data (turnaje, příspěvky, produkty)
- `js/main.js` – sdílená logika (navigace, košík, lightbox)

Přihlášky týmů, objednávky, obsah webu a notifikace jsou ukládány do `localStorage` (demo).

## Administrace

- URL: `/admin.html`
- Demo přístup: `admin` / `kury2026`
- Správa turnajů, příspěvků, merch, přihlášek, objednávek a notifikací.
- Notifikace: při přihlášení týmu a objednávce se vytvoří záznam v logu; odeslání přes e-mail/SMS link (mailto/sms) v administraci nebo při checkoutu.
