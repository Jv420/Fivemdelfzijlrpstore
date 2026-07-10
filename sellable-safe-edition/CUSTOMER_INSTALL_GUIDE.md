# Customer Install Guide - Safe Edition

Deze handleiding is bedoeld voor klanten die de veilige webshoptemplate kopen.

## 1. Wat krijg je?

- Next.js webshop voor Vercel
- Stripe Checkout voor iDEAL/card
- MySQL/MariaDB order queue
- FiveM bridge zonder extra inkomende poorten
- Veilige voorbeeldproducten voor ranks/cosmetics/priority

## 2. Vereisten

- Vercel account
- Stripe account
- MySQL/MariaDB database
- FiveM server
- GitHub repository of ZIP met bestanden

## 3. Database installeren

Run in je MySQL/MariaDB database:

```txt
mysql/schema.sql
```

Dit maakt de tabel `pending_orders`.

## 4. Vercel environment variables

Zet in Vercel:

```env
NEXT_PUBLIC_SITE_URL=https://jouw-webshop-domein.nl
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
FIVEM_BRIDGE_SECRET=maak-een-lange-random-secret
MYSQL_HOST=jouw-db-host
MYSQL_PORT=3306
MYSQL_USER=jouw-db-user
MYSQL_PASSWORD=jouw-db-wachtwoord
MYSQL_DATABASE=jouw-db-naam
```

## 5. Stripe webhook

Maak in Stripe een webhook endpoint:

```txt
https://jouw-webshop-domein.nl/api/stripe/webhook
```

Activeer event:

```txt
checkout.session.completed
```

## 6. FiveM bridge

Kopieer naar je resources:

```txt
fivem/delfzijlrp_shopbridge
```

Pas `config.lua` aan:

```lua
Config.StoreBaseUrl = 'https://jouw-webshop-domein.nl'
Config.BridgeSecret = 'dezelfde-secret-als-FIVEM_BRIDGE_SECRET'
```

Voeg toe aan `server.cfg`:

```txt
ensure delfzijlrp_shopbridge
```

## 7. Producten aanpassen

Producten staan in:

```txt
lib/products.ts
```

Pas namen, prijzen en commands aan naar jouw server.

## 8. Testen

Test altijd eerst met Stripe testmodus.

Controleer:

- betaling lukt;
- order verschijnt in MySQL;
- FiveM bridge ziet order;
- command wordt uitgevoerd;
- orderstatus wordt `delivered`.

## 9. Support tip

Stuur bij problemen deze info mee:

- Vercel error logs;
- Stripe webhook logs;
- FiveM console log;
- screenshot van `pending_orders` in MySQL.
