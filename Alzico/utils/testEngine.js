/**
 * Test Engine for Cognitive Tests
 * Handles test execution, scoring, and result processing
 */

import { getTestById } from './cognitiveTests';

export class TestEngine {
  constructor(testId) {
    this.testId = testId;
    this.test = getTestById(testId);
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.startTime = null;
    this.endTime = null;
    this.isCompleted = false;
  }

  /**
   * Start the test
   */
  startTest() {
    if (!this.test) {
      throw new Error('Test not found');
    }
    
    this.startTime = new Date();
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.isCompleted = false;
    
    return {
      test: this.test,
      currentQuestion: this.test.questions[0],
      totalQuestions: this.test.questions.length,
      timeLimit: this.test.questions[0]?.timeLimit || 0
    };
  }

  /**
   * Submit an answer for the current question
   */
  submitAnswer(answer) {
    if (this.isCompleted) {
      throw new Error('Test is already completed');
    }

    const currentQuestion = this.test.questions[this.currentQuestionIndex];
    if (!currentQuestion) {
      throw new Error('No current question');
    }

    // Store the answer
    this.answers[currentQuestion.id] = {
      answer,
      timestamp: new Date(),
      timeSpent: this.calculateTimeSpent()
    };

    return {
      answerStored: true,
      questionId: currentQuestion.id,
      nextQuestionIndex: this.currentQuestionIndex + 1
    };
  }

  /**
   * Move to the next question
   */
  nextQuestion() {
    if (this.currentQuestionIndex < this.test.questions.length - 1) {
      this.currentQuestionIndex++;
      const nextQuestion = this.test.questions[this.currentQuestionIndex];
      
      return {
        currentQuestion: nextQuestion,
        questionIndex: this.currentQuestionIndex,
        totalQuestions: this.test.questions.length,
        timeLimit: nextQuestion?.timeLimit || 0,
        hasNext: this.currentQuestionIndex < this.test.questions.length - 1
      };
    } else {
      // Test completed
      this.completeTest();
      return { completed: true };
    }
  }

  /**
   * Move to the previous question
   */
  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      const prevQuestion = this.test.questions[this.currentQuestionIndex];
      
      return {
        currentQuestion: prevQuestion,
        questionIndex: this.currentQuestionIndex,
        totalQuestions: this.test.questions.length,
        timeLimit: prevQuestion?.timeLimit || 0,
        hasPrevious: this.currentQuestionIndex > 0
      };
    }
    
    return { error: 'Already at first question' };
  }

  /**
   * Get current question information
   */
  getCurrentQuestion() {
    if (!this.test || this.isCompleted) {
      return null;
    }

    const currentQuestion = this.test.questions[this.currentQuestionIndex];
    return {
      question: currentQuestion,
      index: this.currentQuestionIndex,
      total: this.test.questions.length,
      timeLimit: currentQuestion?.timeLimit || 0,
      progress: ((this.currentQuestionIndex + 1) / this.test.questions.length) * 100
    };
  }

  /**
   * Calculate time spent on current question
   */
  calculateTimeSpent() {
    if (!this.startTime) return 0;
    
    const now = new Date();
    return Math.floor((now - this.startTime) / 1000); // in seconds
  }

  /**
   * Complete the test and calculate final results
   */
  completeTest() {
    if (this.isCompleted) {
      throw new Error('Test is already completed');
    }

    this.endTime = new Date();
    this.isCompleted = true;

    const results = this.calculateResults();
    return results;
  }

  /**
   * Calculate test results and scoring
   */
  calculateResults() {
    if (!this.isCompleted) {
      throw new Error('Test must be completed before calculating results');
    }

    let totalScore = 0;
    let answeredQuestions = 0;
    const questionResults = [];

    this.test.questions.forEach((question, index) => {
      const answerData = this.answers[question.id];
      let questionScore = 0;
      let isCorrect = false;
      let timeSpent = 0;

      if (answerData) {
        answeredQuestions++;
        timeSpent = answerData.timeSpent;

        // Calculate score based on question type
        switch (question.type) {
          case 'multiple-choice':
            isCorrect = answerData.answer === question.correctAnswer;
            questionScore = isCorrect ? question.points : 0;
            break;

          case 'text-input':
          case 'recall':
            // For text input, give partial credit for non-empty answers
            if (answerData.answer && answerData.answer.trim().length > 0) {
              questionScore = question.points;
              isCorrect = true;
            }
            break;

          case 'timed':
            // For timed questions, score based on completion and time
            if (answerData.answer === 'completed') {
              const timeRatio = Math.max(0, 1 - (timeSpent / (question.timeLimit || 1)));
              questionScore = Math.round(question.points * timeRatio);
              isCorrect = questionScore > 0;
            }
            break;

          default:
            // For other question types, give full credit for any answer
            questionScore = question.points;
            isCorrect = true;
            break;
        }
      }

      totalScore += questionScore;

      questionResults.push({
        questionId: question.id,
        questionText: question.question,
        questionType: question.type,
        userAnswer: answerData?.answer || null,
        correctAnswer: question.correctAnswer,
        isCorrect,
        points: question.points,
        earnedPoints: questionScore,
        timeSpent,
        timeLimit: question.timeLimit
      });
    });

    // Calculate percentage score
    const maxPossibleScore = this.test.scoring.totalPoints;
    const percentageScore = Math.round((totalScore / maxPossibleScore) * 100);

    // Determine severity level
    const severity = this.determineSeverity(percentageScore);

    // Calculate test duration
    const testDuration = Math.floor((this.endTime - this.startTime) / 1000 / 60); // in minutes

    return {
      testId: this.test.id,
      testName: this.test.name,
      testFullName: this.test.fullName,
      completionDate: this.endTime,
      duration: testDuration,
      totalQuestions: this.test.questions.length,
      answeredQuestions,
      maxScore: maxPossibleScore,
      rawScore: totalScore,
      percentageScore,
      severity,
      questionResults,
      interpretation: this.getInterpretation(severity),
      recommendations: this.getRecommendations(severity)
    };
  }

  /**
   * Determine severity level based on score
   */
  determineSeverity(percentageScore) {
    const { cutoffScores } = this.test.scoring;
    
    if (this.test.id === 'adas-cog13') {
      // ADAS-Cog13: Lower scores are better
      if (percentageScore <= (cutoffScores.mild / cutoffScores.totalPoints) * 100) {
        return 'Normal';
      } else if (percentageScore <= (cutoffScores.moderate / cutoffScores.totalPoints) * 100) {
        return 'Mild';
      } else if (percentageScore <= (cutoffScores.severe / cutoffScores.totalPoints) * 100) {
        return 'Moderate';
      } else {
        return 'Severe';
      }
    } else {
      // Other tests: Higher scores are better
      if (percentageScore >= (cutoffScores.normal / cutoffScores.totalPoints) * 100) {
        return 'Normal';
      } else if (percentageScore >= (cutoffScores.mild / cutoffScores.totalPoints) * 100) {
        return 'Mild';
      } else if (percentageScore >= (cutoffScores.moderate / cutoffScores.totalPoints) * 100) {
        return 'Moderate';
      } else {
        return 'Severe';
      }
    }
  }

  /**
   * Get interpretation text based on severity
   */
  getInterpretation(severity) {
    const { interpretation } = this.test;
    
    switch (severity.toLowerCase()) {
      case 'normal':
        return interpretation.normal;
      case 'mild':
        return interpretation.mild;
      case 'moderate':
        return interpretation.moderate;
      case 'severe':
        return interpretation.severe;
      default:
        return interpretation.normal;
    }
  }

  /**
   * Get recommendations based on severity
   */
  getRecommendations(severity) {
    const { interpretation } = this.test;
    return interpretation.recommendations || [];
  }

  /**
   * Get test progress
   */
  getProgress() {
    if (!this.test) return 0;
    
    const answeredCount = Object.keys(this.answers).length;
    return Math.round((answeredCount / this.test.questions.length) * 100);
  }

  /**
   * Check if test can be completed
   */
  canComplete() {
    return this.getProgress() >= 80; // Require at least 80% completion
  }

  /**
   * Get test statistics
   */
  getStatistics() {
    if (!this.test) return null;

    const totalTime = this.calculateTimeSpent();
    const avgTimePerQuestion = totalTime / Math.max(1, Object.keys(this.answers).length);
    
    return {
      totalTime,
      avgTimePerQuestion,
      progress: this.getProgress(),
      answeredQuestions: Object.keys(this.answers).length,
      totalQuestions: this.test.questions.length
    };
  }

  /**
   * Reset the test
   */
  reset() {
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.startTime = null;
    this.endTime = null;
    this.isCompleted = false;
  }
}

/**
 * Utility functions for test management
 */
export const TestUtils = {
  /**
   * Create a new test session
   */
  createTestSession: (testId) => {
    return new TestEngine(testId);
  },

  /**
   * Validate test completion
   */
  validateTestCompletion: (answers, questions) => {
    const requiredQuestions = questions.filter(q => q.required !== false);
    const answeredRequired = requiredQuestions.every(q => answers[q.id]);
    
    return {
      isValid: answeredRequired,
      completedQuestions: Object.keys(answers).length,
      totalQuestions: questions.length,
      requiredQuestions: requiredQuestions.length
    };
  },

  /**
   * Calculate estimated time remaining
   */
  calculateTimeRemaining: (startTime, totalTime, elapsedTime) => {
    const remaining = totalTime - elapsedTime;
    return Math.max(0, remaining);
  },

  /**
   * Format time for display
   */
  formatTime: (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
};

export default TestEngine; 