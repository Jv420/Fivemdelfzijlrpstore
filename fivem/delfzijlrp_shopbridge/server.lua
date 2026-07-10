local function log(message)
  if Config.Debug then
    print(('[delfzijlrp_shopbridge] %s'):format(message))
  end
end

local function jsonEncode(data)
  return json.encode(data)
end

local function isAllowedCommand(command)
  if type(command) ~= 'string' or command == '' then
    return false
  end

  for _, prefix in ipairs(Config.AllowedCommandPrefixes) do
    if command:sub(1, #prefix) == prefix then
      return true
    end
  end

  return false
end

local function confirmOrder(orderId, ok, errorMessage)
  local url = Config.StoreBaseUrl .. '/api/fivem/confirm'
  local payload = jsonEncode({ id = orderId, ok = ok, error = errorMessage })

  PerformHttpRequest(url, function(statusCode, body)
    log(('confirm status=%s body=%s'):format(statusCode, body or ''))
  end, 'POST', payload, {
    ['Content-Type'] = 'application/json',
    ['x-fivem-secret'] = Config.BridgeSecret
  })
end

local function findPlayerByExactName(playerName)
  if type(playerName) ~= 'string' or playerName == '' then
    return nil, 'Spelernaam ontbreekt'
  end

  local wanted = string.lower(playerName)
  local matches = {}

  for _, playerId in ipairs(GetPlayers()) do
    local currentName = GetPlayerName(playerId)
    if currentName and string.lower(currentName) == wanted then
      matches[#matches + 1] = playerId
    end
  end

  if #matches == 0 then
    return nil, ('Speler "%s" is niet online of de naam komt niet exact overeen'):format(playerName)
  end

  if #matches > 1 then
    return nil, ('Meerdere online spelers gebruiken de naam "%s"'):format(playerName)
  end

  return matches[1], nil
end

local function getLicenseIdentifier(playerId)
  for _, identifier in ipairs(GetPlayerIdentifiers(playerId)) do
    if identifier:sub(1, 8) == 'license:' then
      return identifier:sub(9)
    end
  end

  return nil
end

local function escapeCommandValue(value)
  return tostring(value or ''):gsub('[\r\n;]', '')
end

local function deliverOrder(order)
  local playerId, findError = findPlayerByExactName(order.player_name)
  if not playerId then
    confirmOrder(order.id, false, findError)
    log(('delivery failed for order %s: %s'):format(order.id, findError))
    return
  end

  local license = getLicenseIdentifier(playerId)
  if not license then
    local errorMessage = 'Geen FiveM license identifier gevonden voor online speler'
    confirmOrder(order.id, false, errorMessage)
    log(('delivery failed for order %s: %s'):format(order.id, errorMessage))
    return
  end

  local command = tostring(order.delivery_command or '')
  command = command:gsub('{license}', escapeCommandValue(license))
  command = command:gsub('{playerId}', escapeCommandValue(playerId))
  command = command:gsub('{playerName}', escapeCommandValue(GetPlayerName(playerId)))

  if command:find('{[%w_]+}') then
    confirmOrder(order.id, false, 'Delivery command bevat een onbekende placeholder')
    log(('blocked unresolved placeholder for order %s'):format(order.id))
    return
  end

  if not isAllowedCommand(command) then
    confirmOrder(order.id, false, 'Command blocked by AllowedCommandPrefixes')
    log(('blocked unsafe command for order %s'):format(order.id))
    return
  end

  log(('executing delivery for %s / %s'):format(order.player_name or 'unknown', order.product_name or 'unknown'))
  ExecuteCommand(command)
  confirmOrder(order.id, true, nil)
end

local function fetchPendingOrders()
  local url = Config.StoreBaseUrl .. '/api/fivem/pending'

  PerformHttpRequest(url, function(statusCode, body)
    if statusCode ~= 200 then
      log(('pending request failed status=%s body=%s'):format(statusCode, body or ''))
      return
    end

    local decoded = json.decode(body or '{}')
    local orders = decoded.orders or {}

    if #orders > 0 then
      log(('found %s pending order(s)'):format(#orders))
    end

    for _, order in ipairs(orders) do
      deliverOrder(order)
      Wait(500)
    end
  end, 'GET', '', {
    ['x-fivem-secret'] = Config.BridgeSecret
  })
end

CreateThread(function()
  log('started')

  while true do
    fetchPendingOrders()
    Wait((Config.PollIntervalSeconds or 45) * 1000)
  end
end)
