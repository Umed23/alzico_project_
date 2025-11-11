# app.py

import joblib
import pandas as pd
from flask import Flask, request, jsonify, session
from flask_cors import CORS
import json
from database import db
import os
from datetime import datetime
from twilio.rest import Client

# 1. Initialize the Flask App
app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'your-secret-key-change-this')
# Enable CORS for development to allow mobile/web app to call the API
CORS(app, supports_credentials=True)

# Twilio SMS Configuration
TWILIO_ACCOUNT_SID = os.environ.get('TWILIO_ACCOUNT_SID', '')
TWILIO_AUTH_TOKEN = os.environ.get('TWILIO_AUTH_TOKEN', '')
TWILIO_PHONE_NUMBER = os.environ.get('TWILIO_PHONE_NUMBER', '')
# Emergency contact phone number - SET THIS TO YOUR NUMBER
# You can set it via environment variable EMERGENCY_CONTACT_PHONE
# Or update it directly here (replace with your actual phone number)
EMERGENCY_CONTACT_PHONE = os.environ.get('EMERGENCY_CONTACT_PHONE', '+19372881136')  # Emergency contact: +1 937 288 1136

# Initialize Twilio client if credentials are provided
twilio_client = None
if TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN:
    try:
        twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        print("Twilio SMS client initialized successfully")
    except Exception as e:
        print(f"Warning: Could not initialize Twilio client: {e}")
        print("SOS SMS functionality will not work until Twilio credentials are configured")
else:
    print("Warning: Twilio credentials not found. SOS SMS functionality disabled.")
    print("Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER, and EMERGENCY_CONTACT_PHONE environment variables")

# 2. Load the trained model pipeline
# This is done only once when the server starts
try:
    # Try to load the original model first
    model_pipeline = joblib.load("final_alz_model.joblib")
    print("Original model pipeline loaded successfully.")
except (FileNotFoundError, ValueError, Exception) as e:
    print(f"Could not load original model ({e}), using mock model for testing.")
    # Import and use mock model
    from mock_model import MockAlzheimerModel
    model_pipeline = MockAlzheimerModel()
    # Fit with dummy data
    import pandas as pd
    import numpy as np
    dummy_X = pd.DataFrame({
        'MMSE__TOTSCORE': [30, 25, 15, 28, 22, 12],
        'ADAS__TOTSCORE': [5, 12, 25, 8, 15, 30],
        'CDR__GLOBAL': [0, 0.5, 2, 0, 1, 3],
        'FAQ__TOTAL': [0, 3, 8, 1, 5, 10],
        'MOCA__TOTAL': [28, 22, 15, 26, 20, 12],
        'AVLT__IMMEDIATE': [45, 35, 20, 40, 30, 15]
    })
    dummy_y = np.array(['Normal', 'Normal', 'Alzheimer Disease', 'Normal', 'Mild Cognitive Impairment', 'Alzheimer Disease'])
    model_pipeline.fit(dummy_X, dummy_y)
    print("Mock model loaded and fitted successfully.")

# 3. Authentication Endpoints
@app.route('/auth/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        if not data or 'email' not in data or 'password' not in data or 'fullName' not in data:
            return jsonify({"error": "Missing required fields"}), 400
        
        success, result = db.create_user(
            email=data['email'],
            password=data['password'],
            full_name=data['fullName']
        )
        
        if success:
            return jsonify({
                "success": True,
                "user": result,
                "message": "User created successfully"
            }), 201
        else:
            return jsonify({"error": result}), 400
            
    except Exception as e:
        return jsonify({"error": f"Registration failed: {str(e)}"}), 500

@app.route('/auth/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({"error": "Missing email or password"}), 400
        
        success, result = db.authenticate_user(
            email=data['email'],
            password=data['password']
        )
        
        if success:
            # Create session
            session_success, session_token = db.create_session(result['id'])
            if session_success:
                return jsonify({
                    "success": True,
                    "user": result,
                    "sessionToken": session_token,
                    "message": "Login successful"
                }), 200
            else:
                return jsonify({"error": "Failed to create session"}), 500
        else:
            return jsonify({"error": result}), 401
            
    except Exception as e:
        return jsonify({"error": f"Login failed: {str(e)}"}), 500

@app.route('/auth/logout', methods=['POST'])
def logout():
    """Logout user"""
    try:
        # In a real implementation, you'd invalidate the session token
        return jsonify({"success": True, "message": "Logout successful"}), 200
    except Exception as e:
        return jsonify({"error": f"Logout failed: {str(e)}"}), 500

@app.route('/auth/validate', methods=['POST'])
def validate_session():
    """Validate user session"""
    try:
        data = request.get_json()
        if not data or 'sessionToken' not in data:
            return jsonify({"error": "Missing session token"}), 400
        
        success, result = db.validate_session(data['sessionToken'])
        if success:
            return jsonify({"success": True, "user": result}), 200
        else:
            return jsonify({"error": result}), 401
            
    except Exception as e:
        return jsonify({"error": f"Session validation failed: {str(e)}"}), 500

@app.route('/user/history', methods=['GET'])
def get_user_history():
    """Get user's test history"""
    try:
        session_token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not session_token:
            return jsonify({"error": "Missing session token"}), 401
        
        # Validate session
        success, user = db.validate_session(session_token)
        if not success:
            return jsonify({"error": "Invalid session"}), 401
        
        # Get user history
        success, history = db.get_user_history(user['id'])
        if success:
            return jsonify({"success": True, "history": history}), 200
        else:
            return jsonify({"error": history}), 500
            
    except Exception as e:
        return jsonify({"error": f"Failed to get history: {str(e)}"}), 500

# 4. Define the Prediction Endpoint
@app.route('/predict', methods=['POST'])
def predict():
    """
    Receives cognitive test data as JSON, makes a prediction, 
    and returns the result.
    """
    if model_pipeline is None:
        return jsonify({"error": "Model is not loaded."}), 500

    # Get the JSON data sent from the mobile app
    data = request.get_json()

    if data is None:
        return jsonify({"error": "Invalid JSON input."}), 400

    # Convert the incoming JSON data into a pandas DataFrame
    # The JSON should be a dictionary where keys are feature names
    # and values are the scores/data for a single prediction.
    # Example: {"MMSE__TOTSCORE": 28, "ADAS__TOTSCORE": 15, ...}
    try:
        # Create single-row DataFrame from incoming JSON
        raw_df = pd.DataFrame([data])
        print(f"Received data for prediction (raw): \n{raw_df}")

        # Align columns to the training-time expected schema when possible
        expected_cols = None
        # Try common places where sklearn stores feature names
        for obj in [model_pipeline,
                    getattr(model_pipeline, 'named_steps', None) or {}.get('pre'),
                    getattr(model_pipeline, 'named_steps', None) or {}.get('transformer'),
                    getattr(model_pipeline, 'named_steps', None) or {}.get('preprocessor')]:
            if obj is None:
                continue
            if hasattr(obj, 'feature_names_in_'):
                expected_cols = list(obj.feature_names_in_)
                break

        if expected_cols is None and hasattr(model_pipeline, 'feature_names_in_'):
            expected_cols = list(model_pipeline.feature_names_in_)

        if expected_cols:
            # Build a new DF with all expected columns, fill missing with 0
            aligned = pd.DataFrame(columns=expected_cols)
            for col in expected_cols:
                aligned[col] = raw_df[col] if col in raw_df.columns else 0
            input_df = aligned.astype(float, errors='ignore')
            # Log any extras in the payload that are not used
            extra = [c for c in raw_df.columns if c not in expected_cols]
            if extra:
                print(f"Ignoring extra input columns not in training schema: {extra[:10]}{'...' if len(extra)>10 else ''}")
        else:
            # Fall back to whatever was sent
            input_df = raw_df

        print(f"Prediction input (aligned): columns={list(input_df.columns)[:10]}{'...' if input_df.shape[1]>10 else ''}")
    except Exception as e:
        return jsonify({"error": f"Failed to prepare input: {str(e)}"}), 400

    # 4. Make a Prediction
    try:
        # The .predict() method on the pipeline will handle all preprocessing
        prediction = model_pipeline.predict(input_df)
        
        # The model might also support predict_proba to get confidence scores
        if hasattr(model_pipeline, "predict_proba"):
            probabilities = model_pipeline.predict_proba(input_df)
            # Create a nice dictionary of class probabilities
            classes = model_pipeline.classes_
            prob_dict = {classes[i]: probabilities[0][i] for i in range(len(classes))}
        else:
            prob_dict = {}

        # 5. Save the test response if user is authenticated
        session_token = request.headers.get('Authorization', '').replace('Bearer ', '')
        user_id = None
        if session_token:
            success, user = db.validate_session(session_token)
            if success:
                user_id = user['id']
                # Save test response to database
                test_name = data.get('testName', 'Unknown Test')
                db.save_test_response(
                    user_id=user_id,
                    test_name=test_name,
                    test_data=data,
                    score=data.get('score'),
                    prediction={'prediction': prediction[0], 'probabilities': prob_dict}
                )

        # 6. Format the Response
        # The prediction is a numpy array, so we get the first element
        result = {
            'prediction': prediction[0],
            'probabilities': prob_dict,
            'saved': user_id is not None
        }
        print(f"Returning prediction: {result}")
        return jsonify(result)

    except Exception as e:
        # This will catch errors during the prediction step
        print(f"Error during prediction: {str(e)}")
        return jsonify({"error": f"An error occurred during prediction: {str(e)}"}), 500

# Health check route
@app.route('/', methods=['GET'])
def health_check():
    return "Server is running and ready to make predictions!"

# SOS Emergency SMS Endpoint
@app.route('/sos/send', methods=['POST'])
def send_sos_sms():
    """
    Send an emergency SMS alert when SOS is triggered
    """
    try:
        data = request.get_json() or {}
        session_token = request.headers.get('Authorization', '').replace('Bearer ', '')
        
        # Get user info if available
        user_info = "Unknown User"
        location = data.get('location', 'Location not provided')
        
        if session_token:
            success, user = db.validate_session(session_token)
            if success:
                user_info = f"{user.get('full_name', user.get('email', 'User'))} (Email: {user.get('email', 'N/A')})"
        
        # Check if Twilio is configured
        if not twilio_client:
            return jsonify({
                "success": False,
                "error": "SMS service not configured. Please set Twilio credentials in environment variables."
            }), 503
        
        # Check if emergency contact phone is set
        if not EMERGENCY_CONTACT_PHONE or EMERGENCY_CONTACT_PHONE == '':
            return jsonify({
                "success": False,
                "error": "Emergency contact phone number not configured. Please set EMERGENCY_CONTACT_PHONE in environment variables or app.py"
            }), 503
        
        # Prepare the emergency message
        message_body = f"""🚨 EMERGENCY ALERT - Alzico App

User: {user_info}
Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
Location: {location}

An emergency SOS was triggered from the Alzico Alzheimer's Detection App. Please check on the user immediately.

This is an automated alert from the Alzico system."""

        # Send SMS
        try:
            message = twilio_client.messages.create(
                body=message_body,
                from_=TWILIO_PHONE_NUMBER,
                to=EMERGENCY_CONTACT_PHONE
            )
            
            return jsonify({
                "success": True,
                "message": "Emergency SMS sent successfully",
                "message_sid": message.sid,
                "recipient": EMERGENCY_CONTACT_PHONE
            }), 200
            
        except Exception as sms_error:
            print(f"Error sending SMS: {sms_error}")
            return jsonify({
                "success": False,
                "error": f"Failed to send SMS: {str(sms_error)}"
            }), 500
            
    except Exception as e:
        print(f"SOS endpoint error: {e}")
        return jsonify({
            "success": False,
            "error": f"An error occurred: {str(e)}"
        }), 500

# Introspection endpoint to aid clients building the payload
@app.route('/features', methods=['GET'])
def features():
    try:
        expected_cols = None
        for obj in [model_pipeline,
                    getattr(model_pipeline, 'named_steps', None) or {}.get('pre'),
                    getattr(model_pipeline, 'named_steps', None) or {}.get('transformer'),
                    getattr(model_pipeline, 'named_steps', None) or {}.get('preprocessor')]:
            if obj is None:
                continue
            if hasattr(obj, 'feature_names_in_'):
                expected_cols = list(obj.feature_names_in_)
                break

        classes = list(getattr(model_pipeline, 'classes_', []))
        return jsonify({
            'expected_features': expected_cols,
            'classes': classes
        })
    except Exception as e:
        return jsonify({"error": f"Failed to fetch features: {str(e)}"}), 500

# 6. Run the Server
if __name__ == '__main__':
    # Use port 5000 and make the server accessible on your network
    app.run(host='0.0.0.0', port=5000, debug=True)