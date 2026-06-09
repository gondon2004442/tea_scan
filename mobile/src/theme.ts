/** Figma frame: 390×844 — values in design pixels */
export const DESIGN = {
  width: 390,
  height: 844,
} as const;

export const colors = {
  textPrimary: '#180036',
  textBlack: '#000000',
  white: '#FFFFFF',
  loginGradientStart: '#C5FFCE',
  myTeasGradientStart: '#DCE49C',
  loginButtonBg: 'rgba(217, 217, 217, 0.2)',
  loginButtonBorder: 'rgba(255, 255, 255, 0.55)',
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

export const fontFamily = {
  kapakana: 'Kapakana',
  manrope: 'Manrope, system-ui, sans-serif',
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
    fontFamily: fontFamily.manrope,
    fontSize: 17,
    lineHeight: 28,
    letterSpacing: 0,
    color: colors.textPrimary,
  },
  filterChip: {
    fontFamily: fontFamily.manrope,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0,
    color: colors.textPrimary,
  },
  modalTitle: {
    fontFamily: fontFamily.manrope,
    fontSize: 44,
    lineHeight: 50,
    letterSpacing: 0,
    color: colors.textBlack,
  },
  modalBody: {
    fontFamily: fontFamily.manrope,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: 0,
    color: colors.textBlack,
  },
  safariUrl: {
    fontFamily: fontFamily.manrope,
    fontSize: 17,
    lineHeight: 22,
    color: '#1B1B1B',
  },
  loginHello: {
    fontFamily: fontFamily.kapakana,
    fontSize: 80,
    lineHeight: 80,
    color: colors.textBlack,
  },
  loginSubtitle: {
    fontFamily: fontFamily.manrope,
    fontSize: 20,
    lineHeight: 20,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  firstOpenTitle: {
    fontFamily: fontFamily.manrope,
    fontSize: 40,
    lineHeight: 40,
    color: colors.textBlack,
  },
} as const;

export const layout = {
  statusBarHeight: 62,
  headerIconTop: 12,
  firstOpenSmileTop: 74,
  headerIconLeft: 24,
  headerIconSize: 24,
  tabToggleTop: 61,
  tabToggleWidth: 112,
  tabToggleHeight: 48,
  tabItemWidth: 56,
  myTeasListTop: 111,
  exploreFiltersTop: 120,
  exploreFiltersTopExploreOnly: 120,
  exploreGridGapBelowFilters: 20,
  exploreOnlyChromeHeight: 111,
  exploreGridTop: 189,
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
  exploreOnlyToggleLeft: 163,
  exploreOnlyToggleTop: 61,
  exploreOnlyToggleWidth: 65,
  exploreOnlyToggleHeight: 50,
  firstOpenEmptyTop: 221,
  loginHelloTop: 212,
  loginSubtitleGap: 16,
  loginSubtitleTop: 254,
  loginGoogleButtonTop: 628,
  loginGoogleButtonLeft: 35,
  loginGoogleButtonWidth: 320,
  loginGoogleButtonHeight: 109,
} as const;
