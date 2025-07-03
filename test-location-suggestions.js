async function testLocationSuggestions() {
    const testData = {
        transcript: "I went to McDonald's in France and it was amazing. The building was old and beautiful with a skylight. They had French macarons and deluxe potatoes.",
        apiKey: "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"
    };

    try {
        console.log('🧪 Testing Location Suggestions API...');
        console.log('📝 Transcript:', testData.transcript.substring(0, 50) + '...');
        
        const response = await fetch('http://localhost:3001/api/voice/suggest-location', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        });

        const result = await response.json();
        
        console.log('✅ Response Status:', response.status);
        console.log('📊 Success:', result.success);
        
        if (result.success) {
            console.log('🤖 AI Analysis:');
            console.log('  - Location Mentioned:', result.analysis?.locationMentioned);
            console.log('  - Location Type:', result.analysis?.locationType);
            console.log('  - Specific Place:', result.analysis?.specificPlace);
            console.log('  - Confidence:', result.analysis?.confidence);
            
            console.log('📍 Suggestions:', result.suggestions?.length || 0);
            result.suggestions?.forEach((suggestion, index) => {
                console.log(`  ${index + 1}. ${suggestion.name} (${suggestion.type}) - ${Math.round(suggestion.confidence * 100)}%`);
            });
        } else {
            console.log('❌ Error:', result.error);
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testLocationSuggestions(); 