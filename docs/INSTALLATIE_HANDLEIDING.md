# Delfzijl RP Store - Uitgebreide installatiehandleiding

Deze handleiding legt stap voor stap uit hoe je de webshop, Stripe, MySQL/MariaDB en de FiveM bridge installeert.

## 1. Overzicht

De store werkt zo:

```txt
Speler koopt product op webshop.delfzijlrp.nl
  -> Stripe Checkout verwerkt iDEAL/card
  -> Stripe webhook zet order in MySQL pending_orders
  -> FiveM resource vraagt uitgaand orders op bij Vercel
  -> FiveM voert veilige delivery command uit
  -> webshop markeert order als delivered
```

Je hoeft op je FiveM-server geen extra inkomende poorten open te zetten.

## 2. Benodigdheden

Je hebt nodig:

- GitHub repo: `Jv420/Fivemdelfzijlrpstore`
- Node.js 20 of nieuwer
- npm
- Vercel account
- Stripe account
- MySQL of MariaDB database
- HeidiSQL om de database te beheren
- FiveM server
- Toegang tot je `server.cfg`

## 3. Repository lokaal draaien

Clone de repo:

```bash
git clone https://github.com/Jv420/Fivemdelfzijlrpstore.git
cd Fivemdelfzijlrpstore
```

Installeer dependencies:

```bash
npm install
```

Maak lokaal een `.env.local` bestand:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
FIVEM_BRIDGE_SECRET=maak-een-lange-random-secret

MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=delfzijlrp_store
MYSQL_PASSWORD=sterk-wachtwoord
MYSQL_DATABASE=delfzijlrp
```

Start lokaal:

```bash
npm run dev
```

Open daarna:

```txt
http://localhost:3000
```

## 4. MySQL/MariaDB database installeren

Open HeidiSQL en maak een database aan, bijvoorbeeld:

```sql
create database if not exists delfzijlrp character set utf8mb4 collate utf8mb4_unicode_ci;
```

Selecteer daarna de database `delfzijlrp` en run het bestand:

```txt
mysql/schema.sql
```

Dit maakt de tabel:

```txt
pending_orders
```

Deze tabel bewaart alle bestellingen die nog naar de FiveM-server geleverd moeten worden.

## 5. Database gebruiker maken

Maak bij voorkeur een aparte gebruiker voor de webshop:

```sql
create user if not exists 'delfzijlrp_store'@'%' identified by 'STERK_WACHTWOORD_HIER';
grant select, insert, update on delfzijlrp.pending_orders to 'delfzijlrp_store'@'%';
flush privileges;
```

Gebruik niet je root-account in Vercel.

## 6. Belangrijk bij Vercel en MySQL

Vercel moet je database kunnen bereiken.

Dus dit moet kloppen:

```env
MYSQL_HOST=jouw-db-host-of-ip
MYSQL_PORT=3306
MYSQL_USER=delfzijlrp_store
MYSQL_PASSWORD=sterk-wachtwoord
MYSQL_DATABASE=delfzijlrp
```

Als jouw MySQL alleen lokaal of alleen via je gamehost bereikbaar is, dan kan Vercel er niet bij. Oplossingen:

- database extern bereikbaar maken met whitelist;
- een externe MySQL provider gebruiken;
- een database gebruiken die speciaal geschikt is voor serverless/Vercel.

## 7. Stripe instellen

Maak in Stripe een account aan en activeer betaalmethodes:

- iDEAL
- card

Gebruik eerst testmodus.

Zet je test secret key in Vercel of `.env.local`:

```env
STRIPE_SECRET_KEY=sk_test_xxx
```

## 8. Stripe webhook instellen

Maak in Stripe een webhook endpoint:

```txt
https://webshop.delfzijlrp.nl/api/stripe/webhook
```

Voor lokaal testen kun je Stripe CLI gebruiken:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Je krijgt dan een webhook secret:

```env
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

Schakel minimaal dit event in:

```txt
checkout.session.completed
```

## 9. Vercel deploy

Ga naar Vercel en importeer de GitHub repo.

Build settings kunnen standaard blijven:

```txt
Framework: Next.js
Build command: npm run build
Output: .next
```

Zet deze environment variables in Vercel:

```env
NEXT_PUBLIC_SITE_URL=https://webshop.delfzijlrp.nl
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
FIVEM_BRIDGE_SECRET=maak-een-lange-random-secret
MYSQL_HOST=jouw-db-host
MYSQL_PORT=3306
MYSQL_USER=delfzijlrp_store
MYSQL_PASSWORD=sterk-wachtwoord
MYSQL_DATABASE=delfzijlrp
```

Deploy daarna opnieuw.

## 10. Domein koppelen

Koppel in Vercel het domein:

```txt
webshop.delfzijlrp.nl
```

Maak bij je DNS-provider meestal een CNAME:

```txt
webshop -> cname.vercel-dns.com
```

Controleer daarna of HTTPS actief is.

## 11. FiveM bridge installeren

Kopieer deze map naar je FiveM resources:

```txt
fivem/delfzijlrp_shopbridge
```

Voorbeeld:

```txt
resources/[delfzijlrp]/delfzijlrp_shopbridge
```

Open:

```txt
fivem/delfzijlrp_shopbridge/config.lua
```

Pas aan:

```lua
Config.StoreBaseUrl = 'https://webshop.delfzijlrp.nl'
Config.BridgeSecret = 'dezelfde-secret-als-FIVEM_BRIDGE_SECRET'
Config.PollIntervalSeconds = 45
```

Zet in `server.cfg`:

```txt
ensure delfzijlrp_shopbridge
```

Herstart de server.

## 12. Bridge testen

Start je FiveM server en check console:

```txt
[delfzijlrp_shopbridge] started
```

Plaats een testorder via Stripe testmodus. Na betaling moet er in MySQL een rij komen met:

```txt
status = pending
```

Binnen ongeveer 45 seconden haalt de FiveM bridge deze order op en voert het command uit. Daarna moet de status worden:

```txt
status = delivered
```

## 13. Producten aanpassen

Producten staan in:

```txt
lib/products.ts
```

Voorbeeld:

```ts
{
  id: 'vip_30d',
  name: 'VIP Rank - 30 dagen',
  description: 'Supporter rank met Discord role, priority queue en cosmetische voordelen.',
  priceCents: 499,
  deliveryType: 'rank',
  command: 'add_principal identifier.license:{license} group.vip',
}
```

Gebruik `{license}` waar automatisch de license van de speler moet komen.

## 14. Command veiligheid

De FiveM bridge voert niet zomaar ieder command uit. Alleen prefixes uit `config.lua` zijn toegestaan:

```lua
Config.AllowedCommandPrefixes = {
  'add_principal ',
  'delfzijl_customplate ',
  'delfzijl_vehiclecosmetic ',
  'delfzijl_showroomslot '
}
```

Als je een nieuw command toevoegt aan producten, voeg dan ook de veilige prefix toe in `config.lua`.

## 15. Bestellingen beheren in HeidiSQL

Belangrijke velden:

- `stripe_session_id` - unieke Stripe betaling
- `product_id` - product uit `lib/products.ts`
- `player_license` - FiveM license van speler
- `delivery_command` - command voor FiveM
- `status` - pending, delivered of failed
- `delivery_error` - foutmelding als delivery geblokkeerd/mislukt

## 16. Testkaarten Stripe

Gebruik in Stripe testmodus testkaarten uit het Stripe dashboard. Test eerst minimaal:

- geslaagde betaling;
- geannuleerde betaling;
- webhook delivery;
- FiveM delivery;
- failed delivery door fout command.

## 17. Live gaan checklist

Controleer vóór live:

- `STRIPE_SECRET_KEY` begint met `sk_live_`
- Stripe webhook gebruikt live endpoint
- `NEXT_PUBLIC_SITE_URL` is `https://webshop.delfzijlrp.nl`
- MySQL wachtwoord is sterk
- Database user heeft alleen noodzakelijke rechten
- `FIVEM_BRIDGE_SECRET` is lang en geheim
- FiveM config gebruikt dezelfde secret
- Testbetaling is gedaan
- Order wordt `delivered`

## 18. Updates uitvoeren

Nieuwe code pushen naar GitHub geeft automatisch een nieuwe Vercel deploy.

Voor FiveM resource updates:

1. Download/kopieer de nieuwe `fivem/delfzijlrp_shopbridge` map.
2. Vervang de resource op je server.
3. Controleer `config.lua` secret.
4. Restart resource:

```txt
restart delfzijlrp_shopbridge
```

## 19. Backups

Maak regelmatig backups van:

- GitHub repo;
- MySQL database;
- Vercel environment variables;
- FiveM resource config.

HeidiSQL backup:

1. Rechtsklik database.
2. Export database as SQL.
3. Sla veilig op.

## 20. Veelvoorkomende problemen

### Webhook komt niet aan

Controleer:

- Stripe webhook URL;
- `STRIPE_WEBHOOK_SECRET`;
- Vercel logs;
- event `checkout.session.completed`.

### Order blijft pending

Controleer:

- FiveM resource gestart;
- `Config.StoreBaseUrl`;
- `Config.BridgeSecret`;
- Vercel env `FIVEM_BRIDGE_SECRET`;
- FiveM console errors.

### Delivery wordt failed

Controleer:

- `delivery_error` in MySQL;
- command prefix staat in `AllowedCommandPrefixes`;
- command bestaat op je FiveM server.

### Vercel kan MySQL niet verbinden

Controleer:

- database host/IP;
- poort 3306 bereikbaar;
- firewall/whitelist;
- gebruikersnaam/wachtwoord;
- database naam.

## 21. Veilige verkoop-editie

Voor verkoop aan anderen gebruik je de map:

```txt
sellable-safe-edition/
```

Die map is bedoeld als schone, veilige uitleg en productrichting zonder experimental map of risicovolle producten.
