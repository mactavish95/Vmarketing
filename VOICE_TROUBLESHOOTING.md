# Voice Recognition Troubleshooting Guide

## 🚨 Common Issues & Solutions

### 1. **"Speech recognition is not supported"**
**Problem**: Your browser doesn't support the Web Speech API.

**Solutions**:
- ✅ **Use Chrome** (recommended)
- ✅ **Use Edge** (Windows)
- ✅ **Use Safari** (Mac/iOS)
- ❌ **Don't use Firefox** (not supported)

### 2. **"Microphone access denied"**
**Problem**: Browser blocked microphone access.

**Solutions**:
1. **Check browser permissions**:
   - Click the microphone icon in the address bar
   - Select "Allow" from the dropdown
   - Refresh the page

2. **System-level permissions**:
   - **Windows**: Settings > Privacy > Microphone > Allow apps to access microphone
   - **Mac**: System Preferences > Security & Privacy > Microphone
   - **iOS**: Settings > Privacy & Security > Microphone

3. **Browser settings**:
   - **Chrome**: Settings > Privacy and security > Site Settings > Microphone
   - **Edge**: Settings > Cookies and site permissions > Microphone
   - **Safari**: Safari > Preferences > Websites > Microphone

### 3. **"No speech detected"**
**Problem**: Voice recognition isn't picking up your speech.

**Solutions**:
- **Speak clearly** and at normal volume
- **Reduce background noise**
- **Speak for at least 3-5 seconds**
- **Check if microphone is muted**
- **Try a different microphone**
- **Move closer to the microphone**

### 4. **"Audio capture failed"**
**Problem**: Another app is using the microphone.

**Solutions**:
- Close other apps that use audio (Zoom, Teams, etc.)
- Restart your browser
- Check microphone settings in your OS
- Try a different browser

### 5. **Voice recognition starts but doesn't transcribe**
**Problem**: Recognition is working but not producing text.

**Solutions**:
- **Check internet connection** (voice recognition needs network)
- **Try speaking in English** (currently set to en-US)
- **Speak in complete sentences**
- **Avoid background music or TV**
- **Check browser console for errors** (F12)

## 🔧 Testing Voice Recognition

### Use the Voice Test Page
1. Go to `/voice-test` in your app
2. Check browser compatibility
3. Test microphone access
4. Try voice recognition
5. View detailed error messages

### Manual Testing Steps
1. **Open browser console** (F12)
2. **Check for errors** in the Console tab
3. **Test microphone** with the test button
4. **Try voice recognition** and watch console logs
5. **Check network tab** for any failed requests

## 🌐 Browser-Specific Issues

### Chrome
- **Best support** for voice recognition
- **HTTPS required** for microphone access
- **Check chrome://settings/content/microphone**

### Edge
- **Good support** (based on Chromium)
- **Similar to Chrome** troubleshooting
- **Check edge://settings/content/microphone**

### Safari
- **Limited support** on some versions
- **Requires user interaction** to start
- **Check Safari > Preferences > Websites > Microphone**

### Firefox
- **Not supported** - use Chrome/Edge/Safari instead

## 📱 Mobile Device Issues

### iOS (iPhone/iPad)
- **Use Safari** (not Chrome)
- **Grant microphone permissions** when prompted
- **Check Settings > Privacy & Security > Microphone**
- **Try in landscape mode** for better results

### Android
- **Use Chrome** (recommended)
- **Grant microphone permissions**
- **Check app permissions** in Settings
- **Try with headphones** for better quality

## 🔍 Debug Information

### Check Browser Console
Press F12 and look for:
```
✅ Speech recognition started
✅ Voice recognition result: { finalTranscript, interimTranscript }
❌ Speech recognition error: [error type]
```

### Browser Information
The voice test page shows:
- **speechRecognition**: Should be ✅ Yes
- **mediaDevices**: Should be ✅ Yes
- **getUserMedia**: Should be ✅ Yes
- **onLine**: Should be ✅ Yes

### Common Error Messages
- `not-allowed`: Microphone permission denied
- `no-speech`: No speech detected
- `audio-capture`: Microphone access failed
- `network`: Network connectivity issue
- `service-not-allowed`: Browser doesn't allow speech recognition

## 🛠️ Advanced Troubleshooting

### Reset Browser Settings
1. **Clear browser data** (cookies, site data)
2. **Reset site permissions**
3. **Restart browser**
4. **Try incognito/private mode**

### System-Level Checks
1. **Test microphone** in system settings
2. **Check audio drivers** are up to date
3. **Try different microphone** if available
4. **Restart computer** if issues persist

### Network Issues
1. **Check internet connection**
2. **Try different network** (mobile hotspot)
3. **Disable VPN** if using one
4. **Check firewall settings**

## 📞 Getting Help

If you're still having issues:

1. **Use the Voice Test page** (`/voice-test`) to get detailed diagnostics
2. **Check browser console** for specific error messages
3. **Try a different browser** (Chrome recommended)
4. **Test on a different device** to isolate the issue
5. **Check the troubleshooting guide** in the app

### Information to Provide
When asking for help, include:
- **Browser name and version**
- **Operating system**
- **Error messages** from console
- **Steps you've tried**
- **Device type** (desktop/mobile)

---

**Remember**: Voice recognition requires a supported browser, microphone permissions, and a stable internet connection. Most issues can be resolved by following the steps above! 