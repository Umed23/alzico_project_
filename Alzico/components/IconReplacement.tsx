import React from 'react';
import WebIcon from './WebIcons';

// This component forwards all props to WebIcon (web-compatible emoji icons)
export default function IconReplacement(props) {
  return <WebIcon {...props} />;
}
