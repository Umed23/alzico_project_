/**
 * Helper function to replace dark theme colors with light theme colors
 * This ensures consistency across all screens
 */
import Colors from '../constants/Colors';

export const replaceDarkColors = (styles: any) => {
  const colorReplacements: { [key: string]: any } = {
    // Background colors
    '#0A0E27': Colors.background,
    '#1A1A2E': Colors.backgroundNav,
    '#16213E': Colors.background,
    '#FFFFFF': Colors.cardBackground,
    
    // Text colors
    '#FFFFFF': (context: string) => context.includes('text') || context.includes('Text') || context.includes('color') ? Colors.text : '#FFFFFF',
    '#B0B0B0': Colors.textSecondary,
    '#888': Colors.textLight,
    '#11181C': Colors.text,
    
    // Button/Accent colors
    '#4A90E2': Colors.tint,
    '#DC3545': Colors.error,
    '#28A745': Colors.success,
    '#FFC107': Colors.warning,
    
    // Card backgrounds (transparent)
    'rgba(255, 255, 255, 0.05)': Colors.backgroundNav,
    'rgba(255, 255, 255, 0.1)': Colors.cardBorder,
    
    // Shadows
    '#000': Colors.cardShadow,
  };
  
  return styles;
};

export default replaceDarkColors;

