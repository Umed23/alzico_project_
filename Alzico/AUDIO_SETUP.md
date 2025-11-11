# Audio Setup Guide for Cognitive Tests

## Why Audio Might Not Work

The audio functionality in cognitive tests requires audio files to be placed in the correct directory. If you can't hear audio, it's likely because:

1. **Audio files don't exist** - The audio files need to be added to the project
2. **Wrong directory** - Files must be in `public/audio/`
3. **Browser permissions** - Some browsers require user interaction before playing audio

## Required Audio Files

The following audio files are referenced in the cognitive tests:

1. **`ravlt_word_list.mp3`** - Rey Auditory Verbal Learning Test word list (15 words)
2. **`ravlt_interference_list.mp3`** - RAVLT interference list (15 words)
3. **`adas_word_list.mp3`** - ADAS-Cog13 word list (10 words)

## Word Lists (Text Fallback)

If audio files are not available, the app will automatically display the word lists as text:

### RAVLT Word List
```
Bed, Tree, House, Car, Phone, Book, Clock, Flower, Ball, Hat, Boat, Bird, Fish, Apple, Cup
```

### RAVLT Interference List
```
Drum, Curtain, Bell, Coffee, School, Parent, Moon, Garden, Hat, Farmer, Nose, Turkey, Color, House, River
```

### ADAS-Cog13 Word List
```
Apple, Table, Penny, Saddle, Insult, Sailor, Letter, King, Cabbage, Face
```

## How to Add Audio Files

1. Create the audio directory:
   ```bash
   mkdir Alzico/public/audio
   ```

2. Add your audio files:
   - Place `ravlt_word_list.mp3` in `public/audio/`
   - Place `ravlt_interference_list.mp3` in `public/audio/`
   - Place `adas_word_list.mp3` in `public/audio/`

3. Restart the webpack dev server:
   ```bash
   npm run web
   ```

## Testing Audio

1. Open the app in your browser
2. Navigate to a test that uses audio (e.g., Rey Auditory Verbal Learning Test)
3. Click the "Play Audio" button
4. If audio doesn't play, you'll see the word list displayed as text automatically

## Browser Audio Requirements

- **Chrome/Edge**: Audio should work after user interaction (clicking play button)
- **Firefox**: May require explicit user gesture
- **Safari**: Requires user interaction before playing audio

## Troubleshooting

### Audio still doesn't play?

1. **Check browser console** - Open Developer Tools (F12) and check for errors
2. **Verify file path** - Ensure files are in `public/audio/` directory
3. **Check file format** - Use MP3 format for best compatibility
4. **Browser permissions** - Ensure browser allows audio playback
5. **File size** - Large audio files may take time to load

### Use Text Fallback

If audio setup is difficult, the app automatically shows word lists as text when audio fails to load. Users can read the lists instead of listening.

