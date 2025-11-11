/**
 * Test Results Management Utility
 * Handles test result storage, analysis, and reporting
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface TestResult {
  id: string;
  testId: string;
  testName: string;
  userId: string;
  score: number;
  maxScore: number;
  percentage: number;
  severity: string;
  duration: number;
  timestamp: string;
  date: string;
  testNumber: number;
  version: string;
  answers?: any[];
  metadata?: any;
}

export interface DashboardSummary {
  totalTests: number;
  testsThisWeek: number;
  testsThisMonth: number;
  averageScore: number;
  recentTrend: string;
  topPerformingTests: Array<{
    testId: string;
    testName: string;
    totalTests: number;
    averageScore: number;
  }>;
  severityBreakdown: Record<string, number>;
}

export interface TestPerformanceStats {
  improvementTrend: Array<{
    testNumber: number;
    score: number;
    date: string;
  }>;
  testTypeBreakdown: Record<string, number>;
  monthlyProgress: Array<{
    month: string;
    averageScore: number;
    testCount: number;
  }>;
}

export class TestResultsManager {
  private storageKey: string;
  private results: TestResult[];

  constructor() {
    this.storageKey = 'alzico_test_results';
    this.results = [];
    this.loadResults();
  }

  /**
   * Load results from storage
   */
  async loadResults(): Promise<void> {
    try {
      const storedResults = await AsyncStorage.getItem(this.storageKey);
      if (storedResults) {
        this.results = JSON.parse(storedResults);
      }
    } catch (error) {
      console.error('Error loading test results:', error);
      this.results = [];
    }
  }

  /**
   * Save results to storage
   */
  async saveResults(): Promise<void> {
    try {
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(this.results));
    } catch (error) {
      console.error('Error saving test results:', error);
    }
  }

  /**
   * Add a new test result
   */
  async addResult(result: Omit<TestResult, 'id' | 'timestamp' | 'version'>): Promise<TestResult> {
    const resultWithId: TestResult = {
      ...result,
      id: this.generateResultId(),
      timestamp: new Date().toISOString(),
      version: '1.0'
    };

    this.results.push(resultWithId);
    await this.saveResults();
    return resultWithId;
  }

  /**
   * Get all test results
   */
  getAllResults(): TestResult[] {
    return this.results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  /**
   * Get results for a specific test
   */
  getResultsByTest(testId: string): TestResult[] {
    return this.results.filter(result => result.testId === testId);
  }

  /**
   * Get results for a specific user
   */
  getResultsByUser(userId: string): TestResult[] {
    return this.results.filter(result => result.userId === userId);
  }

  /**
   * Get a specific result by ID
   */
  getResultById(resultId: string): TestResult | undefined {
    return this.results.find(result => result.id === resultId);
  }

  /**
   * Get recent results (last N days)
   */
  getRecentResults(days: number = 30): TestResult[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return this.results.filter(result => 
      new Date(result.timestamp) >= cutoffDate
    );
  }

  /**
   * Delete a test result
   */
  async deleteResult(resultId: string): Promise<boolean> {
    try {
      const initialLength = this.results.length;
      this.results = this.results.filter(result => result.id !== resultId);
      
      if (this.results.length < initialLength) {
        await this.saveResults();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting test result:', error);
      return false;
    }
  }

  /**
   * Clear all test results
   */
  async clearAllResults(): Promise<void> {
    try {
      this.results = [];
      await AsyncStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Error clearing test results:', error);
    }
  }

  /**
   * Generate a unique result ID
   */
  private generateResultId(): string {
    return `result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get dashboard summary data
   */
  async getDashboardSummary(): Promise<DashboardSummary> {
    const allResults = this.getAllResults();
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const testsThisWeek = allResults.filter(result => 
      new Date(result.timestamp) >= weekAgo
    ).length;

    const testsThisMonth = allResults.filter(result => 
      new Date(result.timestamp) >= monthAgo
    ).length;

    const averageScore = allResults.length > 0 
      ? Math.round(allResults.reduce((sum, result) => sum + result.percentage, 0) / allResults.length)
      : 0;

    const recentTrend = this.calculateTrend(allResults.slice(0, 5));
    const topPerformingTests = this.getTopPerformingTests(allResults);
    const severityBreakdown = this.getSeverityBreakdown(allResults);

    return {
      totalTests: allResults.length,
      testsThisWeek,
      testsThisMonth,
      averageScore,
      recentTrend,
      topPerformingTests,
      severityBreakdown
    };
  }

  /**
   * Get test performance statistics
   */
  async getTestPerformanceStats(): Promise<TestPerformanceStats> {
    const allResults = this.getAllResults();
    
    const improvementTrend = this.getImprovementTrend(allResults);
    const testTypeBreakdown = this.getTestTypeBreakdown(allResults);
    const monthlyProgress = this.getMonthlyProgress(allResults);

    return {
      improvementTrend,
      testTypeBreakdown,
      monthlyProgress
    };
  }

  /**
   * Calculate performance trend
   */
  private calculateTrend(recentResults: TestResult[]): string {
    if (recentResults.length < 2) return 'stable';
    
    const scores = recentResults.map(r => r.percentage);
    const firstHalf = scores.slice(0, Math.ceil(scores.length / 2));
    const secondHalf = scores.slice(Math.ceil(scores.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, score) => sum + score, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, score) => sum + score, 0) / secondHalf.length;
    
    const difference = secondAvg - firstAvg;
    
    if (difference > 5) return 'improving';
    if (difference < -5) return 'declining';
    return 'stable';
  }

  /**
   * Get top performing tests
   */
  private getTopPerformingTests(allResults: TestResult[]): Array<{
    testId: string;
    testName: string;
    totalTests: number;
    averageScore: number;
  }> {
    const testStats = new Map<string, { totalTests: number; totalScore: number }>();
    
    allResults.forEach(result => {
      const existing = testStats.get(result.testId) || { totalTests: 0, totalScore: 0 };
      existing.totalTests += 1;
      existing.totalScore += result.percentage;
      testStats.set(result.testId, existing);
    });

    return Array.from(testStats.entries())
      .map(([testId, stats]) => {
        const testName = allResults.find(r => r.testId === testId)?.testName || 'Unknown Test';
        return {
          testId,
          testName,
          totalTests: stats.totalTests,
          averageScore: Math.round(stats.totalScore / stats.totalTests)
        };
      })
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, 5);
  }

  /**
   * Get severity breakdown
   */
  private getSeverityBreakdown(allResults: TestResult[]): Record<string, number> {
    const breakdown: Record<string, number> = {};
    
    allResults.forEach(result => {
      const severity = result.severity.toLowerCase();
      breakdown[severity] = (breakdown[severity] || 0) + 1;
    });
    
    return breakdown;
  }

  /**
   * Get improvement trend
   */
  private getImprovementTrend(allResults: TestResult[]): Array<{
    testNumber: number;
    score: number;
    date: string;
  }> {
    return allResults.slice(0, 10).map((result, index) => ({
      testNumber: allResults.length - index,
      score: result.percentage,
      date: result.date
    }));
  }

  /**
   * Get test type breakdown
   */
  private getTestTypeBreakdown(allResults: TestResult[]): Record<string, number> {
    const breakdown: Record<string, number> = {};
    
    allResults.forEach(result => {
      breakdown[result.testName] = (breakdown[result.testName] || 0) + 1;
    });
    
    return breakdown;
  }

  /**
   * Get monthly progress
   */
  private getMonthlyProgress(allResults: TestResult[]): Array<{
    month: string;
    averageScore: number;
    testCount: number;
  }> {
    const monthlyData = new Map<string, { totalScore: number; count: number }>();
    
    allResults.forEach(result => {
      const month = new Date(result.timestamp).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      });
      
      const existing = monthlyData.get(month) || { totalScore: 0, count: 0 };
      existing.totalScore += result.percentage;
      existing.count += 1;
      monthlyData.set(month, existing);
    });

    return Array.from(monthlyData.entries())
      .map(([month, data]) => ({
        month,
        averageScore: Math.round(data.totalScore / data.count),
        testCount: data.count
      }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  }

  /**
   * Export results to JSON
   */
  async exportResults(): Promise<string> {
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        totalResults: this.results.length,
        results: this.results
      };
      
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Error exporting results:', error);
      throw error;
    }
  }

  /**
   * Import results from JSON
   */
  async importResults(jsonData: string): Promise<boolean> {
    try {
      const importData = JSON.parse(jsonData);
      
      if (importData.results && Array.isArray(importData.results)) {
        this.results = importData.results;
        await this.saveResults();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error importing results:', error);
      return false;
    }
  }
}

// Export utility functions for direct use
export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const manager = new TestResultsManager();
  await manager.loadResults();
  return manager.getDashboardSummary();
};

export const getTestPerformanceStats = async (): Promise<TestPerformanceStats> => {
  const manager = new TestResultsManager();
  await manager.loadResults();
  return manager.getTestPerformanceStats();
};

export const addTestResult = async (result: Omit<TestResult, 'id' | 'timestamp' | 'version'>): Promise<TestResult> => {
  const manager = new TestResultsManager();
  await manager.loadResults();
  return manager.addResult(result);
};

export const getAllTestResults = async (): Promise<TestResult[]> => {
  const manager = new TestResultsManager();
  await manager.loadResults();
  return manager.getAllResults();
};

export const deleteTestResult = async (resultId: string): Promise<boolean> => {
  const manager = new TestResultsManager();
  await manager.loadResults();
  return manager.deleteResult(resultId);
};

export const clearAllTestResults = async (): Promise<void> => {
  const manager = new TestResultsManager();
  await manager.loadResults();
  return manager.clearAllResults();
}; 