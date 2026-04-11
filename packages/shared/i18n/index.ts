import { I18n } from 'i18n-js';

const en = {
  dashboard: {
    greeting: "Good morning 👋",
    netWorth: "Total Net Worth",
    recentTx: "Recent Transactions",
    noTx: "No transactions yet",
    insight: "Insight"
  },
  actions: {
    add: "Add Money",
    send: "Send",
    pay: "Pay Bill",
    more: "More"
  },
  tabs: {
    home: "Home",
    ledger: "Ledger",
    catalogue: "Catalogue",
    profile: "Profile"
  }
};

const am = {
  dashboard: {
    greeting: "እንደምን አደሩ 👋",
    netWorth: "ጠቅላላ ሀብት",
    recentTx: "የቅርብ ጊዜ ግብይቶች",
    noTx: "ምንም ግብይቶች የሉም",
    insight: "ማስተዋል"
  },
  actions: {
    add: "ገንዘብ አስገባ",
    send: "ላክ",
    pay: "ክፍያ ፈጽም",
    more: "ተጨማሪ"
  },
  tabs: {
    home: "ዋና",
    ledger: "መዝገብ",
    catalogue: "ካታሎግ",
    profile: "ፕሮፋይል"
  }
};

export const i18n = new I18n({ en, am });

// Default settings
i18n.defaultLocale = 'en';
i18n.locale = 'en'; // To be overridden by user preferences
i18n.enableFallback = true;
