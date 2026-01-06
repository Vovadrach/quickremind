// ====== COLORS ======
export const colors = {
  // Background
  bgPrimary: '#FAFBFC',
  bgSecondary: '#F3F4F6',
  bgElevated: '#FFFFFF',
  bgAccent: '#EFF6FF',
  bgOverlay: 'rgba(0, 0, 0, 0.5)',

  // Text
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',

  // Brand
  brandPrimary: '#3B82F6',
  brandSecondary: '#60A5FA',
  brandTertiary: '#93C5FD',

  // Semantic
  success: '#10B981',
  successBg: '#ECFDF5',
  warning: '#F59E0B',
  warningBg: '#FFFBEB',
  error: '#EF4444',
  errorBg: '#FEF2F2',

  // Gamification
  streak: '#F97316',
  streakBg: '#FFF7ED',
  cp: '#8B5CF6',
  cpBg: '#F5F3FF',
  achievement: '#FBBF24',
  achievementBg: '#FFFBEB',
  level: '#06B6D4',
  levelBg: '#ECFEFF',

  // Borders & Dividers
  borderLight: '#E5E7EB',
  borderMedium: '#D1D5DB',
  divider: '#F3F4F6',
} as const;

// ====== SPACING ======
export const spacing = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
} as const;

// ====== BORDER RADIUS ======
export const radius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  full: '9999px',
} as const;

// ====== SHADOWS ======
export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.04)',
  md: '0 4px 12px rgba(0, 0, 0, 0.06)',
  lg: '0 8px 24px rgba(0, 0, 0, 0.08)',
  xl: '0 16px 48px rgba(0, 0, 0, 0.12)',
} as const;

// ====== ANIMATION ======
export const animation = {
  // Duration
  instant: '100ms',
  fast: '200ms',
  normal: '300ms',
  slow: '400ms',

  // Easing
  easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
  easeIn: 'cubic-bezier(0.7, 0, 0.84, 0)',
  easeInOut: 'cubic-bezier(0.45, 0, 0.55, 1)',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

// ====== Z-INDEX ======
export const zIndex = {
  base: 0,
  dropdown: 10,
  modal: 100,
  toast: 200,
  tooltip: 300,
} as const;
