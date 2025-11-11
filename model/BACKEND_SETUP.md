# 🐍 Alzico Backend Setup Guide

## 📋 Prerequisites

### Required Software
- **Python 3.8+** - [Download here](https://www.python.org/downloads/)
- **pip** - (comes with Python)
- **Virtual Environment** - (comes with Python)

### Check Python Installation
```powershell
python --version
# Should show: Python 3.8.x or higher
```

---

## 🚀 Quick Setup (Automated)

### Option 1: Run Setup Script (Recommended)
```powershell
# Navigate to model directory
cd model

# Run the setup script
.\setup_backend.bat
```

This will:
1. ✅ Create virtual environment
2. ✅ Activate virtual environment
3. ✅ Install all dependencies
4. ✅ Prepare the backend for running

### Option 2: Run Backend Server
```powershell
# After setup, run the server
.\run_backend.bat
```

---

## 🔧 Manual Setup (Step by Step)

### Step 1: Navigate to Model Directory
```powershell
cd C:\Users\acer\OneDrive\Desktop\Alzico\Alzico\model
```

### Step 2: Create Virtual Environment
```powershell
python -m venv .venv
```

### Step 3: Activate Virtual Environment

**PowerShell:**
```powershell
.\.venv\Scripts\Activate.ps1
```

**If you get execution policy error:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\.venv\Scripts\Activate.ps1
```

**Command Prompt (cmd):**
```cmd
.venv\Scripts\activate.bat
```

### Step 4: Upgrade pip
```powershell
python -m pip install --upgrade pip
```

### Step 5: Install Dependencies
```powershell
pip install -r requirements.txt
```

### Step 6: Run the Server
```powershell
python app.py
```

---

## 📦 Dependencies Installed

The `requirements.txt` includes:
- **Flask 3.0.0** - Web framework
- **Flask-CORS 4.0.0** - Cross-origin resource sharing
- **joblib 1.3.2** - Model loading
- **pandas 2.1.4** - Data manipulation
- **scikit-learn 1.7.2** - Machine learning
- **numpy 1.26.4** - Numerical computing
- **psycopg2-binary 2.9.9** - PostgreSQL adapter

---

## 🌐 Backend Server Details

### Server Information
- **URL**: `http://localhost:5000`
- **Framework**: Flask
- **CORS**: Enabled for development
- **Model**: Alzheimer's prediction model

### Available Endpoints

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/user` - Get current user

#### Predictions
- `POST /predict` - Make Alzheimer's prediction
- `GET /predictions` - Get user's prediction history
- `GET /predictions/<id>` - Get specific prediction

#### Health Check
- `GET /health` - Check if server is running

---

## 🐛 Troubleshooting

### Issue 1: "pyhton is not recognized"
**Problem**: Typo in command  
**Solution**: Use `python` (not `pyhton`)
```powershell
python app.py  # Correct
pyhton app.py  # Wrong
```

### Issue 2: "ModuleNotFoundError: No module named 'psycopg2'"
**Problem**: Dependencies not installed  
**Solution**: 
```powershell
# Activate virtual environment first
.\.venv\Scripts\Activate.ps1

# Then install dependencies
pip install -r requirements.txt
```

### Issue 3: "Virtual environment activation failed"
**Problem**: PowerShell execution policy  
**Solution**:
```powershell
# Set execution policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then activate
.\.venv\Scripts\Activate.ps1
```

### Issue 4: ".venv\Scripts\activate.bat not recognized"
**Problem**: Wrong directory or syntax  
**Solution**:
```powershell
# Make sure you're in the model directory
cd model

# Use .\ prefix for PowerShell
.\.venv\Scripts\activate.bat

# OR use Activate.ps1 for PowerShell
.\.venv\Scripts\Activate.ps1
```

### Issue 5: "Port 5000 already in use"
**Problem**: Another process using port 5000  
**Solution**:
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace <PID> with actual ID)
taskkill /PID <PID> /F

# Or change port in app.py
# app.run(port=5001)  # Use different port
```

### Issue 6: "Model file not found"
**Problem**: `final_alz_model.joblib` missing  
**Solution**: The app will automatically use a mock model for testing
```
Mock model loaded and fitted successfully.
```
This is normal and allows testing without the actual trained model.

---

## 🔄 Running Both Frontend and Backend

### Terminal 1: Backend (Python)
```powershell
cd model
.\.venv\Scripts\Activate.ps1
python app.py
# Server runs on http://localhost:5000
```

### Terminal 2: Frontend (React)
```powershell
cd Alzico
npm run web
# App runs on http://localhost:3002
```

### Communication
- Frontend (port 3002) calls Backend (port 5000)
- CORS is enabled for cross-origin requests
- Backend provides prediction API
- Frontend displays results

---

## 📝 Environment Variables (Optional)

Create a `.env` file in the model directory:
```env
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://user:password@localhost/alzico
FLASK_ENV=development
PORT=5000
```

---

## 🧪 Testing the Backend

### Test Health Endpoint
```powershell
# Using PowerShell
Invoke-WebRequest -Uri http://localhost:5000/health -Method GET

# Or open in browser
# http://localhost:5000/health
```

### Test Prediction Endpoint
```powershell
# Using curl (if installed)
curl -X POST http://localhost:5000/predict ^
  -H "Content-Type: application/json" ^
  -d "{\"MMSE__TOTSCORE\": 28, \"ADAS__TOTSCORE\": 10, \"CDR__GLOBAL\": 0.5, \"FAQ__TOTAL\": 2, \"MOCA__TOTAL\": 25, \"AVLT__IMMEDIATE\": 40}"
```

---

## 📊 Database Setup (Optional)

If you want to use PostgreSQL instead of mock database:

### Install PostgreSQL
1. Download from https://www.postgresql.org/download/
2. Install and set up database
3. Create database: `CREATE DATABASE alzico;`
4. Update connection string in `database.py`

### Use SQLite (Simpler Alternative)
The app includes `alzico.db` SQLite database for testing.

---

## 🎯 Quick Commands Reference

```powershell
# Setup (one time)
.\setup_backend.bat

# Run server
.\run_backend.bat

# Manual activation
.\.venv\Scripts\Activate.ps1

# Manual run
python app.py

# Check if running
netstat -ano | findstr :5000

# Stop server
Ctrl + C
```

---

## ✅ Success Checklist

- [ ] Python 3.8+ installed
- [ ] Virtual environment created
- [ ] Dependencies installed
- [ ] Server starts without errors
- [ ] Can access http://localhost:5000/health
- [ ] Mock model loads successfully
- [ ] CORS enabled for frontend

---

## 🎉 You're Ready!

Once the backend is running:
1. ✅ Server on http://localhost:5000
2. ✅ Frontend on http://localhost:3002
3. ✅ Full stack application ready
4. ✅ Can make predictions
5. ✅ Can store results

**Happy coding! 🚀**


