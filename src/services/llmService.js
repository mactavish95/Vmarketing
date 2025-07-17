// LLM Service for analyzing voice input
// Supports multiple AI providers: OpenAI, Anthropic, and local fallback

// Enhanced function to clean and format AI responses for longer, more relevant content
function cleanAIResponse(response) {
    if (!response || typeof response !== 'string') {
        return response;
    }
    
    // Remove common AI response artifacts
    let cleaned = response
        // Remove markdown code blocks
        .replace(/```[\s\S]*?```/g, '')
        // Remove asterisks used for emphasis
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        // Remove backticks
        .replace(/`(.*?)`/g, '$1')
        // Remove excessive newlines (more than 2 consecutive)
        .replace(/\n{3,}/g, '\n\n')
        // Remove leading/trailing whitespace
        .trim()
        // Remove common AI prefixes
        .replace(/^(Here's|Here is|I'll|I will|Let me|Based on|According to|As an AI|As a customer service representative|As a helpful assistant)[,\s]*/gi, '')
        // Remove common AI suffixes
        .replace(/(I hope this helps|Let me know if you need anything else|Feel free to ask|Is there anything else I can help you with)[.!]*$/gi, '')
        // Remove excessive punctuation
        .replace(/[!]{2,}/g, '!')
        .replace(/[?]{2,}/g, '?')
        .replace(/[.]{2,}/g, '.')
        // Remove emoji clusters (keep single emojis)
        .replace(/([^\s])\1{2,}/g, '$1')
        // Remove excessive spaces
        .replace(/\s{2,}/g, ' ')
        // Remove quotes around the entire response
        .replace(/^["']|["']$/g, '')
        // Remove bullet points and numbering
        .replace(/^[\s]*[-*•]\s*/gm, '')
        .replace(/^[\s]*\d+[.)]\s*/gm, '')
        // Remove section headers
        .replace(/^[A-Z][A-Z\s]+:$/gm, '')
        // Remove empty lines at start and end
        .replace(/^\s*\n/, '')
        .replace(/\n\s*$/, '');
    
    // Apply enhanced formatting for longer, more comprehensive, and topic-relevant responses
    cleaned = formatForEnhancedDepthAndRelevance(cleaned);
    
    return cleaned;
}

// Enhanced formatting function for longer, more comprehensive, and topic-relevant responses
function formatForEnhancedDepthAndRelevance(text) {
    if (!text || typeof text !== 'string') {
        return text;
    }
    
    // Split into sentences and clean them
    const sentences = text.split(/[.!?]+/)
        .map(s => s.trim())
        .filter(s => s.length > 0);
    
    // Enhanced content structure analysis
    const structure = analyzeEnhancedContentStructure(sentences);
    
    // Format based on content type with enhanced depth
    if (structure.type === 'review') {
        return formatEnhancedReviewResponse(sentences, structure);
    } else if (structure.type === 'analysis') {
        return formatEnhancedAnalysisResponse(sentences, structure);
    } else if (structure.type === 'conversation') {
        return formatEnhancedConversationResponse(sentences, structure);
    } else if (structure.type === 'customer_service') {
        return formatEnhancedCustomerServiceResponse(sentences, structure);
    } else {
        return formatEnhancedGeneralResponse(sentences, structure);
    }
}

// Analyze the structure of the content
function analyzeContentStructure(sentences) {
    const text = sentences.join(' ').toLowerCase();
    
    // Detect content type
    let type = 'general';
    if (text.includes('rating') || text.includes('stars') || text.includes('recommend') || text.includes('experience')) {
        type = 'review';
    } else if (text.includes('analysis') || text.includes('sentiment') || text.includes('key points') || text.includes('summary')) {
        type = 'analysis';
    } else if (text.includes('hello') || text.includes('hi') || text.includes('how are you') || text.includes('chat')) {
        type = 'conversation';
    }
    
    // Extract key elements
    const keyPoints = sentences.filter(s => 
        s.toLowerCase().includes('important') || 
        s.toLowerCase().includes('key') || 
        s.toLowerCase().includes('main') ||
        s.toLowerCase().includes('primary')
    );
    
    const questions = sentences.filter(s => s.includes('?'));
    const statements = sentences.filter(s => !s.includes('?'));
    
    return {
        type,
        keyPoints,
        questions,
        statements,
        totalSentences: sentences.length
    };
}

// Enhanced content structure analysis for better topic relevance
function analyzeEnhancedContentStructure(sentences) {
    const text = sentences.join(' ').toLowerCase();
    
    // Enhanced content type detection
    let type = 'general';
    if (text.includes('rating') || text.includes('stars') || text.includes('recommend') || text.includes('experience') || text.includes('food') || text.includes('service') || text.includes('quality')) {
        type = 'review';
    } else if (text.includes('analysis') || text.includes('sentiment') || text.includes('key points') || text.includes('summary') || text.includes('findings') || text.includes('insights')) {
        type = 'analysis';
    } else if (text.includes('hello') || text.includes('hi') || text.includes('how are you') || text.includes('chat') || text.includes('conversation')) {
        type = 'conversation';
    } else if (text.includes('customer') || text.includes('service') || text.includes('apologize') || text.includes('resolve') || text.includes('issue') || text.includes('problem')) {
        type = 'customer_service';
    }
    
    // Enhanced key elements extraction
    const keyPoints = sentences.filter(s => 
        s.toLowerCase().includes('important') || 
        s.toLowerCase().includes('key') || 
        s.toLowerCase().includes('main') ||
        s.toLowerCase().includes('primary') ||
        s.toLowerCase().includes('essential') ||
        s.toLowerCase().includes('critical')
    );
    
    const positiveAspects = sentences.filter(s => 
        s.toLowerCase().includes('like') || 
        s.toLowerCase().includes('love') || 
        s.toLowerCase().includes('good') ||
        s.toLowerCase().includes('great') ||
        s.toLowerCase().includes('amazing') ||
        s.toLowerCase().includes('excellent') ||
        s.toLowerCase().includes('outstanding') ||
        s.toLowerCase().includes('fantastic')
    );
    
    const negativeAspects = sentences.filter(s => 
        s.toLowerCase().includes('disappointing') ||
        s.toLowerCase().includes('bad') ||
        s.toLowerCase().includes('poor') ||
        s.toLowerCase().includes('terrible') ||
        s.toLowerCase().includes('awful') ||
        s.toLowerCase().includes('horrible') ||
        s.toLowerCase().includes('unacceptable')
    );
    
    const suggestions = sentences.filter(s => 
        s.toLowerCase().includes('suggest') || 
        s.toLowerCase().includes('recommend') || 
        s.toLowerCase().includes('could') ||
        s.toLowerCase().includes('should') ||
        s.toLowerCase().includes('might') ||
        s.toLowerCase().includes('consider')
    );
    
    const questions = sentences.filter(s => s.includes('?'));
    const statements = sentences.filter(s => !s.includes('?'));
    
    // Extract topic-specific keywords
    const topics = extractTopicKeywords(text);
    
    return {
        type,
        keyPoints,
        positiveAspects,
        negativeAspects,
        suggestions,
        questions,
        statements,
        topics,
        totalSentences: sentences.length
    };
}

// Extract topic-specific keywords for better relevance
function extractTopicKeywords(text) {
    const topics = [];
    
    // Restaurant-related topics
    if (text.includes('food') || text.includes('restaurant') || text.includes('dining') || text.includes('meal')) {
        topics.push('restaurant', 'food', 'dining');
    }
    
    // Hotel-related topics
    if (text.includes('hotel') || text.includes('accommodation') || text.includes('room') || text.includes('stay')) {
        topics.push('hotel', 'accommodation', 'travel');
    }
    
    // Product-related topics
    if (text.includes('product') || text.includes('item') || text.includes('purchase') || text.includes('buy')) {
        topics.push('product', 'shopping', 'consumer');
    }
    
    // Service-related topics
    if (text.includes('service') || text.includes('support') || text.includes('help') || text.includes('assistance')) {
        topics.push('service', 'support', 'customer care');
    }
    
    // Technology-related topics
    if (text.includes('app') || text.includes('software') || text.includes('technology') || text.includes('digital')) {
        topics.push('technology', 'software', 'digital');
    }
    
    return [...new Set(topics)]; // Remove duplicates
}

// Format review responses with clear structure
function formatReviewResponse(sentences, structure) {
    let formatted = '';
    
    // Opening statement
    const opening = sentences.find(s => 
        s.toLowerCase().includes('experience') || 
        s.toLowerCase().includes('visit') || 
        s.toLowerCase().includes('tried') ||
        s.toLowerCase().includes('went')
    );
    
    if (opening) {
        formatted += `📝 ${capitalizeFirst(opening)}.\n\n`;
    }
    
    // Main points
    const mainPoints = sentences.filter(s => 
        s.toLowerCase().includes('like') || 
        s.toLowerCase().includes('love') || 
        s.toLowerCase().includes('good') ||
        s.toLowerCase().includes('great') ||
        s.toLowerCase().includes('amazing') ||
        s.toLowerCase().includes('disappointing') ||
        s.toLowerCase().includes('bad') ||
        s.toLowerCase().includes('poor')
    );
    
    if (mainPoints.length > 0) {
        formatted += '✨ Key Highlights:\n';
        mainPoints.slice(0, 3).forEach((point, index) => {
            formatted += `   • ${capitalizeFirst(point)}.\n`;
        });
        formatted += '\n';
    }
    
    // Additional details
    const details = sentences.filter(s => 
        !mainPoints.includes(s) && 
        !opening?.includes(s) &&
        s.length > 20
    );
    
    if (details.length > 0) {
        formatted += '📋 Additional Details:\n';
        details.slice(0, 2).forEach(detail => {
            formatted += `   ${capitalizeFirst(detail)}.\n`;
        });
        formatted += '\n';
    }
    
    // Conclusion
    const conclusion = sentences.find(s => 
        s.toLowerCase().includes('recommend') || 
        s.toLowerCase().includes('return') || 
        s.toLowerCase().includes('worth') ||
        s.toLowerCase().includes('overall')
    );
    
    if (conclusion) {
        formatted += `🎯 ${capitalizeFirst(conclusion)}.`;
    }
    
    return formatted.trim();
}

// Format analysis responses with structured sections
function formatAnalysisResponse(sentences, structure) {
    let formatted = '';
    
    // Summary section
    const summary = sentences.find(s => 
        s.toLowerCase().includes('overall') || 
        s.toLowerCase().includes('summary') || 
        s.toLowerCase().includes('in conclusion')
    );
    
    if (summary) {
        formatted += `📊 Summary:\n${capitalizeFirst(summary)}.\n\n`;
    }
    
    // Key findings
    const findings = sentences.filter(s => 
        s.toLowerCase().includes('found') || 
        s.toLowerCase().includes('discovered') || 
        s.toLowerCase().includes('identified') ||
        s.toLowerCase().includes('detected')
    );
    
    if (findings.length > 0) {
        formatted += '🔍 Key Findings:\n';
        findings.slice(0, 3).forEach((finding, index) => {
            formatted += `   ${index + 1}. ${capitalizeFirst(finding)}.\n`;
        });
        formatted += '\n';
    }
    
    // Recommendations
    const recommendations = sentences.filter(s => 
        s.toLowerCase().includes('recommend') || 
        s.toLowerCase().includes('suggest') || 
        s.toLowerCase().includes('should') ||
        s.toLowerCase().includes('could')
    );
    
    if (recommendations.length > 0) {
        formatted += '💡 Recommendations:\n';
        recommendations.slice(0, 3).forEach((rec, index) => {
            formatted += `   • ${capitalizeFirst(rec)}.\n`;
        });
        formatted += '\n';
    }
    
    // Next steps
    const nextSteps = sentences.filter(s => 
        s.toLowerCase().includes('next') || 
        s.toLowerCase().includes('action') || 
        s.toLowerCase().includes('step') ||
        s.toLowerCase().includes('plan')
    );
    
    if (nextSteps.length > 0) {
        formatted += '🚀 Next Steps:\n';
        nextSteps.slice(0, 2).forEach((step, index) => {
            formatted += `   ${index + 1}. ${capitalizeFirst(step)}.\n`;
        });
    }
    
    return formatted.trim();
}

// Format conversation responses naturally
function formatConversationResponse(sentences, structure) {
    let formatted = '';
    
    // Greeting or acknowledgment
    const greeting = sentences.find(s => 
        s.toLowerCase().includes('hello') || 
        s.toLowerCase().includes('hi') || 
        s.toLowerCase().includes('hey') ||
        s.toLowerCase().includes('thanks') ||
        s.toLowerCase().includes('thank you')
    );
    
    if (greeting) {
        formatted += `${capitalizeFirst(greeting)}.\n\n`;
    }
    
    // Main response
    const mainResponse = sentences.filter(s => 
        !greeting?.includes(s) &&
        s.length > 10
    );
    
    if (mainResponse.length > 0) {
        formatted += mainResponse.slice(0, 3).map(s => capitalizeFirst(s)).join(' ');
        formatted += '\n\n';
    }
    
    // Follow-up or engagement
    const followUp = sentences.find(s => 
        s.toLowerCase().includes('what about you') || 
        s.toLowerCase().includes('how about') || 
        s.toLowerCase().includes('what do you think') ||
        s.toLowerCase().includes('any thoughts')
    );
    
    if (followUp) {
        formatted += `💭 ${capitalizeFirst(followUp)}`;
    }
    
    return formatted.trim();
}

// Format general responses with clear structure
function formatGeneralResponse(sentences, structure) {
    let formatted = '';
    
    // Main point
    const mainPoint = sentences[0];
    if (mainPoint) {
        formatted += `📌 ${capitalizeFirst(mainPoint)}.\n\n`;
    }
    
    // Supporting points
    const supportingPoints = sentences.slice(1, 4);
    if (supportingPoints.length > 0) {
        formatted += '📋 Details:\n';
        supportingPoints.forEach((point, index) => {
            formatted += `   ${index + 1}. ${capitalizeFirst(point)}.\n`;
        });
        formatted += '\n';
    }
    
    // Conclusion or takeaway
    const conclusion = sentences.find(s => 
        s.toLowerCase().includes('therefore') || 
        s.toLowerCase().includes('thus') || 
        s.toLowerCase().includes('in summary') ||
        s.toLowerCase().includes('overall')
    );
    
    if (conclusion) {
        formatted += `🎯 ${capitalizeFirst(conclusion)}`;
    }
    
    return formatted.trim();
}

// Helper function to capitalize first letter
function capitalizeFirst(str) {
    if (!str || typeof str !== 'string') return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Enhanced review response with comprehensive details
function formatEnhancedReviewResponse(sentences, structure) {
    let formatted = '';
    
    // Comprehensive opening with context
    const opening = sentences.find(s => 
        s.toLowerCase().includes('experience') || 
        s.toLowerCase().includes('visit') || 
        s.toLowerCase().includes('tried') ||
        s.toLowerCase().includes('went') ||
        s.toLowerCase().includes('recently') ||
        s.toLowerCase().includes('last')
    );
    
    if (opening) {
        formatted += `📝 ${capitalizeFirst(opening)}.\n\n`;
    }
    
    // Detailed positive aspects section
    if (structure.positiveAspects.length > 0) {
        formatted += '✨ What I Really Enjoyed:\n';
        structure.positiveAspects.slice(0, 4).forEach((aspect, index) => {
            formatted += `   • ${capitalizeFirst(aspect)}.\n`;
        });
        formatted += '\n';
    }
    
    // Detailed negative aspects section
    if (structure.negativeAspects.length > 0) {
        formatted += '⚠️ Areas for Improvement:\n';
        structure.negativeAspects.slice(0, 3).forEach((aspect, index) => {
            formatted += `   • ${capitalizeFirst(aspect)}.\n`;
        });
        formatted += '\n';
    }
    
    // Key highlights and memorable moments
    const highlights = sentences.filter(s => 
        s.toLowerCase().includes('highlight') || 
        s.toLowerCase().includes('memorable') || 
        s.toLowerCase().includes('standout') ||
        s.toLowerCase().includes('impressive') ||
        s.toLowerCase().includes('notable')
    );
    
    if (highlights.length > 0) {
        formatted += '🌟 Memorable Highlights:\n';
        highlights.slice(0, 3).forEach((highlight, index) => {
            formatted += `   ${index + 1}. ${capitalizeFirst(highlight)}.\n`;
        });
        formatted += '\n';
    }
    
    // Detailed experience description
    const experienceDetails = sentences.filter(s => 
        s.toLowerCase().includes('atmosphere') || 
        s.toLowerCase().includes('ambiance') || 
        s.toLowerCase().includes('environment') ||
        s.toLowerCase().includes('setting') ||
        s.toLowerCase().includes('vibe') ||
        s.toLowerCase().includes('feel')
    );
    
    if (experienceDetails.length > 0) {
        formatted += '🏠 Atmosphere & Environment:\n';
        experienceDetails.slice(0, 2).forEach(detail => {
            formatted += `   ${capitalizeFirst(detail)}.\n`;
        });
        formatted += '\n';
    }
    
    // Value and pricing considerations
    const valueAspects = sentences.filter(s => 
        s.toLowerCase().includes('price') || 
        s.toLowerCase().includes('cost') || 
        s.toLowerCase().includes('value') ||
        s.toLowerCase().includes('worth') ||
        s.toLowerCase().includes('expensive') ||
        s.toLowerCase().includes('affordable')
    );
    
    if (valueAspects.length > 0) {
        formatted += '💰 Value & Pricing:\n';
        valueAspects.slice(0, 2).forEach(aspect => {
            formatted += `   ${capitalizeFirst(aspect)}.\n`;
        });
        formatted += '\n';
    }
    
    // Recommendations and suggestions
    if (structure.suggestions.length > 0) {
        formatted += '💡 Recommendations:\n';
        structure.suggestions.slice(0, 3).forEach((suggestion, index) => {
            formatted += `   • ${capitalizeFirst(suggestion)}.\n`;
        });
        formatted += '\n';
    }
    
    // Comprehensive conclusion
    const conclusion = sentences.find(s => 
        s.toLowerCase().includes('recommend') || 
        s.toLowerCase().includes('return') || 
        s.toLowerCase().includes('worth') ||
        s.toLowerCase().includes('overall') ||
        s.toLowerCase().includes('conclusion') ||
        s.toLowerCase().includes('final')
    );
    
    if (conclusion) {
        formatted += `🎯 ${capitalizeFirst(conclusion)}.`;
    } else {
        // Generate a comprehensive conclusion based on sentiment
        const positiveCount = structure.positiveAspects.length;
        const negativeCount = structure.negativeAspects.length;
        
        if (positiveCount > negativeCount) {
            formatted += `🎯 Overall, this was a positive experience that I would recommend to others.`;
        } else if (negativeCount > positiveCount) {
            formatted += `🎯 While there were some issues, there's potential for improvement with the right changes.`;
        } else {
            formatted += `🎯 This was a mixed experience with both positive and negative aspects to consider.`;
        }
    }
    
    return formatted.trim();
}

// Enhanced analysis response with detailed insights
function formatEnhancedAnalysisResponse(sentences, structure) {
    let formatted = '';
    
    // Executive summary
    const summary = sentences.find(s => 
        s.toLowerCase().includes('overall') || 
        s.toLowerCase().includes('summary') || 
        s.toLowerCase().includes('in conclusion') ||
        s.toLowerCase().includes('main takeaway')
    );
    
    if (summary) {
        formatted += `📊 Executive Summary:\n${capitalizeFirst(summary)}.\n\n`;
    }
    
    // Detailed key findings with context
    const findings = sentences.filter(s => 
        s.toLowerCase().includes('found') || 
        s.toLowerCase().includes('discovered') || 
        s.toLowerCase().includes('identified') ||
        s.toLowerCase().includes('detected') ||
        s.toLowerCase().includes('observed') ||
        s.toLowerCase().includes('noticed')
    );
    
    if (findings.length > 0) {
        formatted += '🔍 Detailed Findings:\n';
        findings.slice(0, 5).forEach((finding, index) => {
            formatted += `   ${index + 1}. ${capitalizeFirst(finding)}.\n`;
        });
        formatted += '\n';
    }
    
    // Sentiment analysis breakdown
    const sentimentSentences = sentences.filter(s => 
        s.toLowerCase().includes('positive') || 
        s.toLowerCase().includes('negative') || 
        s.toLowerCase().includes('neutral') ||
        s.toLowerCase().includes('sentiment') ||
        s.toLowerCase().includes('emotion') ||
        s.toLowerCase().includes('tone')
    );
    
    if (sentimentSentences.length > 0) {
        formatted += '😊 Sentiment Analysis:\n';
        sentimentSentences.slice(0, 3).forEach((sentiment, index) => {
            formatted += `   • ${capitalizeFirst(sentiment)}.\n`;
        });
        formatted += '\n';
    }
    
    // Topic-specific insights
    if (structure.topics.length > 0) {
        formatted += `📋 ${structure.topics[0].charAt(0).toUpperCase() + structure.topics[0].slice(1)}-Specific Insights:\n`;
        const topicSentences = sentences.filter(s => 
            structure.topics.some(topic => s.toLowerCase().includes(topic))
        );
        topicSentences.slice(0, 3).forEach((insight, index) => {
            formatted += `   ${index + 1}. ${capitalizeFirst(insight)}.\n`;
        });
        formatted += '\n';
    }
    
    // Strategic recommendations
    if (structure.suggestions.length > 0) {
        formatted += '💡 Strategic Recommendations:\n';
        structure.suggestions.slice(0, 4).forEach((rec, index) => {
            formatted += `   • ${capitalizeFirst(rec)}.\n`;
        });
        formatted += '\n';
    }
    
    // Action items and next steps
    const actionItems = sentences.filter(s => 
        s.toLowerCase().includes('action') || 
        s.toLowerCase().includes('next') || 
        s.toLowerCase().includes('step') ||
        s.toLowerCase().includes('plan') ||
        s.toLowerCase().includes('implement') ||
        s.toLowerCase().includes('improve')
    );
    
    if (actionItems.length > 0) {
        formatted += '🚀 Action Items & Next Steps:\n';
        actionItems.slice(0, 4).forEach((item, index) => {
            formatted += `   ${index + 1}. ${capitalizeFirst(item)}.\n`;
        });
        formatted += '\n';
    }
    
    // Impact assessment
    const impactSentences = sentences.filter(s => 
        s.toLowerCase().includes('impact') || 
        s.toLowerCase().includes('effect') || 
        s.toLowerCase().includes('result') ||
        s.toLowerCase().includes('outcome') ||
        s.toLowerCase().includes('consequence')
    );
    
    if (impactSentences.length > 0) {
        formatted += '📈 Impact Assessment:\n';
        impactSentences.slice(0, 2).forEach((impact, index) => {
            formatted += `   • ${capitalizeFirst(impact)}.\n`;
        });
    }
    
    return formatted.trim();
}

// Enhanced conversation response with more depth
function formatEnhancedConversationResponse(sentences, structure) {
    let formatted = '';
    
    // Warm greeting or acknowledgment
    const greeting = sentences.find(s => 
        s.toLowerCase().includes('hello') || 
        s.toLowerCase().includes('hi') || 
        s.toLowerCase().includes('hey') ||
        s.toLowerCase().includes('thanks') ||
        s.toLowerCase().includes('thank you') ||
        s.toLowerCase().includes('appreciate')
    );
    
    if (greeting) {
        formatted += `${capitalizeFirst(greeting)}.\n\n`;
    }
    
    // Main response with expanded context
    const mainResponse = sentences.filter(s => 
        !greeting?.includes(s) &&
        s.length > 10
    );
    
    if (mainResponse.length > 0) {
        formatted += '💭 My Thoughts:\n';
        mainResponse.slice(0, 4).forEach((response, index) => {
            formatted += `   ${capitalizeFirst(response)}.\n`;
        });
        formatted += '\n';
    }
    
    // Personal insights or experiences
    const personalInsights = sentences.filter(s => 
        s.toLowerCase().includes('think') || 
        s.toLowerCase().includes('believe') || 
        s.toLowerCase().includes('feel') ||
        s.toLowerCase().includes('experience') ||
        s.toLowerCase().includes('opinion') ||
        s.toLowerCase().includes('view')
    );
    
    if (personalInsights.length > 0) {
        formatted += '🤔 Personal Perspective:\n';
        personalInsights.slice(0, 2).forEach((insight, index) => {
            formatted += `   • ${capitalizeFirst(insight)}.\n`;
        });
        formatted += '\n';
    }
    
    // Engaging follow-up questions
    const followUp = sentences.find(s => 
        s.toLowerCase().includes('what about you') || 
        s.toLowerCase().includes('how about') || 
        s.toLowerCase().includes('what do you think') ||
        s.toLowerCase().includes('any thoughts') ||
        s.toLowerCase().includes('your experience') ||
        s.toLowerCase().includes('your opinion')
    );
    
    if (followUp) {
        formatted += `💬 ${capitalizeFirst(followUp)}`;
    } else {
        // Generate engaging follow-up
        formatted += `💬 What are your thoughts on this topic? I'd love to hear your perspective!`;
    }
    
    return formatted.trim();
}

// Enhanced customer service response with comprehensive approach
function formatEnhancedCustomerServiceResponse(sentences, structure) {
    let formatted = '';
    
    // Empathetic acknowledgment
    const acknowledgment = sentences.find(s => 
        s.toLowerCase().includes('understand') || 
        s.toLowerCase().includes('apologize') || 
        s.toLowerCase().includes('sorry') ||
        s.toLowerCase().includes('concern') ||
        s.toLowerCase().includes('issue') ||
        s.toLowerCase().includes('problem')
    );
    
    if (acknowledgment) {
        formatted += `🤝 ${capitalizeFirst(acknowledgment)}.\n\n`;
    }
    
    // Detailed problem understanding
    const problemAnalysis = sentences.filter(s => 
        s.toLowerCase().includes('situation') || 
        s.toLowerCase().includes('circumstance') || 
        s.toLowerCase().includes('experience') ||
        s.toLowerCase().includes('issue') ||
        s.toLowerCase().includes('problem') ||
        s.toLowerCase().includes('concern')
    );
    
    if (problemAnalysis.length > 0) {
        formatted += '📋 Understanding Your Situation:\n';
        problemAnalysis.slice(0, 3).forEach((analysis, index) => {
            formatted += `   • ${capitalizeFirst(analysis)}.\n`;
        });
        formatted += '\n';
    }
    
    // Immediate solutions and actions
    const solutions = sentences.filter(s => 
        s.toLowerCase().includes('solution') || 
        s.toLowerCase().includes('resolve') || 
        s.toLowerCase().includes('fix') ||
        s.toLowerCase().includes('address') ||
        s.toLowerCase().includes('correct') ||
        s.toLowerCase().includes('improve')
    );
    
    if (solutions.length > 0) {
        formatted += '🔧 Immediate Solutions:\n';
        solutions.slice(0, 4).forEach((solution, index) => {
            formatted += `   ${index + 1}. ${capitalizeFirst(solution)}.\n`;
        });
        formatted += '\n';
    }
    
    // Long-term improvements
    const improvements = sentences.filter(s => 
        s.toLowerCase().includes('improve') || 
        s.toLowerCase().includes('enhance') || 
        s.toLowerCase().includes('better') ||
        s.toLowerCase().includes('upgrade') ||
        s.toLowerCase().includes('develop') ||
        s.toLowerCase().includes('advance')
    );
    
    if (improvements.length > 0) {
        formatted += '🚀 Long-term Improvements:\n';
        improvements.slice(0, 3).forEach((improvement, index) => {
            formatted += `   • ${capitalizeFirst(improvement)}.\n`;
        });
        formatted += '\n';
    }
    
    // Compensation or goodwill gestures
    const compensation = sentences.filter(s => 
        s.toLowerCase().includes('compensate') || 
        s.toLowerCase().includes('refund') || 
        s.toLowerCase().includes('discount') ||
        s.toLowerCase().includes('credit') ||
        s.toLowerCase().includes('offer') ||
        s.toLowerCase().includes('gesture')
    );
    
    if (compensation.length > 0) {
        formatted += '🎁 Goodwill Gestures:\n';
        compensation.slice(0, 2).forEach((gesture, index) => {
            formatted += `   • ${capitalizeFirst(gesture)}.\n`;
        });
        formatted += '\n';
    }
    
    // Follow-up and contact information
    const followUp = sentences.find(s => 
        s.toLowerCase().includes('contact') || 
        s.toLowerCase().includes('reach') || 
        s.toLowerCase().includes('follow up') ||
        s.toLowerCase().includes('get in touch') ||
        s.toLowerCase().includes('available')
    );
    
    if (followUp) {
        formatted += `📞 ${capitalizeFirst(followUp)}`;
    } else {
        formatted += `📞 Please don't hesitate to reach out if you need any further assistance.`;
    }
    
    return formatted.trim();
}

// Enhanced general response with comprehensive structure
function formatEnhancedGeneralResponse(sentences, structure) {
    let formatted = '';
    
    // Main point with context
    const mainPoint = sentences[0];
    if (mainPoint) {
        formatted += `📌 Main Point:\n${capitalizeFirst(mainPoint)}.\n\n`;
    }
    
    // Detailed explanation
    const explanations = sentences.slice(1, 6);
    if (explanations.length > 0) {
        formatted += '📋 Detailed Explanation:\n';
        explanations.forEach((explanation, index) => {
            formatted += `   ${index + 1}. ${capitalizeFirst(explanation)}.\n`;
        });
        formatted += '\n';
    }
    
    // Key insights and takeaways
    const insights = sentences.filter(s => 
        s.toLowerCase().includes('important') || 
        s.toLowerCase().includes('key') || 
        s.toLowerCase().includes('essential') ||
        s.toLowerCase().includes('critical') ||
        s.toLowerCase().includes('significant') ||
        s.toLowerCase().includes('notable')
    );
    
    if (insights.length > 0) {
        formatted += '💡 Key Insights:\n';
        insights.slice(0, 3).forEach((insight, index) => {
            formatted += `   • ${capitalizeFirst(insight)}.\n`;
        });
        formatted += '\n';
    }
    
    // Practical applications or examples
    const applications = sentences.filter(s => 
        s.toLowerCase().includes('example') || 
        s.toLowerCase().includes('instance') || 
        s.toLowerCase().includes('case') ||
        s.toLowerCase().includes('scenario') ||
        s.toLowerCase().includes('situation') ||
        s.toLowerCase().includes('application')
    );
    
    if (applications.length > 0) {
        formatted += '🔍 Practical Examples:\n';
        applications.slice(0, 2).forEach((app, index) => {
            formatted += `   ${index + 1}. ${capitalizeFirst(app)}.\n`;
        });
        formatted += '\n';
    }
    
    // Comprehensive conclusion
    const conclusion = sentences.find(s => 
        s.toLowerCase().includes('therefore') || 
        s.toLowerCase().includes('thus') || 
        s.toLowerCase().includes('in summary') ||
        s.toLowerCase().includes('overall') ||
        s.toLowerCase().includes('conclusion') ||
        s.toLowerCase().includes('final')
    );
    
    if (conclusion) {
        formatted += `🎯 ${capitalizeFirst(conclusion)}`;
    } else {
        // Generate a comprehensive conclusion
        formatted += `🎯 In summary, this topic encompasses multiple important aspects that deserve careful consideration and thoughtful discussion.`;
    }
    
    return formatted.trim();
}

class LLMService {
    constructor() {
        // In the browser, process.env is not available. Use empty string or inject via build tools if needed.
        this.apiKey = '';
        this.anthropicKey = '';
        this.useLocalFallback = true;
    }

    // Analyze voice input with sentiment, key points, and suggestions
    async analyzeVoiceInput(transcript, context = {}) {
        if (!transcript || transcript.trim().length === 0) {
            return {
                success: false,
                error: 'No transcript provided'
            };
        }

        try {
            // Try OpenAI first
            if (this.apiKey) {
                const result = await this.analyzeWithOpenAI(transcript, context);
                if (result.success) return result;
            }

            // Try Anthropic if OpenAI fails
            if (this.anthropicKey) {
                const result = await this.analyzeWithAnthropic(transcript, context);
                if (result.success) return result;
            }

            // Fallback to local analysis
            if (this.useLocalFallback) {
                return this.analyzeLocally(transcript, context);
            }

            return {
                success: false,
                error: 'No AI service available'
            };

        } catch (error) {
            console.error('LLM analysis error:', error);
            return {
                success: false,
                error: error.message || 'Analysis failed'
            };
        }
    }

    // NVIDIA Llama 3.3 Nemotron Super Analysis with Enhanced Thinking and Structure
    async analyzeWithOpenAI(transcript, context) {
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4',
                    messages: [
                        {
                            role: 'system',
                            content: `You are an expert voice analysis assistant with deep reasoning capabilities and excellent conversational understanding. 

**ENHANCED THINKING PROCESS**:
1. **CONTEXTUAL UNDERSTANDING**: What is the person really saying in this specific context?
2. **EMOTIONAL INTELLIGENCE**: How is the speaker feeling? What emotions are expressed?
3. **INTENT ANALYSIS**: What is the speaker trying to accomplish or communicate?
4. **STRUCTURAL ANALYSIS**: How is the content organized and what's the logical flow?
5. **CONVERSATIONAL IMPACT**: How does this fit into a broader conversation or interaction?

**STRUCTURED ANALYSIS APPROACH**:
- Analyze both explicit content and implicit meanings
- Consider emotional undertones and conversational nuances
- Identify key themes and how they connect
- Evaluate the effectiveness of communication
- Provide insights that enhance conversational understanding

**RESPONSE STRUCTURE**:
- Organize findings in a logical, easy-to-follow format
- Highlight the most important insights first
- Connect related points to show understanding
- Provide actionable suggestions that improve communication

Analyze the user's voice input and provide structured insights in JSON format:
{
    "sentiment": "positive/negative/neutral",
    "confidence": 0.0-1.0,
    "keyPoints": ["point1", "point2"],
    "topics": ["topic1", "topic2"],
    "suggestions": ["suggestion1", "suggestion2"],
    "tone": "professional/casual/emotional/etc",
    "actionItems": ["action1", "action2"],
    "summary": "brief summary",
    "wordCount": number,
    "speakingPace": "fast/normal/slow",
    "conversationalFlow": "structured/rambling/focused",
    "engagementLevel": "high/medium/low"
}`
                        },
                        {
                            role: 'user',
                            content: `Analyze this voice input with enhanced conversational understanding: "${transcript}"
                            
Context: ${JSON.stringify(context)}`
                        }
                    ],
                    temperature: 0.4,
                    max_tokens: 500
                })
            });

            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.status}`);
            }

            const data = await response.json();
            const analysis = JSON.parse(data.choices[0].message.content);

            return {
                success: true,
                provider: 'Meta Llama 3.1 70B Instruct',
                analysis: {
                    ...analysis,
                    transcript: transcript,
                    timestamp: new Date().toISOString()
                }
            };

        } catch (error) {
            console.error('NVIDIA Llama analysis failed:', error);
            throw error;
        }
    }

    // Anthropic Claude Analysis
    async analyzeWithAnthropic(transcript, context) {
        try {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.anthropicKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: 'claude-3-sonnet-20240229',
                    max_tokens: 500,
                    messages: [
                        {
                            role: 'user',
                            content: `Analyze this voice input and provide a JSON response with:
- sentiment (positive/negative/neutral)
- confidence (0.0-1.0)
- keyPoints (array of main points)
- topics (array of topics discussed)
- suggestions (array of improvement suggestions)
- tone (professional/casual/emotional/etc)
- actionItems (array of next steps)
- summary (brief summary)
- wordCount (number)
- speakingPace (fast/normal/slow)

Voice input: "${transcript}"
Context: ${JSON.stringify(context)}`
                        }
                    ]
                })
            });

            if (!response.ok) {
                throw new Error(`Anthropic API error: ${response.status}`);
            }

            const data = await response.json();
            const analysis = JSON.parse(data.content[0].text);

            return {
                success: true,
                provider: 'Anthropic Claude',
                analysis: {
                    ...analysis,
                    transcript: transcript,
                    timestamp: new Date().toISOString()
                }
            };

        } catch (error) {
            console.error('Anthropic analysis failed:', error);
            throw error;
        }
    }

    // Local fallback analysis (basic sentiment and key points)
    analyzeLocally(transcript, context) {
        const words = transcript.toLowerCase().split(/\s+/);
        const wordCount = words.length;

        // Basic sentiment analysis
        const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'love', 'like', 'happy', 'satisfied', 'perfect'];
        const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'dislike', 'unhappy', 'disappointed', 'poor', 'worst', 'horrible'];
        
        let positiveCount = 0;
        let negativeCount = 0;

        words.forEach(word => {
            if (positiveWords.includes(word)) positiveCount++;
            if (negativeWords.includes(word)) negativeCount++;
        });

        let sentiment = 'neutral';
        let confidence = 0.5;

        if (positiveCount > negativeCount) {
            sentiment = 'positive';
            confidence = Math.min(0.9, 0.5 + (positiveCount - negativeCount) * 0.1);
        } else if (negativeCount > positiveCount) {
            sentiment = 'negative';
            confidence = Math.min(0.9, 0.5 + (negativeCount - positiveCount) * 0.1);
        }

        // Extract key points (simple approach)
        const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const keyPoints = sentences.slice(0, 3).map(s => s.trim());

        // Determine speaking pace
        const speakingPace = wordCount > 200 ? 'fast' : wordCount > 100 ? 'normal' : 'slow';

        // Basic tone detection
        const tone = this.detectTone(transcript);

        return {
            success: true,
            provider: 'Local Analysis',
            analysis: {
                sentiment,
                confidence,
                keyPoints,
                topics: this.extractTopics(transcript),
                suggestions: this.generateSuggestions(sentiment, wordCount, tone),
                tone,
                actionItems: this.generateActionItems(transcript),
                summary: sentences[0] || 'No clear summary available',
                wordCount,
                speakingPace,
                transcript,
                timestamp: new Date().toISOString()
            }
        };
    }

    // Helper methods for local analysis
    detectTone(transcript) {
        const text = transcript.toLowerCase();
        
        if (text.includes('!') || text.includes('amazing') || text.includes('wow')) {
            return 'enthusiastic';
        } else if (text.includes('please') || text.includes('thank you') || text.includes('appreciate')) {
            return 'polite';
        } else if (text.includes('problem') || text.includes('issue') || text.includes('concern')) {
            return 'concerned';
        } else if (text.includes('think') || text.includes('believe') || text.includes('consider')) {
            return 'thoughtful';
        } else {
            return 'neutral';
        }
    }

    extractTopics(transcript) {
        const text = transcript.toLowerCase();
        const topics = [];

        if (text.includes('work') || text.includes('job') || text.includes('career')) {
            topics.push('work/career');
        }
        if (text.includes('family') || text.includes('home') || text.includes('personal')) {
            topics.push('personal/family');
        }
        if (text.includes('health') || text.includes('exercise') || text.includes('fitness')) {
            topics.push('health/fitness');
        }
        if (text.includes('money') || text.includes('finance') || text.includes('budget')) {
            topics.push('finance');
        }
        if (text.includes('travel') || text.includes('vacation') || text.includes('trip')) {
            topics.push('travel');
        }

        return topics.length > 0 ? topics : ['general'];
    }

    generateSuggestions(sentiment, wordCount, tone) {
        const suggestions = [];

        if (wordCount < 10) {
            suggestions.push('Try speaking for longer to provide more context');
        }
        if (wordCount > 200) {
            suggestions.push('Consider breaking your thoughts into smaller segments');
        }
        if (sentiment === 'negative') {
            suggestions.push('Consider focusing on positive aspects or solutions');
        }
        if (tone === 'concerned') {
            suggestions.push('Try to balance concerns with potential solutions');
        }

        return suggestions.length > 0 ? suggestions : ['Your voice input was clear and well-structured'];
    }

    generateActionItems(transcript) {
        const text = transcript.toLowerCase();
        const actions = [];

        if (text.includes('need to') || text.includes('should') || text.includes('must')) {
            actions.push('Review and prioritize mentioned tasks');
        }
        if (text.includes('problem') || text.includes('issue')) {
            actions.push('Address the mentioned concerns');
        }
        if (text.includes('plan') || text.includes('schedule')) {
            actions.push('Create a plan based on your input');
        }

        return actions.length > 0 ? actions : ['Consider what next steps you\'d like to take'];
    }

    // Generate review from voice input
    async generateReviewFromVoice(transcript, reviewType = 'general', rating = 5) {
        const analysis = await this.analyzeVoiceInput(transcript, { reviewType, rating });
        
        if (!analysis.success) {
            return analysis;
        }

        // Generate review text based on analysis
        const reviewText = this.formatReviewText(analysis.analysis, reviewType, rating);
        
        return {
            ...analysis,
            reviewText
        };
    }

    formatReviewText(analysis, reviewType, rating) {
        const { sentiment, keyPoints, tone, summary } = analysis;
        
        let reviewText = '';
        
        // Start with a natural opening based on sentiment and tone
        if (sentiment === 'positive') {
            if (tone === 'enthusiastic') {
                reviewText += `Had an amazing time at this ${reviewType}! `;
            } else if (tone === 'casual') {
                reviewText += `Really enjoyed this ${reviewType}. `;
            } else {
                reviewText += `Great experience with this ${reviewType}. `;
            }
        } else if (sentiment === 'negative') {
            if (tone === 'critical') {
                reviewText += `Unfortunately, this ${reviewType} was disappointing. `;
            } else {
                reviewText += `Wasn't impressed with this ${reviewType}. `;
            }
        } else {
            reviewText += `Mixed experience with this ${reviewType}. `;
        }
        
        // Add key points naturally
        if (keyPoints && keyPoints.length > 0) {
            const points = keyPoints.slice(0, 2); // Limit to 2 main points
            if (points.length === 1) {
                reviewText += points[0];
            } else {
                reviewText += points.join(' ');
            }
        } else if (summary) {
            reviewText += summary;
        }
        
        // Add natural closing based on sentiment and tone
        if (sentiment === 'positive') {
            if (tone === 'enthusiastic') {
                reviewText += ' Definitely worth checking out!';
            } else if (tone === 'casual') {
                reviewText += ' Would go back for sure.';
            } else {
                reviewText += ' Recommended.';
            }
        } else if (sentiment === 'negative') {
            if (tone === 'critical') {
                reviewText += ' Wouldn\'t recommend.';
            } else {
                reviewText += ' Probably won\'t return.';
            }
        } else {
            reviewText += ' Decent option if you\'re in the area.';
        }
        
        // Add rating subtly at the end
        if (rating && rating > 0) {
            reviewText += `\n\nRating: ${rating}/5`;
        }
        
        // Clean the response before returning
        return cleanAIResponse(reviewText);
    }
}

import { getApiUrl } from '../config/api';
/**
 * Get LLM-powered recommendations for a final post result using the Qwen model
 * @param {string} post - The final post content
 * @param {string} platform - The target platform (e.g., 'instagram', 'facebook')
 * @returns {Promise<string>} Recommendations string
 */
export async function getPostRecommendations(post, platform = '') {
  try {
    const url = getApiUrl('/enhanced-llm/recommendation');
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ post, platform })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to get recommendations');
    }
    const data = await res.json();
    return data.recommendations;
  } catch (error) {
    throw new Error(error.message || 'Failed to get recommendations');
  }
}

export default new LLMService(); 