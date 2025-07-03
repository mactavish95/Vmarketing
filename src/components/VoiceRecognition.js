import React, { useState, useEffect, useRef } from 'react';
import './VoiceRecognition.css';

const VoiceRecognition = ({ onTranscript, placeholder = "Tap to start speaking...", disabled = false, enableLLMEnhancement = true }) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');
    const [error, setError] = useState('');
    const [isSupported, setIsSupported] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const [browserInfo, setBrowserInfo] = useState('');
    const [showManualInput, setShowManualInput] = useState(false);
    const [manualText, setManualText] = useState('');
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [enhancedTranscript, setEnhancedTranscript] = useState('');
    const [apiKey, setApiKey] = useState(() => {
        return localStorage.getItem('nvidiaApiKey') || '';
    });
    const recognitionRef = useRef(null);
    const timeoutRef = useRef(null);

    useEffect(() => {
        // Detect mobile device and browser
        const checkDeviceAndBrowser = () => {
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
            setIsMobile(isMobileDevice);
            
            // Detect browser
            let browser = 'Unknown';
            if (userAgent.includes('Chrome')) browser = 'Chrome';
            else if (userAgent.includes('Safari')) browser = 'Safari';
            else if (userAgent.includes('Firefox')) browser = 'Firefox';
            else if (userAgent.includes('Edge')) browser = 'Edge';
            
            setBrowserInfo(`${browser} on ${isMobileDevice ? 'Mobile' : 'Desktop'}`);
        };
        
        checkDeviceAndBrowser();
        initializeSpeechRecognition();
        
        return () => {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.abort();
                } catch (e) {
                    console.log('Cleanup error:', e);
                }
            }
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    // Monitor API key changes
    useEffect(() => {
        const checkApiKey = () => {
            const storedApiKey = localStorage.getItem('nvidiaApiKey');
            if (storedApiKey !== apiKey) {
                console.log('API key updated:', { 
                    oldLength: apiKey.length, 
                    newLength: storedApiKey?.length,
                    oldKey: apiKey.substring(0, 10) + '...',
                    newKey: storedApiKey ? storedApiKey.substring(0, 10) + '...' : 'none'
                });
                setApiKey(storedApiKey || '');
            }
        };
        
        // Check immediately
        checkApiKey();
        
        // Set up interval to check periodically
        const interval = setInterval(checkApiKey, 2000);
        
        return () => clearInterval(interval);
    }, []); // Remove apiKey dependency to prevent infinite loop

    const initializeSpeechRecognition = () => {
        try {
            // Check for speech recognition support with fallbacks
            const SpeechRecognition = window.SpeechRecognition || 
                                    window.webkitSpeechRecognition || 
                                    window.mozSpeechRecognition || 
                                    window.msSpeechRecognition;
            
            if (!SpeechRecognition) {
                setError(`Speech recognition is not supported in ${browserInfo}. Please use Chrome, Edge, or Safari.`);
                setIsSupported(false);
                return;
            }

            // Create recognition instance
            recognitionRef.current = new SpeechRecognition();
            setupRecognition();
            setIsSupported(true);
            setIsInitialized(true);
            setRetryCount(0);
            
        } catch (error) {
            console.error('Failed to initialize speech recognition:', error);
            setError('Failed to initialize speech recognition. Please refresh the page and try again.');
            setIsSupported(false);
        }
    };

    const setupRecognition = () => {
        const recognition = recognitionRef.current;
        
        if (!recognition) return;

        // Configure recognition settings
        recognition.continuous = !isMobile; // Disable continuous on mobile for better performance
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = isMobile ? 3 : 1; // More alternatives for mobile

        // Mobile-specific optimizations
        if (isMobile) {
            recognition.continuous = false;
            recognition.maxAlternatives = 3;
            // Add a timeout for mobile to prevent hanging
            recognition.timeout = 10000; // 10 seconds
        }

        // Event handlers
        recognition.onstart = () => {
            console.log('Speech recognition started');
            setIsListening(true);
            setError('');
            
            // Set a timeout for mobile to auto-stop if no speech detected
            if (isMobile) {
                timeoutRef.current = setTimeout(() => {
                    if (isListening && !interimTranscript) {
                        console.log('Auto-stopping due to timeout');
                        stopListening();
                        setError('No speech detected. Please try speaking again.');
                    }
                }, 15000); // 15 seconds timeout
            }
        };

        recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';

            try {
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const resultTranscript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += resultTranscript;
                    } else {
                        interimTranscript += resultTranscript;
                    }
                }

                console.log('Voice recognition result:', { finalTranscript, interimTranscript });

                if (finalTranscript) {
                    const newTranscript = transcript + finalTranscript;
                    setInterimTranscript('');
                    
                    // Clear timeout since we got results
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                        timeoutRef.current = null;
                    }
                    
                    // Process with LLM enhancement
                    processTranscript(newTranscript, true);
                } else {
                    setInterimTranscript(interimTranscript);
                }
            } catch (error) {
                console.error('Error processing speech recognition result:', error);
                setError('Error processing speech. Please try again.');
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
            
            // Clear timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
            
            let errorMessage = '';
            switch (event.error) {
                case 'no-speech':
                    errorMessage = isMobile 
                        ? 'No speech detected. Please tap the microphone and try speaking again. Make sure to speak clearly and hold your device close.'
                        : 'No speech detected. Please try speaking again.';
                    break;
                case 'audio-capture':
                    errorMessage = isMobile
                        ? 'Audio capture failed. Please check your microphone permissions in device settings and try again.'
                        : 'Audio capture failed. Please check your microphone permissions and try again.';
                    break;
                case 'not-allowed':
                    errorMessage = isMobile
                        ? 'Microphone access denied. Please go to Settings > Privacy & Security > Microphone and enable access for this app, then refresh the page.'
                        : 'Microphone access denied. Please allow microphone access in your browser settings and refresh the page.';
                    break;
                case 'network':
                    errorMessage = 'Network error. Please check your internet connection and try again.';
                    break;
                case 'service-not-allowed':
                    errorMessage = 'Speech recognition service not allowed. Please try a different browser.';
                    break;
                case 'bad-grammar':
                    errorMessage = 'Speech recognition grammar error. Please try speaking more clearly.';
                    break;
                case 'language-not-supported':
                    errorMessage = 'Language not supported. Please try speaking in English.';
                    break;
                case 'aborted':
                    errorMessage = 'Speech recognition was interrupted. Please try again.';
                    break;
                default:
                    errorMessage = `Speech recognition error: ${event.error}. Please try again.`;
            }
            
            setError(errorMessage);
            
            // Increment retry count for auto-retry logic
            setRetryCount(prev => prev + 1);
        };

        recognition.onend = () => {
            console.log('Speech recognition ended');
            setIsListening(false);
            
            // Clear timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
            
            // Auto-restart on mobile for better UX (but limit retries)
            if (isMobile && retryCount < 2) {
                setTimeout(() => {
                    if (!isListening && retryCount < 2) {
                        console.log('Auto-restarting speech recognition...');
                        startListening();
                    }
                }, 500);
            }
        };

        recognition.onaudiostart = () => {
            console.log('Audio capturing started');
        };

        recognition.onaudioend = () => {
            console.log('Audio capturing ended');
        };

        recognition.onsoundstart = () => {
            console.log('Sound detected');
        };

        recognition.onsoundend = () => {
            console.log('Sound ended');
        };

        recognition.onspeechstart = () => {
            console.log('Speech started');
        };

        recognition.onspeechend = () => {
            console.log('Speech ended');
        };
    };

    const startListening = () => {
        if (!isSupported || disabled || !isInitialized) {
            console.log('Cannot start listening:', { isSupported, disabled, isInitialized });
            return;
        }
        
        try {
            setError('');
            console.log('Starting speech recognition...');
            
            // Reset retry count when manually starting
            setRetryCount(0);
            
            recognitionRef.current.start();
        } catch (error) {
            console.error('Error starting speech recognition:', error);
            setError('Failed to start speech recognition. Please try again.');
            
            // Try to reinitialize if there's an error
            setTimeout(() => {
                console.log('Attempting to reinitialize speech recognition...');
                initializeSpeechRecognition();
            }, 1000);
        }
    };

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            try {
                console.log('Stopping speech recognition...');
                recognitionRef.current.stop();
                
                // Clear timeout
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                    timeoutRef.current = null;
                }
            } catch (error) {
                console.error('Error stopping speech recognition:', error);
            }
        }
    };

    const clearTranscript = () => {
        setTranscript('');
        setInterimTranscript('');
        setEnhancedTranscript('');
        if (onTranscript) {
            onTranscript('');
        }
    };

    const handleToggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    const copyToClipboard = () => {
        const textToCopy = transcript || interimTranscript;
        if (textToCopy) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                // Show a brief success message
                const originalText = document.title;
                document.title = 'Copied to clipboard!';
                setTimeout(() => {
                    document.title = originalText;
                }, 1000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        }
    };

    const retryInitialization = () => {
        setError('');
        setIsInitialized(false);
        setTimeout(() => {
            initializeSpeechRecognition();
        }, 500);
    };

    const handleManualInput = async () => {
        if (manualText.trim()) {
            const newTranscript = transcript + manualText;
            setManualText('');
            setShowManualInput(false);
            
            // Process with LLM enhancement
            await processTranscript(newTranscript, true);
        }
    };

    const toggleManualInput = () => {
        setShowManualInput(!showManualInput);
        if (showManualInput) {
            setManualText('');
        }
    };

    // LLM-powered voice recognition enhancement
    const enhanceTranscriptWithLLM = async (rawTranscript) => {
        console.log('LLM enhancement check:', {
            enableLLMEnhancement,
            hasApiKey: !!apiKey.trim(),
            hasTranscript: !!rawTranscript.trim(),
            transcriptLength: rawTranscript.length
        });

        if (!enableLLMEnhancement || !apiKey.trim() || !rawTranscript.trim()) {
            console.log('LLM enhancement skipped:', {
                enableLLMEnhancement,
                hasApiKey: !!apiKey.trim(),
                hasTranscript: !!rawTranscript.trim()
            });
            return rawTranscript;
        }

        setIsEnhancing(true);
        setError('');

        try {
            const prompt = `Please improve and correct this voice-to-text transcript. Fix any spelling errors, grammar issues, and make it more coherent while preserving the original meaning and tone. Only return the corrected text, nothing else.

Original transcript: "${rawTranscript}"

Corrected transcript:`;

            console.log('Sending LLM enhancement request:', { prompt, apiKeyLength: apiKey.length });

            const response = await fetch('/api/llama', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: prompt,
                    apiKey: apiKey
                })
            });

            console.log('LLM response status:', response.status);

            if (!response.ok) {
                throw new Error(`Failed to enhance transcript: ${response.status}`);
            }

            const data = await response.json();
            console.log('LLM response data:', data);
            
            if (data.success && data.response) {
                const enhanced = data.response.trim();
                console.log('LLM enhanced transcript:', { original: rawTranscript, enhanced });
                return enhanced;
            } else {
                console.warn('LLM enhancement failed, using original transcript:', data);
                return rawTranscript;
            }
        } catch (error) {
            console.error('LLM enhancement error:', error);
            setError('Failed to enhance transcript with AI. Using original version.');
            return rawTranscript;
        } finally {
            setIsEnhancing(false);
        }
    };

    // Enhanced transcript processing
    const processTranscript = async (newTranscript, isFinal = false) => {
        if (isFinal && enableLLMEnhancement && apiKey.trim()) {
            // Store original transcript first
            setTranscript(newTranscript);
            
            // Enhance final transcript with LLM
            const enhanced = await enhanceTranscriptWithLLM(newTranscript);
            
            // Only set enhanced transcript if it's different from original
            if (enhanced !== newTranscript) {
                setEnhancedTranscript(enhanced);
                console.log('Enhanced transcript available:', { original: newTranscript, enhanced });
            } else {
                setEnhancedTranscript('');
            }
            
            // Always call onTranscript with the original first
            if (onTranscript) {
                onTranscript(newTranscript);
            }
        } else {
            // Use original transcript
            setTranscript(newTranscript);
            setEnhancedTranscript('');
            
            if (onTranscript) {
                onTranscript(newTranscript);
            }
        }
    };

    // Debug function for testing LLM enhancement
    const debugLLMEnhancement = async () => {
        console.log('=== LLM Enhancement Debug ===');
        console.log('enableLLMEnhancement:', enableLLMEnhancement);
        console.log('apiKey length:', apiKey.length);
        console.log('apiKey preview:', apiKey.substring(0, 10) + '...');
        console.log('current transcript:', transcript);
        
        if (!apiKey.trim()) {
            console.error('❌ No API key available');
            return;
        }
        
        if (!transcript.trim()) {
            console.error('❌ No transcript to enhance');
            return;
        }
        
        console.log('🧪 Testing LLM enhancement...');
        const enhanced = await enhanceTranscriptWithLLM(transcript);
        console.log('Enhanced result:', enhanced);
    };

    // Expose debug function to window for console access
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.debugVoiceRecognition = debugLLMEnhancement;
            console.log('Debug function available: window.debugVoiceRecognition()');
        }
    }, [apiKey, transcript, enableLLMEnhancement]);

    if (!isSupported) {
        return (
            <div className="voice-recognition-error">
                <div className="error-icon">🎤</div>
                <h3>Speech Recognition Not Supported</h3>
                <p>{error}</p>
                <div className="error-actions">
                    <button onClick={retryInitialization} className="retry-btn">
                        🔄 Try Again
                    </button>
                </div>
                <div className="mobile-tips">
                    <h4>Mobile Tips:</h4>
                    <ul>
                        <li>Use Chrome or Safari on your mobile device</li>
                        <li>Allow microphone permissions when prompted</li>
                        <li>Speak clearly and in a quiet environment</li>
                        <li>Hold your device close to your mouth</li>
                    </ul>
                </div>
            </div>
        );
    }

    const displayText = transcript || interimTranscript || placeholder;
    const isActive = isListening || interimTranscript;

    return (
        <div className="voice-recognition">
            {/* LLM Enhancement Controls */}
            {enableLLMEnhancement && (
                <div className="llm-enhancement-controls">
                    <div className="enhancement-status">
                        <span className="enhancement-icon">🤖</span>
                        <span className="enhancement-text">
                            {isEnhancing ? 'AI Enhancing...' : 'AI Enhancement Ready'}
                        </span>
                        <span className="api-key-status">
                            {apiKey.trim() ? 
                                `🔑 API Key: ${apiKey.substring(0, 8)}...` : 
                                '⚠️ No API Key'
                            }
                        </span>
                    </div>
                    {transcript && !isEnhancing && (
                        <button
                            onClick={() => enhanceTranscriptWithLLM(transcript)}
                            className="test-enhancement-btn"
                            title="Test LLM enhancement"
                        >
                            🧪 Test Enhancement
                        </button>
                    )}
                </div>
            )}

            <div className="voice-controls">
                <button
                    className={`voice-button ${isListening ? 'listening' : ''} ${disabled ? 'disabled' : ''}`}
                    onClick={handleToggleListening}
                    disabled={disabled}
                    aria-label={isListening ? 'Stop listening' : 'Start listening'}
                >
                    <span className="mic-icon">
                        {isListening ? '🔴' : '🎤'}
                    </span>
                    <span className="button-text">
                        {isListening ? (isMobile ? 'Tap to Stop' : 'Click to Stop') : (isMobile ? 'Tap to Speak' : 'Click to Speak')}
                    </span>
                </button>
                
                <button
                    onClick={toggleManualInput}
                    className="action-btn manual-btn"
                    title="Type manually"
                    aria-label="Type text manually"
                >
                    ✏️ Type
                </button>
                
                {(transcript || interimTranscript) && (
                    <div className="voice-actions">
                        <button
                            onClick={copyToClipboard}
                            className="action-btn copy-btn"
                            title="Copy to clipboard"
                            aria-label="Copy transcript to clipboard"
                        >
                            📋 Copy
                        </button>
                        <button
                            onClick={clearTranscript}
                            className="action-btn clear-btn"
                            title="Clear transcript"
                            aria-label="Clear transcript"
                        >
                            🗑️ Clear
                        </button>
                    </div>
                )}
            </div>

            {/* Manual Text Input */}
            {showManualInput && (
                <div className="manual-input-section">
                    <textarea
                        value={manualText}
                        onChange={(e) => setManualText(e.target.value)}
                        placeholder="Type your review here..."
                        className="manual-textarea"
                        rows="3"
                        autoFocus
                    />
                    <div className="manual-input-actions">
                        <button
                            onClick={handleManualInput}
                            className="action-btn add-btn"
                            disabled={!manualText.trim() || isEnhancing}
                        >
                            {isEnhancing ? '🤖 Enhancing...' : '➕ Add Text'}
                        </button>
                        <button
                            onClick={toggleManualInput}
                            className="action-btn cancel-btn"
                        >
                            ❌ Cancel
                        </button>
                    </div>
                </div>
            )}

            <div className={`transcript-area ${isActive ? 'active' : ''}`}>
                <div className="transcript-content">
                    {displayText}
                </div>
                {isListening && (
                    <div className="listening-indicator">
                        <div className="pulse-dot"></div>
                        <span>Listening...</span>
                    </div>
                )}
                {isEnhancing && (
                    <div className="enhancing-indicator">
                        <div className="enhancing-spinner"></div>
                        <span>🤖 AI is enhancing your transcript...</span>
                    </div>
                )}
            </div>

            {/* Enhanced Transcript Display */}
            {enhancedTranscript && enhancedTranscript !== transcript && (
                <div className="enhanced-transcript-section">
                    <h4>🤖 AI Enhanced Version:</h4>
                    <div className="enhanced-content">
                        {enhancedTranscript}
                    </div>
                    <div className="enhanced-actions">
                        <button
                            onClick={() => {
                                setTranscript(enhancedTranscript);
                                if (onTranscript) onTranscript(enhancedTranscript);
                            }}
                            className="action-btn use-enhanced-btn"
                        >
                            ✅ Use Enhanced Version
                        </button>
                        <button
                            onClick={() => setEnhancedTranscript('')}
                            className="action-btn keep-original-btn"
                        >
                            🔄 Keep Original
                        </button>
                    </div>
                </div>
            )}

            {error && (
                <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    <span>{error}</span>
                    <div className="error-actions">
                        <button onClick={retryInitialization} className="retry-link">
                            Try Again
                        </button>
                        <button onClick={toggleManualInput} className="manual-link">
                            Type Instead
                        </button>
                    </div>
                </div>
            )}

            {isMobile && (
                <div className="mobile-hints">
                    <p>💡 <strong>Mobile Tips:</strong> Speak clearly, hold device close, and ensure microphone permissions are enabled.</p>
                    <p>📝 <strong>Alternative:</strong> If voice doesn't work, use the "Type" button to enter text manually.</p>
                    {enableLLMEnhancement && (
                        <p>🤖 <strong>AI Enhancement:</strong> Your transcript will be automatically improved with AI for better accuracy.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default VoiceRecognition; 