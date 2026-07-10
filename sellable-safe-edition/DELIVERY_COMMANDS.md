# Safe Delivery Commands

Deze commands zijn bedoeld als veilige voorbeelden voor ranks en cosmetics.

## Rank delivery

```txt
add_principal identifier.license:{license} group.vip
add_principal identifier.license:{license} group.elite
add_principal identifier.license:{license} group.legend
```

## Priority queue

```txt
add_principal identifier.license:{license} group.priority
```

## Donateur garage

```txt
add_principal identifier.license:{license} group.donateurgarage
```

## Custom scripts

Voor eigen cosmetische scripts kun je server commands maken zoals:

```txt
delfzijl_customplate {license}
delfzijl_vehiclecosmetic {license}
delfzijl_showroomslot {license}
```

Zorg dat deze prefixes ook in `fivem/delfzijlrp_shopbridge/config.lua` staan:

```lua
Config.AllowedCommandPrefixes = {
  'add_principal ',
  'delfzijl_customplate ',
  'delfzijl_vehiclecosmetic ',
  'delfzijl_showroomslot '
}
```

## Niet aanbevolen voor Safe Edition

Gebruik in de verkoopklare editie geen delivery commands voor:

- cash;
- bankgeld;
- zwart geld;
- wapens;
- ammo;
- drugs;
- lockpicks;
- random lootbox rewards.
