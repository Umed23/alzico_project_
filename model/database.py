import psycopg2
import psycopg2.extras
import os
from datetime import datetime
import hashlib
import secrets

class DatabaseManager:
    def __init__(self):
        self.connection = None
        self.connect()
        self.init_tables()
    
    def connect(self):
        """Connect to PostgreSQL database with SQLite fallback"""
        try:
            # Try PostgreSQL first
            import psycopg2
            self.connection = psycopg2.connect(
                host=os.getenv('DB_HOST', 'localhost'),
                port=os.getenv('DB_PORT', '5432'),
                database=os.getenv('DB_NAME', 'alzico_db'),
                user=os.getenv('DB_USER', 'postgres'),
                password=os.getenv('DB_PASSWORD', 'password')
            )
            print("Connected to PostgreSQL database successfully")
        except Exception as e:
            print(f"PostgreSQL not available ({e}), using SQLite fallback")
            # Fallback to SQLite for development
            self.setup_sqlite_fallback()
    
    def setup_sqlite_fallback(self):
        """Fallback to SQLite if PostgreSQL is not available"""
        import sqlite3
        # check_same_thread=False allows SQLite to be used in multi-threaded Flask app
        self.connection = sqlite3.connect('alzico.db', check_same_thread=False)
        print("Using SQLite fallback database")
    
    def create_demo_user(self):
        """Create demo user if it doesn't exist"""
        try:
            # Check if demo user already exists
            cursor = self.connection.cursor()
            is_sqlite = 'sqlite3' in str(type(self.connection))
            
            if is_sqlite:
                cursor.execute('SELECT id FROM users WHERE email = ?', ('demo@alzico.com',))
            else:
                cursor.execute('SELECT id FROM users WHERE email = %s', ('demo@alzico.com',))
            
            if not cursor.fetchone():
                # Create demo user
                success, result = self.create_user(
                    email='demo@alzico.com',
                    password='password123',
                    full_name='Demo User'
                )
                if success:
                    print("Demo user created: demo@alzico.com / password123")
                else:
                    print(f"Failed to create demo user: {result}")
            else:
                print("Demo user already exists")
                
        except Exception as e:
            print(f"Error creating demo user: {e}")
    
    def init_tables(self):
        """Initialize database tables"""
        try:
            cursor = self.connection.cursor()
            
            # Check if we're using SQLite or PostgreSQL
            is_sqlite = 'sqlite3' in str(type(self.connection))
            
            if is_sqlite:
                # SQLite table definitions
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS users (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        email TEXT UNIQUE NOT NULL,
                        password_hash TEXT NOT NULL,
                        full_name TEXT NOT NULL,
                        salt TEXT NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                ''')
                
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS test_responses (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id INTEGER REFERENCES users(id),
                        test_name TEXT NOT NULL,
                        test_data TEXT NOT NULL,
                        score INTEGER,
                        prediction TEXT,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                ''')
                
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS user_sessions (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id INTEGER REFERENCES users(id),
                        session_token TEXT UNIQUE NOT NULL,
                        expires_at TIMESTAMP NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                ''')
            else:
                # PostgreSQL table definitions
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS users (
                        id SERIAL PRIMARY KEY,
                        email VARCHAR(255) UNIQUE NOT NULL,
                        password_hash VARCHAR(255) NOT NULL,
                        full_name VARCHAR(255) NOT NULL,
                        salt VARCHAR(255) NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                ''')
                
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS test_responses (
                        id SERIAL PRIMARY KEY,
                        user_id INTEGER REFERENCES users(id),
                        test_name VARCHAR(255) NOT NULL,
                        test_data JSONB NOT NULL,
                        score INTEGER,
                        prediction JSONB,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                ''')
                
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS user_sessions (
                        id SERIAL PRIMARY KEY,
                        user_id INTEGER REFERENCES users(id),
                        session_token VARCHAR(255) UNIQUE NOT NULL,
                        expires_at TIMESTAMP NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                ''')
            
            self.connection.commit()
            print("Database tables initialized successfully")
            
            # Create demo user
            self.create_demo_user()
            
        except Exception as e:
            print(f"Error initializing tables: {e}")
            self.connection.rollback()
    
    def hash_password(self, password, salt=None):
        """Hash password with salt"""
        if salt is None:
            salt = secrets.token_hex(16)
        password_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
        return password_hash.hex(), salt
    
    def verify_password(self, password, stored_hash, salt):
        """Verify password against stored hash"""
        password_hash, _ = self.hash_password(password, salt)
        return password_hash == stored_hash
    
    def create_user(self, email, password, full_name):
        """Create a new user"""
        try:
            cursor = self.connection.cursor()
            is_sqlite = 'sqlite3' in str(type(self.connection))
            
            # Check if user already exists
            if is_sqlite:
                cursor.execute('SELECT id FROM users WHERE email = ?', (email,))
            else:
                cursor.execute('SELECT id FROM users WHERE email = %s', (email,))
            
            if cursor.fetchone():
                return False, "User already exists"
            
            # Hash password
            password_hash, salt = self.hash_password(password)
            
            # Insert user
            if is_sqlite:
                cursor.execute('''
                    INSERT INTO users (email, password_hash, full_name, salt)
                    VALUES (?, ?, ?, ?)
                ''', (email, password_hash, full_name, salt))
                user_id = cursor.lastrowid
            else:
                cursor.execute('''
                    INSERT INTO users (email, password_hash, full_name, salt)
                    VALUES (%s, %s, %s, %s)
                    RETURNING id
                ''', (email, password_hash, full_name, salt))
                user_id = cursor.fetchone()[0]
            
            self.connection.commit()
            
            return True, {"id": user_id, "email": email, "full_name": full_name}
            
        except Exception as e:
            self.connection.rollback()
            return False, f"Error creating user: {str(e)}"
    
    def authenticate_user(self, email, password):
        """Authenticate user login"""
        try:
            cursor = self.connection.cursor()
            is_sqlite = 'sqlite3' in str(type(self.connection))
            
            if is_sqlite:
                cursor.execute('''
                    SELECT id, email, password_hash, salt, full_name 
                    FROM users WHERE email = ?
                ''', (email,))
            else:
                cursor.execute('''
                    SELECT id, email, password_hash, salt, full_name 
                    FROM users WHERE email = %s
                ''', (email,))
            
            result = cursor.fetchone()
            if not result:
                return False, "Invalid credentials"
            
            user_id, user_email, stored_hash, salt, full_name = result
            
            if self.verify_password(password, stored_hash, salt):
                return True, {"id": user_id, "email": user_email, "full_name": full_name}
            else:
                return False, "Invalid credentials"
                
        except Exception as e:
            return False, f"Error authenticating user: {str(e)}"
    
    def save_test_response(self, user_id, test_name, test_data, score=None, prediction=None):
        """Save test response and results"""
        try:
            cursor = self.connection.cursor()
            is_sqlite = 'sqlite3' in str(type(self.connection))
            
            # Convert data to JSON string for SQLite
            if is_sqlite:
                import json
                test_data_json = json.dumps(test_data)
                prediction_json = json.dumps(prediction) if prediction else None
                
                cursor.execute('''
                    INSERT INTO test_responses (user_id, test_name, test_data, score, prediction)
                    VALUES (?, ?, ?, ?, ?)
                ''', (user_id, test_name, test_data_json, score, prediction_json))
                response_id = cursor.lastrowid
            else:
                cursor.execute('''
                    INSERT INTO test_responses (user_id, test_name, test_data, score, prediction)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING id
                ''', (user_id, test_name, test_data, score, prediction))
                response_id = cursor.fetchone()[0]
            
            self.connection.commit()
            
            return True, response_id
            
        except Exception as e:
            self.connection.rollback()
            return False, f"Error saving test response: {str(e)}"
    
    def get_user_history(self, user_id):
        """Get user's test history"""
        try:
            cursor = self.connection.cursor()
            is_sqlite = 'sqlite3' in str(type(self.connection))
            
            if is_sqlite:
                cursor.execute('''
                    SELECT id, test_name, test_data, score, prediction, created_at
                    FROM test_responses 
                    WHERE user_id = ? 
                    ORDER BY created_at DESC
                ''', (user_id,))
            else:
                cursor.execute('''
                    SELECT id, test_name, test_data, score, prediction, created_at
                    FROM test_responses 
                    WHERE user_id = %s 
                    ORDER BY created_at DESC
                ''', (user_id,))
            
            results = cursor.fetchall()
            return True, results
            
        except Exception as e:
            return False, f"Error fetching user history: {str(e)}"
    
    def create_session(self, user_id):
        """Create a new user session"""
        try:
            cursor = self.connection.cursor()
            is_sqlite = 'sqlite3' in str(type(self.connection))
            
            # Generate session token
            session_token = secrets.token_urlsafe(32)
            expires_at = datetime.now().timestamp() + (7 * 24 * 60 * 60)  # 7 days
            expires_datetime = datetime.fromtimestamp(expires_at)
            
            if is_sqlite:
                cursor.execute('''
                    INSERT INTO user_sessions (user_id, session_token, expires_at)
                    VALUES (?, ?, ?)
                ''', (user_id, session_token, expires_datetime))
            else:
                cursor.execute('''
                    INSERT INTO user_sessions (user_id, session_token, expires_at)
                    VALUES (%s, %s, %s)
                    RETURNING session_token
                ''', (user_id, session_token, expires_datetime))
            
            self.connection.commit()
            return True, session_token
            
        except Exception as e:
            self.connection.rollback()
            return False, f"Error creating session: {str(e)}"
    
    def validate_session(self, session_token):
        """Validate session token"""
        try:
            cursor = self.connection.cursor()
            is_sqlite = 'sqlite3' in str(type(self.connection))
            
            if is_sqlite:
                cursor.execute('''
                    SELECT u.id, u.email, u.full_name
                    FROM users u
                    JOIN user_sessions s ON u.id = s.user_id
                    WHERE s.session_token = ? AND s.expires_at > ?
                ''', (session_token, datetime.now()))
            else:
                cursor.execute('''
                    SELECT u.id, u.email, u.full_name
                    FROM users u
                    JOIN user_sessions s ON u.id = s.user_id
                    WHERE s.session_token = %s AND s.expires_at > %s
                ''', (session_token, datetime.now()))
            
            result = cursor.fetchone()
            if result:
                return True, {"id": result[0], "email": result[1], "full_name": result[2]}
            else:
                return False, "Invalid or expired session"
                
        except Exception as e:
            return False, f"Error validating session: {str(e)}"
    
    def close(self):
        """Close database connection"""
        if self.connection:
            self.connection.close()

# Global database instance
db = DatabaseManager()
