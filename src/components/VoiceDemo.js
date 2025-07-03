import React, { useState } from 'react';
import VoiceRecognition from './VoiceRecognition';
import './VoiceDemo.css';

const VoiceDemo = () => {
    const [demoText, setDemoText] = useState('');

    const handleTranscript = (transcript) => {
        setDemoText(transcript);
    };

    return (
        <div className="voice-demo">
            <div className="demo-container">
                <h2>🎤 Voice Recognition Demo</h2>
                <p>Try speaking to see how voice recognition works!</p>
                
                <VoiceRecognition
                    onTranscript={handleTranscript}
                    placeholder="Speak something to test voice recognition..."
                />
                
                {demoText && (
                    <div className="demo-result">
                        <h3>Your spoken text:</h3>
                        <div className="demo-text">
                            "{demoText}"
                        </div>
                        <p className="demo-hint">
                            This text was generated entirely through voice input!
                        </p>
                    </div>
                )}
                
                <div className="demo-features">
                    <h3>Voice Recognition Features:</h3>
                    <ul>
                        <li>🎯 Real-time transcription</li>
                        <li>🔊 Continuous listening</li>
                        <li>📱 Mobile-friendly</li>
                        <li>🎨 Beautiful animations</li>
                        <li>📋 Copy to clipboard</li>
                        <li>🗑️ Clear functionality</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default VoiceDemo; 