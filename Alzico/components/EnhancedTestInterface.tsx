import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebIcon from './WebIcons';

const { width } = Dimensions.get('window');

interface EnhancedTestInterfaceProps {
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

const EnhancedTestInterface: React.FC<EnhancedTestInterfaceProps> = ({
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
  const [inputValue, setInputValue] = React.useState('');
  const currentAnswer = answers[currentQuestion.id] || null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (option: any) => {
    onAnswerSubmit(option);
  };

  const handleTextSubmit = () => {
    if (inputValue.trim()) {
      onAnswerSubmit(inputValue.trim());
      setInputValue('');
    }
  };

  const renderQuestionContent = () => {
    switch (currentQuestion.type) {
      case 'multiple-choice':
      case 'multiple_choice':
        return (
          <View style={styles.optionsContainer}>
            {currentQuestion.options?.map((option: any, index: number) => {
              const isSelected = currentAnswer === option.value || currentAnswer === option;
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
                  onPress={() => handleOptionSelect(option.value || option)}
                >
                  <View style={[styles.optionCircle, isSelected && styles.optionCircleSelected]}>
                    {isSelected && <View style={styles.optionCircleInner} />}
                  </View>
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                    {option.text || option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        );

      case 'text':
      case 'text-input':
      case 'text_input':
        return (
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              value={inputValue || currentAnswer || ''}
              onChangeText={setInputValue}
              placeholder="Type your answer here..."
              placeholderTextColor="#666"
              multiline
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleTextSubmit}
            >
              <Text style={styles.submitButtonText}>Submit Answer</Text>
            </TouchableOpacity>
          </View>
        );

      case 'number':
      case 'number-input':
      case 'number_input':
      case 'numeric':
        return (
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              value={inputValue || currentAnswer?.toString() || ''}
              onChangeText={setInputValue}
              placeholder="Enter a number..."
              placeholderTextColor="#666"
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleTextSubmit}
            >
              <Text style={styles.submitButtonText}>Submit Answer</Text>
            </TouchableOpacity>
          </View>
        );

      case 'scale':
      case 'rating':
        const scale = currentQuestion.scale || [1, 2, 3, 4, 5];
        return (
          <View style={styles.scaleContainer}>
            <View style={styles.scaleButtons}>
              {scale.map((value: number) => {
                const isSelected = currentAnswer === value;
                return (
                  <TouchableOpacity
                    key={value}
                    style={[styles.scaleButton, isSelected && styles.scaleButtonSelected]}
                    onPress={() => onAnswerSubmit(value)}
                  >
                    <Text style={[styles.scaleButtonText, isSelected && styles.scaleButtonTextSelected]}>
                      {value}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {currentQuestion.scaleLabels && (
              <View style={styles.scaleLabels}>
                <Text style={styles.scaleLabelText}>{currentQuestion.scaleLabels[0]}</Text>
                <Text style={styles.scaleLabelText}>{currentQuestion.scaleLabels[1]}</Text>
              </View>
            )}
          </View>
        );

      case 'boolean':
      case 'yes-no':
      case 'yes_no':
      case 'true-false':
      case 'true_false':
        return (
          <View style={styles.booleanContainer}>
            <TouchableOpacity
              style={[styles.booleanButton, currentAnswer === true && styles.booleanButtonSelected]}
              onPress={() => onAnswerSubmit(true)}
            >
              <WebIcon name="checkmark-circle" size={32} color={currentAnswer === true ? '#34C759' : '#666'} />
              <Text style={[styles.booleanText, currentAnswer === true && styles.booleanTextSelected]}>
                Yes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.booleanButton, currentAnswer === false && styles.booleanButtonSelected]}
              onPress={() => onAnswerSubmit(false)}
            >
              <WebIcon name="close-circle" size={32} color={currentAnswer === false ? '#FF3B30' : '#666'} />
              <Text style={[styles.booleanText, currentAnswer === false && styles.booleanTextSelected]}>
                No
              </Text>
            </TouchableOpacity>
          </View>
        );

      case 'sequence':
      case 'ordering':
      case 'recall':
      case 'memory':
      case 'list':
        // For sequence/memory recall questions - treat as text input
        return (
          <View style={styles.textInputContainer}>
            <Text style={styles.instructionText}>
              {currentQuestion.instruction || 'Enter your answer (separate items with commas)'}
            </Text>
            <TextInput
              style={styles.textInput}
              value={inputValue || currentAnswer || ''}
              onChangeText={setInputValue}
              placeholder="Enter your answer..."
              placeholderTextColor="#666"
              multiline
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleTextSubmit}
            >
              <Text style={styles.submitButtonText}>Submit Answer</Text>
            </TouchableOpacity>
          </View>
        );

      case 'drawing':
      case 'image':
      case 'visual':
        // For drawing/visual tasks - show instruction
        return (
          <View style={styles.visualContainer}>
            <Text style={styles.visualInstruction}>
              {currentQuestion.instruction || 'This question requires visual input. Please follow the instructions provided by the examiner.'}
            </Text>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => onAnswerSubmit('completed')}
            >
              <Text style={styles.submitButtonText}>Mark as Completed</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        // Fallback: treat unknown types as text input
        return (
          <View style={styles.textInputContainer}>
            <Text style={styles.warningText}>
              Question type "{currentQuestion.type}" - using text input
            </Text>
            <TextInput
              style={styles.textInput}
              value={inputValue || currentAnswer || ''}
              onChangeText={setInputValue}
              placeholder="Enter your answer..."
              placeholderTextColor="#666"
              multiline
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleTextSubmit}
            >
              <Text style={styles.submitButtonText}>Submit Answer</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Question {questionIndex + 1} of {totalQuestions}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${((questionIndex + 1) / totalQuestions) * 100}%` },
              ]}
            />
          </View>
        </View>
        {timeRemaining > 0 && (
          <View style={styles.timerContainer}>
            <WebIcon name="time" size={20} color="#FFC107" />
            <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
          </View>
        )}
      </View>

      {/* Question Content */}
      <ScrollView
        style={styles.contentContainer}
        contentContainerStyle={styles.contentContainerInner}
      >
        <View style={styles.questionCard}>
          <Text style={styles.questionNumber}>Question {questionIndex + 1}</Text>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
          
          {currentQuestion.description && (
            <Text style={styles.questionDescription}>{currentQuestion.description}</Text>
          )}

          {renderQuestionContent()}
        </View>
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[styles.navButton, questionIndex === 0 && styles.navButtonDisabled]}
          onPress={onPreviousQuestion}
          disabled={questionIndex === 0}
        >
          <WebIcon name="arrow-back" size={24} color={questionIndex === 0 ? '#666' : '#FFF'} />
          <Text style={[styles.navButtonText, questionIndex === 0 && styles.navButtonTextDisabled]}>
            Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButton,
            styles.navButtonNext,
            !currentAnswer && styles.navButtonDisabled,
          ]}
          onPress={onNextQuestion}
          disabled={!currentAnswer}
        >
          <Text style={[styles.navButtonText, !currentAnswer && styles.navButtonTextDisabled]}>
            {questionIndex === totalQuestions - 1 ? 'Finish' : 'Next'}
          </Text>
          <WebIcon name="arrow-forward" size={24} color={!currentAnswer ? '#666' : '#FFF'} />
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
    backgroundColor: '#1A1A2E',
    padding: 20,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressText: {
    color: '#B0B0B0',
    fontSize: 14,
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 3,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    padding: 12,
    borderRadius: 12,
  },
  timerText: {
    color: '#FFC107',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  contentContainer: {
    flex: 1,
  },
  contentContainerInner: {
    padding: 20,
  },
  questionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  questionNumber: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  questionText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    marginBottom: 16,
  },
  questionDescription: {
    color: '#B0B0B0',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  optionsContainer: {
    marginTop: 8,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionButtonSelected: {
    backgroundColor: 'rgba(74, 144, 226, 0.2)',
    borderColor: '#4A90E2',
  },
  optionCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#666',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionCircleSelected: {
    borderColor: '#4A90E2',
  },
  optionCircleInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4A90E2',
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 16,
    flex: 1,
  },
  optionTextSelected: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  textInputContainer: {
    marginTop: 8,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  scaleContainer: {
    marginTop: 8,
  },
  scaleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  scaleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  scaleButtonSelected: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  scaleButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  scaleButtonTextSelected: {
    color: '#FFFFFF',
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scaleLabelText: {
    color: '#B0B0B0',
    fontSize: 14,
  },
  booleanContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  booleanButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginHorizontal: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  booleanButtonSelected: {
    borderColor: '#4A90E2',
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
  },
  booleanText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
  },
  booleanTextSelected: {
    color: '#4A90E2',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#1A1A2E',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    paddingHorizontal: 24,
  },
  navButtonNext: {
    backgroundColor: '#4A90E2',
  },
  navButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    opacity: 0.5,
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 8,
  },
  navButtonTextDisabled: {
    color: '#666',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  instructionText: {
    color: '#4A90E2',
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  warningText: {
    color: '#FFC107',
    fontSize: 14,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  visualContainer: {
    marginTop: 8,
    padding: 20,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.3)',
  },
  visualInstruction: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default EnhancedTestInterface;
