import React from 'react';
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
  const post = blogPosts[slug];

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

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${post.color} 0%, #764ba2 100%)`,
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
            background: post.color,
            borderRadius: '12px',
            width: '56px',
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            color: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>{post.image}</div>
          <div>
            <span style={{
              background: post.color,
              color: '#fff',
              padding: '4px 10px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginRight: '8px'
            }}>{post.category}</span>
            <span style={{ color: '#718096', fontSize: '12px', fontWeight: '500' }}>{post.date}</span>
            <h1 style={{ margin: '8px 0 0 0', color: '#2d3748', fontSize: '2rem', fontWeight: '800' }}>{post.title}</h1>
          </div>
        </div>
        <div style={{ color: '#2d3748', fontSize: '1.1rem', lineHeight: '1.7' }}>
          {post.content}
        </div>
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <Link to="/blog" style={{
            background: post.color,
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
    </div>
  );
};

export default BlogPost; 