import React from 'react';
import FlashDotsBackground from '../Components/FlashDotsBackground';

/**
 * Demo page showing the FlashDotsBackground behind simple content.
 */
const FlashDotsPage: React.FC = () => {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#0d1117', color: '#fff' }}>
      <FlashDotsBackground />
      <main style={{ position: 'relative', zIndex: 1, padding: '4rem 2rem', maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 600 }}>Flash Dots Background</h1>
        <p style={{ lineHeight: 1.6, fontSize: '1.1rem', maxWidth: 640 }}>
          This is a demo of an animated flashing dots background component. The dots fade in and out at
          randomized intervals, creating a subtle starfield-like ambience. The animation respects the
          user&apos;s reduced motion preference. In a future enhancement we can add interactive click
          bursts or convert this to a canvas for very large dot counts.
        </p>
      </main>
    </div>
  );
};

export default FlashDotsPage;
