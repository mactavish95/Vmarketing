# 🤖 LLM Enhancement Testing Guide

## Quick Test Steps

### 1. Check API Key
- Open browser console (F12)
- Run: `localStorage.getItem('nvidiaApiKey')`
- Should return your NVIDIA API key

### 2. Test Backend Connection
- Visit: `http://localhost:3000/test-llm-enhancement.html`
- Click "🌐 Test Backend Connection"
- Should show "✅ Backend is responding"

### 3. Test LLM Enhancement
- On the test page, click "🧪 Test LLM Enhancement"
- Should show enhanced transcript

### 4. Test in Voice Recognition Component
- Go to Voice Review or Review Generator
- Record some voice input
- Look for "🤖 AI Enhancement Ready" status
- Check browser console for debug logs

## Debug Commands

### Browser Console Commands:
```javascript
// Check API key
localStorage.getItem('nvidiaApiKey')

// Test LLM enhancement (if on test page)
testLLMEnhancement()

// Debug voice recognition component
window.debugVoiceRecognition()

// Check if backend is working
fetch('/api/llama', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        prompt: 'Hello',
        apiKey: localStorage.getItem('nvidiaApiKey')
    })
}).then(r => r.json()).then(console.log)
```

## Common Issues

### 1. "No API Key" Error
- Make sure you've entered your NVIDIA API key in the VoiceReview or Llma component
- Check localStorage: `localStorage.getItem('nvidiaApiKey')`

### 2. "Backend Connection Failed"
- Make sure the backend server is running: `npm run server`
- Check if port 3001 is available

### 3. "LLM Enhancement Failed"
- Check browser console for detailed error messages
- Verify API key is valid
- Check network tab for failed requests

### 4. "No Enhanced Transcript"
- The enhancement might be working but the transcript is already good
- Check browser console for "Enhanced transcript available" message
- Look for the purple "🤖 AI Enhanced Version" section

## Expected Behavior

1. **Voice Input** → Original transcript appears immediately
2. **AI Enhancement** → Runs in background, shows enhanced version if different
3. **User Choice** → Can choose between original and enhanced versions
4. **Visual Indicators** → Shows "AI Enhancing..." during processing

## Debug Logs to Look For

```javascript
// Should see these in console:
"LLM enhancement check: {enableLLMEnhancement: true, hasApiKey: true, hasTranscript: true}"
"Sending LLM enhancement request: {prompt: '...', apiKeyLength: 64}"
"LLM response status: 200"
"LLM response data: {success: true, response: '...'}"
"Enhanced transcript available: {original: '...', enhanced: '...'}"
```

## Test Transcript Examples

Try these voice inputs to test enhancement:

1. **Poor Grammar**: "Gordon Ramsay Burger in Las Vegas actually worth it I got his specialty celebration burger for $27 it was pretty tasty but for $27 for cheese tomato and egg on a burger Master Chef more like Master scam prices"

2. **Run-on Sentence**: "this computer model y it's electric but I don't have time to charge I can put gas in here and that will power my generator under the hood give me over 700 miles of range you also get air suspension and lidar for self-driving and let others know it's driving itself the side lights will turn blue"

3. **Casual Speech**: "get right out of the top and it has a weird flavor kind of like dirty you sink water apparently it has a bunch of health benefits you already know I had to try Haley Bieber's 18 dollars strawberry glazed skin smoothie which has avocados and sea moss but really just kind of tastes like a strawberry smoothie from like Planet Smoothie or something" 