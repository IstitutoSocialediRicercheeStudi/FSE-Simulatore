import React, { useState } from 'react';

function HintBadge({ text, position = 'bottom' }) {
  const [show, setShow] = useState(false);

  const tooltipPositions = {
    bottom: { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '8px' },
    top: { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '8px' },
    right: { top: '50%', left: '100%', transform: 'translateY(-50%)', marginLeft: '8px' },
    left: { top: '50%', right: '100%', transform: 'translateY(-50%)', marginRight: '8px' },
  };

  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', cursor: 'pointer' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onClick={() => setShow(!show)}
    >
      <svg
        style={{
          width: '16px', height: '16px', fill: '#0d6efd',
          transition: 'transform 0.2s ease',
          transform: show ? 'scale(1.2)' : 'scale(1)'
        }}
      >
        <use href="/sprites.svg#it-info-circle" />
      </svg>

      {show && (
        <div
          style={{
            position: 'absolute',
            ...tooltipPositions[position],
            backgroundColor: '#1c3654',
            color: 'white',
            padding: '0.6rem 0.8rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            lineHeight: 1.4,
            minWidth: '200px',
            maxWidth: '300px',
            zIndex: 9999,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            whiteSpace: 'normal',
            animation: 'hintFadeIn 0.15s ease'
          }}
        >
          {text}
        </div>
      )}

      <style>{`
        @keyframes hintFadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(4px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </span>
  );
}

export default HintBadge;
