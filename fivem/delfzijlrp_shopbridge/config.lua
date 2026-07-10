Config = {}

Config.StoreBaseUrl = 'https://webshop.delfzijlrp.nl'
Config.BridgeSecret = 'CHANGE_ME_TO_THE_SAME_VALUE_AS_FIVEM_BRIDGE_SECRET'
Config.PollIntervalSeconds = 45

-- Extra veiligheid: alleen commands met deze prefixes worden uitgevoerd.
-- Voeg hier alleen commands toe die je zelf vertrouwt.
Config.AllowedCommandPrefixes = {
  'add_principal ',
  'delfzijl_customplate ',
  'delfzijl_vehiclecosmetic ',
  'delfzijl_showroomslot '
}

Config.Debug = true
