# Delfzijl RP Store

Eigen webshop voor `webshop.delfzijlrp.nl` met Stripe iDEAL/card en een FiveM delivery bridge zonder extra inkomende poorten.

## Architectuur

```txt
Vercel Next.js webshop
  -> Stripe Checkout
  -> Stripe webhook
  -> MySQL/MariaDB pending_orders queue
  -> FiveM resource pollt uitgaand naar Vercel
  -> server voert veilige delivery uit
```

Je FiveM-server hoeft dus geen poort open te zetten. De server maakt zelf een uitgaande HTTPS request naar de webshop API.

## Belangrijk over FiveM monetization

Verkoop geen direct pay-to-win geld, zwart geld of wapens voor echt geld. Gebruik deze store voor ranks, cosmetics, priority queue, donateurvoordelen en niet-pay-to-win perks. Pas producten alleen aan als ze voldoen aan de Cfx/FiveM regels.

## Mappen

- `app/` - Next.js/Vercel webshop + API routes
- `lib/` - producten en MySQL helper
- `mysql/schema.sql` - MySQL/MariaDB database tabel
- `fivem/delfzijlrp_shopbridge/` - FiveM resource

## Benodigd

- Vercel project
- Stripe account met iDEAL/card
- MySQL/MariaDB database die bereikbaar is vanaf Vercel
- FiveM ESX/QB server

## Environment variables op Vercel

```env
NEXT_PUBLIC_SITE_URL=https://webshop.delfzijlrp.nl
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
FIVEM_BRIDGE_SECRET=maak-een-lange-random-secret

MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=delfzijlrp_store
MYSQL_PASSWORD=sterk-wachtwoord
MYSQL_DATABASE=delfzijlrp
```

Let op: `MYSQL_HOST=127.0.0.1` werkt alleen lokaal. Op Vercel moet dit de publieke hostnaam/IP van jouw database zijn, of een externe databaseprovider. Als jouw database alleen bereikbaar is vanaf je gamehost/HeidiSQL en niet vanaf Vercel, dan moet je database toegang/whitelist aanpassen of een externe MySQL database gebruiken.

## Installatie webshop

```bash
npm install
npm run dev
```

Deploy daarna naar Vercel en koppel `webshop.delfzijlrp.nl` als domein.

## Stripe webhook

Maak in Stripe een webhook endpoint naar:

```txt
https://webshop.delfzijlrp.nl/api/stripe/webhook
```

Event:

```txt
checkout.session.completed
```

## MySQL/MariaDB

Open HeidiSQL en run:

```sql
mysql/schema.sql
```

Hiermee wordt de tabel `pending_orders` gemaakt.

## FiveM installatie

1. Zet `fivem/delfzijlrp_shopbridge` in je FiveM `resources` map.
2. Pas `config.lua` aan:

```lua
Config.StoreBaseUrl = 'https://webshop.delfzijlrp.nl'
Config.BridgeSecret = 'dezelfde-secret-als-FIVEM_BRIDGE_SECRET'
```

3. Voeg toe aan `server.cfg`:

```txt
ensure delfzijlrp_shopbridge
```

## Producten aanpassen

Wijzig `lib/products.ts`. Gebruik alleen veilige rewards. Voor geld, zwart geld en wapens staan bewust geen standaardproducten in deze versie.
