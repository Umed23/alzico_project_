// services/PredictionService.ts

// Allow configuring the model API endpoint via environment; fallback to localhost
const API_BASE_URL =
  (process.env.REACT_APP_API_URL ||
    process.env.MODEL_API_URL ||
    'http://localhost:5000').replace(/\/$/, '');

const API_URL = `${API_BASE_URL}/predict`;

/**
 * Sends the cognitive test scores to the backend server to get a prediction.
 * @param testData An object containing the feature names and scores.
 * @param sessionToken Optional session token for authenticated requests.
 * @returns The prediction result from the model.
 */
export const getPrediction = async (testData: { [key: string]: any }, sessionToken?: string) => {
  try {
    console.log('Sending data to server:', testData);
    
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
    };
    
    if (sessionToken) {
      headers['Authorization'] = `Bearer ${sessionToken}`;
    }
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(testData),
    });

    if (!response.ok) {
      // If the server responds with an error, log it and throw an error.
      const errorText = await response.text();
      console.error('Server responded with an error:', errorText);
      throw new Error(`Server error: ${response.status}`);
    }

    const result = await response.json();
    console.log('Received prediction from server:', result);
    return result;

  } catch (error) {
    console.error('Failed to get prediction:', error);
    // Return a structured error so the UI can handle it
    return { error: 'Could not connect to the server. Please check the network.' };
  }
};