import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator, ClassifierMixin

class MockAlzheimerModel(BaseEstimator, ClassifierMixin):
    """Mock model for testing purposes"""
    
    def __init__(self):
        self.classes_ = np.array(['Normal', 'Mild Cognitive Impairment', 'Alzheimer Disease'])
        self.feature_names_in_ = [
            'MMSE__TOTSCORE', 'ADAS__TOTSCORE', 'CDR__GLOBAL', 
            'FAQ__TOTAL', 'MOCA__TOTAL', 'AVLT__IMMEDIATE'
        ]
    
    def fit(self, X, y=None):
        return self
    
    def predict(self, X):
        """Simple mock prediction based on MMSE score"""
        if hasattr(X, 'values'):
            mmse_scores = X['MMSE__TOTSCORE'].values if 'MMSE__TOTSCORE' in X.columns else np.array([25])
        else:
            mmse_scores = np.array([25])
        
        predictions = []
        for score in mmse_scores:
            if score >= 27:
                predictions.append('Normal')
            elif score >= 20:
                predictions.append('Mild Cognitive Impairment')
            else:
                predictions.append('Alzheimer Disease')
        
        return np.array(predictions)
    
    def predict_proba(self, X):
        """Mock probability predictions"""
        predictions = self.predict(X)
        proba = np.zeros((len(predictions), len(self.classes_)))
        
        for i, pred in enumerate(predictions):
            pred_idx = np.where(self.classes_ == pred)[0][0]
            proba[i, pred_idx] = 0.8
            # Add some uncertainty to other classes
            for j in range(len(self.classes_)):
                if j != pred_idx:
                    proba[i, j] = 0.1
        
        return proba

# Create and save the mock model
mock_model = MockAlzheimerModel()

# Create some dummy training data to fit the model
dummy_X = pd.DataFrame({
    'MMSE__TOTSCORE': [30, 25, 15, 28, 22, 12],
    'ADAS__TOTSCORE': [5, 12, 25, 8, 15, 30],
    'CDR__GLOBAL': [0, 0.5, 2, 0, 1, 3],
    'FAQ__TOTAL': [0, 3, 8, 1, 5, 10],
    'MOCA__TOTAL': [28, 22, 15, 26, 20, 12],
    'AVLT__IMMEDIATE': [45, 35, 20, 40, 30, 15]
})

dummy_y = np.array(['Normal', 'Normal', 'Alzheimer Disease', 'Normal', 'Mild Cognitive Impairment', 'Alzheimer Disease'])

# Fit the mock model
mock_model.fit(dummy_X, dummy_y)

print("Mock model created and fitted successfully!")
print(f"Classes: {mock_model.classes_}")
print(f"Features: {mock_model.feature_names_in_}")

# Test prediction
test_data = pd.DataFrame({
    'MMSE__TOTSCORE': [28],
    'ADAS__TOTSCORE': [8],
    'CDR__GLOBAL': [0],
    'FAQ__TOTAL': [2],
    'MOCA__TOTAL': [26],
    'AVLT__IMMEDIATE': [42]
})

prediction = mock_model.predict(test_data)
probabilities = mock_model.predict_proba(test_data)

print(f"\nTest prediction: {prediction[0]}")
print(f"Probabilities: {dict(zip(mock_model.classes_, probabilities[0]))}")
