import React, { useState, useEffect, useRef } from 'react';

const Editor: React.FC = () => {
  const [text, setText] = useState('');
  const lastKeyTime = useRef<number>(Date.now());

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const currentTime = Date.now();
    const duration = currentTime - lastKeyTime.current;
    
    // Vi-Notes Core Logic: Capture the rhythm, not the letter
    console.log(`Key pressed. Interval since last: ${duration}ms`);
    
    lastKeyTime.current = currentTime;
  };

  return (
    <div style={styles.wrapper}>
      <textarea
        style={styles.textarea}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Start writing your authentic thoughts..."
        spellCheck={false}
        autoFocus
      />
      <div style={styles.footer}>
        <span>Character Count: {text.length}</span>
        <span>| Vi-Notes Monitoring Active</span>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column' as 'column',
    backgroundColor: '#f9f9f9',
    padding: '40px'
  },
  textarea: {
    flex: 1,
    fontSize: '18px',
    lineHeight: '1.6',
    border: 'none',
    outline: 'none',
    resize: 'none' as 'none',
    backgroundColor: 'transparent',
    fontFamily: '"Georgia", serif',
    color: '#333',
  },
  footer: {
    paddingTop: '20px',
    borderTop: '1px solid #eee',
    color: '#888',
    fontSize: '12px',
    display: 'flex',
    justifyContent: 'space-between'
  }
};

export default Editor;