import React, { useState } from 'react';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [userName, setUserName] = useState('');

  const renderWelcomeScreen = () => (
    <div style={{ 
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      textAlign: 'center',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#4A90E2', fontSize: '2.5em', marginBottom: '10px' }}>
        🧠 Alzico
      </h1>
      <p style={{ fontSize: '1.3em', marginBottom: '30px', color: '#666' }}>
        Alzheimer's Detection App - Cognitive Assessment & Support
      </p>
      
      <div style={{ 
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '15px',
        maxWidth: '600px',
        margin: '0 auto',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#4A90E2', marginBottom: '20px' }}>Welcome to Alzico</h2>
        <p style={{ fontSize: '1.1em', marginBottom: '25px', lineHeight: '1.6' }}>
          Your comprehensive cognitive assessment platform for early detection and monitoring of cognitive changes.
        </p>
        
        <button 
          onClick={() => setCurrentScreen('login')}
          style={{
            backgroundColor: '#4A90E2',
            color: 'white',
            border: 'none',
            padding: '15px 30px',
            fontSize: '18px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Get Started
        </button>
      </div>
    </div>
  );

  const renderLoginScreen = () => (
    <div style={{ 
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      textAlign: 'center',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#4A90E2', fontSize: '2.5em', marginBottom: '10px' }}>
        🧠 Alzico
      </h1>
      
      <div style={{ 
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '15px',
        maxWidth: '500px',
        margin: '0 auto',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#4A90E2', marginBottom: '25px' }}>Patient Information</h2>
        
        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Full Name:
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your full name"
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #ddd',
              borderRadius: '6px',
              fontSize: '16px'
            }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button 
            onClick={() => setCurrentScreen('welcome')}
            style={{
              backgroundColor: '#666',
              color: 'white',
              border: 'none',
              padding: '12px 25px',
              fontSize: '16px',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Back
          </button>
          
          <button 
            onClick={() => setCurrentScreen('consent')}
            disabled={!userName.trim()}
            style={{
              backgroundColor: userName.trim() ? '#4A90E2' : '#ccc',
              color: 'white',
              border: 'none',
              padding: '12px 25px',
              fontSize: '16px',
              borderRadius: '6px',
              cursor: userName.trim() ? 'pointer' : 'not-allowed'
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );

  const renderConsentScreen = () => (
    <div style={{ 
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      textAlign: 'center',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#4A90E2', fontSize: '2.5em', marginBottom: '10px' }}>
        🧠 Alzico
      </h1>
      
      <div style={{ 
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '15px',
        maxWidth: '600px',
        margin: '0 auto',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#4A90E2', marginBottom: '25px' }}>Assessment Consent</h2>
        
        <div style={{ 
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '25px',
          textAlign: 'left',
          lineHeight: '1.6'
        }}>
          <p style={{ marginBottom: '15px' }}>
            <strong>Dear {userName},</strong>
          </p>
          <p style={{ marginBottom: '15px' }}>
            This cognitive assessment is designed to help evaluate your cognitive function and provide insights into your brain health.
          </p>
          <p style={{ marginBottom: '15px' }}>
            <strong>What to expect:</strong>
          </p>
          <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
            <li>Series of cognitive tests and exercises</li>
            <li>Assessment takes approximately 15-20 minutes</li>
            <li>Results are for educational purposes only</li>
            <li>Your privacy and data are protected</li>
          </ul>
          <p>
            <strong>Note:</strong> This is not a medical diagnosis. Please consult healthcare professionals for medical concerns.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button 
            onClick={() => setCurrentScreen('login')}
            style={{
              backgroundColor: '#666',
              color: 'white',
              border: 'none',
              padding: '12px 25px',
              fontSize: '16px',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Back
          </button>
          
          <button 
            onClick={() => setCurrentScreen('home')}
            style={{
              backgroundColor: '#4A90E2',
              color: 'white',
              border: 'none',
              padding: '12px 25px',
              fontSize: '16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            I Consent - Start Assessment
          </button>
        </div>
      </div>
    </div>
  );

  const renderHomeScreen = () => (
    <div style={{ 
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#4A90E2', fontSize: '2.5em', marginBottom: '5px' }}>
          🧠 Alzico
        </h1>
        <p style={{ fontSize: '1.2em', color: '#666' }}>
          Welcome back, {userName}!
        </p>
      </div>
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Daily Challenge Card */}
        <div style={{ 
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '15px',
          marginBottom: '25px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '2em', marginRight: '15px' }}>🏆</span>
            <h2 style={{ color: '#4A90E2', margin: 0 }}>Daily Challenge</h2>
          </div>
          <p style={{ fontSize: '1.1em', marginBottom: '20px', lineHeight: '1.6' }}>
            Complete today's cognitive exercises to maintain your brain health and track your progress over time.
          </p>
          <button 
            onClick={() => setCurrentScreen('tests')}
            style={{
              backgroundColor: '#4A90E2',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              fontSize: '18px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Start Challenge
          </button>
        </div>
        
        {/* Progress Overview */}
        <div style={{ 
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '15px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#4A90E2', marginBottom: '20px' }}>Your Progress</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
              <span style={{ fontSize: '2em', display: 'block', marginBottom: '10px' }}>🔥</span>
              <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#FF6B35' }}>7</div>
              <div style={{ color: '#666' }}>Day Streak</div>
            </div>
            
            <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
              <span style={{ fontSize: '2em', display: 'block', marginBottom: '10px' }}>⭐</span>
              <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#FFD700' }}>23</div>
              <div style={{ color: '#666' }}>Tests Completed</div>
            </div>
            
            <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
              <span style={{ fontSize: '2em', display: 'block', marginBottom: '10px' }}>📈</span>
              <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#34C759' }}>85%</div>
              <div style={{ color: '#666' }}>Average Score</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTestsScreen = () => (
    <div style={{ 
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#4A90E2', fontSize: '2.5em', marginBottom: '5px' }}>
          🧠 Alzico
        </h1>
        <p style={{ fontSize: '1.2em', color: '#666' }}>
          Cognitive Tests
        </p>
      </div>
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ 
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '15px',
          marginBottom: '25px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#4A90E2', marginBottom: '20px' }}>Available Tests</h2>
          
          <div style={{ display: 'grid', gap: '15px' }}>
            <div style={{ 
              padding: '20px', 
              border: '2px solid #e9ecef', 
              borderRadius: '10px',
              backgroundColor: '#f8f9fa'
            }}>
              <h3 style={{ color: '#4A90E2', marginBottom: '10px' }}>Memory Test</h3>
              <p style={{ marginBottom: '15px', color: '#666' }}>
                Test your short-term memory and recall abilities with pattern recognition exercises.
              </p>
              <button 
                style={{
                  backgroundColor: '#4A90E2',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Start Test
              </button>
            </div>
            
            <div style={{ 
              padding: '20px', 
              border: '2px solid #e9ecef', 
              borderRadius: '10px',
              backgroundColor: '#f8f9fa'
            }}>
              <h3 style={{ color: '#4A90E2', marginBottom: '10px' }}>Attention Test</h3>
              <p style={{ marginBottom: '15px', color: '#666' }}>
                Measure your focus and attention span with concentration exercises.
              </p>
              <button 
                style={{
                  backgroundColor: '#4A90E2',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Start Test
              </button>
            </div>
            
            <div style={{ 
              padding: '20px', 
              border: '2px solid #e9ecef', 
              borderRadius: '10px',
              backgroundColor: '#f8f9fa'
            }}>
              <h3 style={{ color: '#4A90E2', marginBottom: '10px' }}>Processing Speed</h3>
              <p style={{ marginBottom: '15px', color: '#666' }}>
                Evaluate how quickly you can process and respond to visual information.
              </p>
              <button 
                style={{
                  backgroundColor: '#4A90E2',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Start Test
              </button>
            </div>
          </div>
          
          <div style={{ marginTop: '25px', textAlign: 'center' }}>
            <button 
              onClick={() => setCurrentScreen('home')}
              style={{
                backgroundColor: '#666',
                color: 'white',
                border: 'none',
                padding: '12px 25px',
                fontSize: '16px',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render the appropriate screen based on current state
  switch (currentScreen) {
    case 'login':
      return renderLoginScreen();
    case 'consent':
      return renderConsentScreen();
    case 'home':
      return renderHomeScreen();
    case 'tests':
      return renderTestsScreen();
    default:
      return renderWelcomeScreen();
  }
};

export default App; 