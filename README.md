# Delfzijl RP Store

Eigen webshop voor `webshop.delfzijlrp.nl` met Stripe iDEAL/card en een FiveM delivery bridge zonder extra inkomende poorten.

## Architectuur

```txt
Vercel Next.js webshop
  -> Stripe Checkout
  -> Stripe webhook
  -> Supabase pending_orders queue
  -> FiveM resource pollt uitgaand naar Vercel
  -> server voert veilige delivery uit
```

Je FiveM-server hoeft dus geen poort open te zetten. De server maakt zelf een uitgaande HTTPS request naar de webshop API.

## Belangrijk over FiveM monetization

Verkoop geen direct pay-to-win geld, zwart geld of wapens voor echt geld. Gebruik deze store voor ranks, cosmetics, priority queue, donateurvoordelen en niet-pay-to-win perks. Pas producten alleen aan als ze voldoen aan de Cfx/FiveM regels.

## Mappen

- `app/` - Next.js/Vercel webshop + API routes
- `lib/` - producten en Supabase helpers
- `supabase/schema.sql` - database tabellen
- `fivem/delfzijlrp_shopbridge/` - FiveM resource

## Benodigd

- Vercel project
- Stripe account met iDEAL/card
- Supabase project
- FiveM ESX/QB server

## Environment variables op Vercel

```env
NEXT_PUBLIC_SITE_URL=https://webshop.delfzijlrp.nl
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxx
FIVEM_BRIDGE_SECRET=maak-een-lange-random-secret
```

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

## Supabase

Run `supabase/schema.sql` in Supabase SQL editor.

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
