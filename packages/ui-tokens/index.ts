export const MizanColors = {
  // Mint Mode (Simple) - Primary Palette
  mintPrimary: '#45BFA0',
  mintDark: '#2D9E82',
  mintDeep: '#1A7A64',
  mintLight: '#7DD4BE',
  mintBg: '#F0FAF7',
  mintSurface: '#FFFFFF',
  
  // Accents
  mintCoral: '#E8734A',
  mintGold: '#F5A623',
  mintPastelGreen: '#D4EDDA',
  mintPastelPurple: '#E8DFEE',
  
  // Text & Borders
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  textOnMint: '#FFFFFF',
  borderLight: '#E2E8F0',
  borderMuted: '#F1F5F9',
};

export const MizanSpacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const MizanRadii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const generateMizanCssVars = () => {
  return `
    :root {
      --color-mint-primary: ${MizanColors.mintPrimary};
      --color-mint-dark: ${MizanColors.mintDark};
      --color-mint-deep: ${MizanColors.mintDeep};
      --color-mint-light: ${MizanColors.mintLight};
      --color-mint-bg: ${MizanColors.mintBg};
      --color-mint-surface: ${MizanColors.mintSurface};
      --color-mint-coral: ${MizanColors.mintCoral};
      --color-mint-gold: ${MizanColors.mintGold};
      --color-mint-pastel-green: ${MizanColors.mintPastelGreen};
      --color-mint-pastel-purple: ${MizanColors.mintPastelPurple};
      
      --color-text-primary: ${MizanColors.textPrimary};
      --color-text-secondary: ${MizanColors.textSecondary};
      --color-text-muted: ${MizanColors.textMuted};
      --color-text-on-mint: ${MizanColors.textOnMint};
      
      --color-border-light: ${MizanColors.borderLight};
      --color-border-muted: ${MizanColors.borderMuted};
    }
  `;
};

export const MizanTypography = {
  fontFamily: {
    sans: 'Inter',
    ethiopic: 'NotoSansEthiopic',
  },
  sizes: {
    hero: 34,
    title: 20,
    body: 15,
    caption: 12,
    micro: 10,
  },
};

// ═══════════════════════════════════════════
//  COMPONENT TOKENS — Visual Specifications
//
//  Both web (CSS) and mobile (StyleSheet)
//  MUST reference these for parity.
// ═══════════════════════════════════════════

export const MizanComponentTokens = {
  /** Stat cards: Total Balance, Monthly In, etc. */
  statCard: {
    labelSize: 10,
    labelWeight: '700' as const,
    labelLetterSpacing: 0.8,
    labelTransform: 'uppercase' as const,
    valueSize: 24,
    valueWeight: '900' as const,
    padding: 16,
    gap: 12,
    borderRadius: MizanRadii.lg,
  },

  /** Account tiles (colored cards in horizontal scroll) */
  accountTile: {
    width: 160,
    height: 100,
    borderRadius: MizanRadii.lg,
    nameSize: 13,
    nameWeight: '700' as const,
    balanceSize: 18,
    balanceWeight: '900' as const,
    typeSize: 10,
    typeWeight: '700' as const,
    typeTransform: 'uppercase' as const,
    iconSize: 20,
  },

  /** Transaction rows */
  transactionRow: {
    height: 56,
    iconSize: 36,
    iconRadius: 10,
    titleSize: 14,
    titleWeight: '700' as const,
    subtitleSize: 11,
    subtitleWeight: '400' as const,
    amountSize: 14,
    amountWeight: '700' as const,
    borderColor: '#F1F5F9',
  },

  /** Section headers: "MY ACCOUNTS", "RECENT ACTIVITY" */
  sectionHeader: {
    titleSize: 12,
    titleWeight: '700' as const,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
    marginBottom: 12,
  },

  /** Progress bars: budget, goals */
  progressBar: {
    height: 6,
    borderRadius: 3,
    trackColor: '#F1F5F9',
    dangerThreshold: 90,
  },

  /** Insight / info cards */
  insightCard: {
    bgColor: '#F0FDF4',
    borderColor: '#BBF7D0',
    iconSize: 32,
    iconRadius: 16,
    titleSize: 13,
    titleWeight: '700' as const,
    bodySize: 12,
    bodyLineHeight: 18,
  },

  /** Mizan Score card */
  scoreCard: {
    iconSize: 44,
    iconRadius: 14,
    titleSize: 15,
    titleWeight: '700' as const,
    subtitleSize: 12,
    scoreSize: 28,
    scoreWeight: '900' as const,
    labelSize: 10,
    labelWeight: '700' as const,
  },

  /** Quick action buttons */
  actionRow: {
    iconSize: 40,
    iconRadius: 12,
    labelSize: 11,
    labelWeight: '700' as const,
    gap: 12,
    padding: 12,
  },

  /** Profile header */
  profileHeader: {
    avatarSize: 64,
    nameSize: 22,
    nameWeight: '900' as const,
    emailSize: 13,
    emailWeight: '400' as const,
    buttonPaddingH: 24,
    buttonPaddingV: 12,
    buttonRadius: 16,
    buttonTextSize: 13,
    buttonTextWeight: '700' as const,
  },

  /** Verification card */
  verificationCard: {
    bgColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    iconBgColor: '#D1FAE5',
    iconSize: 44,
    iconRadius: 14,
    titleSize: 15,
    subtitleSize: 12,
  },

  /** Security dark card */
  securityCard: {
    bgColor: '#0F172A',
    iconBgColor: 'rgba(255,255,255,0.12)',
    iconSize: 40,
    iconRadius: 12,
    titleSize: 15,
    titleColor: '#FFFFFF',
    subtitleSize: 12,
    subtitleColor: '#94A3B8',
  },

  /** Link list rows (Settings menu) */
  linkList: {
    rowHeight: 48,
    iconSize: 20,
    labelSize: 15,
    labelWeight: '600' as const,
    chevronSize: 16,
    dividerInset: 52,
    dividerColor: '#F1F5F9',
  },

  /** Budget card */
  budgetCard: {
    labelSize: 14,
    labelWeight: '700' as const,
    amountSize: 15,
    amountWeight: '700' as const,
    messageSize: 12,
  },

  /** Goal card */
  goalCard: {
    emojiSize: 28,
    emojiContainerSize: 48,
    emojiContainerRadius: 14,
    nameSize: 15,
    nameWeight: '700' as const,
    progressTextSize: 13,
    percentSize: 13,
    percentWeight: '700' as const,
  },

  /** Bill card */
  billCard: {
    iconSize: 36,
    iconRadius: 10,
    titleSize: 14,
    titleWeight: '700' as const,
    dueSize: 12,
    amountSize: 14,
    amountWeight: '700' as const,
  },

  /** Product card (Find tab) */
  productCard: {
    logoSize: 44,
    logoRadius: 12,
    titleSize: 15,
    titleWeight: '700' as const,
    subtitleSize: 12,
    matchBadgeSize: 11,
  },

  /** Search bar */
  searchBar: {
    height: 44,
    borderRadius: 12,
    iconSize: 18,
    textSize: 14,
    bgColor: '#F1F5F9',
  },

  /** Pill strip (category/institution pills) */
  pillStrip: {
    height: 32,
    borderRadius: 16,
    textSize: 12,
    textWeight: '700' as const,
    activeColor: '#45BFA0',
    activeBg: '#45BFA0',
    activeText: '#FFFFFF',
    inactiveColor: '#94A3B8',
    inactiveBg: '#F1F5F9',
    inactiveText: '#64748B',
    gap: 8,
  },

  /** Spending donut chart */
  spendingChart: {
    chartSize: 120,
    centerLabelSize: 10,
    centerValueSize: 18,
    centerValueWeight: '900' as const,
    legendDotSize: 8,
    legendTextSize: 12,
    legendAmountSize: 12,
    legendAmountWeight: '700' as const,
  },

  /** 6-month trend bar chart */
  trendChart: {
    barHeight: 8,
    barRadius: 4,
    monthLabelSize: 12,
    monthLabelWeight: '700' as const,
    amountSize: 11,
  },
};

/** Generate CSS custom properties from component tokens for web usage */
export const generateComponentCssVars = () => {
  const lines: string[] = [];
  for (const [component, tokens] of Object.entries(MizanComponentTokens)) {
    for (const [key, value] of Object.entries(tokens)) {
      const varName = `--cmp-${component}-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      const cssValue = typeof value === 'number' ? `${value}px` : value;
      lines.push(`${varName}: ${cssValue};`);
    }
  }
  return `:root {\n  ${lines.join('\n  ')}\n}`;
};

