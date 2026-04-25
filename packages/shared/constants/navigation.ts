export const appSections = [
  { 
    key: 'home', 
    label: 'Home', 
    webHref: '/', 
    nativeRoute: 'index', 
    icon: 'home' 
  },
  { 
    key: 'money', 
    label: 'Money', 
    webHref: '/ledger', 
    nativeRoute: 'ledger', 
    icon: 'receipt' 
  },
  { 
    key: 'find', 
    label: 'Find', 
    webHref: '/catalogue', 
    nativeRoute: 'catalogue', 
    icon: 'compass' 
  },
  { 
    key: 'goals', 
    label: 'Goals', 
    webHref: '/dreams', 
    nativeRoute: 'goals', 
    icon: 'target' 
  },
  { 
    key: 'me', 
    label: 'Me', 
    webHref: '/profile', 
    nativeRoute: 'profile', 
    icon: 'user' 
  },
] as const;

export const secondarySections = [
  { 
    key: 'score', 
    label: 'Mizan Score', 
    webHref: '/score', 
    nativeRoute: 'score', 
    icon: 'gauge' 
  },
  { 
    key: 'settings', 
    label: 'Settings', 
    webHref: '/settings', 
    nativeRoute: 'settings', 
    icon: 'settings' 
  },
  { 
    key: 'notifications', 
    label: 'Notifications', 
    webHref: '/notifications', 
    nativeRoute: 'notifications', 
    icon: 'bell' 
  },
] as const;

export type AppSectionKey = (typeof appSections)[number]['key'] | (typeof secondarySections)[number]['key'];
