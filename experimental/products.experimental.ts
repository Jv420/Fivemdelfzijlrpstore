export type ExperimentalProduct = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  enabled: false;
  riskLevel: 'experimental';
  notes: string;
  exampleCommand: string;
};

// LET OP:
// Deze producten zijn standaard NIET actief en worden niet geladen door de webshop.
// Ze staan alleen in deze aparte map als voorbereiding/klad.
export const experimentalProducts: ExperimentalProduct[] = [
  {
    id: 'starter_bundle_rp_disabled',
    name: 'Starterbundel RP - Disabled',
    description: 'Concept: starterpakket met RP-items. Standaard uitgeschakeld en niet gekoppeld aan Stripe.',
    priceCents: 50,
    enabled: false,
    riskLevel: 'experimental',
    notes: 'Controleer eerst actuele FiveM/Cfx regels voordat je dit ooit activeert.',
    exampleCommand: 'delfzijl_exp_starterbundle {license}',
  },
  {
    id: 'vehicle_bundle_rp_disabled',
    name: 'Voertuigbundel RP - Disabled',
    description: 'Concept: voertuigstarter voor RP. Standaard uitgeschakeld en niet gekoppeld aan Stripe.',
    priceCents: 50,
    enabled: false,
    riskLevel: 'experimental',
    notes: 'Gebruik liever cosmetische garage/skin producten uit de hoofdshop.',
    exampleCommand: 'delfzijl_exp_vehiclebundle {license}',
  },
  {
    id: 'economy_bundle_rp_disabled',
    name: 'Economy bundel RP - Disabled',
    description: 'Concept: economy starter. Standaard uitgeschakeld en niet gekoppeld aan Stripe.',
    priceCents: 50,
    enabled: false,
    riskLevel: 'experimental',
    notes: 'Niet gebruiken als betaalde webshop-delivery zonder eigen juridische/platformcontrole.',
    exampleCommand: 'delfzijl_exp_economybundle {license}',
  },
];
