import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const blogPosts = {
  overview: {
    title: 'AI-Powered Review Generation: The Complete Guide',
    date: 'July 2024',
    category: 'Overview',
    image: '🤖',
    color: '#667eea',
    content: (
      <>
        <p>
          Welcome to the complete guide on AI-powered review generation! Discover how our platform leverages advanced AI models to help you create authentic, engaging, and professional reviews for restaurants, hotels, products, and more. With features like voice input, sentiment analysis, and location integration, ReviewGen makes it easy to share your experiences and insights.
        </p>
        <h3>Key Features</h3>
        <ul>
          <li>✨ <b>AI Review Generator</b>: Instantly create high-quality reviews with the help of Meta Llama 3.1 70B</li>
          <li>🎤 <b>Voice Input</b>: Speak your thoughts and let AI transcribe and analyze your experience</li>
          <li>📍 <b>Location Attachment</b>: Add context to your reviews with smart location suggestions</li>
          <li>💬 <b>Customer Service Agent</b>: Turn negative reviews into positive conversations with chatty, empathetic AI responses</li>
          <li>🤖 <b>Multi-Model Support</b>: Specialized LLMs for reviews, customer service, and analysis</li>
        </ul>
        <h3>Why Use ReviewGen?</h3>
        <ul>
          <li>Save time and effort writing reviews</li>
          <li>Get professional, engaging content every time</li>
          <li>Transform customer feedback into actionable insights</li>
          <li>Stand out with authentic, human-like writing</li>
        </ul>
        <h3>Get Started</h3>
        <p>
          Try the <Link to="/generate">AI Review Generator</Link> or <Link to="/voice">Voice Review</Link> now!
        </p>
      </>
    )
  },
  'restaurant-reviews': {
    title: 'Transform Your Restaurant Reviews with AI',
    date: 'July 2024',
    category: 'Restaurant',
    image: '🍽️',
    color: '#ff6b6b',
    content: (
      <>
        <p>
          Writing restaurant reviews has never been easier! Our AI understands the nuances of dining experiences, from food quality to service and atmosphere. Just share your thoughts, and ReviewGen will craft a review that captures the essence of your meal.
        </p>
        <h3>How It Works</h3>
        <ol>
          <li>Choose "Restaurant" as your review type</li>
          <li>Describe your experience (pros, cons, details)</li>
          <li>Let AI generate a review with natural flow and authentic voice</li>
        </ol>
        <h3>Pro Tips</h3>
        <ul>
          <li>Mention specific dishes or drinks</li>
          <li>Describe the ambiance and service</li>
          <li>Attach your location for extra context</li>
        </ul>
        <p>
          <b>Ready to try?</b> <Link to="/generate">Generate a restaurant review now!</Link>
        </p>
      </>
    )
  },
  'hotel-reviews': {
    title: "AI Hotel Review Generation: A Traveler's Best Friend",
    date: 'July 2024',
    category: 'Hotel',
    image: '🏨',
    color: '#20c997',
    content: (
      <>
        <p>
          Whether you're a frequent traveler or a first-time guest, ReviewGen helps you write detailed hotel reviews that inform and inspire. Highlight amenities, comfort, cleanliness, and service with ease.
        </p>
        <h3>What to Include</h3>
        <ul>
          <li>Room quality and comfort</li>
          <li>Staff friendliness and service</li>
          <li>Location and nearby attractions</li>
          <li>Value for money</li>
        </ul>
        <p>
          <b>Share your stay:</b> <Link to="/generate">Write a hotel review with AI</Link>
        </p>
      </>
    )
  },
  'product-reviews': {
    title: 'Smart Product Review Creation with AI',
    date: 'July 2024',
    category: 'Product',
    image: '📱',
    color: '#f7b731',
    content: (
      <>
        <p>
          Generate comprehensive product reviews that highlight features, benefits, and real-world usage. Whether it's tech, gadgets, or everyday items, ReviewGen makes your feedback shine.
        </p>
        <h3>Tips for Great Product Reviews</h3>
        <ul>
          <li>Describe what you liked and what could be improved</li>
          <li>Mention specific features or specs</li>
          <li>Share your overall verdict and recommendation</li>
        </ul>
        <p>
          <b>Try it out:</b> <Link to="/generate">Create a product review</Link>
        </p>
      </>
    )
  },
  'customer-service-ai': {
    title: 'AI Customer Service Responses: Building Better Relationships',
    date: 'July 2024',
    category: 'Customer Service',
    image: '💬',
    color: '#4b7bec',
    content: (
      <>
        <p>
          Turn negative reviews into positive customer experiences with our chatty, empathetic AI customer service agent. Respond to feedback in a way that feels personal, warm, and genuinely helpful.
        </p>
        <h3>How It Works</h3>
        <ol>
          <li>Paste a negative review into the Chatty Agent</li>
          <li>AI generates a friendly, conversational response</li>
          <li>Copy and use the response to engage your customer</li>
        </ol>
        <h3>Benefits</h3>
        <ul>
          <li>Defuse negative situations with empathy</li>
          <li>Build trust and loyalty with customers</li>
          <li>Save time with ready-to-use, human-like replies</li>
        </ul>
        <p>
          <b>Try the Chatty Agent:</b> <Link to="/customer-service-response">Go to Chatty Agent</Link>
        </p>
      </>
    )
  },
  'your-custom-post': {
    title: 'Your Custom Blog Post Title',
    date: 'July 2024',
    category: 'Custom',
    image: '📝',
    color: '#a55eea',
    content: (
      <>
        <p>
          This is where your custom blog post content will go. Please share your suggested content and I'll replace this placeholder with your actual content.
        </p>
        <h3>Your Content Here</h3>
        <p>
          Replace this section with your suggested content. You can include:
        </p>
        <ul>
          <li>Your main points and ideas</li>
          <li>Examples and case studies</li>
          <li>Tips and best practices</li>
          <li>Any other relevant information</li>
        </ul>
        <p>
          <b>Ready to customize:</b> Just share your content and I'll update this post!
        </p>
      </>
    )
  }
};

const BlogPost = () => {
  const { slug } = useParams();
  const [generatedPost, setGeneratedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');

  useEffect(() => {
    loadGeneratedPost();
  }, [slug]);

  const loadGeneratedPost = () => {
    try {
      setLoading(true);
      
      // Check if this is a generated post (starts with 'generated-')
      if (slug && slug.startsWith('generated-')) {
        const postId = slug.replace('generated-', '');
        const blogHistory = JSON.parse(localStorage.getItem('blogHistory') || '[]');
        const foundPost = blogHistory.find(post => post.id.toString() === postId);
        
        if (foundPost) {
          setGeneratedPost(foundPost);
          setEditedContent(foundPost.blogPost || '');
        }
      }
    } catch (error) {
      console.error('Error loading generated post:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to toggle edit mode
  const toggleEditMode = () => {
    if (isEditMode) {
      // Exiting edit mode, reset to original content
      setEditedContent(generatedPost?.blogPost || '');
    }
    setIsEditMode(!isEditMode);
  };

  // Function to save edited content
  const saveEditedContent = async () => {
    if (!generatedPost) return;
    
    try {
      setIsSaving(true);
      
      // Update the post in localStorage
      const blogHistory = JSON.parse(localStorage.getItem('blogHistory') || '[]');
      const updatedHistory = blogHistory.map(post => {
        if (post.id.toString() === generatedPost.id.toString()) {
          return {
            ...post,
            blogPost: editedContent,
            lastEdited: new Date().toISOString()
          };
        }
        return post;
      });
      
      localStorage.setItem('blogHistory', JSON.stringify(updatedHistory));
      
      // Update the current post state
      setGeneratedPost({
        ...generatedPost,
        blogPost: editedContent,
        lastEdited: new Date().toISOString()
      });
      
      setIsEditMode(false);
    } catch (error) {
      console.error('Error saving edited content:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Function to discard changes
  const discardChanges = () => {
    setEditedContent(generatedPost?.blogPost || '');
    setIsEditMode(false);
    setShowPreview(false);
  };

  // Function to toggle preview
  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  // Function to copy full blog content
  const copyFullContent = async () => {
    if (!generatedPost) return;
    
    try {
      // Get the current content (edited or original)
      const contentToCopy = isEditMode ? editedContent : generatedPost.blogPost;
      
      // Clean the content for copying (remove markdown artifacts but keep structure)
      const cleanContentForCopy = contentToCopy
        // Remove image placement suggestions
        .replace(/\[Image \d+: [^\]]+\]/g, '')
        .replace(/\[Place image here[^\]]*\]/g, '')
        .replace(/\[Insert image[^\]]*\]/g, '')
        .replace(/\[Add image[^\]]*\]/g, '')
        .replace(/\[Image placement[^\]]*\]/g, '')
        .replace(/\[Caption: [^\]]+\]/g, '')
        .replace(/\[Suggested caption[^\]]*\]/g, '')
        // Remove technical image instructions
        .replace(/Note: Images are embedded[^.]*\./g, '')
        .replace(/Images are embedded[^.]*\./g, '')
        .replace(/Image integration[^.]*\./g, '')
        .replace(/Image placement[^.]*\./g, '')
        // Remove markdown code blocks
        .replace(/```[\s\S]*?```/g, '')
        // Remove inline code blocks
        .replace(/`([^`]+)`/g, '$1')
        // Remove markdown links but keep text
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        // Remove markdown images but keep alt text
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
        // Remove markdown emphasis but keep text
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/__([^_]+)__/g, '$1')
        .replace(/_([^_]+)_/g, '$1')
        // Remove markdown strikethrough
        .replace(/~~([^~]+)~~/g, '$1')
        // Remove markdown blockquotes
        .replace(/^>\s*/gm, '')
        // Remove markdown horizontal rules
        .replace(/^[-*_]{3,}$/gm, '')
        // Remove markdown table syntax
        .replace(/^\|.*\|$/gm, '')
        // Convert markdown headings to plain text
        .replace(/^#\s*(.+)$/gm, '$1')
        .replace(/^##\s*(.+)$/gm, '$1')
        .replace(/^###\s*(.+)$/gm, '$1')
        .replace(/^####\s*(.+)$/gm, '$1')
        // Convert bullet points to plain text
        .replace(/^[-*•]\s*/gm, '• ')
        // Convert numbered lists to plain text
        .replace(/^\d+\.\s*/gm, (match) => {
          const num = match.match(/\d+/)[0];
          return `${num}. `;
        })
        // Clean up excessive spacing
        .replace(/\n{3,}/g, '\n\n')
        .replace(/ {2,}/g, ' ')
        .trim();
      
      // Create a formatted version with title and metadata
      const formattedContent = `${generatedPost.topic}

${cleanContentForCopy}

---
Generated by ReviewGen AI
Restaurant: ${generatedPost.restaurantName || 'N/A'}
Cuisine: ${generatedPost.cuisine || 'N/A'}
Location: ${generatedPost.location || 'N/A'}
Target Audience: ${generatedPost.targetAudience || 'N/A'}
Writing Tone: ${generatedPost.tone || 'N/A'}
Blog Length: ${generatedPost.length || 'N/A'}
Generated on: ${new Date(generatedPost.timestamp).toLocaleString()}`;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(formattedContent);
      
      // Show success feedback
      setCopyStatus('✅ Content copied to clipboard!');
      
      // Clear the status after 3 seconds
      setTimeout(() => {
        setCopyStatus('');
      }, 3000);
      
    } catch (error) {
      console.error('Error copying content:', error);
      setCopyStatus('❌ Failed to copy content');
      
      // Clear the error status after 3 seconds
      setTimeout(() => {
        setCopyStatus('');
      }, 3000);
    }
  };

  // Function to clean and format blog content
  const cleanAndFormatBlogContent = (content) => {
    if (!content) return '';
    
    let cleanedContent = content;
    
    // Remove image placement suggestions and technical instructions
    cleanedContent = cleanedContent
      // Remove image placement suggestions
      .replace(/\[Image \d+: [^\]]+\]/g, '')
      .replace(/\[Place image here[^\]]*\]/g, '')
      .replace(/\[Insert image[^\]]*\]/g, '')
      .replace(/\[Add image[^\]]*\]/g, '')
      .replace(/\[Image placement[^\]]*\]/g, '')
      .replace(/\[Caption: [^\]]+\]/g, '')
      .replace(/\[Suggested caption[^\]]*\]/g, '')
      // Remove technical image instructions
      .replace(/Note: Images are embedded[^.]*\./g, '')
      .replace(/Images are embedded[^.]*\./g, '')
      .replace(/Image integration[^.]*\./g, '')
      .replace(/Image placement[^.]*\./g, '')
      // Remove markdown code blocks
      .replace(/```[\s\S]*?```/g, '')
      // Remove inline code blocks
      .replace(/`([^`]+)`/g, '$1')
      // Remove markdown links but keep text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // Remove markdown images but keep alt text
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
      // Remove markdown emphasis but keep text
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      // Remove markdown strikethrough
      .replace(/~~([^~]+)~~/g, '$1')
      // Remove markdown blockquotes
      .replace(/^>\s*/gm, '')
      // Remove markdown horizontal rules
      .replace(/^[-*_]{3,}$/gm, '')
      // Remove markdown table syntax
      .replace(/^\|.*\|$/gm, '')
      // Remove markdown list markers but keep content
      .replace(/^[-*+]\s+/gm, '• ')
      .replace(/^\d+\.\s+/gm, (match) => {
        const num = match.match(/\d+/)[0];
        return `${num}. `;
      });
    
    // Keep strategic emojis but remove excessive ones
    // Note: All emojis are now preserved - no emoji cleaning applied
    
    // Clean up excessive punctuation
    cleanedContent = cleanedContent
      .replace(/\.{3,}/g, '...')
      .replace(/!{2,}/g, '!')
      .replace(/\?{2,}/g, '?')
      .replace(/_{2,}/g, '_')
      .replace(/\*{3,}/g, '**');
    
    // Clean up excessive spacing
    cleanedContent = cleanedContent
      .replace(/\n{3,}/g, '\n\n')
      .replace(/ {2,}/g, ' ')
      .replace(/\t/g, ' ');
    
    // Enhanced heading hierarchy formatting
    cleanedContent = cleanedContent
      // Fix H1 headings (main title)
      .replace(/^#\s*(.+)$/gm, '# $1')
      // Fix H2 headings (major sections)
      .replace(/^##\s*(.+)$/gm, '## $1')
      // Fix H3 headings (subsections)
      .replace(/^###\s*(.+)$/gm, '### $1')
      // Fix H4 headings (detailed points)
      .replace(/^####\s*(.+)$/gm, '#### $1')
      // Convert ALL CAPS lines to H2 headings (if they look like headings)
      .replace(/^([A-Z][A-Z\s]+)$/gm, (match) => {
        const trimmed = match.trim();
        if (trimmed.length > 3 && trimmed.length < 60 && !trimmed.includes('.')) {
          return `## ${trimmed}`;
        }
        return match;
      })
      // Convert Title Case lines to H3 headings (if they look like headings)
      .replace(/^([A-Z][a-z\s]+)$/gm, (match) => {
        const trimmed = match.trim();
        if (trimmed.length > 3 && trimmed.length < 50 && !trimmed.includes('.') && !trimmed.includes('!') && !trimmed.includes('?')) {
          return `### ${trimmed}`;
        }
        return match;
      });
    
    // Clean up bullet points and lists
    cleanedContent = cleanedContent
      .replace(/^[-*•]\s*/gm, '• ')
      .replace(/^[0-9]+\.\s*/gm, (match) => {
        return match.replace(/^[0-9]+\.\s*/, (num) => `${num.split('.')[0]}. `);
      });
    
    // Ensure proper spacing around headings
    cleanedContent = cleanedContent
      .replace(/([^\n])\n(#+\s)/g, '$1\n\n$2')
      .replace(/(#+\s[^\n]+)\n([^\n])/g, '$1\n\n$2');
    
    // Remove any remaining markdown artifacts
    cleanedContent = cleanedContent
      // Remove any remaining markdown syntax
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      .replace(/~~([^~]+)~~/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      // Remove any remaining markdown list markers
      .replace(/^[-*+]\s+/gm, '• ')
      // Remove any remaining markdown blockquotes
      .replace(/^>\s*/gm, '')
      // Remove any remaining markdown horizontal rules
      .replace(/^[-*_]{3,}$/gm, '')
      // Remove any remaining markdown table syntax
      .replace(/^\|.*\|$/gm, '');
    
    return cleanedContent.trim();
  };

  // Function to render blog content with embedded images
  const renderBlogWithImages = (blogContent, images = []) => {
    // Clean and format the blog content
    const cleanedContent = cleanAndFormatBlogContent(blogContent);
    
    if (!cleanedContent || !images.length) {
      return (
        <div style={{
          color: '#2d3748',
          fontSize: '16px',
          lineHeight: '1.7',
          whiteSpace: 'pre-wrap'
        }}>
          {renderHierarchicalContent(cleanedContent)}
        </div>
      );
    }

    // Split the blog content into paragraphs
    const paragraphs = cleanedContent.split('\n\n').filter(p => p.trim());
    
    // Create image placement strategy
    const imagePlacement = [];
    if (images.length === 1) {
      imagePlacement.push(0); // After first paragraph
    } else if (images.length === 2) {
      imagePlacement.push(0, Math.floor(paragraphs.length / 2));
    } else if (images.length === 3) {
      imagePlacement.push(0, Math.floor(paragraphs.length / 3), Math.floor(paragraphs.length * 2 / 3));
    } else {
      // For more images, distribute them evenly
      for (let i = 0; i < images.length; i++) {
        imagePlacement.push(Math.floor((paragraphs.length * i) / images.length));
      }
    }

    return (
      <div style={{ color: '#2d3748', fontSize: '16px', lineHeight: '1.7' }}>
        {paragraphs.map((paragraph, index) => (
          <div key={index}>
            <div style={{ marginBottom: '20px' }}>
              {renderHierarchicalContent(paragraph)}
            </div>
            
            {/* Insert images at strategic points */}
            {imagePlacement.includes(index) && (
              <div style={{
                margin: '24px 0',
                textAlign: 'center'
              }}>
                {images.slice(0, imagePlacement.filter(p => p <= index).length).map((image, imgIndex) => {
                  if (imagePlacement.indexOf(index) === imgIndex) {
                    return (
                      <div key={image.id} style={{
                        marginBottom: '16px',
                        background: '#f8f9fa',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid #e9ecef'
                      }}>
                        <img
                          src={image.dataUrl}
                          alt={image.name}
                          style={{
                            maxWidth: '100%',
                            height: 'auto',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            marginBottom: '12px'
                          }}
                        />
                        <div style={{
                          fontSize: '14px',
                          color: '#6c757d',
                          fontStyle: 'italic',
                          textAlign: 'center',
                          marginTop: '0',
                          marginBottom: '8px'
                        }}>
                          {image.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ')}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            )}
          </div>
        ))}
        
        {/* Display remaining images at the end if any */}
        {imagePlacement.length < images.length && (
          <div style={{
            marginTop: '32px',
            padding: '24px',
            background: '#f8f9fa',
            borderRadius: '12px',
            border: '1px solid #e9ecef'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px'
            }}>
              {images.slice(imagePlacement.length).map((image) => (
                <div key={image.id} style={{
                  textAlign: 'center'
                }}>
                  <img
                    src={image.dataUrl}
                    alt={image.name}
                    style={{
                      width: '100%',
                      height: '150px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      marginBottom: '8px'
                    }}
                  />
                  <div style={{
                    fontSize: '12px',
                    color: '#6c757d',
                    textAlign: 'center',
                    marginTop: '0'
                  }}>
                    {image.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Function to render hierarchical content with proper styling
  const renderHierarchicalContent = (content) => {
    if (!content) return null;

    const lines = content.split('\n');
    
    return lines.map((line, index) => {
      const trimmedLine = line.trim();
      
      // H1 - Main title (usually not used in blog content, but handle it)
      if (trimmedLine.startsWith('# ') && !trimmedLine.startsWith('##')) {
        return (
          <h1 key={index} style={{
            fontSize: '28px',
            fontWeight: '800',
            color: '#1a202c',
            margin: '32px 0 24px 0',
            lineHeight: '1.3',
            borderBottom: '3px solid #667eea',
            paddingBottom: '12px'
          }}>
            {trimmedLine.substring(2)}
          </h1>
        );
      }
      
      // H2 - Major sections
      if (trimmedLine.startsWith('## ')) {
        return (
          <h2 key={index} style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#2d3748',
            margin: '28px 0 20px 0',
            lineHeight: '1.4',
            borderLeft: '4px solid #667eea',
            paddingLeft: '16px'
          }}>
            {trimmedLine.substring(3)}
          </h2>
        );
      }
      
      // H3 - Subsections
      if (trimmedLine.startsWith('### ')) {
        return (
          <h3 key={index} style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#4a5568',
            margin: '24px 0 16px 0',
            lineHeight: '1.4'
          }}>
            {trimmedLine.substring(4)}
          </h3>
        );
      }
      
      // H4 - Detailed points
      if (trimmedLine.startsWith('#### ')) {
        return (
          <h4 key={index} style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#718096',
            margin: '20px 0 12px 0',
            lineHeight: '1.4',
            fontStyle: 'italic'
          }}>
            {trimmedLine.substring(5)}
          </h4>
        );
      }
      
      // Bullet points
      if (trimmedLine.startsWith('• ')) {
        return (
          <div key={index} style={{
            margin: '8px 0',
            paddingLeft: '20px',
            position: 'relative'
          }}>
            <span style={{
              position: 'absolute',
              left: '0',
              color: '#667eea',
              fontWeight: 'bold'
            }}>•</span>
            <span style={{ marginLeft: '8px' }}>
              {trimmedLine.substring(2)}
            </span>
          </div>
        );
      }
      
      // Numbered lists
      if (/^\d+\.\s/.test(trimmedLine)) {
        return (
          <div key={index} style={{
            margin: '8px 0',
            paddingLeft: '20px',
            position: 'relative'
          }}>
            <span style={{
              position: 'absolute',
              left: '0',
              color: '#667eea',
              fontWeight: '600'
            }}>
              {trimmedLine.match(/^\d+/)[0]}.
            </span>
            <span style={{ marginLeft: '8px' }}>
              {trimmedLine.replace(/^\d+\.\s/, '')}
            </span>
          </div>
        );
      }
      
      // Bold text and key points highlighting
      if (trimmedLine.includes('**')) {
        const parts = trimmedLine.split('**');
        return (
          <p key={index} style={{
            margin: '12px 0',
            lineHeight: '1.7'
          }}>
            {parts.map((part, partIndex) => (
              partIndex % 2 === 1 ? (
                <strong key={partIndex} style={{ 
                  color: '#1a202c', 
                  fontWeight: '700',
                  backgroundColor: '#fef3c7',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  {part}
                </strong>
              ) : (
                <span key={partIndex}>{part}</span>
              )
            ))}
          </p>
        );
      }
      
      // Highlight important sentences and key points
      if (trimmedLine.includes('✨') || trimmedLine.includes('💡') || trimmedLine.includes('🎯') || 
          trimmedLine.includes('⭐') || trimmedLine.includes('🔥') || trimmedLine.includes('💎')) {
        return (
          <div key={index} style={{
            margin: '16px 0',
            padding: '16px',
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            borderRadius: '12px',
            border: '2px solid #f59e0b',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)'
          }}>
            <p style={{
              margin: '0',
              lineHeight: '1.7',
              color: '#92400e',
              fontWeight: '600',
              fontSize: '16px'
            }}>
              {trimmedLine}
            </p>
          </div>
        );
      }
      
      // Regular paragraphs
      if (trimmedLine) {
        return (
          <p key={index} style={{
            margin: '12px 0',
            lineHeight: '1.7'
          }}>
            {trimmedLine}
          </p>
        );
      }
      
      // Empty lines
      return <div key={index} style={{ height: '8px' }} />;
    });
  };

  // Check for predefined post first
  const predefinedPost = blogPosts[slug];

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        flexDirection: 'column'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid rgba(255,255,255,0.3)',
          borderTop: '4px solid #fff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '16px'
        }}></div>
        <p style={{ fontSize: '1.1rem' }}>Loading blog post...</p>
      </div>
    );
  }

  // Use generated post if available, otherwise fall back to predefined post
  const post = generatedPost || predefinedPost;

  if (!post) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        flexDirection: 'column'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>404</h1>
        <p style={{ fontSize: '1.3rem', marginBottom: '24px' }}>Blog post not found.</p>
        <Link to="/blog" style={{
          background: '#fff',
          color: '#667eea',
          padding: '12px 24px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: '600',
        }}>← Back to Blog</Link>
      </div>
    );
  }

  // Determine post styling based on whether it's generated or predefined
  const isGenerated = !!generatedPost;
  const postColor = isGenerated ? '#667eea' : post.color;
  const postImage = isGenerated ? '📝' : post.image;
  const postCategory = isGenerated ? 'Generated Blog' : post.category;
  const postDate = isGenerated ? new Date(post.timestamp).toLocaleDateString() : post.date;
  const postTitle = isGenerated ? post.topic : post.title;

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${postColor} 0%, #764ba2 100%)`,
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: 800,
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.97)',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12)',
        overflow: 'hidden',
        backdropFilter: 'blur(10px)',
        padding: '40px 32px',
        marginTop: '40px',
        marginBottom: '40px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '24px' }}>
          <div style={{
            background: postColor,
            borderRadius: '12px',
            width: '56px',
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            color: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>{postImage}</div>
          <div style={{ flex: 1 }}>
            <span style={{
              background: postColor,
              color: '#fff',
              padding: '4px 10px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginRight: '8px'
            }}>{postCategory}</span>
            <span style={{ color: '#718096', fontSize: '12px', fontWeight: '500' }}>{postDate}</span>
            <h1 style={{ margin: '8px 0 0 0', color: '#2d3748', fontSize: '2rem', fontWeight: '800' }}>{postTitle}</h1>
            {isGenerated && (
              <div style={{
                marginTop: '8px',
                fontSize: '14px',
                color: '#718096'
              }}>
                <span style={{ marginRight: '12px' }}>{post.restaurantName}</span>
                {post.cuisine && <span style={{ marginRight: '12px' }}>{post.cuisine}</span>}
                {post.location && <span>{post.location}</span>}
              </div>
            )}
          </div>
          
          {/* Action Buttons - Only show for generated posts */}
          {isGenerated && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {/* Copy Content Button */}
              <button
                onClick={copyFullContent}
                style={{
                  background: '#48bb78',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap'
                }}
              >
                📋 Copy Content
              </button>
              
              {/* Edit Mode Controls */}
              {!isEditMode ? (
                <button
                  onClick={toggleEditMode}
                  style={{
                    background: '#667eea',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap'
                  }}
                >
                  ✏️ Edit Content
                </button>
              ) : (
                <>
                  <button
                    onClick={saveEditedContent}
                    disabled={isSaving}
                    style={{
                      background: '#48bb78',
                      color: '#fff',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: isSaving ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s',
                      opacity: isSaving ? 0.7 : 1,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {isSaving ? '💾 Saving...' : '💾 Save'}
                  </button>
                  <button
                    onClick={discardChanges}
                    style={{
                      background: '#f56565',
                      color: '#fff',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    ❌ Cancel
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Copy Status Feedback */}
        {copyStatus && (
          <div style={{
            marginBottom: '20px',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            textAlign: 'center',
            background: copyStatus.includes('✅') ? '#f0fff4' : '#fed7d7',
            color: copyStatus.includes('✅') ? '#22543d' : '#c53030',
            border: `1px solid ${copyStatus.includes('✅') ? '#9ae6b4' : '#feb2b2'}`
          }}>
            {copyStatus}
          </div>
        )}

        <div style={{ color: '#2d3748', fontSize: '1.1rem', lineHeight: '1.7' }}>
          {isGenerated ? (
            isEditMode ? (
              <div style={{
                background: '#f8f9fa',
                border: '2px solid #667eea',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px'
              }}>
                <div style={{
                  marginBottom: '16px',
                  padding: '12px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  ✏️ Edit Mode - You can modify the blog content below. Use markdown formatting for headings (# ## ###), bold text (**text**), and lists (• or 1. 2. 3.)
                </div>
                
                {/* Preview Toggle */}
                <div style={{
                  marginBottom: '16px',
                  display: 'flex',
                  gap: '8px'
                }}>
                  <button
                    onClick={togglePreview}
                    style={{
                      background: showPreview ? '#667eea' : '#e2e8f0',
                      color: showPreview ? '#fff' : '#4a5568',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s'
                    }}
                  >
                    👁️ {showPreview ? 'Hide Preview' : 'Show Preview'}
                  </button>
                </div>

                {showPreview ? (
                  <div style={{
                    background: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '20px',
                    marginBottom: '16px',
                    maxHeight: '400px',
                    overflow: 'auto'
                  }}>
                    <div style={{
                      marginBottom: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#667eea'
                    }}>
                      📖 Preview:
                    </div>
                    {renderBlogWithImages(editedContent, post.images || [])}
                  </div>
                ) : (
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    style={{
                      width: '100%',
                      minHeight: '400px',
                      padding: '16px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '16px',
                      lineHeight: '1.6',
                      fontFamily: 'monospace',
                      resize: 'vertical',
                      background: '#fff'
                    }}
                    placeholder="Edit your blog content here..."
                  />
                )}
                
                <div style={{
                  marginTop: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '14px',
                  color: '#718096'
                }}>
                  <span style={{ fontStyle: 'italic' }}>
                    💡 Tip: Use # for main headings, ## for sections, ### for subsections, **text** for bold, and • for bullet points
                  </span>
                  <span style={{ fontWeight: '600' }}>
                    📊 Word Count: {editedContent.split(/\s+/).filter(word => word.length > 0).length} words
                  </span>
                </div>
              </div>
            ) : (
              renderBlogWithImages(post.blogPost, post.images || [])
            )
          ) : (
            post.content
          )}
        </div>

        {/* Blog post metadata for generated posts */}
        {isGenerated && (
          <div style={{
            marginTop: '32px',
            padding: '20px',
            background: '#f8f9fa',
            borderRadius: '12px',
            border: '1px solid #e9ecef'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              fontSize: '14px'
            }}>
              <div>
                <strong style={{ color: '#495057' }}>Target Audience:</strong>
                <div style={{ color: '#6c757d', marginTop: '4px' }}>
                  {post.targetAudience === 'customers' && 'General Customers'}
                  {post.targetAudience === 'foodies' && 'Food Enthusiasts'}
                  {post.targetAudience === 'families' && 'Families'}
                  {post.targetAudience === 'business' && 'Business Professionals'}
                  {post.targetAudience === 'tourists' && 'Tourists/Visitors'}
                  {post.targetAudience === 'locals' && 'Local Community'}
                </div>
              </div>
              <div>
                <strong style={{ color: '#495057' }}>Writing Tone:</strong>
                <div style={{ color: '#6c757d', marginTop: '4px' }}>
                  {post.tone === 'professional' && 'Professional'}
                  {post.tone === 'casual' && 'Casual & Friendly'}
                  {post.tone === 'enthusiastic' && 'Enthusiastic'}
                  {post.tone === 'elegant' && 'Elegant & Sophisticated'}
                  {post.tone === 'rustic' && 'Rustic & Cozy'}
                  {post.tone === 'modern' && 'Modern & Trendy'}
                </div>
              </div>
              <div>
                <strong style={{ color: '#495057' }}>Blog Length:</strong>
                <div style={{ color: '#6c757d', marginTop: '4px' }}>
                  {post.length === 'short' && 'Short (300-500 words)'}
                  {post.length === 'medium' && 'Medium (600-800 words)'}
                  {post.length === 'long' && 'Long (900-1200 words)'}
                </div>
              </div>
              <div>
                <strong style={{ color: '#495057' }}>Images:</strong>
                <div style={{ color: '#6c757d', marginTop: '4px' }}>
                  {post.images ? post.images.length : 0} images included
                </div>
              </div>
              {post.lastEdited && (
                <div>
                  <strong style={{ color: '#495057' }}>Last Edited:</strong>
                  <div style={{ color: '#6c757d', marginTop: '4px' }}>
                    {new Date(post.lastEdited).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <Link to="/blog" style={{
            background: postColor,
            color: '#fff',
            padding: '10px 22px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '1rem',
            transition: 'all 0.2s',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>← Back to Blog</Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default BlogPost; 