const fs = require('fs');
const path = require('path');

// Function to replace Expo vector icons with our Icon component
function replaceExpoIcons(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Recursively process subdirectories
      replaceExpoIcons(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      // Process TypeScript/TSX files
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Replace the import statement
      if (content.includes('@expo/vector-icons')) {
        console.log(`Processing: ${filePath}`);
        
        // Replace the import
        content = content.replace(
          /import\s+\{[^}]*\}\s+from\s+['"]@expo\/vector-icons['"];?/g,
          "import Icon from '../components/IconReplacement';"
        );
        
        // Replace Icon usage patterns
        content = content.replace(
          /<Ionicons\s+name="([^"]+)"\s+([^>]*)>/g,
          '<Icon name="$1" $2>'
        );
        
        content = content.replace(
          /<MaterialIcons\s+name="([^"]+)"\s+([^>]*)>/g,
          '<Icon name="$1" $2>'
        );
        
        content = content.replace(
          /<AntDesign\s+name="([^"]+)"\s+([^>]*)>/g,
          '<Icon name="$1" $2>'
        );
        
        content = content.replace(
          /<Feather\s+name="([^"]+)"\s+([^>]*)>/g,
          '<Icon name="$1" $2>'
        );
        
        content = content.replace(
          /<FontAwesome\s+name="([^"]+)"\s+([^>]*)>/g,
          '<Icon name="$1" $2>'
        );
        
        content = content.replace(
          /<FontAwesome5\s+name="([^"]+)"\s+([^>]*)>/g,
          '<Icon name="$1" $2>'
        );
        
        content = content.replace(
          /<Entypo\s+name="([^"]+)"\s+([^>]*)>/g,
          '<Icon name="$1" $2>'
        );
        
        content = content.replace(
          /<EvilIcons\s+name="([^"]+)"\s+([^>]*)>/g,
          '<Icon name="$1" $2>'
        );
        
        content = content.replace(
          /<Foundation\s+name="([^"]+)"\s+([^>]*)>/g,
          '<Icon name="$1" $2>'
        );
        
        content = content.replace(
          /<Octicons\s+name="([^"]+)"\s+([^>]*)>/g,
          '<Icon name="$1" $2>'
        );
        
        content = content.replace(
          /<SimpleLineIcons\s+name="([^"]+)"\s+([^>]*)>/g,
          '<Icon name="$1" $2>'
        );
        
        content = content.replace(
          /<Zocial\s+name="([^"]+)"\s+([^>]*)>/g,
          '<Icon name="$1" $2>'
        );
        
        // Write the updated content back
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
      }
    }
  });
}

// Start the replacement process
console.log('🚀 Starting Expo vector icons replacement...');
replaceExpoIcons('./screens');
replaceExpoIcons('./navigation');
replaceExpoIcons('./components');
console.log('✅ Expo vector icons replacement completed!');
console.log('');
console.log('📱 Now you can run:');
console.log('   npm run web    - for web');
console.log('   npm run android - for Android');
console.log('   npm run ios    - for iOS');
console.log('   npm start      - for Metro bundler'); 