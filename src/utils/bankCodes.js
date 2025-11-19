// Nigerian Bank Codes for Paystack Transfers
// This maps bank names to their Paystack bank codes

const bankCodeMap = {
  // Major Commercial Banks
  'Access Bank': '044',
  'Access Bank Plc': '044',
  'Guaranty Trust Bank': '058',
  'GTBank': '058',
  'Guaranty Trust Bank Plc': '058',
  'First Bank of Nigeria': '011',
  'First Bank': '011',
  'First Bank Plc': '011',
  'United Bank for Africa': '033',
  'UBA': '033',
  'United Bank for Africa Plc': '033',
  'Zenith Bank': '057',
  'Zenith Bank Plc': '057',
  'Ecobank Nigeria': '050',
  'Ecobank': '050',
  'Union Bank of Nigeria': '032',
  'Union Bank': '032',
  'Wema Bank': '035',
  'Wema Bank Plc': '035',
  'Sterling Bank': '232',
  'Sterling Bank Plc': '232',
  'Fidelity Bank': '070',
  'Fidelity Bank Plc': '070',
  'Unity Bank': '215',
  'Unity Bank Plc': '215',
  'Heritage Bank': '030',
  'Heritage Bank Plc': '030',
  'Keystone Bank': '082',
  'Keystone Bank Limited': '082',
  'Standard Chartered Bank': '068',
  'Citibank Nigeria': '023',
  'Citibank': '023',
  'Stanbic IBTC Bank': '221',
  'Stanbic IBTC': '221',
  'Standard Chartered': '068',
  
  // Digital Banks & FinTech
  'Kuda Bank': '090',
  'Kuda': '090',
  'Opay Digital Bank': '999',
  'Opay': '999',
  'PalmPay': '999',
  'Moniepoint Microfinance Bank': '999',
  'Moniepoint': '999',
  'Carbon': '999',
  'ALAT by Wema': '035',
  'Vbank': '999',
  'Sparkle': '999',
  'Mint FinTech': '999',
  'Rubies Microfinance Bank': '999',
  'Fairmoney Microfinance Bank': '999',
  'Page Microfinance Bank': '999',
  'MFBank': '999',
  'Suntrust Bank': '100',
  'Taj Bank': '301',
  'Jaiz Bank': '301',
  'Providus Bank': '101',
  'Parallex Bank': '999',
  'Globus Bank': '999',
  'Optimus Bank': '999',
  'Nova Merchant Bank': '999',
  'Cordros Capital': '999',
  'FSDH Merchant Bank': '999',
  'Rand Merchant Bank': '999',
  'FBNQuest Merchant Bank': '999',
  'Coronation Merchant Bank': '999',
  'Unity Bank Plc': '215',
  
  // Microfinance Banks
  'Accion Microfinance Bank': '999',
  'Accion MFB': '999',
  'Ammex Microfinance Bank': '999',
  'Bainescredit Microfinance Bank': '999',
  'Bowen Microfinance Bank': '999',
  'Covenant Microfinance Bank': '999',
  'Credit Direct Limited': '999',
  'Ecobank Microfinance': '999',
  'Ekondo Microfinance Bank': '999',
  'Eyowo': '999',
  'Fidelity Microfinance Bank': '999',
  'Finca Microfinance Bank': '999',
  'Fullrange Microfinance Bank': '999',
  'Gtco Microfinance Bank': '999',
  'Hasal Microfinance Bank': '999',
  'Ikeja Microfinance Bank': '999',
  'Infinity Microfinance Bank': '999',
  'Kredi Money Microfinance Bank': '999',
  'Lagos Building Investment Company': '999',
  'Lapo Microfinance Bank': '999',
  'Mainstreet Microfinance Bank': '999',
  'Mambu Microfinance Bank': '999',
  'Mutual Benefits Assurance Plc': '999',
  'NPF Microfinance Bank': '999',
  'Olash Microfinance Bank': '999',
  'Pagatech Microfinance Bank': '999',
  'Pearl Microfinance Bank': '999',
  'Platinum Microfinance Bank': '999',
  'Rimini Microfinance Bank': '999',
  'Solid Allianze Microfinance Bank': '999',
  'Sunrise Microfinance Bank': '999',
  'Trustbond Microfinance Bank': '999',
  'U & C Microfinance Bank': '999',
  'Unipro Microfinance Bank': '999',
  'Virtus Microfinance Bank': '999',
  'Wag Microfinance Bank': '999',
  'XtraCredit Microfinance Bank': '999',
  'Yield Microfinance Bank': '999',
  'Zedvance Microfinance Bank': '999',
  
  // Islamic Banks
  'Jaiz Bank': '301',
  'Jaiz Bank Plc': '301',
  'Taj Bank': '301',
  'Taj Bank Limited': '301',
  
  // Investment Banks
  'Apex Bank': '999',
  'BancABC': '999',
  'BGL': '999',
  'BIA Capital': '999',
  'Capital Alliance': '999',
  'Citi Investment': '999',
  'Dangote Capital': '999',
  'Ecobank Investment': '999',
  'FBN Capital': '999',
  'FCMB Capital': '999',
  'First Ally': '999',
  'FSDH Merchant': '999',
  'Greenwich Merchant': '999',
  'Investment One': '999',
  'Meristem Capital': '999',
  'Nigerian Capital': '999',
  'Polaris Capital': '999',
  'Rand Merchant': '999',
  'Renaissance Capital': '999',
  'Sigma Capital': '999',
  'Standard Chartered Capital': '999',
  'Union Capital': '999',
  'Ventures Capital': '999',
  'Zenith Capital': '999',
  
  // Mortgage Banks
  'Abbey Mortgage Bank': '999',
  'AG Mortgage Bank': '999',
  'Bridgeway Mortgage Bank': '999',
  'Cooperative Mortgage Bank': '999',
  'Delta Trust Mortgage Bank': '999',
  'EIB Mortgage Bank': '999',
  'Federal Mortgage Bank': '999',
  'First Mortgage Bank': '999',
  'Gateway Mortgage Bank': '999',
  'Gold Mortgage Bank': '999',
  'HAH Mortgage Bank': '999',
  'Homebase Mortgage Bank': '999',
  'Imperial Homes Mortgage Bank': '999',
  'Infinity Trust Mortgage Bank': '999',
  'Jubilee Life Mortgage Bank': '999',
  'Kaduna State Mortgage Bank': '999',
  'LAG Staff Mortgage Bank': '999',
  'Lagos State Mortgage Bank': '999',
  'Livingtrust Mortgage Bank': '999',
  'Nigerian Reinsurance Corporation': '999',
  'NPHC Mortgage Bank': '999',
  'Ogun State Mortgage Bank': '999',
  'Paragon Mortgage Bank': '999',
  'Plaza Mortgage Bank': '999',
  'Refuge Mortgage Bank': '999',
  'SafeTrust Mortgage Bank': '999',
  'State Mortgage Bank': '999',
  'Trustbond Mortgage Bank': '999',
  'UHF Mortgage Bank': '999',
  'Union Homes Mortgage Bank': '999',
  'Universal Mortgage Bank': '999',
  'WAPIC Mortgage Bank': '999',
  'Yobe State Mortgage Bank': '999'
};

// Function to get bank code by name (case-insensitive)
function getBankCode(bankName) {
  if (!bankName || typeof bankName !== 'string') {
    return null;
  }
  
  // Try exact match first
  const exactMatch = bankCodeMap[bankName];
  if (exactMatch) return exactMatch;
  
  // Try case-insensitive match
  const lowerBankName = bankName.toLowerCase().trim();
  for (const [name, code] of Object.entries(bankCodeMap)) {
    if (name.toLowerCase() === lowerBankName) {
      return code;
    }
  }
  
  // Try partial match
  for (const [name, code] of Object.entries(bankCodeMap)) {
    if (name.toLowerCase().includes(lowerBankName) || 
        lowerBankName.includes(name.toLowerCase())) {
      return code;
    }
  }
  
  return null;
}

// Function to get all bank names
function getAllBankNames() {
  return Object.keys(bankCodeMap).sort();
}

// Function to validate bank code
function isValidBankCode(code) {
  return Object.values(bankCodeMap).includes(code);
}

module.exports = {
  bankCodeMap,
  getBankCode,
  getAllBankNames,
  isValidBankCode
};
