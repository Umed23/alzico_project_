import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import WebIcon from './WebIcons';
import Colors from '../constants/Colors';

const { width } = Dimensions.get('window');

interface InteractiveTestInterfaceProps {
  test: any;
  currentQuestion: any;
  questionIndex: number;
  totalQuestions: number;
  timeRemaining: number;
  onAnswerSubmit: (answer: any) => void;
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  answers: Record<string, any>;
}

const InteractiveTestInterface: React.FC<InteractiveTestInterfaceProps> = ({
  test,
  currentQuestion,
  questionIndex,
  totalQuestions,
  timeRemaining,
  onAnswerSubmit,
  onNextQuestion,
  onPreviousQuestion,
  answers,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [scaleValue, setScaleValue] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [hasReadStory, setHasReadStory] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [drawingDescription, setDrawingDescription] = useState('');
  const [audioHeard, setAudioHeard] = useState(false);
  const [usingTTS, setUsingTTS] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedText, setRecordedText] = useState('');
  const [speechRecognition, setSpeechRecognition] = useState<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  // Get current answer - handle both object and string formats
  const currentAnswer = answers[currentQuestion.id] !== undefined && answers[currentQuestion.id] !== null 
    ? answers[currentQuestion.id] 
    : null;

  // Initialize audio when question changes
  useEffect(() => {
    if (currentQuestion.type === 'audio-recall' && currentQuestion.audio) {
      // Reset audio state for new question
      setAudioHeard(false);
      setIsPlaying(false);
      setAudioProgress(0);
      setUsingTTS(false);
      window.speechSynthesis?.cancel();
      
      // Clean up previous audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      // Create new audio element for web
      if (typeof window !== 'undefined' && window.Audio) {
        // Try multiple possible paths for audio files
        const audioPaths = [
          `/audio/${currentQuestion.audio}`,
          `/public/audio/${currentQuestion.audio}`,
          `./audio/${currentQuestion.audio}`,
          currentQuestion.audio.startsWith('http') ? currentQuestion.audio : null
        ].filter(Boolean);
        
        const audio = new Audio(audioPaths[0]);
        audioRef.current = audio;

        // Set up error handling
        const handleError = (e: any) => {
          console.error('Audio load error:', e, 'Path:', audioPaths[0]);
          console.error('Audio error details:', {
            code: audio.error?.code,
            message: audio.error?.message,
            networkState: audio.networkState,
            readyState: audio.readyState
          });
          // Mark audio as errored for fallback display
          (audio as any).error = true;
          setIsPlaying(false);
        };

        audio.addEventListener('error', handleError);
        
        // Also check on load failure
        audio.addEventListener('canplay', () => {
          (audio as any).error = false;
        });
        
        audio.addEventListener('loadeddata', () => {
          (audio as any).error = false;
        });

        // Check if audio fails to load after a timeout
        setTimeout(() => {
          if (audio.readyState === 0) {
            console.warn('Audio not loading, marking as error');
            (audio as any).error = true;
          }
        }, 2000);

        // Set up event listeners
        audio.addEventListener('play', () => setIsPlaying(true));
        audio.addEventListener('pause', () => setIsPlaying(false));
        audio.addEventListener('ended', () => {
          setAudioHeard(true); // Mark as heard when audio file finishes
          setIsPlaying(false);
          setAudioProgress(0);
        });
        audio.addEventListener('timeupdate', () => {
          if (audio.duration) {
            setAudioProgress((audio.currentTime / audio.duration) * 100);
          }
        });

        // Cleanup on unmount
        return () => {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
          }
        };
      }
    } else {
      // Reset audio state when not on audio question
      setIsPlaying(false);
      setAudioProgress(0);
    }
  }, [currentQuestion.id, currentQuestion.type, currentQuestion.audio]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (option: any) => {
    // Add haptic feedback visual
    onAnswerSubmit(option.value || option);
  };

  // **SLIDER for scale/rating questions**
  const renderSlider = () => {
    const scale = currentQuestion.scale || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const selectedValue = currentAnswer || scaleValue || scale[Math.floor(scale.length / 2)];

    return (
      <View style={styles.sliderContainer}>
        {/* Visual emoji indicators */}
        <View style={styles.emojiRow}>
          <Text style={styles.emoji}>😟</Text>
          <Text style={styles.emoji}>😐</Text>
          <Text style={styles.emoji}>😊</Text>
        </View>

        {/* Interactive slider */}
        <View style={styles.sliderTrack}>
          {scale.map((value: number) => {
            const isSelected = selectedValue === value;
            const isPassed = selectedValue >= value;
            return (
              <TouchableOpacity
                key={value}
                style={[
                  styles.sliderDot,
                  isPassed && styles.sliderDotActive,
                  isSelected && styles.sliderDotSelected,
                ]}
                onPress={() => {
                  setScaleValue(value);
                  onAnswerSubmit(value);
                }}
              >
                {isSelected && <Text style={styles.sliderDotText}>{value}</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Labels */}
        {currentQuestion.scaleLabels && (
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabelText}>{currentQuestion.scaleLabels[0]}</Text>
            <Text style={styles.sliderLabelText}>{currentQuestion.scaleLabels[1]}</Text>
          </View>
        )}

        {/* Selected value display */}
        <View style={styles.selectedValueContainer}>
          <Text style={styles.selectedValueText}>Selected: {selectedValue}</Text>
        </View>
      </View>
    );
  };

  // **CARD-BASED multiple choice with icons**
  const renderCardOptions = () => {
    const optionIcons = ['checkmark-circle', 'close-circle', 'help-circle', 'information-circle'];
    
    return (
      <View style={styles.cardOptionsContainer}>
        {currentQuestion.options?.map((option: any, index: number) => {
          const isSelected = currentAnswer === option.value || currentAnswer === option;
          const optionText = option.text || option;
          const iconName = optionIcons[index % optionIcons.length];
          
          return (
            <TouchableOpacity
              key={index}
              style={[styles.optionCard, isSelected && styles.optionCardSelected]}
              onPress={() => handleOptionSelect(option.value || option)}
              activeOpacity={0.7}
            >
              <View style={[styles.optionCardIcon, isSelected && styles.optionCardIconSelected]}>
                <WebIcon 
                  name={isSelected ? 'checkmark-circle' : iconName} 
                  size={32} 
                  color={isSelected ? '#FFFFFF' : '#4A90E2'} 
                />
              </View>
              <Text style={[styles.optionCardText, isSelected && styles.optionCardTextSelected]}>
                {optionText}
              </Text>
              {isSelected && (
                <View style={styles.selectedBadge}>
                  <Text style={styles.selectedBadgeText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  // **QUICK TAP buttons for yes/no**
  const renderQuickButtons = () => {
    return (
      <View style={styles.quickButtonsContainer}>
        <TouchableOpacity
          style={[
            styles.quickButton,
            styles.quickButtonYes,
            currentAnswer === true && styles.quickButtonSelected,
          ]}
          onPress={() => onAnswerSubmit(true)}
        >
          <View style={styles.quickButtonIcon}>
            <Text style={styles.quickButtonEmoji}>👍</Text>
          </View>
          <Text style={[styles.quickButtonText, currentAnswer === true && styles.quickButtonTextSelected]}>
            Yes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.quickButton,
            styles.quickButtonNo,
            currentAnswer === false && styles.quickButtonSelected,
          ]}
          onPress={() => onAnswerSubmit(false)}
        >
          <View style={styles.quickButtonIcon}>
            <Text style={styles.quickButtonEmoji}>👎</Text>
          </View>
          <Text style={[styles.quickButtonText, currentAnswer === false && styles.quickButtonTextSelected]}>
            No
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Get word list text for TTS
  const getWordListText = () => {
    if (currentQuestion.audio === 'ravlt_word_list.mp3') {
      return 'Bed, Tree, House, Car, Phone, Book, Clock, Flower, Ball, Hat, Boat, Bird, Fish, Apple, Cup';
    } else if (currentQuestion.audio === 'ravlt_interference_list.mp3') {
      return 'Drum, Curtain, Bell, Coffee, School, Parent, Moon, Garden, Hat, Farmer, Nose, Turkey, Color, House, River';
    } else if (currentQuestion.audio === 'adas_word_list.mp3') {
      return 'Apple, Table, Penny, Saddle, Insult, Sailor, Letter, King, Cabbage, Face';
    }
    return '';
  };

  // Text-to-Speech function as fallback
  const speakWords = (text: string) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      const words = text.split(',').map(w => w.trim());
      let currentIndex = 0;

      const speakNext = () => {
        if (currentIndex >= words.length) {
          setAudioHeard(true);
          setIsPlaying(false);
          setUsingTTS(false);
          return;
        }

        const utterance = new SpeechSynthesisUtterance(words[currentIndex]);
        utterance.rate = 0.8; // Slightly slower for clarity
        utterance.pitch = 1;
        utterance.volume = 1;

        utterance.onend = () => {
          currentIndex++;
          setTimeout(speakNext, 300); // Small pause between words
        };

        utterance.onerror = () => {
          console.error('TTS error');
          setIsPlaying(false);
          setUsingTTS(false);
        };

        window.speechSynthesis.speak(utterance);
        setUsingTTS(true);
      };

      speakNext();
    } else {
      Alert.alert('Not Supported', 'Text-to-speech is not available in your browser.');
    }
  };

  // Set up audio ended event listener (at top level, not in render function)
  useEffect(() => {
    if (currentQuestion.type === 'audio-recall' && audioRef.current && !usingTTS) {
      const handleEnded = () => {
        setAudioHeard(true);
        setIsPlaying(false);
      };
      audioRef.current.addEventListener('ended', handleEnded);
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('ended', handleEnded);
        }
      };
    }
  }, [currentQuestion.id, currentQuestion.type, audioRef.current, usingTTS]);

  // **AUDIO PLAYER for listening tests**
  const renderAudioPlayer = () => {
    const handlePlayPause = () => {
      if (audioRef.current && !usingTTS) {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          audioRef.current.play().catch((error) => {
            console.error('Audio file not available, using text-to-speech instead');
            // Fallback to TTS if audio file doesn't exist
            const wordList = getWordListText();
            if (wordList) {
              setIsPlaying(true);
              speakWords(wordList);
            } else {
              Alert.alert('Audio Error', 'Could not play audio and word list not available.');
            }
          });
        }
      } else if (usingTTS) {
        // Stop TTS
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setUsingTTS(false);
      } else {
        // No audio file, use TTS directly
        const wordList = getWordListText();
        if (wordList) {
          setIsPlaying(true);
          speakWords(wordList);
        }
      }
    };

    const handleReplay = () => {
      if (usingTTS) {
        window.speechSynthesis.cancel();
      }
      setAudioHeard(false);
      
      if (audioRef.current && !usingTTS) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((error) => {
          // Use TTS as fallback
          const wordList = getWordListText();
          if (wordList) {
            setIsPlaying(true);
            speakWords(wordList);
          }
        });
      } else {
        const wordList = getWordListText();
        if (wordList) {
          setIsPlaying(true);
          speakWords(wordList);
        }
      }
    };

    return (
      <View style={styles.audioContainer}>
        <View style={styles.audioPlayerCard}>
          <View style={styles.audioIconContainer}>
            <Text style={styles.audioIcon}>🎧</Text>
          </View>
          
          <Text style={styles.audioInstructions}>
            {currentQuestion.question}
          </Text>

          <View style={styles.audioControls}>
            <TouchableOpacity
              style={styles.audioButton}
              onPress={handlePlayPause}
              activeOpacity={0.8}
            >
              <WebIcon 
                name={isPlaying ? 'pause' : 'play'} 
                size={32} 
                color="#FFFFFF" 
              />
              <Text style={styles.audioButtonText}>
                {isPlaying ? 'Pause' : 'Play'} Audio
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.audioButtonSecondary}
              onPress={handleReplay}
              activeOpacity={0.8}
            >
              <WebIcon name="refresh" size={24} color={Colors.tint} />
              <Text style={styles.audioButtonTextSecondary}>Replay</Text>
            </TouchableOpacity>
          </View>

          {/* Progress bar */}
          {isPlaying && (
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[styles.progressBarFill, { width: `${audioProgress}%` }]} 
                />
              </View>
            </View>
          )}

          <Text style={styles.audioHint}>
            💡 Listen carefully to the word list. After it finishes, you'll be asked to recall the words.
          </Text>

          {/* Word list text display */}
          <View style={styles.wordListFallback}>
            <Text style={styles.wordListTitle}>📝 Word List {usingTTS ? '(Speaking...)' : '(Click Play to Hear)'}:</Text>
            <Text style={styles.wordListText}>
              {getWordListText() || 'Word list not available'}
            </Text>
          </View>
          
          {/* Audio heard confirmation */}
          {audioHeard && (
            <View style={styles.audioHeardBadge}>
              <WebIcon name="checkmark-circle" size={24} color={Colors.accent} />
              <Text style={styles.audioHeardText}>Audio heard - Ready to recall!</Text>
            </View>
          )}
        </View>

        {/* Text input for recall after listening */}
        <View style={styles.audioRecallContainer}>
          <Text style={styles.recallPrompt}>
            {audioHeard 
              ? '✅ Enter the words you remember (separated by commas):'
              : '⏸️ Please listen to the audio first, then enter the words you remember:'
            }
          </Text>
          <TextInput
            style={styles.audioRecallInput}
            value={inputValue || currentAnswer || ''}
            onChangeText={setInputValue}
            placeholder="Type the words you remember here..."
            placeholderTextColor={Colors.textLight}
            multiline
            numberOfLines={4}
          />
          <TouchableOpacity
            style={[
              styles.submitRecallButton, 
              (!inputValue.trim() || !audioHeard) && styles.submitRecallButtonDisabled
            ]}
            onPress={() => {
              if (inputValue.trim() && audioHeard) {
                onAnswerSubmit(inputValue.trim());
              } else if (!audioHeard) {
                Alert.alert(
                  'Listen First',
                  'Please listen to the audio word list before submitting your recall. Click the "Play Audio" button to hear the words.',
                  [{ text: 'OK' }]
                );
              }
            }}
            disabled={!inputValue.trim() || !audioHeard}
            activeOpacity={0.8}
          >
            <Text style={styles.submitRecallButtonText}>
              {audioHeard ? 'Submit Recall' : 'Listen to Audio First'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // **COMPACT text input with character count**
  const renderCompactTextInput = () => {
    const maxLength = currentQuestion.maxLength || 200;
    const currentLength = (inputValue || currentAnswer || '').length;

    return (
      <View style={styles.compactInputContainer}>
        <TextInput
          style={styles.compactInput}
          value={inputValue || currentAnswer || ''}
          onChangeText={setInputValue}
          placeholder="Tap to answer..."
          placeholderTextColor="#666"
          maxLength={maxLength}
          multiline
        />
        <View style={styles.inputFooter}>
          <Text style={styles.characterCount}>{currentLength}/{maxLength}</Text>
          <TouchableOpacity
            style={[styles.miniSubmitButton, !inputValue && styles.miniSubmitButtonDisabled]}
            onPress={() => {
              if (inputValue.trim()) {
                onAnswerSubmit(inputValue.trim());
                setInputValue('');
              }
            }}
            disabled={!inputValue}
          >
            <WebIcon name="arrow-forward" size={20} color={inputValue ? '#FFF' : '#666'} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // **RECOGNITION: Image with multiple choice**
  const renderRecognition = () => {
    const imageSource = currentQuestion.image 
      ? { uri: `/images/${currentQuestion.image}` }
      : null;

    return (
      <View style={styles.recognitionContainer}>
        {imageSource && (
          <View style={styles.recognitionImageContainer}>
            <Image 
              source={imageSource} 
              style={styles.recognitionImage}
              resizeMode="contain"
              onError={() => {
                console.warn('Image failed to load:', currentQuestion.image);
              }}
            />
          </View>
        )}
        {!imageSource && (
          <View style={styles.recognitionPlaceholder}>
            <WebIcon name="image" size={64} color={Colors.tint} />
            <Text style={styles.recognitionPlaceholderText}>
              Image: {currentQuestion.image || 'No image provided'}
            </Text>
          </View>
        )}
        
        {currentQuestion.options && currentQuestion.options.length > 0 && (
          <View style={styles.recognitionOptions}>
            <Text style={styles.recognitionPrompt}>
              Select the correct answer:
            </Text>
            {currentQuestion.options.map((option: string, index: number) => {
              const isSelected = currentAnswer === option;
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.recognitionOptionCard,
                    isSelected && styles.recognitionOptionCardSelected
                  ]}
                  onPress={() => handleOptionSelect(option)}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.recognitionOptionIcon,
                    isSelected && styles.recognitionOptionIconSelected
                  ]}>
                    <WebIcon 
                      name={isSelected ? 'checkmark-circle' : 'ellipse-outline'} 
                      size={28} 
                      color={isSelected ? '#FFFFFF' : Colors.tint} 
                    />
                  </View>
                  <Text style={[
                    styles.recognitionOptionText,
                    isSelected && styles.recognitionOptionTextSelected
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    );
  };

  // **STORY READING: Display story content for reading**
  const renderStoryReading = () => {
    const storyText = currentQuestion.storyContent || '';
    const readStatus = currentAnswer === 'read' || hasReadStory;

    return (
      <View style={styles.storyContainer}>
        <View style={styles.storyHeader}>
          <Text style={styles.storyIcon}>📖</Text>
          <Text style={styles.storyTitle}>Read the Story</Text>
        </View>
        
        <View style={styles.storyContentCard}>
          <ScrollView 
            style={styles.storyScrollView}
            contentContainerStyle={styles.storyScrollContent}
            showsVerticalScrollIndicator={true}
          >
            <Text style={styles.storyText}>{storyText}</Text>
          </ScrollView>
        </View>

        <View style={styles.storyActions}>
          <TouchableOpacity
            style={[styles.storyReadButton, readStatus && styles.storyReadButtonCompleted]}
            onPress={() => {
              setHasReadStory(true);
              onAnswerSubmit('read');
            }}
            activeOpacity={0.8}
          >
            <WebIcon 
              name={readStatus ? 'checkmark-done' : 'eye'} 
              size={24} 
              color="#FFFFFF" 
            />
            <Text style={styles.storyReadButtonText}>
              {readStatus ? 'Story Read ✓' : 'I Have Read This Story'}
            </Text>
          </TouchableOpacity>
          
          <Text style={styles.storyHint}>
            💡 Read the story carefully. You will be asked to recall it later.
          </Text>
        </View>
      </View>
    );
  };

  // **SEQUENCE: Step-by-step task tracking**
  const renderSequence = () => {
    const steps = currentQuestion.question.match(/\d+\)\s*([^0-9]+)/g) || 
                  currentQuestion.question.split(/[\n•]/).filter((s: string) => s.trim());
    
    const savedSteps = currentAnswer?.steps || completedSteps;
    
    const toggleStep = (step: string) => {
      const trimmedStep = step.trim().replace(/^\d+\)\s*/, '');
      const newSteps = savedSteps.includes(trimmedStep)
        ? savedSteps.filter((s: string) => s !== trimmedStep)
        : [...savedSteps, trimmedStep];
      setCompletedSteps(newSteps);
      onAnswerSubmit({ steps: newSteps });
    };

    return (
      <View style={styles.sequenceContainer}>
        <Text style={styles.sequenceInstructions}>
          Complete the following steps:
        </Text>
        
        <View style={styles.sequenceSteps}>
          {steps.map((step: string, index: number) => {
            const stepText = step.trim().replace(/^\d+\)\s*/, '');
            const isCompleted = savedSteps.includes(stepText);
            
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.sequenceStep,
                  isCompleted && styles.sequenceStepCompleted
                ]}
                onPress={() => toggleStep(step)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.sequenceStepIcon,
                  isCompleted && styles.sequenceStepIconCompleted
                ]}>
                  {isCompleted ? (
                    <WebIcon name="checkmark" size={24} color="#FFFFFF" />
                  ) : (
                    <Text style={styles.sequenceStepNumber}>{index + 1}</Text>
                  )}
                </View>
                <Text style={[
                  styles.sequenceStepText,
                  isCompleted && styles.sequenceStepTextCompleted
                ]}>
                  {stepText}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.sequenceProgress}>
          <Text style={styles.sequenceProgressText}>
            Completed: {savedSteps.length} / {steps.length} steps
          </Text>
        </View>
      </View>
    );
  };

  // Drawing canvas ref and state (moved to top level)
  const drawingCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawingOnCanvas, setIsDrawingOnCanvas] = useState(false);

  // Set up drawing canvas (at top level, not in render function)
  useEffect(() => {
    if (typeof window !== 'undefined' && currentQuestion.type === 'drawing') {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 400;
        canvas.style.border = `2px solid ${Colors.tint}`;
        canvas.style.borderRadius = '12px';
        canvas.style.backgroundColor = Colors.backgroundCard;
        canvas.style.cursor = 'crosshair';
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.strokeStyle = Colors.tint;
          ctx.lineWidth = 3;
          ctx.lineCap = 'round';

          let lastX = 0;
          let lastY = 0;

          const startDrawing = (e: MouseEvent | TouchEvent) => {
            setIsDrawingOnCanvas(true);
            const rect = canvas.getBoundingClientRect();
            const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
            const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
            lastX = x;
            lastY = y;
          };

          const draw = (e: MouseEvent | TouchEvent) => {
            if (!isDrawingOnCanvas) return;
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
            const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.stroke();
            
            lastX = x;
            lastY = y;
          };

          const stopDrawing = () => {
            setIsDrawingOnCanvas(false);
          };

          canvas.addEventListener('mousedown', startDrawing);
          canvas.addEventListener('mousemove', draw);
          canvas.addEventListener('mouseup', stopDrawing);
          canvas.addEventListener('mouseout', stopDrawing);
          canvas.addEventListener('touchstart', startDrawing);
          canvas.addEventListener('touchmove', draw);
          canvas.addEventListener('touchend', stopDrawing);

          const container = document.getElementById('drawing-canvas-container');
          if (container) {
            container.innerHTML = '';
            container.appendChild(canvas);
            drawingCanvasRef.current = canvas;
          }
        }
      }
  }, [currentQuestion.id, currentQuestion.type, isDrawingOnCanvas]);

  // **DRAWING: Canvas for drawing tasks**
  const renderDrawing = () => {
    const savedDrawing = currentAnswer?.drawing || null;

    const clearCanvas = () => {
      if (drawingCanvasRef.current) {
        const ctx = drawingCanvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, drawingCanvasRef.current.width, drawingCanvasRef.current.height);
        }
      }
    };

    const saveDrawing = () => {
      if (drawingCanvasRef.current) {
        const dataUrl = drawingCanvasRef.current.toDataURL();
        onAnswerSubmit({ 
          drawing: dataUrl,
          description: drawingDescription 
        });
      } else if (drawingDescription.trim()) {
        onAnswerSubmit({ description: drawingDescription });
      }
    };

    return (
      <View style={styles.drawingContainer}>
        <View style={styles.drawingCanvasContainer}>
          <View id="drawing-canvas-container" style={styles.drawingCanvasWrapper} />
          {currentQuestion.image && (
            <View style={styles.drawingReference}>
              <Text style={styles.drawingReferenceLabel}>Reference:</Text>
              <Image 
                source={{ uri: `/images/${currentQuestion.image}` }}
                style={styles.drawingReferenceImage}
                resizeMode="contain"
              />
            </View>
          )}
        </View>

        <View style={styles.drawingControls}>
          <TouchableOpacity
            style={styles.drawingButtonSecondary}
            onPress={clearCanvas}
            activeOpacity={0.8}
          >
            <WebIcon name="refresh" size={20} color={Colors.tint} />
            <Text style={styles.drawingButtonTextSecondary}>Clear</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.drawingDescriptionInput}
            value={drawingDescription}
            onChangeText={setDrawingDescription}
            placeholder="Optional: Describe your drawing..."
            placeholderTextColor={Colors.textLight}
            multiline
          />

          <TouchableOpacity
            style={[styles.drawingButtonPrimary, !drawingCanvasRef.current && !drawingDescription && styles.drawingButtonDisabled]}
            onPress={saveDrawing}
            activeOpacity={0.8}
          >
            <WebIcon name="checkmark" size={24} color="#FFFFFF" />
            <Text style={styles.drawingButtonTextPrimary}>Save Drawing</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && currentQuestion.type === 'stroop-audio') {
      // Stop any existing recognition first
      if (recognitionRef.current) {
        try {
          if (recognitionRef.current.state === 'listening' || recognitionRef.current.state === 'starting') {
            recognitionRef.current.stop();
          }
        } catch (e) {
          // Ignore errors
        }
        recognitionRef.current = null;
      }
      
      // Reset state only if we don't have an answer yet
      if (!currentAnswer) {
        setRecordedText('');
      }
      setIsRecording(false);
      
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        try {
          const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = 'en-US';

          recognition.onresult = (event: any) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
              const transcript = event.results[i][0].transcript;
              if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
              } else {
                interimTranscript += transcript;
              }
            }

            const fullText = (finalTranscript + interimTranscript).trim();
            if (fullText) {
              setRecordedText(fullText);
            }
          };

          recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            // Don't stop on 'no-speech' error - it's normal
            if (event.error !== 'no-speech' && event.error !== 'aborted') {
              setIsRecording(false);
              if (event.error === 'not-allowed') {
                Alert.alert('Microphone Permission', 'Please allow microphone access to use speech recognition.');
              }
            }
          };

          recognition.onend = () => {
            setIsRecording(false);
          };

          recognitionRef.current = recognition;
          setSpeechRecognition(recognition);
        } catch (error) {
          console.error('Failed to initialize speech recognition:', error);
          recognitionRef.current = null;
        }
      } else {
        recognitionRef.current = null;
      }
    } else {
      // Not a stroop-audio question, clean up
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore
        }
        recognitionRef.current = null;
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          if (recognitionRef.current.state === 'listening' || recognitionRef.current.state === 'starting') {
            recognitionRef.current.stop();
          }
        } catch (e) {
          // Ignore errors when stopping
        }
        recognitionRef.current = null;
      }
    };
  }, [currentQuestion.id, currentQuestion.type, currentAnswer]);

  // **STROOP AUDIO: Display colored words and record speech**
  const renderStroopAudio = () => {
    const stroopWords = currentQuestion.stroopWords || [];
    const expectedResponse = currentQuestion.expectedResponse || [];

    const handleStartRecording = () => {
      if (recognitionRef.current) {
        try {
          // Check if already started
          if (recognitionRef.current.state === 'listening' || recognitionRef.current.state === 'starting') {
            return;
          }
          recognitionRef.current.start();
          setIsRecording(true);
          setRecordedText('');
        } catch (error: any) {
          console.error('Failed to start recording:', error);
          if (error.message && error.message.includes('already started')) {
            setIsRecording(true);
            return;
          }
          Alert.alert('Recording Error', 'Could not start speech recognition. Please check your microphone permissions.');
          setIsRecording(false);
        }
      } else {
        Alert.alert('Not Supported', 'Speech recognition is not available in your browser. Please use Chrome or Edge.');
      }
    };

    const handleStopRecording = () => {
      if (recognitionRef.current && isRecording) {
        try {
          recognitionRef.current.stop();
          setIsRecording(false);
        } catch (error) {
          console.error('Error stopping recording:', error);
          setIsRecording(false);
        }
      }
    };

    const handleVerifyAndSubmit = () => {
      if (!recordedText.trim()) {
        Alert.alert('No Recording', 'Please record your response first.');
        return;
      }

      // Stop recording if still active
      if (isRecording && recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore
        }
        setIsRecording(false);
      }

      const spokenWords = recordedText.trim().toUpperCase().split(/\s+/);
      const expectedWords = expectedResponse.map(w => w.toUpperCase());
      
      // Improved matching - check if all expected words are mentioned
      let matches = 0;
      const matchedWords: string[] = [];
      
      expectedWords.forEach(expected => {
        const found = spokenWords.some(spoken => {
          const match = spoken.includes(expected) || expected.includes(spoken);
          if (match && !matchedWords.includes(expected)) {
            matchedWords.push(expected);
            return true;
          }
          return false;
        });
        if (found) matches++;
      });

      const accuracy = (matches / expectedWords.length) * 100;
      const isCorrect = accuracy >= 75; // 75% match threshold

      // Submit answer immediately, then show verification
      const answerValue = recordedText.trim();
      const answerData = {
        text: answerValue,
        expected: expectedResponse,
        matches: matches,
        totalExpected: expectedWords.length,
        accuracy: accuracy,
        isCorrect: isCorrect
      };
      
      // Submit immediately so navigation works (even if user cancels, answer is saved)
      onAnswerSubmit(answerData);
      
      // Clear recorded text after submission to prevent re-submission
      setTimeout(() => {
        setRecordedText(answerValue); // Keep display but mark as submitted
      }, 100);

      // Show verification feedback
      Alert.alert(
        isCorrect ? 'Correct!' : 'Review Your Answer',
        `You said: "${answerValue}"\n\nExpected: ${expectedResponse.join(', ')}\n\nAccuracy: ${accuracy.toFixed(0)}% (${matches}/${expectedWords.length} correct)`,
        [
          {
            text: 'Try Again',
            onPress: () => {
              setRecordedText('');
              // Remove the answer to allow retry
              onAnswerSubmit(null);
            },
            style: isCorrect ? 'cancel' : 'default'
          },
          {
            text: isCorrect ? 'Continue' : 'Continue Anyway',
            onPress: () => {
              // Answer already submitted, navigation button should be enabled now
            }
          }
        ]
      );
    };

    return (
      <View style={styles.stroopContainer}>
        <View style={styles.stroopWordsContainer}>
          {stroopWords.map((item: any, index: number) => (
            <View key={index} style={styles.stroopWordCard}>
              <Text style={[styles.stroopWord, { color: item.color }]}>
                {item.word}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.stroopInstructions}>
          <Text style={styles.stroopInstructionText}>
            {currentQuestion.question}
          </Text>
        </View>

        <View style={styles.stroopRecordingContainer}>
          <TouchableOpacity
            style={[styles.stroopRecordButton, isRecording && styles.stroopRecordButtonActive]}
            onPress={isRecording ? handleStopRecording : handleStartRecording}
            activeOpacity={0.8}
          >
            <WebIcon 
              name={isRecording ? 'stop' : 'mic'} 
              size={32} 
              color="#FFFFFF" 
            />
            <Text style={styles.stroopRecordButtonText}>
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Text>
          </TouchableOpacity>

          {isRecording && (
            <View style={styles.stroopRecordingIndicator}>
              <View style={styles.stroopPulse} />
              <Text style={styles.stroopRecordingText}>Recording... Speak now</Text>
            </View>
          )}

          {recordedText && (
            <View style={styles.stroopTranscriptionBox}>
              <Text style={styles.stroopTranscriptionLabel}>You said:</Text>
              <Text style={styles.stroopTranscriptionText}>{recordedText}</Text>
            </View>
          )}

          {currentAnswer && (
            <View style={styles.stroopSubmittedBadge}>
              <WebIcon name="checkmark-circle" size={24} color={Colors.accent} />
              <Text style={styles.stroopSubmittedText}>Answer Submitted ✓</Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.stroopSubmitButton, 
              (!recordedText || currentAnswer) && styles.stroopSubmitButtonDisabled
            ]}
            onPress={handleVerifyAndSubmit}
            disabled={!recordedText || !!currentAnswer}
            activeOpacity={0.8}
          >
            <WebIcon name="checkmark" size={24} color="#FFFFFF" />
            <Text style={styles.stroopSubmitButtonText}>
              {currentAnswer ? 'Submitted' : 'Verify & Submit'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // **IMAGE-BASED visual questions**
  const renderVisualQuestion = () => {
    return (
      <View style={styles.visualQuestionContainer}>
        <View style={styles.visualPlaceholder}>
          <WebIcon name="image" size={64} color={Colors.tint} />
          <Text style={styles.visualPlaceholderText}>
            {currentQuestion.instruction || 'Visual element would display here'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.visualCompleteButton}
          onPress={() => onAnswerSubmit('completed')}
        >
          <WebIcon name="checkmark" size={24} color="#FFF" />
          <Text style={styles.visualCompleteButtonText}>Mark Complete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // **Render appropriate input type**
  const renderQuestionContent = () => {
    switch (currentQuestion.type) {
      case 'audio-recall':
        return renderAudioPlayer();

      case 'recognition':
        return renderRecognition();

      case 'story-reading':
        return renderStoryReading();

      case 'drawing':
        return renderDrawing();

      case 'sequence':
        return renderSequence();

      case 'multiple-choice':
      case 'multiple_choice':
        return renderCardOptions();

      case 'scale':
      case 'rating':
        return renderSlider();

      case 'boolean':
      case 'yes-no':
      case 'yes_no':
      case 'true-false':
      case 'true_false':
        return renderQuickButtons();

      case 'text':
      case 'text-input':
      case 'text_input':
      case 'ordering':
      case 'recall':
      case 'memory':
      case 'list':
      case 'timed':
        return renderCompactTextInput();

      case 'stroop-audio':
        return renderStroopAudio();

      case 'image':
      case 'visual':
        return renderVisualQuestion();

      default:
        return renderCompactTextInput();
    }
  };

  return (
    <View style={styles.container}>
      {/* Compact Header with circular progress */}
      <View style={styles.header}>
        <View style={styles.progressCircle}>
          <Text style={styles.progressText}>
            {questionIndex + 1}/{totalQuestions}
          </Text>
        </View>
        
        {timeRemaining > 0 && (
          <View style={styles.timerBadge}>
            <WebIcon name="time" size={16} color="#FFC107" />
            <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
          </View>
        )}
      </View>

      {/* Question Content */}
      <ScrollView
        style={styles.contentContainer}
        contentContainerStyle={styles.contentContainerInner}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.questionCard}>
          {/* Question icon based on type */}
          <View style={styles.questionIconContainer}>
            <Text style={styles.questionIcon}>
              {currentQuestion.type === 'audio-recall' ? '🎧' :
               currentQuestion.type === 'stroop-audio' ? '🎨' :
               currentQuestion.type === 'recognition' ? '👁️' :
               currentQuestion.type === 'story-reading' ? '📖' :
               currentQuestion.type === 'drawing' ? '✏️' :
               currentQuestion.type === 'sequence' ? '📋' :
               currentQuestion.type.includes('choice') ? '🎯' : 
               currentQuestion.type.includes('scale') ? '📊' :
               currentQuestion.type.includes('text') ? '✍️' :
               currentQuestion.type.includes('visual') ? '🖼️' : '❓'}
            </Text>
          </View>

          {currentQuestion.type !== 'audio-recall' && currentQuestion.type !== 'stroop-audio' && (
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
          )}
          
          {currentQuestion.description && (
            <Text style={styles.questionHint}>💡 {currentQuestion.description}</Text>
          )}

          {renderQuestionContent()}
        </View>
      </ScrollView>

      {/* Floating Navigation */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[styles.navButton, styles.navButtonPrev, questionIndex === 0 && styles.navButtonDisabled]}
          onPress={onPreviousQuestion}
          disabled={questionIndex === 0}
        >
          <WebIcon name="arrow-back" size={24} color={questionIndex === 0 ? '#666' : '#FFF'} />
        </TouchableOpacity>

        {/* Progress dots */}
        <View style={styles.progressDots}>
          {Array.from({ length: Math.min(totalQuestions, 5) }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                i <= questionIndex && styles.progressDotActive,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.navButton,
            styles.navButtonNext,
            !currentAnswer && styles.navButtonDisabled,
          ]}
          onPress={onNextQuestion}
          disabled={!currentAnswer}
        >
          {questionIndex === totalQuestions - 1 ? (
            <WebIcon name="checkmark-done" size={24} color={!currentAnswer ? '#666' : '#FFF'} />
          ) : (
            <WebIcon name="arrow-forward" size={24} color={!currentAnswer ? '#666' : '#FFF'} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E27',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#1A1A2E',
  },
  progressCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(74, 144, 226, 0.2)',
    borderWidth: 3,
    borderColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: 'bold',
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  timerText: {
    color: '#FFC107',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
  },
  contentContainerInner: {
    padding: 16,
  },
  questionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  questionIconContainer: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  questionIcon: {
    fontSize: 48,
  },
  questionText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 32,
    marginBottom: 12,
    textAlign: 'center',
  },
  questionHint: {
    color: '#B0B0B0',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  
  // Card Options
  cardOptionsContainer: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  optionCardSelected: {
    backgroundColor: 'rgba(74, 144, 226, 0.3)',
    borderColor: '#4A90E2',
  },
  optionCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(74, 144, 226, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionCardIconSelected: {
    backgroundColor: '#4A90E2',
  },
  optionCardText: {
    color: '#FFFFFF',
    fontSize: 16,
    flex: 1,
    fontWeight: '500',
  },
  optionCardTextSelected: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#34C759',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBadgeText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Slider
  sliderContainer: {
    paddingVertical: 20,
  },
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  emoji: {
    fontSize: 32,
  },
  sliderTrack: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
    marginBottom: 12,
  },
  sliderDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderDotActive: {
    backgroundColor: 'rgba(74, 144, 226, 0.5)',
  },
  sliderDotSelected: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4A90E2',
  },
  sliderDotText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  sliderLabelText: {
    color: '#B0B0B0',
    fontSize: 12,
  },
  selectedValueContainer: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(74, 144, 226, 0.2)',
    padding: 12,
    borderRadius: 12,
  },
  selectedValueText: {
    color: '#4A90E2',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Quick Buttons
  quickButtonsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  quickButton: {
    flex: 1,
    alignItems: 'center',
    padding: 32,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  quickButtonYes: {
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
  },
  quickButtonNo: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  quickButtonSelected: {
    borderColor: '#4A90E2',
    transform: [{ scale: 1.05 }],
  },
  quickButtonIcon: {
    marginBottom: 12,
  },
  quickButtonEmoji: {
    fontSize: 48,
  },
  quickButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  quickButtonTextSelected: {
    color: '#4A90E2',
  },

  // Compact Input
  compactInputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  compactInput: {
    color: '#FFFFFF',
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  characterCount: {
    color: '#888',
    fontSize: 12,
  },
  miniSubmitButton: {
    backgroundColor: '#4A90E2',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniSubmitButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },

  // Visual Question
  visualQuestionContainer: {
    alignItems: 'center',
  },
  visualPlaceholder: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(74, 144, 226, 0.3)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    padding: 20,
  },
  visualPlaceholderText: {
    color: '#B0B0B0',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
  },
  visualCompleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  visualCompleteButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // Navigation
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#1A1A2E',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  navButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonPrev: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  navButtonNext: {
    backgroundColor: '#4A90E2',
  },
  navButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    opacity: 0.5,
  },
  progressDots: {
    flexDirection: 'row',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  progressDotActive: {
    backgroundColor: '#4A90E2',
  },

  // Audio Player Styles
  audioContainer: {
    gap: 20,
  },
  audioPlayerCard: {
    backgroundColor: 'rgba(74, 144, 226, 0.15)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: Colors.tint,
    alignItems: 'center',
  },
  audioIconContainer: {
    marginBottom: 16,
  },
  audioIcon: {
    fontSize: 64,
  },
  audioInstructions: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 26,
  },
  audioControls: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  audioButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.tint,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 8,
    minHeight: 60,
  },
  audioButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  audioButtonSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundCard,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.tint,
    gap: 8,
  },
  audioButtonTextSecondary: {
    color: Colors.tint,
    fontSize: 16,
    fontWeight: '600',
  },
  progressBarContainer: {
    width: '100%',
    marginTop: 16,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.tint,
    borderRadius: 3,
  },
  audioHint: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  wordListFallback: {
    marginTop: 20,
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.warning,
    borderStyle: 'dashed',
  },
  wordListTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  wordListText: {
    color: Colors.text,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  audioHeardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent + '20',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    gap: 8,
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  audioHeardText: {
    color: Colors.accent,
    fontSize: 16,
    fontWeight: '700',
  },
  audioRecallContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  recallPrompt: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  audioRecallInput: {
    backgroundColor: Colors.inputBackground,
    borderRadius: 12,
    padding: 16,
    color: Colors.text,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    marginBottom: 16,
  },
  submitRecallButton: {
    backgroundColor: Colors.buttonPrimary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  submitRecallButtonDisabled: {
    backgroundColor: Colors.textLight,
    opacity: 0.5,
  },
  submitRecallButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },

  // Recognition Styles
  recognitionContainer: {
    gap: 20,
  },
  recognitionImageContainer: {
    width: '100%',
    minHeight: 200,
    maxHeight: 400,
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.cardBorder,
  },
  recognitionImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
  },
  recognitionPlaceholder: {
    width: '100%',
    minHeight: 200,
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.cardBorder,
  },
  recognitionPlaceholderText: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
  },
  recognitionOptions: {
    gap: 12,
  },
  recognitionPrompt: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  recognitionOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
  },
  recognitionOptionCardSelected: {
    backgroundColor: Colors.tint + '20',
    borderColor: Colors.tint,
  },
  recognitionOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundNav,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  recognitionOptionIconSelected: {
    backgroundColor: Colors.tint,
  },
  recognitionOptionText: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: '500',
    flex: 1,
  },
  recognitionOptionTextSelected: {
    color: Colors.tint,
    fontWeight: '700',
  },

  // Story Reading Styles
  storyContainer: {
    gap: 20,
  },
  storyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 8,
  },
  storyIcon: {
    fontSize: 48,
  },
  storyTitle: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: '700',
  },
  storyContentCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
    maxHeight: 400,
  },
  storyScrollView: {
    maxHeight: 360,
  },
  storyScrollContent: {
    paddingBottom: 8,
  },
  storyText: {
    color: Colors.text,
    fontSize: 17,
    lineHeight: 28,
    fontWeight: '400',
  },
  storyActions: {
    gap: 12,
  },
  storyReadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.buttonPrimary,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 12,
    minHeight: 64,
  },
  storyReadButtonCompleted: {
    backgroundColor: Colors.accent,
  },
  storyReadButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  storyHint: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
  },

  // Sequence Styles
  sequenceContainer: {
    gap: 20,
  },
  sequenceInstructions: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  sequenceSteps: {
    gap: 12,
  },
  sequenceStep: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
  },
  sequenceStepCompleted: {
    backgroundColor: Colors.accent + '20',
    borderColor: Colors.accent,
  },
  sequenceStepIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.backgroundNav,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  sequenceStepIconCompleted: {
    backgroundColor: Colors.accent,
  },
  sequenceStepNumber: {
    color: Colors.tint,
    fontSize: 20,
    fontWeight: '700',
  },
  sequenceStepText: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: '500',
    flex: 1,
  },
  sequenceStepTextCompleted: {
    color: Colors.accent,
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  sequenceProgress: {
    backgroundColor: Colors.backgroundNav,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  sequenceProgressText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },

  // Drawing Styles
  drawingContainer: {
    gap: 20,
  },
  drawingCanvasContainer: {
    gap: 16,
  },
  drawingCanvasWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 400,
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
  },
  drawingReference: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  drawingReferenceLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  drawingReferenceImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  drawingControls: {
    gap: 12,
  },
  drawingButtonSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundCard,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.tint,
    gap: 8,
  },
  drawingButtonTextSecondary: {
    color: Colors.tint,
    fontSize: 16,
    fontWeight: '600',
  },
  drawingDescriptionInput: {
    backgroundColor: Colors.inputBackground,
    borderRadius: 12,
    padding: 16,
    color: Colors.text,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 2,
    borderColor: Colors.inputBorder,
  },
  drawingButtonPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.buttonPrimary,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 12,
    minHeight: 64,
  },
  drawingButtonDisabled: {
    backgroundColor: Colors.textLight,
    opacity: 0.5,
  },
  drawingButtonTextPrimary: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },

  // Stroop Audio Styles
  stroopContainer: {
    gap: 24,
  },
  stroopWordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 8,
  },
  stroopWordCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: 24,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  stroopWord: {
    fontSize: 32,
    fontWeight: '900',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  stroopInstructions: {
    backgroundColor: Colors.backgroundNav,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.tint,
  },
  stroopInstructionText: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 24,
  },
  stroopRecordingContainer: {
    gap: 16,
  },
  stroopRecordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.buttonPrimary,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 12,
    minHeight: 64,
  },
  stroopRecordButtonActive: {
    backgroundColor: Colors.error,
  },
  stroopRecordButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  stroopRecordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.error + '20',
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: Colors.error,
  },
  stroopPulse: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.error,
  },
  stroopRecordingText: {
    color: Colors.error,
    fontSize: 16,
    fontWeight: '700',
  },
  stroopTranscriptionBox: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.tint,
  },
  stroopTranscriptionLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  stroopTranscriptionText: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
  },
  stroopSubmitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 12,
    minHeight: 64,
  },
  stroopSubmitButtonDisabled: {
    backgroundColor: Colors.textLight,
    opacity: 0.5,
  },
  stroopSubmitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  stroopSubmittedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent + '20',
    borderRadius: 12,
    padding: 16,
    gap: 8,
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  stroopSubmittedText: {
    color: Colors.accent,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default InteractiveTestInterface;

