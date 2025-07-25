import { useState, useEffect, useRef } from 'react';
import { getApiUrl } from '../config/api';

// Debounce utility
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// Hook to fetch LLM tip for a field
export function useFieldTipLLM(field, value) {
  const [tip, setTip] = useState('');
  const [loading, setLoading] = useState(false);
  const debouncedValue = useDebounce(value, 500);
  const lastRequest = useRef(0);

  useEffect(() => {
    // Always fetch, even if debouncedValue is empty
    let isCurrent = true;
    setLoading(true);
    const reqId = Date.now();
    lastRequest.current = reqId;
    fetch(getApiUrl('field-tip'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field, value: debouncedValue }),
    })
      .then(res => res.json())
      .then(data => {
        if (isCurrent && lastRequest.current === reqId) {
          setTip(data.tip || '');
          setLoading(false);
        }
      })
      .catch(() => {
        if (isCurrent && lastRequest.current === reqId) {
          setTip('');
          setLoading(false);
        }
      });
    return () => { isCurrent = false; };
  }, [field, debouncedValue]);

  return { tip, loading };
}

// Component to show the tip below a field
export function FieldTipLLM({ field, value }) {
  const { tip, loading } = useFieldTipLLM(field, value);
  if (!value) return null;
  return (
    <div className="blogcreator-field-tip">
      {loading ? <span>Loading tip...</span> : tip}
    </div>
  );
} 