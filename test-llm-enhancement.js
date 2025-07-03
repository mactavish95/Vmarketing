// Test script for LLM enhancement
const testLLMEnhancement = async () => {
    const apiKey = localStorage.getItem('nvidiaApiKey');
    console.log('API Key from localStorage:', apiKey ? `${apiKey.substring(0, 10)}...` : 'Not found');
    
    if (!apiKey) {
        console.error('No API key found in localStorage');
        return;
    }
    
    const testTranscript = "Gordon Ramsay Burger in Las Vegas actually worth it I got his specialty celebration burger for $27 it was pretty tasty but for $27 for cheese tomato and egg on a burger Master Chef more like Master scam prices";
    
    console.log('Testing LLM enhancement with transcript:', testTranscript);
    
    try {
        const prompt = `Please improve and correct this voice-to-text transcript. Fix any spelling errors, grammar issues, and make it more coherent while preserving the original meaning and tone. Only return the corrected text, nothing else.

Original transcript: "${testTranscript}"

Corrected transcript:`;

        console.log('Sending request to /api/llama...');
        
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

        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Response data:', data);
        
        if (data.success && data.response) {
            console.log('✅ LLM Enhancement Success!');
            console.log('Original:', testTranscript);
            console.log('Enhanced:', data.response.trim());
        } else {
            console.error('❌ LLM Enhancement failed:', data);
        }
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
};

// Run test when page loads
if (typeof window !== 'undefined') {
    window.testLLMEnhancement = testLLMEnhancement;
    console.log('Test function available. Run testLLMEnhancement() in console to test.');
} 