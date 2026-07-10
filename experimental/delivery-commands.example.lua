-- Experimental voorbeeldcommands
-- Deze file wordt standaard NIET geladen door fxmanifest.lua.
-- Gebruik dit alleen als klad/voorbeeld en controleer eerst je serverregels/platformregels.

local function isConsoleOrAdmin(source)
  return source == 0 or IsPlayerAceAllowed(source, 'delfzijlrp.admin')
end

RegisterCommand('delfzijl_exp_starterbundle', function(source, args)
  if not isConsoleOrAdmin(source) then return end
  local license = args[1]
  if not license then
    print('Gebruik: delfzijl_exp_starterbundle <license>')
    return
  end

  print(('[experimental] Starterbundle placeholder voor %s'):format(license))
  -- Voeg hier pas echte delivery toe als je zeker weet dat dit binnen jouw regels past.
end, true)

RegisterCommand('delfzijl_exp_vehiclebundle', function(source, args)
  if not isConsoleOrAdmin(source) then return end
  local license = args[1]
  if not license then
    print('Gebruik: delfzijl_exp_vehiclebundle <license>')
    return
  end

  print(('[experimental] Vehiclebundle placeholder voor %s'):format(license))
end, true)

RegisterCommand('delfzijl_exp_economybundle', function(source, args)
  if not isConsoleOrAdmin(source) then return end
  local license = args[1]
  if not license then
    print('Gebruik: delfzijl_exp_economybundle <license>')
    return
  end

  print(('[experimental] Economybundle placeholder voor %s'):format(license))
end, true)
