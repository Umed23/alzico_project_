/**
 * Color scheme optimized for elderly and Alzheimer's patients
 * Features: High contrast, calming colors, modern design
 * Designed for accessibility and visual comfort
 */

// Primary accent - Soft, calming blue (easy on eyes, trustworthy)
const primaryBlue = '#5B9BD5';  // Soft sky blue
const primaryBlueDark = '#4A7BA7';  // Darker shade for hover
const primaryBlueLight = '#7FB3E8';  // Lighter shade for highlights

// Secondary accent - Calming soft green (positive, soothing)
const secondaryGreen = '#6FAF8C';  // Soft sage green
const secondaryGreenLight = '#8BC9A8';  // Lighter green

// Background colors - Soft, light, calming
const backgroundLight = '#F5F9FC';  // Soft blue-white (calming, modern)
const backgroundMain = '#EBF4F8';  // Slightly darker soft blue-white
const backgroundCard = '#FFFFFF';  // Pure white cards for high contrast
const backgroundNav = '#E8F2F7';  // Soft nav background

// Text colors - High contrast for readability
const textPrimary = '#2C3E50';  // Dark blue-gray (excellent readability)
const textSecondary = '#5D6D7E';  // Medium gray for secondary text
const textLight = '#7F8C8D';  // Light gray for hints

// Button colors
const buttonPrimary = primaryBlue;
const buttonPrimaryHover = primaryBlueDark;
const buttonSuccess = secondaryGreen;
const buttonWarning = '#F4D03F';  // Soft yellow (less alarming than red)
const buttonInfo = '#85C1E9';  // Light blue for info

// Border and divider colors
const borderLight = '#D5E8F0';  // Very soft blue-gray
const borderMedium = '#BDD4E0';  // Medium soft blue-gray
const borderFocus = primaryBlue;

// Status colors (softer, less alarming)
const successColor = secondaryGreen;
const warningColor = '#F4D03F';  // Soft yellow
const errorColor = '#E67E22';  // Soft coral (less alarming than red)
const infoColor = '#5B9BD5';

export const Colors = {
  light: {
    // Main colors
    text: textPrimary,
    textSecondary: textSecondary,
    textLight: textLight,
    background: backgroundMain,
    backgroundCard: backgroundCard,
    backgroundNav: backgroundNav,
    
    // Accent colors
    tint: primaryBlue,
    tintLight: primaryBlueLight,
    tintDark: primaryBlueDark,
    accent: secondaryGreen,
    accentLight: secondaryGreenLight,
    
    // Interactive elements
    icon: textSecondary,
    tabIconDefault: textLight,
    tabIconSelected: primaryBlue,
    
    // Cards and containers
    cardBackground: backgroundCard,
    cardBorder: borderLight,
    cardShadow: 'rgba(91, 155, 213, 0.1)',
    
    // Inputs
    inputBackground: '#FFFFFF',
    inputBorder: borderMedium,
    inputBorderFocus: borderFocus,
    inputPlaceholder: textLight,
    
    // Buttons
    buttonPrimary: buttonPrimary,
    buttonPrimaryText: '#FFFFFF',
    buttonSecondary: backgroundNav,
    buttonSecondaryText: textPrimary,
    buttonSuccess: buttonSuccess,
    buttonWarning: buttonWarning,
    buttonInfo: buttonInfo,
    
    // Status colors
    success: successColor,
    warning: warningColor,
    error: errorColor,
    info: infoColor,
  },
  dark: {
    // For dark mode (if needed) - Still accessible
    text: '#F8F9FA',
    textSecondary: '#D5DBDB',
    textLight: '#BDC3C7',
    background: '#2C3E50',
    backgroundCard: '#34495E',
    backgroundNav: '#1B2631',
    
    tint: primaryBlueLight,
    tintLight: primaryBlueLight,
    tintDark: primaryBlue,
    accent: secondaryGreenLight,
    accentLight: secondaryGreen,
    
    icon: '#BDC3C7',
    tabIconDefault: '#95A5A6',
    tabIconSelected: primaryBlueLight,
    
    cardBackground: '#34495E',
    cardBorder: 'rgba(139, 201, 168, 0.2)',
    cardShadow: 'rgba(0, 0, 0, 0.3)',
    
    inputBackground: '#34495E',
    inputBorder: 'rgba(139, 201, 168, 0.3)',
    inputBorderFocus: primaryBlueLight,
    inputPlaceholder: '#95A5A6',
    
    buttonPrimary: primaryBlue,
    buttonPrimaryText: '#FFFFFF',
    buttonSecondary: '#34495E',
    buttonSecondaryText: '#F8F9FA',
    buttonSuccess: secondaryGreen,
    buttonWarning: buttonWarning,
    buttonInfo: infoColor,
    
    success: secondaryGreenLight,
    warning: buttonWarning,
    error: '#F1948A',  // Soft red for dark mode
    info: primaryBlueLight,
  },
};

// Default to light mode for elderly users (better visibility)
export default Colors.light;
