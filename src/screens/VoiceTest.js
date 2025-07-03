import React, { useState } from 'react';
import VoiceRecognition from '../components/VoiceRecognition';
import './VoiceTest.css';

const VoiceTest = () => {
    const [testResults, setTestResults] = useState([]);
    const [browserInfo, setBrowserInfo] = useState({});

    React.useEffect(() => {
        // Get browser information
        const info = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            speechRecognition: !!(window.SpeechRecognition || window.webkitSpeechRecognition),
            mediaDevices: !!navigator.mediaDevices,
            getUserMedia: !!navigator.mediaDevices?.getUserMedia,
        };
        setBrowserInfo(info);
    }, []);

    const addTestResult = (message, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString();
        setTestResults(prev => [...prev, { message, type, timestamp }]);
    };

    const testMicrophone = async () => {
        try {
            addTestResult('Testing microphone access...', 'info');
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            addTestResult('✅ Microphone access granted!', 'success');
            stream.getTracks().forEach(track => track.stop());
        } catch (error) {
            addTestResult(`❌ Microphone access failed: ${error.message}`, 'error');
        }
    };

    const clearResults = () => {
        setTestResults([]);
    };

    const handleVoiceTranscript = (transcript) => {
        addTestResult(`🎤 Voice input: "${transcript}"`, 'success');
    };

    return (
        <div className="voice-test">
            <div className="test-container">
                <h1>🎤 Voice Recognition Test</h1>
                <p>Use this page to test and debug voice recognition issues</p>

                <div className="test-sections">
                    <div className="test-section">
                        <h2>Browser Information</h2>
                        <div className="browser-info">
                            {Object.entries(browserInfo).map(([key, value]) => (
                                <div key={key} className="info-item">
                                    <strong>{key}:</strong> 
                                    <span className={value ? 'success' : 'error'}>
                                        {typeof value === 'boolean' ? (value ? '✅ Yes' : '❌ No') : value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="test-section">
                        <h2>Microphone Test</h2>
                        <button onClick={testMicrophone} className="test-btn">
                            🎤 Test Microphone Access
                        </button>
                    </div>

                    <div className="test-section">
                        <h2>Voice Recognition Test</h2>
                        <VoiceRecognition
                            onTranscript={handleVoiceTranscript}
                            placeholder="Speak something to test voice recognition..."
                        />
                    </div>

                    <div className="test-section">
                        <h2>Test Results</h2>
                        <div className="test-controls">
                            <button onClick={clearResults} className="clear-btn">
                                🗑️ Clear Results
                            </button>
                        </div>
                        <div className="test-results">
                            {testResults.length === 0 ? (
                                <p className="no-results">No test results yet. Try the tests above!</p>
                            ) : (
                                testResults.map((result, index) => (
                                    <div key={index} className={`test-result ${result.type}`}>
                                        <span className="timestamp">[{result.timestamp}]</span>
                                        <span className="message">{result.message}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="troubleshooting-tips">
                    <h2>🔧 Troubleshooting Tips</h2>
                    <ul>
                        <li><strong>Browser Support:</strong> Use Chrome, Edge, or Safari</li>
                        <li><strong>HTTPS Required:</strong> Voice recognition needs secure connection</li>
                        <li><strong>Microphone Permissions:</strong> Allow microphone access when prompted</li>
                        <li><strong>Clear Speech:</strong> Speak clearly and at normal volume</li>
                        <li><strong>Quiet Environment:</strong> Reduce background noise</li>
                        <li><strong>Check Console:</strong> Press F12 to see detailed error messages</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default VoiceTest; 