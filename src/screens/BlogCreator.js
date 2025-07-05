import React, { useState, useEffect } from 'react';
import ModelInfo from '../components/ModelInfo';
import apiConfig from '../config/api';

const BlogCreator = () => {
  const [blogData, setBlogData] = useState({
    topic: '',
    restaurantName: '',
    restaurantType: 'restaurant',
    cuisine: '',
    location: '',
    targetAudience: 'customers',
    tone: 'professional',
    length: 'medium',
    keyPoints: '',
    specialFeatures: ''
  });
  const [generatedBlog, setGeneratedBlog] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('nvidiaApiKey') || '';
  });
  
  // Image upload states
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageAnalysis, setImageAnalysis] = useState(null);

  // Image handling functions
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      
      if (!isValidType) {
        alert(`Invalid file type: ${file.name}. Please upload JPEG, PNG, GIF, or WebP images.`);
        return false;
      }
      
      if (!isValidSize) {
        alert(`File too large: ${file.name}. Please upload images smaller than 5MB.`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    // Process images
    const processImages = validFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = {
            id: Date.now() + Math.random(),
            name: file.name,
            size: file.size,
            type: file.type,
            dataUrl: e.target.result,
            uploadedAt: new Date().toISOString()
          };
          resolve(imageData);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(processImages).then(newImages => {
      setImages(prev => [...prev, ...newImages]);
      setUploadProgress(100);
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    });
  };

  const removeImage = (imageId) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  const reorderImages = (fromIndex, toIndex) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    setImages(newImages);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const restaurantTypes = [
    { value: 'restaurant', label: 'Restaurant', icon: '🍽️', color: '#ff6b6b' },
    { value: 'cafe', label: 'Café', icon: '☕', color: '#8b4513' },
    { value: 'pizzeria', label: 'Pizzeria', icon: '🍕', color: '#ff8c00' },
    { value: 'bakery', label: 'Bakery', icon: '🥐', color: '#daa520' },
    { value: 'bar', label: 'Bar/Pub', icon: '🍺', color: '#ffd700' },
    { value: 'food-truck', label: 'Food Truck', icon: '🚚', color: '#ff6347' },
    { value: 'fine-dining', label: 'Fine Dining', icon: '🍷', color: '#800020' },
    { value: 'fast-casual', label: 'Fast Casual', icon: '🥪', color: '#32cd32' }
  ];

  const targetAudiences = [
    { value: 'customers', label: 'General Customers', icon: '👥', color: '#667eea' },
    { value: 'foodies', label: 'Food Enthusiasts', icon: '🍴', color: '#ff6b6b' },
    { value: 'families', label: 'Families', icon: '👨‍👩‍👧‍👦', color: '#20c997' },
    { value: 'business', label: 'Business Professionals', icon: '💼', color: '#4b7bec' },
    { value: 'tourists', label: 'Tourists/Visitors', icon: '🗺️', color: '#f7b731' },
    { value: 'locals', label: 'Local Community', icon: '🏘️', color: '#a55eea' }
  ];

  const tones = [
    { value: 'professional', label: 'Professional', icon: '👔', color: '#667eea' },
    { value: 'casual', label: 'Casual & Friendly', icon: '😊', color: '#ffa726' },
    { value: 'enthusiastic', label: 'Enthusiastic', icon: '🎉', color: '#ff7043' },
    { value: 'elegant', label: 'Elegant & Sophisticated', icon: '✨', color: '#9c27b0' },
    { value: 'rustic', label: 'Rustic & Cozy', icon: '🏡', color: '#8d6e63' },
    { value: 'modern', label: 'Modern & Trendy', icon: '🚀', color: '#00bcd4' }
  ];

  const lengths = [
    { value: 'short', label: 'Short (300-500 words)', icon: '📝', color: '#4caf50' },
    { value: 'medium', label: 'Medium (600-800 words)', icon: '📄', color: '#ff9800' },
    { value: 'long', label: 'Long (900-1200 words)', icon: '📚', color: '#f44336' }
  ];

  const handleInputChange = (field, value) => {
    setBlogData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApiKeyChange = (newApiKey) => {
    setApiKey(newApiKey);
    if (newApiKey.trim()) {
      localStorage.setItem('nvidiaApiKey', newApiKey);
    } else {
      localStorage.removeItem('nvidiaApiKey');
    }
  };

  const generateBlogPost = async () => {
    // Validate input
    if (!blogData.topic.trim()) {
      setError('Please enter a blog topic');
      return;
    }

    if (!blogData.restaurantName.trim()) {
      setError('Please enter your restaurant name');
      return;
    }

    if (!apiKey.trim()) {
      setError('Please enter your NVIDIA API key');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedBlog('');

    try {
      // Force production URL if we're on Netlify
      const isNetlify = window.location.hostname.includes('netlify.app') || window.location.hostname.includes('vmarketing.netlify.app');
      const baseURL = isNetlify ? 'https://vmarketing-backend-server.onrender.com/api' : apiConfig.baseURL;
      
      // Prepare image data for the API
      const imageData = images.map(img => ({
        name: img.name,
        type: img.type,
        size: img.size,
        dataUrl: img.dataUrl
      }));

      const res = await fetch(`${baseURL}/blog/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...blogData,
          apiKey,
          images: imageData
        }),
      });

      const data = await res.json();
      if (data.success) {
        setGeneratedBlog(data.blogPost);
        setImageAnalysis(data.imageAnalysis);
        
        // Save to localStorage for history
        const blogHistory = JSON.parse(localStorage.getItem('blogHistory') || '[]');
        const newBlog = {
          id: Date.now(),
          ...blogData,
          blogPost: data.blogPost,
          images: images,
          imageAnalysis: data.imageAnalysis,
          timestamp: new Date().toISOString()
        };
        blogHistory.unshift(newBlog);
        localStorage.setItem('blogHistory', JSON.stringify(blogHistory.slice(0, 20))); // Keep last 20
      } else {
        setError(data.error || 'Failed to generate blog post');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    // Create a rich text version with image references
    let richContent = generatedBlog;
    
    if (images.length > 0) {
      richContent += '\n\n--- IMAGES ---\n';
      images.forEach((image, index) => {
        richContent += `\n[Image ${index + 1}: ${image.name}]\n`;
      });
      richContent += '\nNote: Images are embedded in the blog post above at strategic locations.';
    }
    
    navigator.clipboard.writeText(richContent);
    alert('Blog post copied to clipboard!');
  };

  const resetForm = () => {
    setBlogData({
      topic: '',
      restaurantName: '',
      restaurantType: 'restaurant',
      cuisine: '',
      location: '',
      targetAudience: 'customers',
      tone: 'professional',
      length: 'medium',
      keyPoints: '',
      specialFeatures: ''
    });
    setGeneratedBlog('');
    setError('');
    setImages([]);
    setImageAnalysis(null);
  };

  const getWordCount = () => {
    if (!generatedBlog) return 0;
    return generatedBlog.split(/\s+/).length;
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
    // Define emojis to keep (food, quality, service, location, action, emotion)
    const keepEmojis = /[🍽️🍕🍔🍜🍣🍰☕🍷🍺🥗🥩🍤⭐🌟💎👑🏆💫✨👨‍🍳👩‍🍳🛎️💁‍♂️💁‍♀️🤝📍🏙️🌆🏘️😋😍🤤😊😌🎉🎊🚀💪🎯🔥💡📸📷]/g;
    
    // Remove excessive emojis while preserving strategic ones
    cleanedContent = cleanedContent
      // Remove excessive decorative emojis
      .replace(/[🔍🎯📝📊📈📉📋✅❌⚠️🚨💡💭💬💪🎈🎁🎂🎄🎃🎅🎆🎇🎈🎉🎊🎋🎌🎍🎎🎏🎐🎑🎒🎓🎔🎕🎖️🎗️🎘️🎙️🎚️🎛️🎜️🎝️🎞️🎟️🎠🎡🎢🎣🎤🎥🎦🎧🎨🎩🎪🎫🎬🎭🎮🎯🎰🎱🎲🎳🎴🎵🎶🎷🎸🎹🎺🎻🎼🎽🎾🎿🏀🏁🏂🏃🏄🏅🏆🏇🏈🏉🏊🏋️🏌️🏍️🏎️🏏🏐🏑🏒🏓🏔️🏕️🏖️🏗️🏘️🏙️🏚️🏛️🏜️🏝️🏞️🏟️🏠🏡🏢🏣🏤🏥🏦🏧🏨🏩🏪🏫🏬🏭🏮🏯🏰🏱🏲🏳️🏴🏵️🏶🏷️🏸🏹🏺🏻🏼🏽🏾🏿🐀🐁🐂🐃🐄🐅🐆🐇🐈🐉🐊🐋🐌🐍🐎🐏🐐🐑🐒🐓🐔🐕🐖🐗🐘🐙🐚🐛🐜🐝🐞🐟🐠🐡🐢🐣🐤🐥🐦🐧🐨🐩🐪🐫🐬🐭🐮🐯🐰🐱🐲🐳🐴🐵🐶🐷🐸🐹🐺🐻🐼🐽🐾🐿️👀👁️👂👃👄👅👆👇👈👉👊👋👌👍👎👏👐👑👒👓👔👕👖👗👘👙👚👛👜👝👞👟👠👡👢👣👤👥👦👧👨👩👪👫👬👭👮👯👰👱👲👳👴👵👶👷👸👹👺👻👼👽👾👿💀💁💂💃💄💅💆💇💈💉💊💋💌💍💎💏💐💑💒💓💔💕💖💗💘💙💚💛💜💝💞💟💠💡💢💣💤💥💦💧💨💩💪💫💬💭💮💯💰💱💲💳💴💵💶💷💸💹💺💻💼💽💾💿📀📁📂📃📄📅📆📇📈📉📊📋📌📍📎📏📐📑📒📓📔📕📖📗📘📙📚📛📜📝📞📟📠📡📢📣📤📥📦📧📨📩📪📫📬📭📮📯📰📱📲📳📴📵📶📷📸📹📺📻📼📽️📾📿🔀🔁🔂🔃🔄🔅🔆🔇🔈🔉🔊🔋🔌🔍🔎🔏🔐🔑🔒🔓🔔🔕🔖🔗🔘🔙🔚🔛🔜🔝🔞🔟🔠🔡🔢🔣🔤🔥🔦🔧🔨🔩🔪🔫🔬🔭🔮🔯🔰🔱🔲🔳🔴🔵🔶🔷🔸🔹🔺🔻🔼🔽🔾🔿🕀🕁🕂🕃🕄🕅🕆🕇🕈🕉🕊️🕋🕌🕍🕎🕏🕐🕑🕒🕓🕔🕕🕖🕗🕘🕙🕚🕛🕜🕝🕞🕟🕠🕡🕢🕣🕤🕥🕦🕧🕨🕩🕪🕫🕬🕭🕮🕯🕰🕱🕲🕳🕴️🕵️🕶️🕷️🕸️🕹️🕺🕻🕼🕽🕾🕿🖀🖁🖂🖃🖄🖅🖆🖇️🖈🖉🖊️🖋️🖌️🖍️🖎️🖏️🖐️🖑🖒🖓🖔🖕🖖🖗🖘🖙🖚🖛🖜🖝🖞🖟🖠🖡🖢🖣🖤🖥️🖦🖧🖨🖩🖪🖫🖬🖭🖮🖯🖰🖱🖲🖳🖴🖵🖶🖷🖸🖹🖺🖻🖼️🖽🖾🖿🗀🗁🗂🗃🗄🗅🗆🗇🗈🗉🗊🗋🗌🗍🗎🗏🗐🗑🗒🗓🗔🗕🗖🗗🗘🗙🗚🗛🗜🗝🗞🗟🗠🗡🗢🗣🗤🗥🗦🗧🗨🗩🗪🗫🗬🗭🗮🗯🗰🗱🗲🗳🗴🗵🗶🗷🗸🗹🗺🗻🗼🗽🗾🗿😀😁😂🤣😃😄😅😆😇😈😉😊😋😌😍😎😏😐😑😒😓😔😕😖😗😘😙😚😛😜😝😞😟😠😡😢😣😤😥😦😧😨😩😪😫😬😭😮😯😰😱😲😳😴😵😶😷😸😹😺😻😼😽😾😿🙀🙁🙂🙃🙄🙅🙆🙇🙈🙉🙊🙋🙌🙍🙎🙏]/g, '')
      // Remove excessive decorative symbols
      .replace(/[⚡✨🌟💫⭐]/g, '')
      .replace(/[🎯🎪🎨🎭🎬🎤🎧🎵🎶🎷🎸🎹🎺🎻🎼🎽🎾🎿🏀🏁🏂🏃🏄🏅🏆🏇🏈🏉🏊🏋️🏌️🏍️🏎️🏏🏐🏑🏒🏓🏔️🏕️🏖️🏗️🏘️🏙️🏚️🏛️🏜️🏝️🏞️🏟️🏠🏡🏢🏣🏤🏥🏦🏧🏨🏩🏪🏫🏬🏭🏮🏯🏰🏱🏲🏳️🏴🏵️🏶🏷️🏸🏹🏺🏻🏼🏽🏾🏿]/g, '')
      // Remove excessive food emojis but keep strategic ones
      .replace(/[🍟🍖🍗🍘🍙🍚🍛🍝🍞🍟🍠🍡🍢🍤🍥🍦🍧🍨🍩🍪🍫🍬🍭🍮🍯🍱🍲🍳🍴🍵🍶🍸🍹🍻🍼🍾🍿]/g, '')
      // Remove excessive building emojis
      .replace(/[🏪🏫🏬🏭🏮🏯🏰🏱🏲🏳️🏴🏵️🏶🏷️🏸🏹🏺🏻🏼🏽🏾🏿]/g, '')
      // Remove excessive device emojis
      .replace(/[📱📲📳📴📵📶📷📹📺📻📼📽️📾📿]/g, '')
      // Remove excessive communication emojis
      .replace(/[💬💭💮💯💰💱💲💳💴💵💶💷💸💹💺💻💼💽💾💿📀]/g, '');
    
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

  // Function to render blog content with embedded images
  const renderBlogWithImages = () => {
    // Clean and format the blog content
    const cleanedContent = cleanAndFormatBlogContent(generatedBlog);
    
    if (!cleanedContent || !images.length) {
      return (
        <div style={{
          color: '#2d3748',
          fontSize: '16px',
          lineHeight: '1.7'
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

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
        overflow: 'hidden',
        backdropFilter: 'blur(10px)'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #4f8cff 0%, #38e8ff 100%)',
          padding: '40px 32px',
          textAlign: 'center'
        }}>
          <span style={{ 
            fontSize: '64px', 
            marginBottom: '16px', 
            display: 'block',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
          }}>📝</span>
          <h1 style={{ 
            margin: '0 0 12px 0', 
            fontWeight: '800', 
            fontSize: '36px', 
            color: '#fff',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            Restaurant Blog Creator
          </h1>
          <p style={{ 
            margin: '0', 
            fontSize: '18px', 
            color: '#fff',
            opacity: '0.95'
          }}>
            Generate engaging blog content for your restaurant business with AI
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: '40px 32px' }}>
          {/* Model Information */}
          <ModelInfo 
            useCase="blog_generation" 
            style={{ marginBottom: '24px' }}
          />

          {!generatedBlog ? (
            <div>
              {/* API Key Section */}
              <div style={{
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '24px',
                border: '1px solid #bae6fd'
              }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#0c4a6e',
                  fontSize: '16px'
                }}>
                  🔑 NVIDIA API Key:
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => handleApiKeyChange(e.target.value)}
                  placeholder="Enter your NVIDIA API key"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e1e5e9',
                    borderRadius: '8px',
                    fontSize: '16px',
                    marginBottom: '8px'
                  }}
                />
                <small style={{ color: '#0369a1', fontSize: '14px' }}>
                  Get your API key from{' '}
                  <a 
                    href="https://integrate.api.nvidia.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#0ea5e9', textDecoration: 'none' }}
                  >
                    NVIDIA API Portal
                  </a>
                </small>
              </div>

              {/* Image Upload Section */}
              <div style={{
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '24px',
                border: '1px solid #bae6fd'
              }}>
                <h3 style={{
                  margin: '0 0 20px 0',
                  color: '#0c4a6e',
                  fontSize: '20px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  📸 Blog Images
                </h3>
                
                <div style={{
                  border: '2px dashed #bae6fd',
                  borderRadius: '12px',
                  padding: '24px',
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.5)',
                  marginBottom: '20px',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>📁</div>
                  <p style={{ margin: '0 0 16px 0', color: '#0c4a6e', fontSize: '16px' }}>
                    Upload images to enhance your blog post
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: '#fff',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      display: 'inline-block',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    📤 Choose Images
                  </label>
                  <p style={{ margin: '8px 0 0 0', color: '#0369a1', fontSize: '14px' }}>
                    Supports JPEG, PNG, GIF, WebP (max 5MB each)
                  </p>
                </div>

                {/* Upload Progress */}
                {isUploading && (
                  <div style={{
                    background: '#fff',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '16px',
                    border: '1px solid #bae6fd'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '8px'
                    }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        border: '2px solid #bae6fd',
                        borderTop: '2px solid #0ea5e9',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                      <span style={{ color: '#0c4a6e', fontWeight: '600' }}>
                        Uploading images...
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      background: '#e0f2fe',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${uploadProgress}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #0ea5e9, #667eea)',
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>
                  </div>
                )}

                {/* Image Preview Grid */}
                {images.length > 0 && (
                  <div>
                    <h4 style={{
                      margin: '0 0 16px 0',
                      color: '#0c4a6e',
                      fontSize: '16px',
                      fontWeight: '600'
                    }}>
                      📷 Uploaded Images ({images.length})
                    </h4>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                      gap: '16px',
                      marginBottom: '16px'
                    }}>
                      {images.map((image, index) => (
                        <div
                          key={image.id}
                          style={{
                            background: '#fff',
                            borderRadius: '12px',
                            padding: '12px',
                            border: '1px solid #bae6fd',
                            position: 'relative'
                          }}
                        >
                          <img
                            src={image.dataUrl}
                            alt={image.name}
                            style={{
                              width: '100%',
                              height: '120px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                              marginBottom: '8px'
                            }}
                          />
                          <div style={{
                            fontSize: '12px',
                            color: '#0369a1',
                            marginBottom: '4px',
                            fontWeight: '500'
                          }}>
                            {image.name.length > 20 ? image.name.substring(0, 20) + '...' : image.name}
                          </div>
                          <div style={{
                            fontSize: '11px',
                            color: '#64748b',
                            marginBottom: '8px'
                          }}>
                            {formatFileSize(image.size)}
                          </div>
                          <div style={{
                            display: 'flex',
                            gap: '8px'
                          }}>
                            <button
                              onClick={() => removeImage(image.id)}
                              style={{
                                background: '#ef4444',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '4px 8px',
                                fontSize: '11px',
                                cursor: 'pointer',
                                fontWeight: '500'
                              }}
                            >
                              🗑️ Remove
                            </button>
                            {index > 0 && (
                              <button
                                onClick={() => reorderImages(index, index - 1)}
                                style={{
                                  background: '#3b82f6',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: '6px',
                                  padding: '4px 8px',
                                  fontSize: '11px',
                                  cursor: 'pointer',
                                  fontWeight: '500'
                                }}
                              >
                                ⬆️ Up
                              </button>
                            )}
                            {index < images.length - 1 && (
                              <button
                                onClick={() => reorderImages(index, index + 1)}
                                style={{
                                  background: '#3b82f6',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: '6px',
                                  padding: '4px 8px',
                                  fontSize: '11px',
                                  cursor: 'pointer',
                                  fontWeight: '500'
                                }}
                              >
                                ⬇️ Down
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{
                      background: '#e0f2fe',
                      borderRadius: '8px',
                      padding: '12px',
                      fontSize: '14px',
                      color: '#0c4a6e'
                    }}>
                      💡 <strong>Tip:</strong> Images will be automatically integrated into your blog post. The AI will suggest optimal placement and captions based on your content.
                    </div>
                  </div>
                )}
              </div>

              {/* Blog Configuration Form */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px',
                marginBottom: '32px'
              }}>
                {/* Basic Information */}
                <div style={{
                  background: '#f8f9fa',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #e9ecef'
                }}>
                  <h3 style={{
                    margin: '0 0 20px 0',
                    color: '#2d3748',
                    fontSize: '20px',
                    fontWeight: '700'
                  }}>
                    📋 Basic Information
                  </h3>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '600',
                      color: '#495057'
                    }}>
                      Blog Topic *
                    </label>
                    <input
                      type="text"
                      value={blogData.topic}
                      onChange={(e) => handleInputChange('topic', e.target.value)}
                      placeholder="e.g., Our New Seasonal Menu, Behind the Scenes, Local Ingredients"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e1e5e9',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '600',
                      color: '#495057'
                    }}>
                      Restaurant Name *
                    </label>
                    <input
                      type="text"
                      value={blogData.restaurantName}
                      onChange={(e) => handleInputChange('restaurantName', e.target.value)}
                      placeholder="Your restaurant name"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e1e5e9',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '600',
                      color: '#495057'
                    }}>
                      Restaurant Type
                    </label>
                    <select
                      value={blogData.restaurantType}
                      onChange={(e) => handleInputChange('restaurantType', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e1e5e9',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                    >
                      {restaurantTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '600',
                      color: '#495057'
                    }}>
                      Cuisine Type
                    </label>
                    <input
                      type="text"
                      value={blogData.cuisine}
                      onChange={(e) => handleInputChange('cuisine', e.target.value)}
                      placeholder="e.g., Italian, Mexican, Fusion, American"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e1e5e9',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '600',
                      color: '#495057'
                    }}>
                      Location
                    </label>
                    <input
                      type="text"
                      value={blogData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="e.g., Downtown Seattle, West Village, etc."
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e1e5e9',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                    />
                  </div>
                </div>

                {/* Content Preferences */}
                <div style={{
                  background: '#f8f9fa',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #e9ecef'
                }}>
                  <h3 style={{
                    margin: '0 0 20px 0',
                    color: '#2d3748',
                    fontSize: '20px',
                    fontWeight: '700'
                  }}>
                    🎯 Content Preferences
                  </h3>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '12px',
                      fontWeight: '600',
                      color: '#495057'
                    }}>
                      Target Audience
                    </label>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                      gap: '8px'
                    }}>
                      {targetAudiences.map(audience => (
                        <button
                          key={audience.value}
                          type="button"
                          onClick={() => handleInputChange('targetAudience', audience.value)}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: `2px solid ${blogData.targetAudience === audience.value ? audience.color : '#e1e5e9'}`,
                            background: blogData.targetAudience === audience.value ? `${audience.color}15` : '#fff',
                            color: blogData.targetAudience === audience.value ? audience.color : '#495057',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {audience.icon} {audience.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '12px',
                      fontWeight: '600',
                      color: '#495057'
                    }}>
                      Writing Tone
                    </label>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                      gap: '8px'
                    }}>
                      {tones.map(tone => (
                        <button
                          key={tone.value}
                          type="button"
                          onClick={() => handleInputChange('tone', tone.value)}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: `2px solid ${blogData.tone === tone.value ? tone.color : '#e1e5e9'}`,
                            background: blogData.tone === tone.value ? `${tone.color}15` : '#fff',
                            color: blogData.tone === tone.value ? tone.color : '#495057',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {tone.icon} {tone.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '12px',
                      fontWeight: '600',
                      color: '#495057'
                    }}>
                      Blog Length
                    </label>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr',
                      gap: '8px'
                    }}>
                      {lengths.map(length => (
                        <button
                          key={length.value}
                          type="button"
                          onClick={() => handleInputChange('length', length.value)}
                          style={{
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: `2px solid ${blogData.length === length.value ? length.color : '#e1e5e9'}`,
                            background: blogData.length === length.value ? `${length.color}15` : '#fff',
                            color: blogData.length === length.value ? length.color : '#495057',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            transition: 'all 0.3s ease',
                            textAlign: 'left'
                          }}
                        >
                          {length.icon} {length.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div style={{
                background: '#f8f9fa',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '32px',
                border: '1px solid #e9ecef'
              }}>
                <h3 style={{
                  margin: '0 0 20px 0',
                  color: '#2d3748',
                  fontSize: '20px',
                  fontWeight: '700'
                }}>
                  📝 Additional Details
                </h3>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#495057'
                  }}>
                    Key Points to Include
                  </label>
                  <textarea
                    value={blogData.keyPoints}
                    onChange={(e) => handleInputChange('keyPoints', e.target.value)}
                    placeholder="List specific points, events, or features you want highlighted in the blog post..."
                    rows="4"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '8px',
                      fontSize: '16px',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#495057'
                  }}>
                    Special Features or Highlights
                  </label>
                  <textarea
                    value={blogData.specialFeatures}
                    onChange={(e) => handleInputChange('specialFeatures', e.target.value)}
                    placeholder="Mention any special features, awards, unique aspects, or recent news about your restaurant..."
                    rows="4"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '8px',
                      fontSize: '16px',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>

              {/* Generate Button */}
              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={generateBlogPost}
                  disabled={isGenerating || !blogData.topic.trim() || !blogData.restaurantName.trim() || !apiKey.trim()}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px 32px',
                    fontWeight: '700',
                    fontSize: '18px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
                    transition: 'all 0.3s ease',
                    opacity: isGenerating || !blogData.topic.trim() || !blogData.restaurantName.trim() || !apiKey.trim() ? 0.6 : 1
                  }}
                >
                  {isGenerating ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTop: '2px solid #fff',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                      Generating Blog Post...
                    </div>
                  ) : (
                    '🚀 Generate Blog Post'
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Generated Blog Post */}
              <div style={{
                background: '#f8f9fa',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '24px',
                border: '1px solid #e9ecef'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px'
                }}>
                  <h3 style={{
                    margin: 0,
                    color: '#2d3748',
                    fontSize: '24px',
                    fontWeight: '700'
                  }}>
                    ✨ Your Generated Blog Post
                  </h3>
                  <div style={{
                    display: 'flex',
                    gap: '12px'
                  }}>
                    <button
                      onClick={copyToClipboard}
                      style={{
                        background: '#28a745',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      📋 Copy
                    </button>
                    <button
                      onClick={resetForm}
                      style={{
                        background: '#6c757d',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      🔄 New Post
                    </button>
                  </div>
                </div>

                <div style={{
                  background: '#fff',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid #e9ecef',
                  marginBottom: '16px'
                }}>
                  {renderHierarchicalContent(generatedBlog)}
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  background: '#e9ecef',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#6c757d'
                }}>
                  <span>📊 Word Count: {getWordCount()} words</span>
                  <span>📸 Images: {images.length}</span>
                  <span>🤖 Model: NVIDIA Llama 3.3 Nemotron Super 49B</span>
                  <span>📅 Generated: {new Date().toLocaleString()}</span>
                </div>
                
                {/* Image Analysis Information */}
                {imageAnalysis && (
                  <div style={{
                    marginTop: '16px',
                    padding: '16px',
                    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                    borderRadius: '8px',
                    border: '1px solid #bae6fd'
                  }}>
                    <h4 style={{
                      margin: '0 0 12px 0',
                      color: '#0c4a6e',
                      fontSize: '16px',
                      fontWeight: '600'
                    }}>
                      📸 Image Integration Analysis
                    </h4>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '12px'
                    }}>
                      {imageAnalysis.imageDetails.map((img, index) => (
                        <div key={index} style={{
                          background: '#fff',
                          padding: '12px',
                          borderRadius: '8px',
                          border: '1px solid #bae6fd'
                        }}>
                          <div style={{
                            fontWeight: '600',
                            color: '#0c4a6e',
                            marginBottom: '4px'
                          }}>
                            {img.name}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: '#0369a1',
                            marginBottom: '4px'
                          }}>
                            📍 Placement: {img.suggestedPlacement}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: '#0369a1',
                            fontStyle: 'italic'
                          }}>
                            💬 Caption: {img.suggestedCaption}
                          </div>
                        </div>
                      ))}
                    </div>
                    {imageAnalysis.integrationSuggestions.length > 0 && (
                      <div style={{
                        marginTop: '12px',
                        padding: '12px',
                        background: '#fff',
                        borderRadius: '6px',
                        border: '1px solid #bae6fd'
                      }}>
                        <div style={{
                          fontWeight: '600',
                          color: '#0c4a6e',
                          marginBottom: '8px',
                          fontSize: '14px'
                        }}>
                          💡 Integration Suggestions:
                        </div>
                        <ul style={{
                          margin: '0',
                          paddingLeft: '16px',
                          fontSize: '12px',
                          color: '#0369a1'
                        }}>
                          {imageAnalysis.integrationSuggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div style={{
              background: 'linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%)',
              border: '1px solid #fc8181',
              borderRadius: '12px',
              padding: '16px',
              color: '#c53030',
              fontWeight: '600',
              textAlign: 'center',
              marginTop: '24px'
            }}>
              ⚠️ {error}
            </div>
          )}
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

export default BlogCreator; 