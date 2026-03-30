import React, { useState, useRef, useMemo } from 'react';

const Editor: React.FC = () => {
  const [text, setText] = useState('');
  const [humanScore, setHumanScore] = useState(100);
  const lastKeyTime = useRef<number>(Date.now());
  const intervals = useRef<number[]>([]);

  //checks if someone is typing like a bot or a human by analyzing the rhythm of their keystrokes
  const analyzeRhythm = (newInterval: number) => {
    // We only care about fast typing
    if (newInterval > 0 && newInterval < 1000) {
      intervals.current.push(newInterval);
    }

    //after we have enough data, we analyze the rhythm
    if (intervals.current.length > 10) {
      const recent = intervals.current.slice(-10);
      const avg = recent.reduce((a, b) => a + b) / 10;
      //How much the speed changes between keys
      const variance = recent.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / 10;
      
      // If variance is super low, drop the score
      const newScore = variance < 30 ? Math.max(0, humanScore - 10) : Math.min(100, humanScore + 5);
      setHumanScore(Math.round(newScore));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const currentTime = Date.now();
    const duration = currentTime - lastKeyTime.current;
    
    analyzeRhythm(duration);
    lastKeyTime.current = currentTime;
  };

  // Calculate word count for the footer
  const wordCount = useMemo(() => {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  }, [text]);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <span>VI-NOTES</span>
        <span style={styles.badge}>ENCRYPTION ACTIVE</span>
      </header>
      
      <main style={styles.main}>
        <textarea
          style={styles.textarea}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write your mind...."
          spellCheck={false}
          autoFocus
        />
      </main>

      <footer style={styles.footer}>
        <div style={styles.statBox}>
          <span style={styles.statLabel}>WORD COUNT</span>
          <span style={styles.statValue}>{wordCount}</span>
        </div>
        
        <div style={styles.statBox}>
          <span style={styles.statLabel}>HUMAN SIGNATURE</span>
          <span style={{
            ...styles.statValue, 
            color: humanScore < 50 ? '#eb4d4b' : '#6ab04c' 
          }}>
            {humanScore}%
          </span>
        </div>

        <div style={styles.statusIndicator}>
          <div style={{
            ...styles.dot, 
            backgroundColor: humanScore < 50 ? '#eb4d4b' : '#6ab04c'
          }} />
          {humanScore < 50 ? 'Low Authenticity Detected' : 'Verified Human Input'}
        </div>
      </footer>
    </div>
  );
};

//UI Styles
const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column' as 'column',
    backgroundColor: '#5d9cca',
    color: '#2f3542',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px 40px',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '1.5px',
    color: '#a4b0be',
    borderBottom: '1px solid #f1f2f6',
  },
  badge: {
    color: '#747d8c',
    border: '1px solid #dfe4ea',
    padding: '2px 8px',
    borderRadius: '4px',
  },
  main: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    padding: '60px 20px',
    overflowY: 'auto' as 'auto',
  },
  textarea: {
    width: '100%',
    maxWidth: '750px',
    fontSize: '20px',
    lineHeight: '1.8',
    border: 'none',
    outline: 'none',
    resize: 'none' as 'none',
    color: '#2f3542',
    fontFamily: '"Georgia", serif',
    backgroundColor: 'transparent',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    gap: '50px',
    padding: '20px 40px',
    backgroundColor: '#f8f9fa',
    borderTop: '1px solid #f1f2f6',
  },
  statBox: {
    display: 'flex',
    flexDirection: 'column' as 'column',
  },
  statLabel: {
    fontSize: '10px',
    fontWeight: 800,
    color: '#a4b0be',
    marginBottom: '2px',
  },
  statValue: {
    fontSize: '18px',
    fontWeight: 700,
    fontFamily: 'monospace',
  },
  statusIndicator: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    fontWeight: 500,
    color: '#747d8c',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  }
};

export default Editor;