import { AppRegistry } from 'react-native';
import App from './App';

console.log('Alzico: index.web.js loaded');

// Register the app
AppRegistry.registerComponent('alzico', () => App);
console.log('Alzico: App component registered');

// Function to run the app
function runApp() {
  console.log('Alzico: Attempting to run app');
  const rootTag = document.getElementById('root');
  
  if (rootTag) {
    console.log('Alzico: Root element found, mounting app');
    try {
      AppRegistry.runApplication('alzico', {
        rootTag: rootTag
      });
      console.log('Alzico: App mounted successfully');
    } catch (error) {
      console.error('Alzico: Error mounting app:', error);
    }
  } else {
    console.error('Alzico: Could not find root element');
  }
}

// Try to run immediately if DOM is already loaded
if (document.readyState === 'loading') {
  console.log('Alzico: DOM still loading, waiting for DOMContentLoaded');
  document.addEventListener('DOMContentLoaded', runApp);
} else {
  console.log('Alzico: DOM already loaded, running app immediately');
  runApp();
}