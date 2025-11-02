/**
 * Color Palette - Zen Garden & Tatami Aesthetic
 * Inspired by minimalist Japanese design with warm, natural tones
 */

export const Colors = {
  // Primary colors
  primary: '#2F2F2F',        // Graphite - main brand color
  background: '#F5F3EF',     // Warm Off-White - main background
  accent: '#3E5C76',         // Indigo Ink - interactive elements

  // Support colors
  sage: '#B5C99A',           // Light Sage - success states
  sand: '#E0D8C3',           // Muted Sand - subtle backgrounds

  // Typography
  text: '#1B1B1B',           // Dark Charcoal - primary text
  textSecondary: '#6B6B6B',  // Gray text - secondary text
  textLight: '#FFFFFF',      // White text - text on dark backgrounds

  // UI elements
  surface: '#FFFFFF',        // Surface - component backgrounds
  cardBackground: '#FFFFFF',  // White - card backgrounds
  border: '#E0D8C3',         // Muted Sand - borders and dividers
  success: '#B5C99A',        // Light Sage - success messages
  error: '#D9534F',          // Error red - error states
  warning: '#F0AD4E',        // Warning orange - warning states

  // Transparent overlays
  overlay: 'rgba(47, 47, 47, 0.5)',           // Modal overlay
  shadowColor: 'rgba(27, 27, 27, 0.1)',       // Shadow color
};

/**
 * Typography System
 * Consistent text sizes and weights across the app
 */
export const Typography = {
  sizes: {
    h1: 28,
    h2: 24,
    h3: 20,
    lg: 18,
    md: 16,
    body: 16,
    sm: 14,
    small: 14,
    xs: 12,
    tiny: 12,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

/**
 * Spacing System
 * Consistent spacing throughout the app
 */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

/**
 * Border Radius System
 */
export const BorderRadius = {
  sm: 8,
  small: 8,
  md: 12,
  medium: 12,
  lg: 16,
  large: 16,
  round: 24,
  circle: 9999,
};

/**
 * Shadow System
 */
export const Shadows = {
  sm: {
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  light: {
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  medium: {
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  strong: {
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};
