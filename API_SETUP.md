# AI API Setup Guide

## 🤖 Configuring AI Voice Analysis

The voice review app supports multiple AI providers for analyzing your voice input. You can use OpenAI GPT-4, Anthropic Claude, or fall back to local analysis.

## 🔑 API Key Setup

### Option 1: OpenAI GPT-4 (Recommended)

1. **Get an API Key**:
   - Go to [OpenAI Platform](https://platform.openai.com/api-keys)
   - Sign up or log in
   - Create a new API key

2. **Configure the App**:
   - Create a `.env` file in the project root
   - Add your API key:
   ```
   REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
   ```

### Option 2: Anthropic Claude

1. **Get an API Key**:
   - Go to [Anthropic Console](https://console.anthropic.com/)
   - Sign up or log in
   - Create a new API key

2. **Configure the App**:
   - Add to your `.env` file:
   ```
   REACT_APP_ANTHROPIC_API_KEY=your_anthropic_api_key_here
   ```

### Option 3: Local Analysis (No API Key Required)

If you don't provide any API keys, the app will use local analysis which provides:
- Basic sentiment analysis
- Key point extraction
- Topic detection
- Speaking pace analysis

## 🚀 Features by Provider

### OpenAI GPT-4
- ✅ Advanced sentiment analysis
- ✅ Detailed key points extraction
- ✅ Intelligent suggestions
- ✅ Professional review generation
- ✅ Context-aware analysis

### Anthropic Claude
- ✅ High-quality analysis
- ✅ Detailed insights
- ✅ Professional tone detection
- ✅ Action item generation

### Local Analysis
- ✅ Basic sentiment detection
- ✅ Simple key points
- ✅ Topic categorization
- ✅ No internet required
- ✅ No API costs

## 💰 Cost Information

### OpenAI GPT-4
- ~$0.03 per 1K tokens
- Typical voice analysis: $0.01-0.05 per analysis

### Anthropic Claude
- ~$0.015 per 1K tokens
- Typical voice analysis: $0.005-0.025 per analysis

### Local Analysis
- Free! No costs involved

## 🔧 Environment File Setup

Create a `.env` file in the project root:

```bash
# AI API Keys
REACT_APP_OPENAI_API_KEY=sk-your-openai-key-here
REACT_APP_ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here

# Optional: Disable local fallback
# REACT_APP_DISABLE_LOCAL_FALLBACK=true
```

## 🛡️ Security Notes

- **Never commit API keys** to version control
- **Use environment variables** for sensitive data
- **Rotate keys regularly** for security
- **Monitor usage** to avoid unexpected charges

## 🧪 Testing Your Setup

1. **Start the app**: `npm start`
2. **Go to Voice Test**: Navigate to `/voice-test`
3. **Try voice recognition**: Speak something
4. **Check analysis**: Verify AI analysis works
5. **Check console**: Look for any API errors

## 🔍 Troubleshooting

### "Analysis failed" errors:
- Check API key is correct
- Verify internet connection
- Check API quota/limits
- Try local analysis as fallback

### "No AI service available":
- Add at least one API key
- Or enable local fallback
- Check environment file format

### High costs:
- Monitor usage in API dashboard
- Set up usage alerts
- Consider local analysis for testing

## 📱 Mobile Considerations

- **Voice recognition** works best on Chrome/Edge/Safari
- **API calls** require internet connection
- **Local analysis** works offline
- **HTTPS required** for microphone access

## 🎯 Best Practices

1. **Start with local analysis** for testing
2. **Add API keys** for production use
3. **Monitor costs** regularly
4. **Use appropriate models** for your needs
5. **Test thoroughly** before deployment

---

**Need help?** Check the troubleshooting guide or test page for detailed diagnostics! 