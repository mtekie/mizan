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
