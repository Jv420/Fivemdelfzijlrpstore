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

local function deliverOrder(order)
  local command = order.delivery_command

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
