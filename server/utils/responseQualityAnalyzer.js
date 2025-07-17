// Response Quality Analyzer
// Analyzes response patterns, structure, and key points to improve response quality

class ResponseQualityAnalyzer {
    constructor() {
        this.qualityMetrics = {
            coherence: 0,
            relevance: 0,
            completeness: 0,
            clarity: 0,
            engagement: 0,
            structure: 0,
            tone: 0,
            length: 0
        };

        this.responsePatterns = {
            conversation: {
                requiredElements: ['greeting', 'main_content', 'engagement'],
                optimalLength: { min: 50, max: 200 },
                tone: ['friendly', 'casual', 'engaging'],
                structure: ['opening', 'body', 'closing']
            },
            analysis: {
                requiredElements: ['summary', 'key_points', 'insights', 'recommendations'],
                optimalLength: { min: 150, max: 500 },
                tone: ['professional', 'objective', 'detailed'],
                structure: ['executive_summary', 'detailed_analysis', 'conclusions']
            },
            customer_service: {
                requiredElements: ['acknowledgment', 'understanding', 'solution', 'follow_up'],
                optimalLength: { min: 100, max: 300 },
                tone: ['empathetic', 'professional', 'helpful'],
                structure: ['empathy', 'problem_understanding', 'solution', 'next_steps']
            },
            review: {
                requiredElements: ['experience', 'highlights', 'details', 'recommendation'],
                optimalLength: { min: 100, max: 400 },
                tone: ['personal', 'authentic', 'informative'],
                structure: ['context', 'experience', 'evaluation', 'recommendation']
            }
        };
    }

    // Analyze response quality comprehensively
    analyzeResponseQuality(response, contentType = 'general', context = {}) {
        const analysis = {
            overallScore: 0,
            metrics: { ...this.qualityMetrics },
            strengths: [],
            weaknesses: [],
            suggestions: [],
            patternAnalysis: {},
            structureAnalysis: {},
            keyPoints: [],
            sentiment: 'neutral',
            complexity: 'moderate',
            engagement: 'medium'
        };

        // Analyze different aspects
        analysis.metrics.coherence = this.analyzeCoherence(response);
        analysis.metrics.relevance = this.analyzeRelevance(response, context);
        analysis.metrics.completeness = this.analyzeCompleteness(response, contentType);
        analysis.metrics.clarity = this.analyzeClarity(response);
        analysis.metrics.engagement = this.analyzeEngagement(response);
        analysis.metrics.structure = this.analyzeStructure(response, contentType);
        analysis.metrics.tone = this.analyzeTone(response, contentType);
        analysis.metrics.length = this.analyzeLength(response, contentType);

        // Calculate overall score
        analysis.overallScore = this.calculateOverallScore(analysis.metrics);

        // Identify strengths and weaknesses
        analysis.strengths = this.identifyStrengths(analysis.metrics);
        analysis.weaknesses = this.identifyWeaknesses(analysis.metrics);

        // Generate suggestions for improvement
        analysis.suggestions = this.generateSuggestions(analysis);

        // Analyze response patterns
        analysis.patternAnalysis = this.analyzeResponsePatterns(response, contentType);

        // Analyze structure
        analysis.structureAnalysis = this.analyzeResponseStructure(response, contentType);

        // Extract key points
        analysis.keyPoints = this.extractKeyPoints(response);

        // Analyze sentiment
        analysis.sentiment = this.analyzeSentiment(response);

        // Analyze complexity
        analysis.complexity = this.analyzeComplexity(response);

        return analysis;
    }

    // Analyze coherence of the response
    analyzeCoherence(response) {
        if (!response || typeof response !== 'string') return 0;

        const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);
        if (sentences.length < 2) return 0.5;

        let coherenceScore = 0;
        let transitionCount = 0;
        let logicalFlowScore = 0;
        let structureScore = 0;

        // Check for logical transitions and connectors
        const transitions = [
            'however', 'therefore', 'furthermore', 'moreover', 'in addition', 
            'consequently', 'as a result', 'meanwhile', 'subsequently', 'next',
            'then', 'also', 'besides', 'additionally', 'further', 'moreover',
            'similarly', 'likewise', 'in contrast', 'on the other hand',
            'first', 'second', 'third', 'finally', 'in conclusion', 'to summarize'
        ];
        
        // Check for paragraph structure and logical flow
        const paragraphs = response.split(/\n\s*\n/).filter(p => p.trim().length > 0);
        if (paragraphs.length > 1) {
            structureScore += 0.2; // Bonus for paragraph structure
        }

        for (let i = 1; i < sentences.length; i++) {
            const currentSentence = sentences[i].toLowerCase();
            const prevSentence = sentences[i-1].toLowerCase();
            
            // Check for transition words
            const hasTransition = transitions.some(transition => currentSentence.includes(transition));
            if (hasTransition) {
                transitionCount++;
                logicalFlowScore += 0.1;
            }

            // Check for topic continuity and keyword repetition
            const prevWords = prevSentence.split(' ').slice(-4); // Last 4 words
            const currentWords = currentSentence.split(' ').slice(0, 4); // First 4 words
            const hasContinuity = prevWords.some(word => 
                currentWords.includes(word) && word.length > 3
            );
            
            if (hasContinuity) {
                coherenceScore += 0.15;
            }

            // Check for logical progression (question-answer, problem-solution, etc.)
            const hasQuestion = prevSentence.includes('?');
            const hasAnswer = currentSentence.includes('because') || currentSentence.includes('since') || 
                             currentSentence.includes('as') || currentSentence.includes('due to');
            
            if (hasQuestion && hasAnswer) {
                logicalFlowScore += 0.2;
            }

            // Check for cause-effect relationships
            const hasCause = prevSentence.includes('because') || prevSentence.includes('since') || 
                           prevSentence.includes('as a result');
            const hasEffect = currentSentence.includes('therefore') || currentSentence.includes('consequently') ||
                            currentSentence.includes('this means') || currentSentence.includes('so');
            
            if (hasCause || hasEffect) {
                logicalFlowScore += 0.15;
            }
        }

        // Check for clear beginning, middle, and end structure
        const hasHook = sentences[0].length < 100 && (sentences[0].includes('!') || sentences[0].includes('?'));
        const hasConclusion = sentences[sentences.length - 1].includes('in conclusion') || 
                             sentences[sentences.length - 1].includes('finally') ||
                             sentences[sentences.length - 1].includes('to summarize');
        
        if (hasHook) structureScore += 0.1;
        if (hasConclusion) structureScore += 0.1;

        // Normalize scores
        const transitionScore = Math.min(transitionCount / sentences.length, 1) * 0.25;
        const continuityScore = Math.min(coherenceScore / sentences.length, 1) * 0.3;
        const flowScore = Math.min(logicalFlowScore / sentences.length, 1) * 0.25;
        const finalStructureScore = Math.min(structureScore, 0.2);

        return Math.min(transitionScore + continuityScore + flowScore + finalStructureScore, 1);
    }

    // Analyze relevance to the context and target audience
    analyzeRelevance(response, context) {
        if (!response) return 0.5;

        let relevanceScore = 0.5; // Base score
        const responseLower = response.toLowerCase();
        const responseWords = responseLower.split(' ');

        // Analyze context relevance if context is provided
        if (context && Object.keys(context).length > 0) {
            const contextWords = Object.values(context).join(' ').toLowerCase().split(' ');
            const contextKeywords = contextWords.filter(word => word.length > 3);
            
            // Find common words between response and context
            const commonWords = responseWords.filter(word => 
                contextKeywords.includes(word) && word.length > 3
            );

            const contextRelevance = commonWords.length / Math.max(responseWords.length, 1);
            relevanceScore += contextRelevance * 0.3;
        }

        // Analyze audience relevance based on platform and target audience
        if (context && context.targetAudience) {
            const audience = context.targetAudience.toLowerCase();
            
            // Audience-specific relevance checks
            if (audience.includes('business') || audience.includes('professional')) {
                const businessTerms = ['strategy', 'growth', 'efficiency', 'results', 'professional', 'industry', 'market'];
                const businessTermCount = businessTerms.filter(term => responseLower.includes(term)).length;
                relevanceScore += (businessTermCount / businessTerms.length) * 0.2;
            }
            
            if (audience.includes('family') || audience.includes('parent')) {
                const familyTerms = ['family', 'children', 'kids', 'parent', 'home', 'together', 'fun', 'safe'];
                const familyTermCount = familyTerms.filter(term => responseLower.includes(term)).length;
                relevanceScore += (familyTermCount / familyTerms.length) * 0.2;
            }
            
            if (audience.includes('foodie') || audience.includes('food')) {
                const foodTerms = ['delicious', 'flavor', 'cuisine', 'ingredients', 'taste', 'dining', 'restaurant', 'chef'];
                const foodTermCount = foodTerms.filter(term => responseLower.includes(term)).length;
                relevanceScore += (foodTermCount / foodTerms.length) * 0.2;
            }
        }

        // Analyze platform relevance
        if (context && context.platform) {
            const platform = context.platform.toLowerCase();
            
            if (platform.includes('facebook')) {
                // Facebook-specific relevance (community, sharing, personal stories)
                const facebookTerms = ['community', 'share', 'story', 'experience', 'friends', 'family', 'together'];
                const facebookTermCount = facebookTerms.filter(term => responseLower.includes(term)).length;
                relevanceScore += (facebookTermCount / facebookTerms.length) * 0.15;
            }
            
            if (platform.includes('instagram')) {
                // Instagram-specific relevance (visual, aesthetic, lifestyle)
                const instagramTerms = ['beautiful', 'amazing', 'stunning', 'perfect', 'lifestyle', 'aesthetic', 'visual'];
                const instagramTermCount = instagramTerms.filter(term => responseLower.includes(term)).length;
                relevanceScore += (instagramTermCount / instagramTerms.length) * 0.15;
            }
            
            if (platform.includes('linkedin')) {
                // LinkedIn-specific relevance (professional, career, industry)
                const linkedinTerms = ['professional', 'career', 'industry', 'business', 'leadership', 'expertise', 'network'];
                const linkedinTermCount = linkedinTerms.filter(term => responseLower.includes(term)).length;
                relevanceScore += (linkedinTermCount / linkedinTerms.length) * 0.15;
            }
        }

        // Check for engagement elements (call-to-action, questions, etc.)
        const engagementElements = ['click', 'share', 'comment', 'like', 'follow', 'visit', 'learn more', 'discover'];
        const engagementCount = engagementElements.filter(element => responseLower.includes(element)).length;
        relevanceScore += (engagementCount / engagementElements.length) * 0.1;

        // Check for hashtag usage (relevant for social media)
        const hashtagCount = (response.match(/#\w+/g) || []).length;
        if (hashtagCount > 0 && hashtagCount <= 5) {
            relevanceScore += 0.1; // Bonus for appropriate hashtag usage
        }

        return Math.min(relevanceScore, 1);
    }

    // Analyze completeness based on content type
    analyzeCompleteness(response, contentType) {
        if (!response) return 0;

        const pattern = this.responsePatterns[contentType] || this.responsePatterns.conversation;
        const requiredElements = pattern.requiredElements;
        
        let completenessScore = 0;
        const responseLower = response.toLowerCase();

        requiredElements.forEach(element => {
            const elementWords = element.split('_');
            const hasElement = elementWords.some(word => 
                responseLower.includes(word) || 
                this.findSynonyms(word).some(synonym => responseLower.includes(synonym))
            );
            
            if (hasElement) {
                completenessScore += 1 / requiredElements.length;
            }
        });

        return completenessScore;
    }

    // Analyze clarity of the response
    analyzeClarity(response) {
        if (!response) return 0;

        let clarityScore = 0.5; // Base score

        // Check sentence length (shorter sentences are often clearer)
        const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const avgSentenceLength = sentences.reduce((sum, sentence) => 
            sum + sentence.split(' ').length, 0) / sentences.length;

        if (avgSentenceLength <= 15) clarityScore += 0.2;
        else if (avgSentenceLength <= 25) clarityScore += 0.1;
        else clarityScore -= 0.1;

        // Check for complex words
        const complexWords = ['notwithstanding', 'aforementioned', 'subsequently', 'consequently', 'furthermore'];
        const complexWordCount = complexWords.filter(word => 
            response.toLowerCase().includes(word)
        ).length;

        if (complexWordCount === 0) clarityScore += 0.2;
        else if (complexWordCount <= 2) clarityScore += 0.1;
        else clarityScore -= 0.1;

        // Check for active voice
        const passiveVoicePatterns = ['is being', 'are being', 'was being', 'were being', 'has been', 'have been'];
        const passiveCount = passiveVoicePatterns.filter(pattern => 
            response.toLowerCase().includes(pattern)
        ).length;

        if (passiveCount === 0) clarityScore += 0.1;
        else clarityScore -= 0.1;

        return Math.min(Math.max(clarityScore, 0), 1);
    }

    // Analyze engagement level
    analyzeEngagement(response) {
        if (!response) return 0;

        let engagementScore = 0.5; // Base score

        // Check for questions (encourages interaction)
        const questionCount = (response.match(/\?/g) || []).length;
        if (questionCount > 0) engagementScore += 0.2;

        // Check for personal pronouns (creates connection)
        const personalPronouns = ['you', 'your', 'we', 'our', 'us'];
        const pronounCount = personalPronouns.filter(pronoun => 
            response.toLowerCase().includes(pronoun)
        ).length;
        
        if (pronounCount >= 3) engagementScore += 0.2;
        else if (pronounCount >= 1) engagementScore += 0.1;

        // Check for emotional words
        const emotionalWords = ['amazing', 'fantastic', 'wonderful', 'excellent', 'great', 'love', 'enjoy', 'appreciate'];
        const emotionalCount = emotionalWords.filter(word => 
            response.toLowerCase().includes(word)
        ).length;
        
        if (emotionalCount >= 2) engagementScore += 0.1;

        // Check for call-to-action
        const callToActionWords = ['try', 'consider', 'think about', 'imagine', 'suppose'];
        const hasCallToAction = callToActionWords.some(word => 
            response.toLowerCase().includes(word)
        );
        
        if (hasCallToAction) engagementScore += 0.1;

        return Math.min(Math.max(engagementScore, 0), 1);
    }

    // Analyze structure based on content type
    analyzeStructure(response, contentType) {
        if (!response) return 0;

        const pattern = this.responsePatterns[contentType] || this.responsePatterns.conversation;
        const expectedStructure = pattern.structure;
        
        let structureScore = 0.5; // Base score

        // Check for paragraph breaks (indicates structure)
        const paragraphs = response.split(/\n\s*\n/).filter(p => p.trim().length > 0);
        if (paragraphs.length >= 2) structureScore += 0.2;

        // Check for structural indicators
        const structuralIndicators = ['first', 'second', 'third', 'finally', 'in conclusion', 'to summarize', 'overall'];
        const indicatorCount = structuralIndicators.filter(indicator => 
            response.toLowerCase().includes(indicator)
        ).length;
        
        if (indicatorCount >= 2) structureScore += 0.2;
        else if (indicatorCount >= 1) structureScore += 0.1;

        // Check for bullet points or numbered lists
        const hasBulletPoints = /\n\s*[-*•]\s/.test(response);
        const hasNumberedList = /\n\s*\d+[.)]\s/.test(response);
        
        if (hasBulletPoints || hasNumberedList) structureScore += 0.1;

        return Math.min(Math.max(structureScore, 0), 1);
    }

    // Analyze tone appropriateness
    analyzeTone(response, contentType) {
        if (!response) return 0;

        const pattern = this.responsePatterns[contentType] || this.responsePatterns.conversation;
        const expectedTones = pattern.tone;
        
        let toneScore = 0.5; // Base score

        // Define tone indicators
        const toneIndicators = {
            professional: ['professional', 'expert', 'analysis', 'recommendation', 'assessment'],
            casual: ['cool', 'awesome', 'great', 'nice', 'fun'],
            friendly: ['hello', 'hi', 'thanks', 'appreciate', 'welcome'],
            empathetic: ['understand', 'sorry', 'apologize', 'care', 'concern'],
            formal: ['therefore', 'consequently', 'furthermore', 'moreover', 'thus']
        };

        // Check for expected tones
        expectedTones.forEach(expectedTone => {
            const indicators = toneIndicators[expectedTone] || [];
            const hasTone = indicators.some(indicator => 
                response.toLowerCase().includes(indicator)
            );
            
            if (hasTone) toneScore += 0.2;
        });

        return Math.min(Math.max(toneScore, 0), 1);
    }

    // Analyze length appropriateness
    analyzeLength(response, contentType) {
        if (!response) return 0;

        const pattern = this.responsePatterns[contentType] || this.responsePatterns.conversation;
        const optimalLength = pattern.optimalLength;
        
        const wordCount = response.split(' ').length;
        const { min, max } = optimalLength;

        if (wordCount >= min && wordCount <= max) return 1;
        if (wordCount >= min * 0.8 && wordCount <= max * 1.2) return 0.8;
        if (wordCount >= min * 0.6 && wordCount <= max * 1.4) return 0.6;
        return 0.3;
    }

    // Calculate overall score based on metrics
    calculateOverallScore(metrics) {
        // Enhanced weighting for social media content with focus on coherence and relevance
        const weights = {
            coherence: 0.40,      // 40% - Most important for social media
            relevance: 0.30,      // 30% - Second most important
            clarity: 0.15,        // 15% - Important for understanding
            engagement: 0.15      // 15% - Important for social media success
        };

        let totalScore = 0;
        let totalWeight = 0;

        // Calculate weighted score for key metrics
        Object.keys(weights).forEach(metric => {
            if (metrics[metric] !== undefined) {
                totalScore += metrics[metric] * weights[metric];
                totalWeight += weights[metric];
            }
        });

        // Normalize to 0-100 scale
        const normalizedScore = totalWeight > 0 ? (totalScore / totalWeight) * 100 : 0;
        
        return Math.round(normalizedScore);
    }

    // Identify strengths in the response
    identifyStrengths(metrics) {
        const strengths = [];
        
        if (metrics.coherence >= 0.8) strengths.push('Excellent logical flow and coherence');
        if (metrics.relevance >= 0.8) strengths.push('Highly relevant to the context');
        if (metrics.completeness >= 0.8) strengths.push('Comprehensive and complete response');
        if (metrics.clarity >= 0.8) strengths.push('Clear and easy to understand');
        if (metrics.engagement >= 0.8) strengths.push('Engaging and interactive');
        if (metrics.structure >= 0.8) strengths.push('Well-structured and organized');
        if (metrics.tone >= 0.8) strengths.push('Appropriate tone for the context');
        if (metrics.length >= 0.8) strengths.push('Optimal length for the content type');

        return strengths;
    }

    // Identify weaknesses in the response
    identifyWeaknesses(metrics) {
        const weaknesses = [];
        
        if (metrics.coherence < 0.5) weaknesses.push('Poor logical flow and coherence');
        if (metrics.relevance < 0.5) weaknesses.push('Low relevance to the context');
        if (metrics.completeness < 0.5) weaknesses.push('Incomplete response');
        if (metrics.clarity < 0.5) weaknesses.push('Unclear or confusing');
        if (metrics.engagement < 0.5) weaknesses.push('Not engaging enough');
        if (metrics.structure < 0.5) weaknesses.push('Poor structure and organization');
        if (metrics.tone < 0.5) weaknesses.push('Inappropriate tone');
        if (metrics.length < 0.5) weaknesses.push('Length not appropriate for content type');

        return weaknesses;
    }

    // Generate suggestions for improvement
    generateSuggestions(analysis) {
        const suggestions = [];

        // Coherence-focused suggestions (highest priority)
        if (analysis.metrics.coherence < 0.7) {
            suggestions.push(
                "Improve logical flow by adding transition words like 'however', 'therefore', 'furthermore'",
                "Ensure each sentence builds naturally on the previous one",
                "Create a clear beginning, middle, and end structure",
                "Use paragraph breaks to separate different ideas or topics",
                "Check that your main message is consistently reinforced throughout"
            );
        }

        // Relevance-focused suggestions (second priority)
        if (analysis.metrics.relevance < 0.7) {
            suggestions.push(
                "Make content more relevant to your target audience by using their language and examples",
                "Include specific details that matter to your audience",
                "Add platform-specific elements (hashtags for Instagram, professional tone for LinkedIn)",
                "Ensure your call-to-action aligns with your audience's interests",
                "Use examples and references that your audience can relate to"
            );
        }

        // Clarity-focused suggestions
        if (analysis.metrics.clarity < 0.7) {
            suggestions.push(
                "Use shorter, simpler sentences for better readability",
                "Avoid jargon and complex vocabulary",
                "Make your main message crystal clear from the start",
                "Break up long paragraphs into smaller, digestible chunks",
                "Use bullet points or numbered lists for better organization"
            );
        }

        // Engagement-focused suggestions
        if (analysis.metrics.engagement < 0.7) {
            suggestions.push(
                "Start with a compelling hook that grabs attention immediately",
                "Include a clear call-to-action that encourages interaction",
                "Ask questions to encourage comments and engagement",
                "Use emotional language that resonates with your audience",
                "Add relevant hashtags to increase discoverability"
            );
        }

        // General improvement suggestions
        if (analysis.overallScore < 70) {
            suggestions.push(
                "Read your content aloud to check for natural flow and rhythm",
                "Have someone from your target audience review the content",
                "Test different versions to see which performs better",
                "Focus on one main message rather than trying to cover multiple topics",
                "Use storytelling techniques to make your content more engaging"
            );
        }

        // Return unique suggestions (remove duplicates)
        return [...new Set(suggestions)].slice(0, 8); // Limit to 8 suggestions
    }

    // Analyze response patterns
    analyzeResponsePatterns(response, contentType) {
        const patterns = {
            hasQuestions: false,
            hasPersonalPronouns: false,
            hasEmotionalWords: false,
            hasCallToAction: false,
            hasTransitions: false,
            hasBulletPoints: false,
            hasNumberedList: false,
            hasParagraphs: false
        };

        if (!response) return patterns;

        patterns.hasQuestions = /\?/.test(response);
        patterns.hasPersonalPronouns = /\b(you|your|we|our|us)\b/i.test(response);
        patterns.hasEmotionalWords = /\b(amazing|fantastic|wonderful|excellent|great|love|enjoy|appreciate)\b/i.test(response);
        patterns.hasCallToAction = /\b(try|consider|think about|imagine|suppose)\b/i.test(response);
        patterns.hasTransitions = /\b(however|therefore|furthermore|moreover|in addition|consequently|as a result|meanwhile|subsequently)\b/i.test(response);
        patterns.hasBulletPoints = /\n\s*[-*•]\s/.test(response);
        patterns.hasNumberedList = /\n\s*\d+[.)]\s/.test(response);
        patterns.hasParagraphs = /\n\s*\n/.test(response);

        return patterns;
    }

    // Analyze response structure
    analyzeResponseStructure(response, contentType) {
        const structure = {
            paragraphs: 0,
            sentences: 0,
            words: 0,
            avgSentenceLength: 0,
            avgParagraphLength: 0,
            hasIntroduction: false,
            hasConclusion: false,
            hasBody: false
        };

        if (!response) return structure;

        const paragraphs = response.split(/\n\s*\n/).filter(p => p.trim().length > 0);
        const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const words = response.split(/\s+/).filter(w => w.length > 0);

        structure.paragraphs = paragraphs.length;
        structure.sentences = sentences.length;
        structure.words = words.length;
        structure.avgSentenceLength = sentences.length > 0 ? words.length / sentences.length : 0;
        structure.avgParagraphLength = paragraphs.length > 0 ? sentences.length / paragraphs.length : 0;

        // Check for structural elements
        const responseLower = response.toLowerCase();
        structure.hasIntroduction = /\b(introduction|overview|summary|first|initially)\b/i.test(responseLower);
        structure.hasConclusion = /\b(conclusion|finally|in summary|overall|therefore)\b/i.test(responseLower);
        structure.hasBody = structure.sentences > 2;

        return structure;
    }

    // Extract key points from the response
    extractKeyPoints(response) {
        if (!response) return [];

        const keyPoints = [];
        const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);

        // Look for sentences with key indicators
        const keyIndicators = ['important', 'key', 'main', 'primary', 'essential', 'critical', 'significant', 'notable'];
        
        sentences.forEach(sentence => {
            const sentenceLower = sentence.toLowerCase();
            const hasKeyIndicator = keyIndicators.some(indicator => sentenceLower.includes(indicator));
            
            if (hasKeyIndicator && sentence.trim().length > 10) {
                keyPoints.push(sentence.trim());
            }
        });

        // If no key indicators found, extract first few sentences as key points
        if (keyPoints.length === 0 && sentences.length > 0) {
            keyPoints.push(...sentences.slice(0, Math.min(3, sentences.length)).map(s => s.trim()));
        }

        return keyPoints.slice(0, 5); // Limit to 5 key points
    }

    // Analyze sentiment of the response
    analyzeSentiment(response) {
        if (!response) return 'neutral';

        const positiveWords = ['good', 'great', 'amazing', 'excellent', 'wonderful', 'fantastic', 'love', 'like', 'happy', 'satisfied', 'pleased'];
        const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'hate', 'disappointed', 'angry', 'frustrated', 'upset', 'unhappy'];

        const responseLower = response.toLowerCase();
        const positiveCount = positiveWords.filter(word => responseLower.includes(word)).length;
        const negativeCount = negativeWords.filter(word => responseLower.includes(word)).length;

        if (positiveCount > negativeCount) return 'positive';
        if (negativeCount > positiveCount) return 'negative';
        return 'neutral';
    }

    // Analyze complexity of the response
    analyzeComplexity(response) {
        if (!response) return 'moderate';

        const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const avgSentenceLength = sentences.reduce((sum, sentence) => 
            sum + sentence.split(' ').length, 0) / sentences.length;

        const complexWords = ['notwithstanding', 'aforementioned', 'subsequently', 'consequently', 'furthermore', 'moreover', 'therefore'];
        const complexWordCount = complexWords.filter(word => 
            response.toLowerCase().includes(word)
        ).length;

        if (avgSentenceLength > 20 || complexWordCount > 3) return 'high';
        if (avgSentenceLength < 10 && complexWordCount === 0) return 'low';
        return 'moderate';
    }

    // Find synonyms for better pattern matching
    findSynonyms(word) {
        const synonymMap = {
            'greeting': ['hello', 'hi', 'hey', 'welcome'],
            'main_content': ['content', 'information', 'details', 'explanation'],
            'engagement': ['interaction', 'participation', 'involvement'],
            'summary': ['overview', 'recap', 'summary', 'brief'],
            'key_points': ['main points', 'important points', 'key findings'],
            'insights': ['observations', 'findings', 'discoveries'],
            'recommendations': ['suggestions', 'advice', 'recommendations'],
            'acknowledgment': ['understand', 'recognize', 'acknowledge'],
            'understanding': ['comprehend', 'grasp', 'understand'],
            'solution': ['resolve', 'fix', 'address', 'solve'],
            'follow_up': ['next steps', 'follow up', 'continue']
        };

        return synonymMap[word] || [];
    }
}

// Platform-Specific Quality Analyzer
// Provides customized scoring systems for different social media platforms
class PlatformSpecificAnalyzer extends ResponseQualityAnalyzer {
    constructor() {
        super();
        
        // Platform-specific configurations
        this.platformConfigs = {
            instagram: {
                name: 'Instagram',
                characterLimit: 2200,
                optimalLength: { min: 50, max: 150 },
                hashtagLimit: { min: 5, max: 30 },
                emojiUsage: 'high',
                visualFocus: true,
                engagementMetrics: {
                    hashtags: 0.25,
                    emojis: 0.20,
                    questions: 0.20,
                    callToAction: 0.15,
                    personalStory: 0.20
                },
                tonePreferences: ['authentic', 'personal', 'inspirational', 'aspirational'],
                contentTypes: ['lifestyle', 'product', 'behind-the-scenes', 'user-generated'],
                hashtagCategories: ['brand', 'niche', 'trending', 'location', 'community'],
                visualKeywords: ['beautiful', 'stunning', 'amazing', 'perfect', 'gorgeous', 'incredible'],
                engagementPhrases: ['double tap', 'save this', 'share with friends', 'comment below', 'tag a friend']
            },
            
            facebook: {
                name: 'Facebook',
                characterLimit: 63206,
                optimalLength: { min: 100, max: 300 },
                hashtagLimit: { min: 0, max: 5 },
                emojiUsage: 'moderate',
                visualFocus: false,
                engagementMetrics: {
                    community: 0.30,
                    personalStory: 0.25,
                    questions: 0.20,
                    callToAction: 0.15,
                    hashtags: 0.10
                },
                tonePreferences: ['friendly', 'community-focused', 'informative', 'supportive'],
                contentTypes: ['community', 'news', 'personal', 'business', 'events'],
                hashtagCategories: ['community', 'local', 'business', 'events'],
                communityKeywords: ['community', 'together', 'friends', 'family', 'support', 'share'],
                engagementPhrases: ['share your thoughts', 'what do you think', 'join the conversation', 'tag someone who needs this']
            },
            
            twitter: {
                name: 'Twitter',
                characterLimit: 280,
                optimalLength: { min: 50, max: 250 },
                hashtagLimit: { min: 1, max: 3 },
                emojiUsage: 'moderate',
                visualFocus: false,
                engagementMetrics: {
                    hashtags: 0.30,
                    mentions: 0.25,
                    questions: 0.20,
                    trending: 0.15,
                    brevity: 0.10
                },
                tonePreferences: ['concise', 'informative', 'engaging', 'trending'],
                contentTypes: ['news', 'opinion', 'trending', 'conversation', 'announcement'],
                hashtagCategories: ['trending', 'niche', 'brand', 'conversation'],
                trendingKeywords: ['breaking', 'update', 'announcement', 'trending', 'viral'],
                engagementPhrases: ['retweet if you agree', 'quote tweet with your thoughts', 'follow for more', 'thread coming']
            },
            
            linkedin: {
                name: 'LinkedIn',
                characterLimit: 3000,
                optimalLength: { min: 200, max: 600 },
                hashtagLimit: { min: 3, max: 10 },
                emojiUsage: 'low',
                visualFocus: false,
                engagementMetrics: {
                    professionalInsight: 0.35,
                    industryRelevance: 0.25,
                    thoughtLeadership: 0.20,
                    networking: 0.15,
                    hashtags: 0.05
                },
                tonePreferences: ['professional', 'thoughtful', 'insightful', 'authoritative'],
                contentTypes: ['industry-insights', 'career-advice', 'business-updates', 'professional-development'],
                hashtagCategories: ['industry', 'professional', 'business', 'leadership'],
                professionalKeywords: ['industry', 'leadership', 'strategy', 'growth', 'innovation', 'expertise'],
                engagementPhrases: ['what are your thoughts', 'share your experience', 'connect with me', 'let\'s discuss']
            },
            
            tiktok: {
                name: 'TikTok',
                characterLimit: 150,
                optimalLength: { min: 20, max: 100 },
                hashtagLimit: { min: 3, max: 8 },
                emojiUsage: 'high',
                visualFocus: true,
                engagementMetrics: {
                    trending: 0.30,
                    hashtags: 0.25,
                    emojis: 0.20,
                    callToAction: 0.15,
                    brevity: 0.10
                },
                tonePreferences: ['fun', 'trendy', 'authentic', 'entertaining'],
                contentTypes: ['trending', 'entertainment', 'educational', 'challenge', 'duet'],
                hashtagCategories: ['trending', 'challenge', 'niche', 'fyp'],
                trendingKeywords: ['trending', 'viral', 'fyp', 'challenge', 'duet'],
                engagementPhrases: ['follow for more', 'duet this', 'save this', 'share with friends']
            },
            
            youtube: {
                name: 'YouTube',
                characterLimit: 5000,
                optimalLength: { min: 100, max: 500 },
                hashtagLimit: { min: 5, max: 15 },
                emojiUsage: 'moderate',
                visualFocus: true,
                engagementMetrics: {
                    videoDescription: 0.30,
                    callToAction: 0.25,
                    hashtags: 0.20,
                    timestamps: 0.15,
                    links: 0.10
                },
                tonePreferences: ['informative', 'entertaining', 'educational', 'engaging'],
                contentTypes: ['tutorial', 'review', 'entertainment', 'educational', 'vlog'],
                hashtagCategories: ['content-type', 'niche', 'trending', 'brand'],
                videoKeywords: ['subscribe', 'like', 'comment', 'share', 'bell', 'notification'],
                engagementPhrases: ['subscribe for more', 'hit the like button', 'comment below', 'share with friends']
            }
        };
    }

    // Analyze response quality for specific platform
    analyzePlatformQuality(response, platform, postType = 'general', context = {}) {
        const platformConfig = this.platformConfigs[platform.toLowerCase()];
        if (!platformConfig) {
            return this.analyzeResponseQuality(response, 'general', context);
        }

        const analysis = {
            platform: platformConfig.name,
            overallScore: 0,
            platformScore: 0,
            metrics: { ...this.qualityMetrics },
            platformMetrics: {},
            strengths: [],
            weaknesses: [],
            suggestions: [],
            platformSuggestions: [],
            patternAnalysis: {},
            structureAnalysis: {},
            keyPoints: [],
            sentiment: 'neutral',
            complexity: 'moderate',
            engagement: 'medium',
            platformOptimization: {}
        };

        // Standard quality analysis
        analysis.metrics.coherence = this.analyzeCoherence(response);
        analysis.metrics.relevance = this.analyzeRelevance(response, context);
        analysis.metrics.completeness = this.analyzeCompleteness(response, postType);
        analysis.metrics.clarity = this.analyzeClarity(response);
        analysis.metrics.engagement = this.analyzeEngagement(response);
        analysis.metrics.structure = this.analyzeStructure(response, postType);
        analysis.metrics.tone = this.analyzeTone(response, postType);
        analysis.metrics.length = this.analyzeLength(response, postType);

        // Platform-specific analysis
        analysis.platformMetrics = this.analyzePlatformMetrics(response, platformConfig);
        analysis.platformOptimization = this.analyzePlatformOptimization(response, platformConfig);
        
        // Calculate scores
        analysis.overallScore = this.calculateOverallScore(analysis.metrics);
        analysis.platformScore = this.calculatePlatformScore(analysis.platformMetrics, platformConfig);

        // Generate suggestions
        analysis.strengths = this.identifyStrengths(analysis.metrics);
        analysis.weaknesses = this.identifyWeaknesses(analysis.metrics);
        analysis.suggestions = this.generateSuggestions(analysis);
        analysis.platformSuggestions = this.generatePlatformSuggestions(analysis, platformConfig);

        // Additional analysis
        analysis.patternAnalysis = this.analyzeResponsePatterns(response, postType);
        analysis.structureAnalysis = this.analyzeResponseStructure(response, postType);
        analysis.keyPoints = this.extractKeyPoints(response);
        analysis.sentiment = this.analyzeSentiment(response);
        analysis.complexity = this.analyzeComplexity(response);

        return analysis;
    }

    // Analyze platform-specific metrics
    analyzePlatformMetrics(response, platformConfig) {
        const metrics = {};
        const responseLower = response.toLowerCase();
        const wordCount = response.split(/\s+/).length;
        const charCount = response.length;

        // Hashtag analysis
        const hashtags = (response.match(/#\w+/g) || []);
        metrics.hashtagCount = hashtags.length;
        metrics.hashtagScore = this.calculateHashtagScore(hashtags.length, platformConfig.hashtagLimit);
        metrics.hashtagRelevance = this.analyzeHashtagRelevance(hashtags, platformConfig.hashtagCategories);

        // Emoji analysis
        const emojis = (response.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu) || []);
        metrics.emojiCount = emojis.length;
        metrics.emojiScore = this.calculateEmojiScore(emojis.length, platformConfig.emojiUsage, wordCount);

        // Length analysis
        metrics.lengthScore = this.calculatePlatformLengthScore(charCount, wordCount, platformConfig);
        metrics.characterEfficiency = this.calculateCharacterEfficiency(response, platformConfig);

        // Engagement analysis
        metrics.engagementScore = this.calculatePlatformEngagementScore(response, platformConfig);
        metrics.callToActionScore = this.analyzeCallToAction(response, platformConfig.engagementPhrases);
        metrics.questionScore = this.analyzeQuestions(response);

        // Tone analysis
        metrics.toneScore = this.analyzePlatformTone(response, platformConfig.tonePreferences);
        metrics.keywordScore = this.analyzePlatformKeywords(response, platformConfig);

        // Visual focus analysis
        if (platformConfig.visualFocus) {
            metrics.visualKeywordsScore = this.analyzeVisualKeywords(response, platformConfig.visualKeywords);
        }

        return metrics;
    }

    // Calculate hashtag score
    calculateHashtagScore(count, limit) {
        const { min, max } = limit;
        if (count >= min && count <= max) return 1.0;
        if (count >= min * 0.8 && count <= max * 1.2) return 0.8;
        if (count >= min * 0.6 && count <= max * 1.4) return 0.6;
        return 0.3;
    }

    // Analyze hashtag relevance
    analyzeHashtagRelevance(hashtags, categories) {
        if (hashtags.length === 0) return 0;
        
        let relevantCount = 0;
        hashtags.forEach(hashtag => {
            const tag = hashtag.toLowerCase().replace('#', '');
            if (categories.some(category => tag.includes(category))) {
                relevantCount++;
            }
        });
        
        return relevantCount / hashtags.length;
    }

    // Calculate emoji score
    calculateEmojiScore(count, usage, wordCount) {
        const emojiRatio = count / wordCount;
        
        switch (usage) {
            case 'high':
                return emojiRatio >= 0.1 && emojiRatio <= 0.3 ? 1.0 : 
                       emojiRatio >= 0.05 && emojiRatio <= 0.4 ? 0.7 : 0.4;
            case 'moderate':
                return emojiRatio >= 0.05 && emojiRatio <= 0.15 ? 1.0 :
                       emojiRatio >= 0.02 && emojiRatio <= 0.25 ? 0.7 : 0.4;
            case 'low':
                return emojiRatio <= 0.05 ? 1.0 :
                       emojiRatio <= 0.1 ? 0.7 : 0.3;
            default:
                return 0.5;
        }
    }

    // Calculate platform length score
    calculatePlatformLengthScore(charCount, wordCount, platformConfig) {
        const { optimalLength, characterLimit } = platformConfig;
        const { min, max } = optimalLength;
        
        // Check character limit
        if (charCount > characterLimit) return 0.1;
        
        // Check optimal word count
        if (wordCount >= min && wordCount <= max) return 1.0;
        if (wordCount >= min * 0.8 && wordCount <= max * 1.2) return 0.8;
        if (wordCount >= min * 0.6 && wordCount <= max * 1.4) return 0.6;
        return 0.3;
    }

    // Calculate character efficiency
    calculateCharacterEfficiency(response, platformConfig) {
        const charCount = response.length;
        const wordCount = response.split(/\s+/).length;
        const avgWordLength = charCount / wordCount;
        
        // Optimal word length varies by platform
        const optimalWordLength = platformConfig.name === 'Twitter' ? 4.5 : 5.5;
        const deviation = Math.abs(avgWordLength - optimalWordLength);
        
        return Math.max(0, 1 - (deviation / optimalWordLength));
    }

    // Calculate platform engagement score
    calculatePlatformEngagementScore(response, platformConfig) {
        const responseLower = response.toLowerCase();
        let score = 0;
        
        // Check for platform-specific engagement phrases
        platformConfig.engagementPhrases.forEach(phrase => {
            if (responseLower.includes(phrase.toLowerCase())) {
                score += 0.2;
            }
        });
        
        // Check for questions
        const questionCount = (response.match(/\?/g) || []).length;
        score += Math.min(questionCount * 0.15, 0.3);
        
        // Check for personal pronouns
        const pronounCount = (responseLower.match(/\b(you|your|we|our|us)\b/g) || []).length;
        score += Math.min(pronounCount * 0.1, 0.2);
        
        return Math.min(score, 1.0);
    }

    // Analyze call to action
    analyzeCallToAction(response, engagementPhrases) {
        const responseLower = response.toLowerCase();
        const foundPhrases = engagementPhrases.filter(phrase => 
            responseLower.includes(phrase.toLowerCase())
        );
        
        return foundPhrases.length > 0 ? 1.0 : 0.0;
    }

    // Analyze questions
    analyzeQuestions(response) {
        const questionCount = (response.match(/\?/g) || []).length;
        return questionCount > 0 ? Math.min(questionCount * 0.3, 1.0) : 0.0;
    }

    // Analyze platform tone
    analyzePlatformTone(response, preferredTones) {
        const responseLower = response.toLowerCase();
        let score = 0;
        
        const toneIndicators = {
            'professional': ['professional', 'industry', 'business', 'strategy', 'leadership'],
            'friendly': ['hello', 'hi', 'thanks', 'appreciate', 'welcome'],
            'authentic': ['real', 'honest', 'genuine', 'authentic', 'truth'],
            'inspirational': ['inspire', 'motivate', 'dream', 'achieve', 'success'],
            'informative': ['learn', 'discover', 'explore', 'understand', 'knowledge'],
            'entertaining': ['fun', 'amazing', 'incredible', 'awesome', 'exciting'],
            'trendy': ['trending', 'viral', 'hot', 'popular', 'latest'],
            'concise': ['brief', 'quick', 'simple', 'direct', 'clear']
        };
        
        preferredTones.forEach(tone => {
            const indicators = toneIndicators[tone] || [];
            const matches = indicators.filter(indicator => 
                responseLower.includes(indicator)
            );
            score += (matches.length / indicators.length) * 0.25;
        });
        
        return Math.min(score, 1.0);
    }

    // Analyze platform keywords
    analyzePlatformKeywords(response, platformConfig) {
        const responseLower = response.toLowerCase();
        let score = 0;
        
        // Check for platform-specific keywords
        if (platformConfig.professionalKeywords) {
            const keywordMatches = platformConfig.professionalKeywords.filter(keyword =>
                responseLower.includes(keyword)
            );
            score += (keywordMatches.length / platformConfig.professionalKeywords.length) * 0.5;
        }
        
        if (platformConfig.communityKeywords) {
            const communityMatches = platformConfig.communityKeywords.filter(keyword =>
                responseLower.includes(keyword)
            );
            score += (communityMatches.length / platformConfig.communityKeywords.length) * 0.5;
        }
        
        if (platformConfig.trendingKeywords) {
            const trendingMatches = platformConfig.trendingKeywords.filter(keyword =>
                responseLower.includes(keyword)
            );
            score += (trendingMatches.length / platformConfig.trendingKeywords.length) * 0.5;
        }
        
        return Math.min(score, 1.0);
    }

    // Analyze visual keywords
    analyzeVisualKeywords(response, visualKeywords) {
        const responseLower = response.toLowerCase();
        const matches = visualKeywords.filter(keyword =>
            responseLower.includes(keyword)
        );
        
        return matches.length > 0 ? Math.min(matches.length * 0.2, 1.0) : 0.0;
    }

    // Calculate platform score
    calculatePlatformScore(platformMetrics, platformConfig) {
        const weights = platformConfig.engagementMetrics;
        let totalScore = 0;
        let totalWeight = 0;
        
        Object.keys(weights).forEach(metric => {
            const weight = weights[metric];
            const score = platformMetrics[metric + 'Score'] || 0;
            totalScore += score * weight;
            totalWeight += weight;
        });
        
        return totalWeight > 0 ? (totalScore / totalWeight) * 100 : 0;
    }

    // Analyze platform optimization
    analyzePlatformOptimization(response, platformConfig) {
        const optimization = {
            hashtagOptimization: {},
            emojiOptimization: {},
            lengthOptimization: {},
            engagementOptimization: {},
            toneOptimization: {}
        };
        
        // Hashtag optimization
        const hashtags = (response.match(/#\w+/g) || []);
        optimization.hashtagOptimization = {
            current: hashtags.length,
            recommended: platformConfig.hashtagLimit,
            status: hashtags.length >= platformConfig.hashtagLimit.min && 
                   hashtags.length <= platformConfig.hashtagLimit.max ? 'optimal' : 'needs-improvement'
        };
        
        // Emoji optimization
        const emojis = (response.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu) || []);
        optimization.emojiOptimization = {
            current: emojis.length,
            recommended: platformConfig.emojiUsage,
            status: this.getEmojiStatus(emojis.length, platformConfig.emojiUsage)
        };
        
        // Length optimization
        const wordCount = response.split(/\s+/).length;
        optimization.lengthOptimization = {
            current: wordCount,
            recommended: platformConfig.optimalLength,
            status: wordCount >= platformConfig.optimalLength.min && 
                   wordCount <= platformConfig.optimalLength.max ? 'optimal' : 'needs-improvement'
        };
        
        return optimization;
    }

    // Get emoji status
    getEmojiStatus(count, usage) {
        switch (usage) {
            case 'high':
                return count >= 3 ? 'optimal' : 'needs-improvement';
            case 'moderate':
                return count >= 1 && count <= 5 ? 'optimal' : 'needs-improvement';
            case 'low':
                return count <= 2 ? 'optimal' : 'needs-improvement';
            default:
                return 'needs-improvement';
        }
    }

    // Generate platform-specific suggestions
    generatePlatformSuggestions(analysis, platformConfig) {
        const suggestions = [];
        
        // Hashtag suggestions
        if (analysis.platformOptimization.hashtagOptimization.status === 'needs-improvement') {
            const { current, recommended } = analysis.platformOptimization.hashtagOptimization;
            if (current < recommended.min) {
                suggestions.push(`Add ${recommended.min - current} more hashtags for better discoverability`);
            } else if (current > recommended.max) {
                suggestions.push(`Reduce hashtags to ${recommended.max} for better readability`);
            }
        }
        
        // Emoji suggestions
        if (analysis.platformOptimization.emojiOptimization.status === 'needs-improvement') {
            const { recommended } = analysis.platformOptimization.emojiOptimization;
            if (recommended === 'high') {
                suggestions.push('Add more emojis to make your content more engaging and visual');
            } else if (recommended === 'low') {
                suggestions.push('Reduce emoji usage for a more professional tone');
            }
        }
        
        // Length suggestions
        if (analysis.platformOptimization.lengthOptimization.status === 'needs-improvement') {
            const { current, recommended } = analysis.platformOptimization.lengthOptimization;
            if (current < recommended.min) {
                suggestions.push(`Expand your content to at least ${recommended.min} words for better engagement`);
            } else if (current > recommended.max) {
                suggestions.push(`Keep your content under ${recommended.max} words for better readability`);
            }
        }
        
        // Platform-specific suggestions
        switch (platformConfig.name.toLowerCase()) {
            case 'instagram':
                suggestions.push('Use relevant hashtags in your niche for better discoverability');
                suggestions.push('Include a clear call-to-action to encourage engagement');
                suggestions.push('Share personal stories to build authentic connections');
                break;
            case 'facebook':
                suggestions.push('Focus on community-building and personal connections');
                suggestions.push('Ask questions to encourage comments and discussions');
                suggestions.push('Share valuable information that helps your audience');
                break;
            case 'twitter':
                suggestions.push('Use trending hashtags to join relevant conversations');
                suggestions.push('Keep your message concise and impactful');
                suggestions.push('Include mentions to engage with others in your industry');
                break;
            case 'linkedin':
                suggestions.push('Share professional insights and industry knowledge');
                suggestions.push('Use industry-specific hashtags for better visibility');
                suggestions.push('Focus on thought leadership and professional development');
                break;
            case 'tiktok':
                suggestions.push('Use trending sounds and hashtags');
                suggestions.push('Keep your caption short and engaging');
                suggestions.push('Include a clear call-to-action for engagement');
                break;
            case 'youtube':
                suggestions.push('Include timestamps for longer videos');
                suggestions.push('Add relevant links in your description');
                suggestions.push('Use keywords that match your video content');
                break;
        }
        
        return suggestions.slice(0, 5); // Limit to 5 suggestions
    }

    // Get platform recommendations
    getPlatformRecommendations(platform) {
        const platformConfig = this.platformConfigs[platform.toLowerCase()];
        if (!platformConfig) return null;
        
        return {
            platform: platformConfig.name,
            characterLimit: platformConfig.characterLimit,
            optimalLength: platformConfig.optimalLength,
            hashtagLimit: platformConfig.hashtagLimit,
            emojiUsage: platformConfig.emojiUsage,
            tonePreferences: platformConfig.tonePreferences,
            contentTypes: platformConfig.contentTypes,
            engagementPhrases: platformConfig.engagementPhrases,
            bestPractices: this.getPlatformBestPractices(platformConfig)
        };
    }

    // Get platform best practices
    getPlatformBestPractices(platformConfig) {
        const practices = {
            instagram: [
                'Use high-quality visuals with your posts',
                'Post consistently at optimal times',
                'Engage with your audience through comments',
                'Use Instagram Stories for behind-the-scenes content',
                'Collaborate with influencers in your niche'
            ],
            facebook: [
                'Focus on community engagement',
                'Share valuable, informative content',
                'Use Facebook Live for real-time engagement',
                'Create Facebook Groups for deeper community building',
                'Respond to comments and messages promptly'
            ],
            twitter: [
                'Join trending conversations with relevant hashtags',
                'Retweet and engage with industry leaders',
                'Use Twitter threads for longer content',
                'Monitor and respond to mentions',
                'Post consistently throughout the day'
            ],
            linkedin: [
                'Share professional insights and industry knowledge',
                'Publish LinkedIn articles for thought leadership',
                'Engage with industry professionals',
                'Use LinkedIn polls for audience insights',
                'Share company updates and achievements'
            ],
            tiktok: [
                'Use trending sounds and hashtags',
                'Create authentic, entertaining content',
                'Post consistently to build momentum',
                'Engage with comments and duets',
                'Follow current trends and challenges'
            ],
            youtube: [
                'Optimize video titles and descriptions with keywords',
                'Create engaging thumbnails',
                'Use end screens and cards for engagement',
                'Respond to comments to build community',
                'Collaborate with other creators'
            ]
        };
        
        return practices[platformConfig.name.toLowerCase()] || [];
    }
}

module.exports = { ResponseQualityAnalyzer, PlatformSpecificAnalyzer };
