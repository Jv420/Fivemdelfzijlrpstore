export type StoreProduct = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  deliveryType: 'rank' | 'vehicle_cosmetic' | 'discord_role' | 'priority';
  command: string;
};

export const products: StoreProduct[] = [
  {
    id: 'vip_30d',
    name: 'VIP Rank - 30 dagen',
    description: 'Supporter rank met Discord role, priority queue en cosmetische voordelen.',
    priceCents: 499,
    deliveryType: 'rank',
    command: 'add_principal identifier.license:{license} group.vip',
  },
  {
    id: 'elite_30d',
    name: 'Elite Rank - 30 dagen',
    description: 'Elite supporter rank met extra cosmetische voordelen en priority queue.',
    priceCents: 999,
    deliveryType: 'rank',
    command: 'add_principal identifier.license:{license} group.elite',
  },
  {
    id: 'legend_30d',
    name: 'Legend Rank - 30 dagen',
    description: 'Hoogste supporter rank met maximale cosmetische supporter voordelen.',
    priceCents: 1499,
    deliveryType: 'rank',
    command: 'add_principal identifier.license:{license} group.legend',
  },
  {
    id: 'custom_plate',
    name: 'Custom kenteken aanvraag',
    description: 'Aanvraag voor een custom kenteken. Staff keurt ongepaste teksten af.',
    priceCents: 299,
    deliveryType: 'vehicle_cosmetic',
    command: 'delfzijl_customplate {license}',
  },
  {
    id: 'priority_queue',
    name: 'Priority Queue - 30 dagen',
    description: 'Supporter priority queue zonder gameplay voordeel.',
    priceCents: 399,
    deliveryType: 'priority',
    command: 'add_principal identifier.license:{license} group.priority',
  },
  {
    id: 'donateur_garage_30d',
    name: 'Donateur garage toegang - 30 dagen',
    description: 'Toegang tot een speciale garage met cosmetische/community voertuigen. Geen geldwaarde of pay-to-win voordeel.',
    priceCents: 699,
    deliveryType: 'vehicle_cosmetic',
    command: 'add_principal identifier.license:{license} group.donateurgarage',
  },
  {
    id: 'cosmetic_vehicle_skin',
    name: 'Cosmetic vehicle skin aanvraag',
    description: 'Aanvraag voor een niet-pay-to-win voertuigskin/livery. Staff keurt ongepaste of oneerlijke aanvragen af.',
    priceCents: 799,
    deliveryType: 'vehicle_cosmetic',
    command: 'delfzijl_vehiclecosmetic {license}',
  },
  {
    id: 'showroom_slot',
    name: 'Showroom showcase slot',
    description: 'Laat jouw voertuig tijdelijk in een supporter showroom tonen. Alleen cosmetisch/display.',
    priceCents: 499,
    deliveryType: 'vehicle_cosmetic',
    command: 'delfzijl_showroomslot {license}',
  },
];

export function getProduct(productId: string) {
  return products.find((product) => product.id === productId);
}
