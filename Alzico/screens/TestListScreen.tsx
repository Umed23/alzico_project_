import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  TextInput,
  StatusBar,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { COGNITIVE_TESTS, getTestsByCategory, getTestCategories, CognitiveTest } from '../utils/cognitiveTests';
import ModernNavbar from '../components/ModernNavbar';
import WebIcon from '../components/WebIcons';
import Colors from '../constants/Colors';

type TestListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TestList'>;

const { width, height } = Dimensions.get('window');

const TestListScreen = () => {
  const navigation = useNavigation<TestListScreenNavigationProp>();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTests, setFilteredTests] = useState<CognitiveTest[]>(COGNITIVE_TESTS);

  const categories = ['All', ...getTestCategories()];

  useEffect(() => {
    filterTests();
  }, [selectedCategory, searchQuery]);

  const filterTests = () => {
    let filtered = COGNITIVE_TESTS;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = getTestsByCategory(selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(test => 
        test.name.toLowerCase().includes(query) ||
        test.fullName.toLowerCase().includes(query) ||
        test.description.toLowerCase().includes(query) ||
        test.category.toLowerCase().includes(query)
      );
    }

    setFilteredTests(filtered);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return Colors.success;
      case 'Medium':
        return Colors.warning;
      case 'Hard':
        return Colors.error;
      default:
        return Colors.textLight;
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return '🟢';
      case 'Medium':
        return '🟡';
      case 'Hard':
        return '🔴';
      default:
        return '⚪';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Global Cognitive Assessment':
        return '🧠';
      case 'Language & Memory':
        return '💬';
      case 'Memory & Learning':
        return '📚';
      case 'Visuospatial & Executive':
        return '🎨';
      case 'Memory & Comprehension':
        return '📖';
      case 'Comprehensive Assessment':
        return '🔍';
      case 'Attention & Executive':
        return '⚡';
      case 'Memory & Attention':
        return '🧩';
      case 'Language & Executive':
        return '🗣️';
      case 'Memory & Language':
        return '📝';
      case 'Executive Function':
        return '🎯';
      default:
        return '📋';
    }
  };

  const handleTestPress = (test: CognitiveTest) => {
    navigation.navigate('TestInterface', {
      testId: test.id,
      testName: test.name
    });
  };

  const renderTestCard = (test: CognitiveTest) => (
    <TouchableOpacity
      key={test.id}
      style={styles.testCard}
      onPress={() => handleTestPress(test)}
      activeOpacity={0.8}
    >
      <View style={styles.testHeader}>
        <View style={styles.testTitleContainer}>
          <Text style={styles.testName}>{test.name}</Text>
          <Text style={styles.testFullName}>{test.fullName}</Text>
        </View>
        <View style={styles.testBadges}>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(test.difficulty) }]}>
            <Text style={styles.difficultyIcon}>{getDifficultyIcon(test.difficulty)}</Text>
            <Text style={styles.difficultyText}>{test.difficulty}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.testDescription}>{test.description}</Text>

      <View style={styles.testInfo}>
        <View style={styles.infoItem}>
          <Text style={styles.infoIcon}>⏱️</Text>
          <Text style={styles.infoText}>{test.duration} min</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoIcon}>📝</Text>
          <Text style={styles.infoText}>{test.questions.length} questions</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoIcon}>🎯</Text>
          <Text style={styles.infoText}>{test.maxScore} points</Text>
        </View>
      </View>

      <View style={styles.testFooter}>
        <View style={styles.categoryRow}>
          <Text style={styles.categoryIcon}>{getCategoryIcon(test.category)}</Text>
          <Text style={styles.categoryText}>{test.category}</Text>
        </View>
        <TouchableOpacity 
          style={styles.startButton}
          onPress={() => handleTestPress(test)}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>Start Test</Text>
          <Text style={styles.startButtonIcon}>→</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (filteredTests.length === 0 && (searchQuery.trim() || selectedCategory !== 'All')) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>🧠</Text>
            <Text style={styles.logoText}>Alzico</Text>
          </View>
          <Text style={styles.headerTitle}>Cognitive Tests</Text>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search tests..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.categoryContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.selectedCategoryButton
                ]}
                onPress={() => setSelectedCategory(category)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.categoryButtonText,
                  selectedCategory === category && styles.selectedCategoryButtonText
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsIcon}>🔍</Text>
          <Text style={styles.noResultsTitle}>No Tests Found</Text>
          <Text style={styles.noResultsText}>
            No tests match your current search criteria.
          </Text>
          <TouchableOpacity
            style={styles.clearFiltersButton}
            onPress={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.clearFiltersButtonText}>Clear Filters</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleWHOLink = () => {
    Linking.openURL('https://www.who.int/news-room/fact-sheets/detail/dementia');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ModernNavbar title="Cognitive Tests" showBackButton={true} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* WHO Awareness Card */}
          <View style={styles.contentPadding}>
            <TouchableOpacity 
              style={styles.whoCard} 
              onPress={handleWHOLink}
              activeOpacity={0.8}
            >
              <View style={styles.whoContent}>
                <Text style={styles.whoTitle}>WHO Alzheimer's Resources</Text>
                <Text style={styles.whoDescription}>Access official information and guidance</Text>
              </View>
              <View style={styles.whoButton}>
                <Text style={styles.whoButtonText}>Visit</Text>
              </View>
            </TouchableOpacity>
          </View>
          
          {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>🧠</Text>
            <Text style={styles.logoText}>Alzico</Text>
          </View>
          <Text style={styles.headerTitle}>Cognitive Tests</Text>
          <Text style={styles.headerSubtitle}>
            Comprehensive cognitive assessment tools for early detection
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search tests by name, description, or category..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Category Filter */}
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryTitle}>Filter by Category:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.selectedCategoryButton
                ]}
                onPress={() => setSelectedCategory(category)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.categoryButtonText,
                  selectedCategory === category && styles.selectedCategoryButtonText
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Test Count */}
        <View style={styles.testCountContainer}>
          <Text style={styles.testCountText}>
            {filteredTests.length} test{filteredTests.length !== 1 ? 's' : ''} available
          </Text>
        </View>

        {/* Test List */}
        <View style={styles.testListContainer}>
          {filteredTests.map(renderTestCard)}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            All tests are scientifically validated and designed for cognitive health assessment.
          </Text>
          <Text style={styles.footerText}>
            Results are for informational purposes only. Consult healthcare professionals for medical advice.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contentPadding: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  whoCard: {
    backgroundColor: Colors.tintLight + '30',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: Colors.tintLight,
  },
  whoContent: {
    flex: 1,
  },
  whoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  whoDescription: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  whoButton: {
    backgroundColor: Colors.tint,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    marginLeft: 14,
    minHeight: 44,
    cursor: 'pointer',
  },
  whoButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoIcon: {
    fontSize: 32,
    marginRight: 8,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 17,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: Colors.inputBackground,
    borderRadius: 16,
    padding: 18,
    color: Colors.text,
    fontSize: 17,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
  },
  categoryContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  categoryTitle: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 14,
    letterSpacing: 0.2,
  },
  categoryButton: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginRight: 12,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
    cursor: 'pointer',
  },
  selectedCategoryButton: {
    backgroundColor: Colors.tint,
    borderColor: Colors.tint,
  },
  categoryButtonText: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '500',
  },
  selectedCategoryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  testCountContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  testCountText: {
    color: Colors.textLight,
    fontSize: 15,
    fontStyle: 'italic',
    fontWeight: '500',
  },
  testListContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  testCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    padding: 24,
    marginBottom: 18,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  testTitleContainer: {
    flex: 1,
    marginRight: 14,
  },
  testName: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  testFullName: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 20,
    fontWeight: '500',
  },
  testBadges: {
    alignItems: 'flex-end',
  },
  difficultyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  difficultyIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  difficultyText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  testDescription: {
    color: Colors.text,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 18,
    fontWeight: '500',
  },
  testInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  infoText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  testFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  categoryText: {
    color: Colors.textLight,
    fontSize: 13,
    fontWeight: '500',
  },
  startButton: {
    backgroundColor: Colors.tint,
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    cursor: 'pointer',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginRight: 8,
    letterSpacing: 0.3,
  },
  startButtonIcon: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noResultsIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  noResultsTitle: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  noResultsText: {
    color: Colors.textSecondary,
    fontSize: 17,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 28,
    fontWeight: '500',
  },
  clearFiltersButton: {
    backgroundColor: Colors.tint + '25',
    borderRadius: 18,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: Colors.tint,
    minHeight: 48,
    cursor: 'pointer',
  },
  clearFiltersButtonText: {
    color: Colors.tint,
    fontSize: 17,
    fontWeight: '700',
  },
  footer: {
    padding: 24,
    paddingTop: 0,
  },
  footerText: {
    color: Colors.textLight,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 10,
    fontWeight: '500',
  },
});

export default TestListScreen;
