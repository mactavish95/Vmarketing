import React, { useState } from 'react';
import { FieldTipLLM, useFieldTipLLM } from './FieldTipLLM';
import './LetterCreator.css';

const letterTypes = [
  { value: 'thank_you', label: 'Thank You' },
  { value: 'apology', label: 'Apology' },
  { value: 'business', label: 'Business' },
  { value: 'invitation', label: 'Invitation' },
  { value: 'complaint', label: 'Complaint' },
  { value: 'other', label: 'Other' }
];

const tones = [
  { value: 'formal', label: 'Formal' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'sincere', label: 'Sincere' },
  { value: 'enthusiastic', label: 'Enthusiastic' }
];

export default function LetterCreator() {
  const [letterData, setLetterData] = useState({
    letterType: '',
    recipient: '',
    sender: '',
    subject: '',
    tone: '',
    keyPoints: '',
    specialRequests: ''
  });
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // LLM tips for each field
  const { tip: typeTip } = useFieldTipLLM('letterType', letterData.letterType);
  const { tip: recipientTip } = useFieldTipLLM('recipient', letterData.recipient);
  const { tip: senderTip } = useFieldTipLLM('sender', letterData.sender);
  const { tip: subjectTip } = useFieldTipLLM('subject', letterData.subject);
  const { tip: toneTip } = useFieldTipLLM('tone', letterData.tone);
  const { tip: keyPointsTip } = useFieldTipLLM('keyPoints', letterData.keyPoints);
  const { tip: specialRequestsTip } = useFieldTipLLM('specialRequests', letterData.specialRequests);

  const handleInputChange = (field, value) => {
    setLetterData(prev => ({ ...prev, [field]: value }));
  };

  // Generate letter idea (LLM-powered, placeholder for now)
  const suggestIdea = async () => {
    setLetterData(prev => ({
      ...prev,
      subject: 'Congratulations on Your Promotion!',
      keyPoints: '• Express happiness for their achievement\n• Mention specific qualities\n• Offer support for new role'
    }));
  };

  // Generate the letter (LLM-powered, placeholder for now)
  const generateLetter = async () => {
    setIsGenerating(true);
    setGeneratedLetter('');
    setTimeout(() => {
      setGeneratedLetter(
        `Dear ${letterData.recipient || '[Recipient]'},\n\nCongratulations on your well-deserved promotion! Your dedication and leadership have truly set you apart. I am confident you will excel in your new role.\n\nBest wishes,\n${letterData.sender || '[Your Name]'}`
      );
      setIsGenerating(false);
    }, 1200);
  };

  return (
    <div className="lettercreator-root">
      <header className="lettercreator-header">
        <h1>Letter Creator</h1>
        <p>Generate ideas and create personalized letters with AI guidance.</p>
        <button className="lettercreator-idea-btn" onClick={suggestIdea}>💡 Suggest a Letter Idea</button>
      </header>
      <main className="lettercreator-main">
        <form className="lettercreator-form" onSubmit={e => { e.preventDefault(); generateLetter(); }}>
          <div className="lettercreator-field-group">
            <label>Letter Type</label>
            <select
              value={letterData.letterType}
              onChange={e => handleInputChange('letterType', e.target.value)}
              placeholder={typeTip || 'Choose a letter type'}
            >
              <option value="" disabled>Choose a letter type</option>
              {letterTypes.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <FieldTipLLM field="letterType" value={letterData.letterType} />
          </div>
          <div className="lettercreator-field-group">
            <label>Recipient Name/Title</label>
            <input
              type="text"
              value={letterData.recipient}
              onChange={e => handleInputChange('recipient', e.target.value)}
              placeholder={recipientTip || 'e.g., Mr. Smith, HR Manager'}
            />
            <FieldTipLLM field="recipient" value={letterData.recipient} />
          </div>
          <div className="lettercreator-field-group">
            <label>Sender Name</label>
            <input
              type="text"
              value={letterData.sender}
              onChange={e => handleInputChange('sender', e.target.value)}
              placeholder={senderTip || 'e.g., Jane Doe'}
            />
            <FieldTipLLM field="sender" value={letterData.sender} />
          </div>
          <div className="lettercreator-field-group">
            <label>Subject/Topic</label>
            <input
              type="text"
              value={letterData.subject}
              onChange={e => handleInputChange('subject', e.target.value)}
              placeholder={subjectTip || 'e.g., Congratulations on Your Promotion'}
            />
            <FieldTipLLM field="subject" value={letterData.subject} />
          </div>
          <div className="lettercreator-field-group">
            <label>Tone</label>
            <select
              value={letterData.tone}
              onChange={e => handleInputChange('tone', e.target.value)}
              placeholder={toneTip || 'Choose a tone'}
            >
              <option value="" disabled>Choose a tone</option>
              {tones.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <FieldTipLLM field="tone" value={letterData.tone} />
          </div>
          <div className="lettercreator-field-group">
            <label>Key Points or Details</label>
            <textarea
              value={letterData.keyPoints}
              onChange={e => handleInputChange('keyPoints', e.target.value)}
              placeholder={keyPointsTip || '• Main message\n• Details to include'}
              rows={3}
            />
            <FieldTipLLM field="keyPoints" value={letterData.keyPoints} />
          </div>
          <div className="lettercreator-field-group">
            <label>Special Requests or Customization</label>
            <textarea
              value={letterData.specialRequests}
              onChange={e => handleInputChange('specialRequests', e.target.value)}
              placeholder={specialRequestsTip || 'e.g., Add a quote, mention a specific event'}
              rows={2}
            />
            <FieldTipLLM field="specialRequests" value={letterData.specialRequests} />
          </div>
          <button className="lettercreator-generate-btn" type="submit" disabled={isGenerating}>
            {isGenerating ? 'Generating...' : 'Generate Letter'}
          </button>
        </form>
        {generatedLetter && (
          <div className="lettercreator-preview">
            <h2>Preview</h2>
            <pre>{generatedLetter}</pre>
          </div>
        )}
      </main>
    </div>
  );
} 