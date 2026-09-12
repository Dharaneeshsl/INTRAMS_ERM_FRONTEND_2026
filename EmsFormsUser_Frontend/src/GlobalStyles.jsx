import React from 'react';

const GlobalStyles = () => {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap');
      
      :root {
        color-scheme: dark;
        --bg-abyss: #000000;
        --ui-panel: #0b0b0b;
        --ui-border: #2a2a2a;
        --ui-white: #ffffff;
        --ui-muted: #a3a3a3;
      }

      * {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        box-sizing: border-box;
      }
      
      h1, h2, h3, .font-heading {
        font-family: 'Outfit', 'Inter', sans-serif;
      }

      body {
        background-color: var(--bg-abyss);
        color: var(--ui-white);
        margin: 0;
        padding: 0;
        -webkit-font-smoothing: antialiased;
      }
      
      .ocean-gradient-bg {
        background: var(--bg-abyss);
      }

      .horizon-glow {
        color: var(--ui-white);
      }

      .glass-card {
        background: var(--ui-panel);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid var(--ui-border);
      }

      .glass-card:hover {
        border-color: #666666;
        box-shadow: 0 10px 30px -10px rgba(255, 255, 255, 0.16);
      }

      .btn-horizon-primary {
        background: var(--ui-white);
        color: var(--bg-abyss);
        font-weight: 700;
        border-radius: 0.75rem;
        box-shadow: 0 10px 25px -5px rgba(255, 255, 255, 0.2);
        transition: all 0.2s ease-in-out;
      }
      .btn-horizon-primary:hover {
        background: #d4d4d4;
        transform: translateY(-1px);
      }

      .input-horizon {
        background-color: var(--bg-abyss);
        border: 1px solid var(--ui-border);
        border-radius: 0.75rem;
        color: #ffffff;
        padding: 0.75rem 1rem;
        outline: none;
        transition: all 0.2s ease-in-out;
      }
      .input-horizon:focus {
        border-color: var(--ui-white);
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.18);
      }

      /* Custom Scrollbar for Horizon Aesthetic */
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      ::-webkit-scrollbar-track {
        background: #000000;
      }
      ::-webkit-scrollbar-thumb {
        background: #333333;
        border-radius: 4px;
        border: 1px solid var(--ui-border);
      }
      ::-webkit-scrollbar-thumb:hover {
        background: #666666;
      }
    `}</style>
  );
};

export default GlobalStyles;
