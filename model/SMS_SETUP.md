# SMS Setup Guide for SOS Feature

## Overview
The SOS feature sends emergency SMS alerts using Twilio. This guide will help you set it up.

## Step 1: Get Twilio Account

1. Go to [https://www.twilio.com](https://www.twilio.com)
2. Sign up for a free account (free trial includes $15 credit)
3. Verify your phone number

## Step 2: Get Twilio Credentials

1. Log into your Twilio Console
2. Go to the Dashboard
3. Copy these values:
   - **Account SID** (starts with "AC")
   - **Auth Token** (click to reveal)

## Step 3: Get a Twilio Phone Number

1. In Twilio Console, go to **Phone Numbers** → **Manage** → **Buy a number**
2. Select a number (you can get a free trial number)
3. Copy the phone number (format: +1234567890)

## Step 4: Set Environment Variables

Create a `.env` file in the `model/` directory with:

```env
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
EMERGENCY_CONTACT_PHONE=+1987654321
```

**IMPORTANT:** Replace `EMERGENCY_CONTACT_PHONE` with the actual phone number where you want to receive emergency alerts.

## Step 5: Install Dependencies

Make sure you've installed the requirements:
```bash
cd model
pip install -r requirements.txt
```

## Step 6: Update Emergency Contact Number

You can also set the emergency contact number directly in `app.py`:

```python
EMERGENCY_CONTACT_PHONE = '+1987654321'  # Replace with your number
```

Or set it as an environment variable before running:
```bash
export EMERGENCY_CONTACT_PHONE=+1987654321
python app.py
```

## Testing

1. Start the backend server:
   ```bash
   cd model
   python app.py
   ```

2. Open the app and navigate to the SOS screen
3. Click "Send Emergency Alert"
4. You should receive an SMS at the emergency contact number

## Troubleshooting

### "SMS service not configured" error
- Make sure all Twilio environment variables are set
- Check that your Twilio credentials are correct
- Verify your Twilio account is active

### "Failed to send SMS" error
- Verify the phone number format is correct (must include country code, e.g., +1 for US)
- Check that your Twilio account has sufficient credits
- Verify the Twilio phone number is active

### Phone number format
- Must include country code
- Format: +1234567890 (no spaces or dashes)
- Example for US: +15551234567

## Security Notes

- **Never commit your `.env` file to git**
- Keep your Twilio Auth Token secret
- Consider using environment variables in production
- The `.env` file should be in `.gitignore`

## Cost Information

- Twilio free trial: $15 credit
- SMS cost: ~$0.0075 per SMS in US
- With free trial, you can send ~2,000 SMS messages

