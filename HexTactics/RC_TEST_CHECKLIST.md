# HexTactics Store Bridge Pro - Release Candidate Test Checklist

Gebruik deze checklist vóórdat versie 1.0 wordt verkocht.

## A. Schone installatie

- [ ] Nieuwe lege map gebruiken
- [ ] Repository opnieuw clonen
- [ ] `.env.example` kopiëren naar `.env.local`
- [ ] Alle environment variables invullen
- [ ] `npm install` uitvoeren
- [ ] `npm run build` uitvoeren zonder errors
- [ ] `npm run dev` starten
- [ ] Homepage opent zonder errors

## B. Database

- [ ] Nieuwe lege MySQL/MariaDB database maken
- [ ] `mysql/schema.sql` importeren via HeidiSQL
- [ ] `pending_orders` tabel bestaat
- [ ] Webshop databasegebruiker heeft alleen SELECT, INSERT en UPDATE
- [ ] Verkeerde databasegegevens geven een duidelijke Vercel foutlog

## C. Stripe testmodus

- [ ] `STRIPE_SECRET_KEY` gebruikt een test key
- [ ] Stripe webhook endpoint is aangemaakt
- [ ] `checkout.session.completed` is geselecteerd
- [ ] iDEAL testcheckout opent
- [ ] Card testcheckout opent
- [ ] Geslaagde betaling maakt exact één order
- [ ] Dubbele webhook maakt geen dubbele order
- [ ] Niet-betaalde sessie wordt niet geleverd
- [ ] Geannuleerde checkout maakt geen pending order

## D. FiveM bridge

- [ ] Resource staat in de resources-map
- [ ] `Config.StoreBaseUrl` klopt
- [ ] `Config.BridgeSecret` komt overeen met Vercel
- [ ] Resource start zonder errors
- [ ] Pending order wordt opgehaald
- [ ] Toegestaan command wordt uitgevoerd
- [ ] Order verandert naar `delivered`
- [ ] Geblokkeerd command verandert naar `failed`
- [ ] `delivery_error` bevat een bruikbare foutmelding
- [ ] Server hoeft geen extra inkomende poort te openen

## E. Admin dashboard

- [ ] `ADMIN_PASSWORD` staat in Vercel
- [ ] `/admin` stuurt niet-ingelogde bezoekers naar `/admin/login`
- [ ] Verkeerd wachtwoord wordt geweigerd
- [ ] Correct wachtwoord opent dashboard
- [ ] Pending, delivered en failed aantallen kloppen
- [ ] Statusfilters werken
- [ ] Retry zet failed/delivered terug naar pending
- [ ] Handmatig delivered markeren werkt
- [ ] Handmatig failed markeren werkt
- [ ] Uitloggen verwijdert admin session
- [ ] Admin cookie is HttpOnly
- [ ] Admin cookie gebruikt Secure in productie

## F. Beveiliging

- [ ] Geen `.env.local` of echte keys in GitHub
- [ ] Sterk `ADMIN_PASSWORD` gebruikt
- [ ] Lange willekeurige `FIVEM_BRIDGE_SECRET` gebruikt
- [ ] Stripe webhook signature verificatie actief
- [ ] FiveM API weigert fout bridge secret
- [ ] Product ID komt uitsluitend uit server-side productconfig
- [ ] FiveM license input wordt gevalideerd
- [ ] Command whitelist blokkeert onbekende commands

## G. UI en gebruik

- [ ] Webshop werkt op mobiel
- [ ] Admin dashboard is bruikbaar op mobiel/tablet
- [ ] Productnamen en prijzen kloppen
- [ ] Success page wordt getoond na betaling
- [ ] Cancel page wordt getoond na annulering
- [ ] Foutmeldingen lekken geen secrets

## H. Documentatie

- [ ] Hoofd-README klopt
- [ ] Installatiehandleiding vanaf nul gevolgd
- [ ] Customer Install Guide klopt
- [ ] Alle environment variables staan beschreven
- [ ] Stripe webhook instructies kloppen
- [ ] FiveM installatie-instructies kloppen
- [ ] Support policy is toegevoegd
- [ ] Licentietekst is gecontroleerd

## I. Release

- [ ] Versienummer ingesteld op `1.0.0-rc.1`
- [ ] Changelog bijgewerkt
- [ ] Screenshots gemaakt
- [ ] Demo video gemaakt
- [ ] Demo installatie getest
- [ ] Release ZIP bevat geen secrets
- [ ] Release ZIP bevat geen `node_modules`
- [ ] Eerste proefklant/tester heeft installatie uitgevoerd

## Releasebesluit

Verkoop pas als alle kritieke punten uit A t/m F groen zijn. UI, documentatie en marketing moeten vóór de publieke v1.0 ook volledig afgerond zijn.
