# ReviewGen - AI-Powered Review Generator

A modern React mobile application that helps users create professional reviews using AI analysis, voice recognition, and location attachment features.

## 🌟 Features

### ✨ AI Review Generation
- **Smart Review Creation**: Generate professional reviews based on your input
- **Multiple Review Types**: Restaurants, hotels, products, services, experiences, apps, places, and more
- **Customizable Tone**: Professional, casual, enthusiastic, critical, or balanced
- **Rating System**: 1-5 star rating with visual indicators

### 🎤 Voice Recognition
- **Voice Input**: Speak your reviews instead of typing
- **Real-time Analysis**: AI analyzes your voice input for insights
- **Voice-to-Text**: Accurate speech-to-text conversion
- **Voice Review Generation**: Create reviews directly from voice input

### 📍 Location Attachment
- **Current Location**: Automatically detect and attach your location
- **Address Resolution**: Convert coordinates to human-readable addresses
- **Permission Management**: Graceful handling of location permissions
- **Location Context**: Add location information to your reviews

### 🤖 NVIDIA Llama Integration
- **Advanced AI Model**: Powered by Llama 3.1 Nemotron Ultra (253B parameters)
- **Secure API Handling**: Backend server with proper security measures
- **Real-time Responses**: Fast AI-powered text generation
- **Multiple Use Cases**: Text generation, analysis, coding assistance

### 📊 Review Management
- **Review History**: View and manage all your generated reviews
- **Search & Filter**: Find reviews by type, content, or date
- **Copy & Share**: Easy copying and sharing of reviews
- **AI Analysis**: Get insights and suggestions for your reviews

## 🚀 Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn
- NVIDIA API key (for Llama features)
- Modern web browser with geolocation support

### One-Command Setup

**Linux/macOS:**
```bash
./start-dev.sh
```

**Windows:**
```cmd
start-dev.bat
```

This will automatically:
- Install all dependencies
- Set up environment files
- Start both frontend and backend servers
- Open the application in your browser

### Manual Setup

1. **Clone and navigate:**
   ```bash
   git clone https://github.com/yourusername/reviewgen-app.git
   cd reviewgen-app
   ```

2. **Set up backend:**
   ```bash
   cd server
   npm install
   cp env.example .env
   # Edit .env and add your NVIDIA API key
   npm run dev
   ```

3. **Set up frontend (new terminal):**
   ```bash
   npm install
   npm start
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🔑 Getting Your NVIDIA API Key

1. Visit [https://integrate.api.nvidia.com](https://integrate.api.nvidia.com)
2. Sign up or log in to your NVIDIA account
3. Navigate to API keys section
4. Generate a new API key for Llama 3.1 Nemotron Ultra
5. Add the key to `server/.env` file

## 📱 Usage

### Creating Reviews
1. **Choose Review Type**: Select from restaurant, hotel, product, etc.
2. **Set Rating**: Use the star rating system
3. **Choose Tone**: Pick the writing style that fits your needs
4. **Add Content**: Fill in pros, cons, and experience details
5. **Attach Location**: Add your current location for context
6. **Generate**: Let AI create your professional review

### Voice Reviews
1. **Enable Microphone**: Grant permission when prompted
2. **Speak Your Experience**: Describe your experience naturally
3. **AI Analysis**: Get real-time insights and suggestions
4. **Generate Review**: Create a review from your voice input

### NVIDIA Llama AI
1. **Navigate to Llama**: Click "🤖 Llama" in the header
2. **Enter API Key**: Add your NVIDIA API key
3. **Type Your Message**: Ask questions or request content
4. **Get AI Response**: Receive intelligent responses from Llama 3.1

### Managing Reviews
1. **View History**: Access all your generated reviews
2. **Search & Filter**: Find specific reviews quickly
3. **Copy & Share**: Use your reviews anywhere
4. **Delete**: Remove reviews you no longer need

## 🏗️ Project Structure

```
my-react-mobile-app/
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   │   ├── Header.js      # App header component
│   │   ├── VoiceRecognition.js # Voice input component
│   │   ├── VoiceAnalysis.js # AI analysis display
│   │   ├── LocationAttachment.js # Location attachment component
│   │   ├── Llma.js        # NVIDIA Llama integration
│   │   └── ...
│   ├── screens/           # Main app screens
│   │   ├── HomeScreen.js  # Welcome screen
│   │   ├── ReviewGenerator.js # Main review creation
│   │   ├── VoiceReview.js # Voice-based reviews
│   │   ├── ReviewHistory.js # Review management
│   │   └── ...
│   ├── services/          # Business logic and APIs
│   │   ├── llmService.js  # AI service integration
│   │   ├── locationService.js # Location utilities
│   │   └── ...
│   └── App.js            # Main app component
├── server/               # Backend Express server
│   ├── server.js        # Main server file
│   ├── package.json     # Backend dependencies
│   ├── .env            # Environment variables
│   └── README.md       # Backend documentation
├── public/              # Static assets
├── package.json         # Frontend dependencies
├── start-dev.sh        # Linux/macOS startup script
├── start-dev.bat       # Windows startup script
└── README.md           # This file
```

## 🛠️ Technologies Used

### Frontend
- **React 17**: Modern React with hooks
- **React Router**: Client-side routing
- **Web Speech API**: Voice recognition
- **Geolocation API**: Location services
- **OpenStreetMap Nominatim**: Address geocoding
- **CSS3**: Modern styling with gradients and animations
- **Local Storage**: Client-side data persistence

### Backend
- **Node.js**: Server runtime
- **Express.js**: Web framework
- **OpenAI SDK**: NVIDIA API integration
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API abuse prevention
- **Morgan**: Request logging

## 📋 Features in Detail

### AI Review Generation
- Intelligent review creation based on user input
- Multiple review types and tones
- Professional formatting and structure
- Rating-based recommendations

### Voice Recognition
- Real-time speech-to-text conversion
- Support for multiple languages
- Voice activity detection
- Error handling and retry mechanisms

### Location Services
- High-accuracy GPS location detection
- Reverse geocoding for address resolution
- Permission management and user guidance
- Location data validation and formatting

### NVIDIA Llama Integration
- 253 billion parameter model
- Advanced reasoning and text generation
- Secure API key handling
- Real-time response streaming
- Comprehensive error handling

### Review Management
- Persistent storage using localStorage
- Search and filtering capabilities
- Review categorization and organization
- Export and sharing functionality

## 🔧 Configuration

### Frontend Configuration
The app uses browser APIs and doesn't require external API keys for basic functionality.

### Backend Configuration
Create a `server/.env` file with:
```env
NVIDIA_API_KEY=your_nvidia_api_key_here
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Browser Requirements
- Modern browser with ES6+ support
- Geolocation API support
- Web Speech API support
- HTTPS connection (required for geolocation)

## 🎨 Customization

### Styling
- CSS custom properties for easy theming
- Responsive design for all screen sizes
- Dark mode support
- Customizable color schemes

### Components
- Modular component architecture
- Reusable UI components
- Consistent design patterns
- Easy to extend and modify

## 🚀 Deployment

### Frontend Deployment
```bash
npm run build
```

### Backend Deployment
```bash
cd server
npm install --production
npm start
```

### Deploy Options
- **Netlify**: Drag and drop the build folder
- **Vercel**: Connect your GitHub repository
- **Heroku**: Deploy both frontend and backend
- **AWS/DigitalOcean**: Full-stack deployment

## 🔒 Security

### Frontend Security
- Input validation and sanitization
- Secure API key handling
- CORS protection
- XSS prevention

### Backend Security
- Helmet security headers
- Rate limiting (100 requests/15min per IP)
- Input validation and sanitization
- Environment variable protection
- Error handling without sensitive data exposure

## 📊 Monitoring

### Health Checks
- Backend health: `http://localhost:3001/api/health`
- Frontend status: Browser developer tools
- API usage tracking
- Error logging and monitoring

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Check `FRONTEND_URL` in backend `.env`
   - Ensure both servers are running

2. **API Key Issues**:
   - Verify NVIDIA API key is valid
   - Check key permissions and quota

3. **Port Conflicts**:
   - Change `PORT` in backend `.env`
   - Ensure ports 3000 and 3001 are available

4. **Location Services**:
   - Enable location permissions in browser
   - Use HTTPS connection

5. **Voice Recognition**:
   - Grant microphone permissions
   - Check browser compatibility

### Debug Mode

**Frontend:**
```bash
NODE_ENV=development npm start
```

**Backend:**
```bash
cd server
NODE_ENV=development npm run dev
```

## 📚 Documentation

- [Backend Server Guide](server/README.md)
- [Location Feature Guide](LOCATION_FEATURE.md)
- [Voice Recognition Guide](VOICE_RECOGNITION_GUIDE.md)
- [Llama API Setup](LLAMA_API_SETUP.md)
- [API Setup Guide](API_SETUP.md)
- [Voice Troubleshooting](VOICE_TROUBLESHOOTING.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenStreetMap**: For free geocoding services
- **Web Speech API**: For voice recognition capabilities
- **NVIDIA**: For Llama 3.1 Nemotron Ultra model
- **React Community**: For the amazing framework and ecosystem

## 📞 Support

If you encounter any issues or have questions:
1. Check the troubleshooting guides
2. Review the documentation
3. Open an issue on GitHub
4. Contact the development team

---

**Made with ❤️ for better review writing**