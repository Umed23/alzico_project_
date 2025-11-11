# Quick SMS Setup Guide

## To Set Your Emergency Contact Number

**Please provide your phone number and I'll configure it for you!**

Or you can set it yourself:

### Option 1: Set in `app.py` (Easiest)

Edit `model/app.py` line 26 and replace the empty string with your phone number:

```python
EMERGENCY_CONTACT_PHONE = '+1234567890'  # Replace with YOUR number
```

**Phone number format:** Must include country code (e.g., +1 for US)
- US example: `+15551234567`
- UK example: `+447911123456`

### Option 2: Set via Environment Variable

Create a `.env` file in the `model/` folder:

```env
EMERGENCY_CONTACT_PHONE=+1234567890
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

### Option 3: Use the Setup Script

```bash
cd model
python setup_sms.py
```

## Twilio Setup (Required for SMS to work)

1. Sign up at [twilio.com](https://www.twilio.com) (free trial available)
2. Get Account SID and Auth Token from dashboard
3. Get a Twilio phone number
4. Set environment variables or use `.env` file

## What Happens When SOS is Triggered?

1. User clicks "Send Emergency Alert" button
2. Backend sends SMS to the configured emergency contact
3. SMS contains:
   - User's name and email
   - Timestamp
   - Location (if available)
   - Emergency alert message

## Testing

After setup, test by:
1. Navigate to SOS screen in the app
2. Click "Send Emergency Alert"
3. Check your phone for the SMS

---

**Just provide your phone number and I'll add it to the code!**

