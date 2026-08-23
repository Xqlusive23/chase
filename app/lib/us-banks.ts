export type UsBank = {
  id: string;
  name: string;
  routingNumber: string;
  kind: "bank" | "prepaid";
  domain: string;
};

export const US_BANKS: UsBank[] = [
  { id: "boa", name: "Bank of America", routingNumber: "026009593", kind: "bank", domain: "bankofamerica.com" },
  { id: "wells", name: "Wells Fargo", routingNumber: "121000248", kind: "bank", domain: "wellsfargo.com" },
  { id: "citi", name: "Citibank", routingNumber: "021000089", kind: "bank", domain: "citi.com" },
  { id: "usbank", name: "U.S. Bank", routingNumber: "091000022", kind: "bank", domain: "usbank.com" },
  { id: "pnc", name: "PNC Bank", routingNumber: "043000096", kind: "bank", domain: "pnc.com" },
  { id: "capone", name: "Capital One", routingNumber: "051405515", kind: "bank", domain: "capitalone.com" },
  { id: "td", name: "TD Bank", routingNumber: "031101266", kind: "bank", domain: "tdbank.com" },
  { id: "truist", name: "Truist", routingNumber: "061000104", kind: "bank", domain: "truist.com" },
  { id: "ally", name: "Ally Bank", routingNumber: "124003116", kind: "bank", domain: "ally.com" },
  { id: "usaa", name: "USAA", routingNumber: "314074269", kind: "bank", domain: "usaa.com" },
  { id: "navy", name: "Navy Federal Credit Union", routingNumber: "256074974", kind: "bank", domain: "navyfederal.org" },
  { id: "amex", name: "American Express National Bank", routingNumber: "124303065", kind: "bank", domain: "americanexpress.com" },
  { id: "discover", name: "Discover Bank", routingNumber: "031100649", kind: "bank", domain: "discover.com" },
  { id: "marcus", name: "Marcus by Goldman Sachs", routingNumber: "124014729", kind: "bank", domain: "marcus.com" },
  { id: "schwab", name: "Charles Schwab Bank", routingNumber: "121202211", kind: "bank", domain: "schwab.com" },
  { id: "fidelity", name: "Fidelity", routingNumber: "101205681", kind: "bank", domain: "fidelity.com" },
  { id: "regions", name: "Regions Bank", routingNumber: "062000019", kind: "bank", domain: "regions.com" },
  { id: "fifth", name: "Fifth Third Bank", routingNumber: "042000314", kind: "bank", domain: "53.com" },
  { id: "citizens", name: "Citizens Bank", routingNumber: "011500120", kind: "bank", domain: "citizensbank.com" },
  { id: "keybank", name: "KeyBank", routingNumber: "041001039", kind: "bank", domain: "key.com" },
  { id: "huntington", name: "Huntington Bank", routingNumber: "044000024", kind: "bank", domain: "huntington.com" },
  { id: "bmo", name: "BMO Bank", routingNumber: "071000288", kind: "bank", domain: "bmo.com" },
  { id: "santander", name: "Santander Bank", routingNumber: "231372691", kind: "bank", domain: "santanderbank.com" },
  { id: "hsbc", name: "HSBC Bank USA", routingNumber: "022000020", kind: "bank", domain: "us.hsbc.com" },
  { id: "chase", name: "Chase", routingNumber: "021000021", kind: "bank", domain: "chase.com" },
  { id: "sofi", name: "SoFi", routingNumber: "121122676", kind: "prepaid", domain: "sofi.com" },
  { id: "chime", name: "Chime", routingNumber: "103100195", kind: "prepaid", domain: "chime.com" },
  { id: "varo", name: "Varo Bank", routingNumber: "124303201", kind: "prepaid", domain: "varomoney.com" },
  { id: "cashapp", name: "Cash App", routingNumber: "073972181", kind: "prepaid", domain: "cash.app" },
  { id: "venmo", name: "Venmo", routingNumber: "031101279", kind: "prepaid", domain: "venmo.com" },
  { id: "paypal", name: "PayPal", routingNumber: "031101279", kind: "prepaid", domain: "paypal.com" },
  { id: "current", name: "Current", routingNumber: "124303120", kind: "prepaid", domain: "current.com" },
  { id: "greendot", name: "Green Dot", routingNumber: "124303120", kind: "prepaid", domain: "greendot.com" },
  { id: "go2bank", name: "Go2bank", routingNumber: "124303120", kind: "prepaid", domain: "go2bank.com" },
  { id: "netspend", name: "Netspend", routingNumber: "124303120", kind: "prepaid", domain: "netspend.com" },
  { id: "applecash", name: "Apple Cash", routingNumber: "124303120", kind: "prepaid", domain: "apple.com" },
  { id: "wise", name: "Wise", routingNumber: "084009519", kind: "prepaid", domain: "wise.com" },
];

export function findUsBank(idOrName: string) {
  const needle = idOrName.trim().toLowerCase();
  return US_BANKS.find((bank) => bank.id === needle || bank.name.toLowerCase() === needle);
}

export function bankLogoUrl(name?: string) {
  const bank = name ? findUsBank(name) : undefined;
  const domain = bank?.domain || "federalreserve.gov";
  return `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;
}

export function bankLogoSources(name?: string) {
  const bank = name ? findUsBank(name) : undefined;
  const domain = bank?.domain || "federalreserve.gov";
  return [
    `https://logo.clearbit.com/${domain}`,
    `https://www.google.com/s2/favicons?sz=128&domain=${domain}`,
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
  ];
}
