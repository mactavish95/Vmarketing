# NVIDIA Llama API Setup Guide

## Overview

This guide explains how to set up and use the NVIDIA Llama 3.1 Nemotron Ultra API with the React component in your app.

## 🤖 About NVIDIA Llama 3.1 Nemotron Ultra

- **Model**: nvidia/llama-3.1-nemotron-ultra-253b-v1
- **Parameters**: 253 billion parameters
- **Capabilities**: Advanced reasoning, coding, text generation
- **License**: AI Foundation Models Community License Agreement
- **API Endpoint**: https://integrate.api.nvidia.com/v1

## 🔑 Getting Your API Key

1. **Visit NVIDIA API Portal**:
   - Go to [https://integrate.api.nvidia.com](https://integrate.api.nvidia.com)
   - Sign up or log in to your NVIDIA account

2. **Create API Key**:
   - Navigate to the API keys section
   - Generate a new API key for Llama 3.1 Nemotron Ultra
   - Copy and save your API key securely

3. **API Key Security**:
   - Never expose your API key in frontend code
   - Always use a backend service to handle API calls
   - Store API keys in environment variables

## 🏗️ Backend Implementation

### Option 1: Node.js/Express Backend

Create a backend service to handle the NVIDIA API calls:

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize OpenAI client for NVIDIA API
const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

app.post('/api/llama', async (req, res) => {
  try {
    const { text, apiKey } = req.body;
    
    // Validate input
    if (!text || !apiKey) {
      return res.status(400).json({ 
        error: 'Text and API key are required' 
      });
    }

    // Create completion with NVIDIA Llama
    const completion = await openai.chat.completions.create({
      model: "nvidia/llama-3.1-nemotron-ultra-253b-v1",
      messages: [
        {
          role: "system", 
          content: "You are a helpful AI assistant powered by NVIDIA's Llama 3.1 Nemotron Ultra model."
        },
        {
          role: "user", 
          content: text
        }
      ],
      temperature: 0.6,
      top_p: 0.95,
      max_tokens: 4096,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: false, // Set to false for simple responses
    });

    const response = completion.choices[0]?.message?.content || 'No response generated';
    
    res.json({ 
      success: true, 
      response: response,
      usage: completion.usage
    });

  } catch (error) {
    console.error('Llama API Error:', error);
    res.status(500).json({ 
      error: 'Failed to get response from Llama API',
      details: error.message 
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Option 2: Python/Flask Backend

```python
# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure OpenAI client for NVIDIA API
openai.api_key = os.getenv('NVIDIA_API_KEY')
openai.api_base = 'https://integrate.api.nvidia.com/v1'

@app.route('/api/llama', methods=['POST'])
def llama_api():
    try:
        data = request.json
        text = data.get('text')
        api_key = data.get('apiKey')
        
        if not text or not api_key:
            return jsonify({'error': 'Text and API key are required'}), 400
        
        # Create completion
        completion = openai.ChatCompletion.create(
            model="nvidia/llama-3.1-nemotron-ultra-253b-v1",
            messages=[
                {"role": "system", "content": "You are a helpful AI assistant."},
                {"role": "user", "content": text}
            ],
            temperature=0.6,
            top_p=0.95,
            max_tokens=4096,
            frequency_penalty=0,
            presence_penalty=0,
            stream=False
        )
        
        response = completion.choices[0].message.content
        
        return jsonify({
            'success': True,
            'response': response,
            'usage': completion.usage
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=3001)
```

## 🔧 Environment Setup

### Backend Dependencies

**Node.js:**
```bash
npm install express cors openai dotenv
```

**Python:**
```bash
pip install flask flask-cors openai python-dotenv
```

### Environment Variables

Create a `.env` file in your backend directory:

```env
NVIDIA_API_KEY=your_nvidia_api_key_here
PORT=3001
```

## 📱 Frontend Integration

The React component is already set up to work with the backend. Here's how it works:

### API Call Flow

1. **User Input**: User enters text and API key
2. **Frontend Validation**: Basic validation of inputs
3. **Backend Request**: Frontend sends request to `/api/llama`
4. **NVIDIA API Call**: Backend calls NVIDIA API with user's key
5. **Response**: Backend returns response to frontend
6. **Display**: Frontend displays the AI response

### Component Features

- **API Key Management**: Secure input for NVIDIA API key
- **Example Prompts**: Pre-built examples for testing
- **Loading States**: Visual feedback during API calls
- **Error Handling**: Graceful error display
- **Response Copying**: Easy copy-to-clipboard functionality

## 🚀 Usage Examples

### Basic Text Generation

```javascript
// Example prompt
"Write a short story about a robot learning to paint"
```

### Code Generation

```javascript
// Example prompt
"Write a Python function to calculate fibonacci numbers"
```

### Analysis and Reasoning

```javascript
// Example prompt
"Explain the benefits of renewable energy sources"
```

## ⚙️ API Configuration Options

### Temperature (0.0 - 1.0)
- **0.0**: Very focused, deterministic responses
- **0.6**: Balanced creativity and focus (default)
- **1.0**: Maximum creativity, more random responses

### Top_p (0.0 - 1.0)
- **0.95**: Good balance for most use cases
- Controls diversity of token selection

### Max Tokens
- **4096**: Maximum response length
- Adjust based on your needs

### Streaming
- **true**: Real-time response streaming
- **false**: Complete response at once (simpler)

## 🔒 Security Considerations

### API Key Protection
- Never store API keys in frontend code
- Use environment variables in backend
- Implement rate limiting
- Monitor API usage

### Input Validation
- Sanitize user inputs
- Implement length limits
- Check for malicious content

### Error Handling
- Don't expose sensitive error details
- Log errors securely
- Provide user-friendly error messages

## 📊 Monitoring and Usage

### API Usage Tracking
```javascript
// Response includes usage information
{
  "success": true,
  "response": "AI generated text...",
  "usage": {
    "prompt_tokens": 50,
    "completion_tokens": 200,
    "total_tokens": 250
  }
}
```

### Rate Limits
- Monitor your API usage
- Implement request throttling
- Handle rate limit errors gracefully

## 🛠️ Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure backend has CORS enabled
   - Check frontend URL configuration

2. **API Key Errors**:
   - Verify API key is valid
   - Check key permissions
   - Ensure key is not expired

3. **Network Errors**:
   - Check internet connection
   - Verify NVIDIA API endpoint accessibility
   - Check firewall settings

4. **Response Errors**:
   - Validate input format
   - Check token limits
   - Monitor API status

### Debug Mode

Enable debug logging in your backend:

```javascript
// Node.js
console.log('Request:', { text, apiKey: '***' });
console.log('Response:', completion);

// Python
print(f"Request: {text}")
print(f"Response: {completion}")
```

## 📚 Additional Resources

- [NVIDIA API Documentation](https://docs.nvidia.com/api/)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Llama 3.1 Model Details](https://huggingface.co/nvidia/llama-3.1-nemotron-ultra-253b-v1)
- [Community License Agreement](https://ai.meta.com/llama/license/)

## 🎯 Best Practices

1. **Start Simple**: Begin with basic text generation
2. **Test Thoroughly**: Validate responses and error handling
3. **Monitor Costs**: Track API usage and costs
4. **User Experience**: Provide clear feedback and loading states
5. **Security First**: Always protect API keys and user data
6. **Error Recovery**: Implement graceful error handling
7. **Performance**: Optimize for response times and user experience

---

**Note**: This implementation requires a backend service due to CORS restrictions and API key security. The frontend component is designed to work with the provided backend examples. 