# 🔐 Google OAuth Setup Guide for AttendX

Follow these steps to enable real Google Sign-In for your Attendance System.

## 1. Create a Google Cloud Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click on the project dropdown at the top and select **"New Project"**.
3. Name it `AttendX` and click **Create**.

## 2. Configure OAuth Consent Screen
1. Go to **APIs & Services > OAuth consent screen**.
2. Select **External** (unless you are part of a Google Workspace organization).
3. Fill in the required fields:
   - **App Name**: `AttendX`
   - **User support email**: Your Gmail.
   - **Developer contact info**: Your Gmail.
4. Click **Save and Continue** (skip Scopes for now).
5. Add your own Gmail as a **Test User**.

## 3. Create Credentials (Client ID)
1. Go to **APIs & Services > Credentials**.
2. Click **+ Create Credentials > OAuth client ID**.
3. Select **Web application** for "Application type".
4. Under **"Authorized JavaScript origins"**, add:
   - `http://localhost:5173`
5. Click **Create**.

## 4. Update the .env File
1. Copy the **Client ID** that starts with a long number (e.g., `123456...apps.googleusercontent.com`).
2. Open the `.env` file in your project root.
3. Replace the placeholder line with your real ID:
   ```env
   VITE_GOOGLE_CLIENT_ID=PASTE_YOUR_ID_HERE.apps.googleusercontent.com
   VITE_ALLOWED_DOMAIN=moderncoe.edu.in
   ```
4. **Restart your dev server** (press `Ctrl+C` in terminal, then run `npm run dev` again).

## 💡 Troubleshooting
- **"Error 401: invalid_client"**: You didn't copy the Client ID correctly or didn't restart the server.
- **"Access Blocked"**: Make sure you added your email to the **Test Users** on the OAuth Consent Screen.
