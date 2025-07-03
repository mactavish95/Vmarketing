#!/usr/bin/env node

// Debug script to check localStorage contents
// Run this in the browser console or as a Node.js script

function debugLocalStorage() {
    console.log('🔍 Debugging localStorage...\n');
    
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
        console.log('Browser localStorage contents:');
        
        // Check voiceReviews
        const voiceReviews = localStorage.getItem('voiceReviews');
        console.log('voiceReviews:', voiceReviews);
        
        if (voiceReviews) {
            try {
                const parsed = JSON.parse(voiceReviews);
                console.log('Parsed voiceReviews:', parsed);
                console.log('Number of voice reviews:', parsed.length);
                
                if (parsed.length > 0) {
                    console.log('Latest voice review:', parsed[0]);
                }
            } catch (error) {
                console.error('Error parsing voiceReviews:', error);
            }
        }
        
        // Check reviewHistory
        const reviewHistory = localStorage.getItem('reviewHistory');
        console.log('reviewHistory:', reviewHistory);
        
        if (reviewHistory) {
            try {
                const parsed = JSON.parse(reviewHistory);
                console.log('Parsed reviewHistory:', parsed);
                console.log('Number of regular reviews:', parsed.length);
            } catch (error) {
                console.error('Error parsing reviewHistory:', error);
            }
        }
        
        // Check voiceAnalyses
        const voiceAnalyses = localStorage.getItem('voiceAnalyses');
        console.log('voiceAnalyses:', voiceAnalyses);
        
        if (voiceAnalyses) {
            try {
                const parsed = JSON.parse(voiceAnalyses);
                console.log('Parsed voiceAnalyses:', parsed);
                console.log('Number of voice analyses:', parsed.length);
            } catch (error) {
                console.error('Error parsing voiceAnalyses:', error);
            }
        }
        
        // List all localStorage keys
        console.log('\nAll localStorage keys:');
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            console.log(`- ${key}: ${localStorage.getItem(key)?.substring(0, 100)}...`);
        }
        
    } else {
        console.log('Not in browser environment. Run this script in the browser console.');
        console.log('To run in browser console:');
        console.log('1. Open browser developer tools (F12)');
        console.log('2. Go to Console tab');
        console.log('3. Copy and paste this script');
    }
}

// Test data creation function
function createTestVoiceReview() {
    if (typeof window !== 'undefined') {
        const testReview = {
            id: Date.now(),
            type: 'restaurant',
            rating: 5,
            review: 'This is a test review generated from voice input.',
            transcript: 'Test voice transcript',
            analysis: {
                sentiment: 'positive',
                confidence: 0.9,
                keyPoints: ['Good food', 'Great service'],
                topics: ['Restaurant', 'Food'],
                tone: 'positive',
                summary: 'Positive restaurant experience'
            },
            location: {
                latitude: 36.1699,
                longitude: -115.1398,
                address: 'Las Vegas, NV'
            },
            timestamp: new Date().toISOString()
        };
        
        const existingReviews = JSON.parse(localStorage.getItem('voiceReviews') || '[]');
        const updatedReviews = [testReview, ...existingReviews];
        localStorage.setItem('voiceReviews', JSON.stringify(updatedReviews));
        
        console.log('✅ Test voice review created and saved!');
        console.log('Test review:', testReview);
        
        return testReview;
    } else {
        console.log('Not in browser environment');
    }
}

// Export functions for browser use
if (typeof window !== 'undefined') {
    window.debugLocalStorage = debugLocalStorage;
    window.createTestVoiceReview = createTestVoiceReview;
    
    console.log('🔧 Debug functions loaded:');
    console.log('- debugLocalStorage() - Check localStorage contents');
    console.log('- createTestVoiceReview() - Create a test voice review');
}

// Run debug if called directly
if (typeof require !== 'undefined' && require.main === module) {
    debugLocalStorage();
} 