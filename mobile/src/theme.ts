/** Figma frame: 390×844 — values in design pixels */
export const DESIGN = {
  width: 390,
  height: 844,
} as const;

export const colors = {
  textPrimary: '#180036',
  textBlack: '#000000',
  white: '#FFFFFF',
  myTeasGradientStart: '#DCE49C',
  exploreGradientStart: '#9CAAE4',
  exploreGradientEnd: '#F5EEFF',
  modalCard: '#FDFCFD',
  modalBackdrop: '#2A2A2A',
  steepingRing: '#E7EDBD',
  safariBarBg: 'rgba(250, 250, 250, 0.7)',
  safariSearchBg: 'rgba(0, 0, 0, 0.04)',
  filterBorder: 'rgba(0, 0, 0, 0.2)',
  toggleActive: '#000000',
} as const;

export const timePalettes = {
  my: {
    morning: ['#DCE49C', '#FFFFFF'] as const,
    afternoon: ['#DCE49C', '#FFFFFF'] as const,
    evening: ['#DCE49C', '#FFFFFF'] as const,
  },
  explore: {
    morning: ['#DCE49C', '#FFFFFF'] as const,
    afternoon: ['#9CAAE4', '#F5EEFF'] as const,
    evening: ['#9CAAE4', '#F5EEFF'] as const,
  },
} as const;

export const typography = {
  teaName: {
    fontFamily: 'Manrope, system-ui, sans-serif',
    fontSize: 17,
    lineHeight: 28,
    letterSpacing: 0,
    color: colors.textPrimary,
  },
  filterChip: {
    fontFamily: 'Manrope, system-ui, sans-serif',
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0,
    color: colors.textPrimary,
  },
  modalTitle: {
    fontFamily: 'Manrope, system-ui, sans-serif',
    fontSize: 44,
    lineHeight: 50,
    letterSpacing: 0,
    color: colors.textBlack,
  },
  modalBody: {
    fontFamily: 'Manrope, system-ui, sans-serif',
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: 0,
    color: colors.textBlack,
  },
  safariUrl: {
    fontFamily: 'Manrope, system-ui, sans-serif',
    fontSize: 17,
    lineHeight: 22,
    color: '#1B1B1B',
  },
} as const;

export const layout = {
  statusBarHeight: 62,
  headerIconTop: 74,
  headerIconLeft: 24,
  headerIconSize: 24,
  tabToggleTop: 62,
  tabToggleWidth: 112,
  tabToggleHeight: 48,
  tabItemWidth: 56,
  myTeasListTop: 134,
  exploreFiltersTop: 126,
  exploreGridTop: 251,
  exploreGridLeft: 25,
  gridGap: 20,
  cardImageMyTeas: 206,
  cardImageExplore: 160,
  cardLabelGap: 16,
  listItemGap: 24,
  labelIconGap: 10,
  timeIconSize: 20,
  safariBottom: 28,
  safariWidth: 334,
  safariHeight: 114,
  screenRadius: 30,
} as const;
