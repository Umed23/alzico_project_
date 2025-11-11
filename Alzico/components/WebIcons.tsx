import React from 'react';
import { Text } from 'react-native';

// Web-compatible icon component to replace react-native-vector-icons
export const WebIcon: React.FC<{ name: string; size?: number; color?: string }> = ({ 
  name, 
  size = 24, 
  color = '#000' 
}) => {
  const iconMap: { [key: string]: string } = {
    // Navigation icons
    'home': '🏠',
    'home-outline': '🏠',
    'arrow-back': '←',
    'arrow-forward': '→',
    'chevron-forward': '›',
    'chevron-back': '‹',
    'person': '👤',
    'person-circle': '👤',
    'person-outline': '👤',
    'help-circle': '❓',
    'help-circle-outline': '❓',
    'information-circle': 'ℹ️',
    'information-circle-outline': 'ℹ️',
    'clipboard': '📋',
    'clipboard-outline': '📋',
    'time': '⏰',
    'time-outline': '⏰',
    
    // Action icons
    'create': '✏️',
    'camera': '📷',
    'settings': '⚙️',
    'share-social': '📤',
    'document-text': '📄',
    'flame': '🔥',
    'star': '⭐',
    'trending-up': '📈',
    'trophy': '🏆',
    'medal': '🏅',
    'bulb': '💡',
    'heart': '❤️',
    'leaf': '🍃',
    
    // Settings icons
    'shield-checkmark': '🛡️',
    'notifications': '🔔',
    'notifications-outline': '🔔',
    'volume-high': '🔊',
    'save': '💾',
    'moon': '🌙',
    'cloud-upload': '☁️',
    'download': '⬇️',
    'trash': '🗑️',
    'log-out': '🚪',
  };

  return (
    <Text style={{ fontSize: size, color }}>
      {iconMap[name] || '❓'}
    </Text>
  );
};

// Export as default for compatibility
export default WebIcon;
