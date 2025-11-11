#!/usr/bin/env python3
"""
Quick setup script for SMS functionality
Run this to configure your emergency contact number
"""

import os
import sys

def setup_sms():
    print("=" * 60)
    print("SMS Setup for Alzico SOS Feature")
    print("=" * 60)
    print()
    
    # Get emergency contact number
    print("Enter the emergency contact phone number where SMS alerts should be sent.")
    print("Format: Include country code (e.g., +15551234567 for US)")
    print()
    emergency_phone = input("Emergency Contact Phone Number: ").strip()
    
    if not emergency_phone:
        print("Error: Phone number is required")
        return False
    
    if not emergency_phone.startswith('+'):
        print("Warning: Phone number should start with '+' and country code")
        response = input("Continue anyway? (y/n): ").strip().lower()
        if response != 'y':
            return False
    
    # Get Twilio credentials (optional - can be set via environment variables)
    print()
    print("Twilio Credentials (optional - can be set via environment variables)")
    print("Leave blank to use environment variables if already set")
    print()
    
    account_sid = input("Twilio Account SID (or press Enter to skip): ").strip()
    auth_token = input("Twilio Auth Token (or press Enter to skip): ").strip()
    twilio_phone = input("Twilio Phone Number (or press Enter to skip): ").strip()
    
    # Create .env file
    env_lines = []
    if account_sid:
        env_lines.append(f"TWILIO_ACCOUNT_SID={account_sid}")
    if auth_token:
        env_lines.append(f"TWILIO_AUTH_TOKEN={auth_token}")
    if twilio_phone:
        env_lines.append(f"TWILIO_PHONE_NUMBER={twilio_phone}")
    
    env_lines.append(f"EMERGENCY_CONTACT_PHONE={emergency_phone}")
    
    # Write to .env file
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    try:
        with open(env_path, 'w') as f:
            f.write('\n'.join(env_lines) + '\n')
        print()
        print(f"✅ Configuration saved to {env_path}")
        print()
        print("Configuration:")
        print(f"  Emergency Contact: {emergency_phone}")
        if account_sid:
            print(f"  Twilio Account SID: {account_sid[:10]}...")
        if auth_token:
            print(f"  Twilio Auth Token: {'*' * len(auth_token)}")
        if twilio_phone:
            print(f"  Twilio Phone: {twilio_phone}")
        print()
        print("⚠️  IMPORTANT: Make sure .env is in .gitignore and never commit it!")
        return True
    except Exception as e:
        print(f"Error writing .env file: {e}")
        return False

if __name__ == '__main__':
    setup_sms()

