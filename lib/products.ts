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
];

export function getProduct(productId: string) {
  return products.find((product) => product.id === productId);
}
