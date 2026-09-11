import React from 'react';

const GlobalStyles = () => {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap');
      
      :root {
        color-scheme: dark;
        --bg-abyss: #020617;
        --ocean-slate: #0f172a;
        --ocean-blue: #0284c7;
        --horizon-sky: #38bdf8;
        --bioluminescence: #818cf8;
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
        color: #f8fafc;
        margin: 0;
        padding: 0;
        -webkit-font-smoothing: antialiased;
      }
      
      .ocean-gradient-bg {
        background: radial-gradient(circle at 50% -20%, #0369a1 0%, #020617 75%);
      }

      .horizon-glow {
        background: linear-gradient(90deg, #38bdf8 0%, #818cf8 50%, #06b6d4 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .glass-card {
        background: rgba(15, 23, 42, 0.75);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(56, 189, 248, 0.15);
      }

      .glass-card:hover {
        border-color: rgba(56, 189, 248, 0.4);
        box-shadow: 0 10px 30px -10px rgba(56, 189, 248, 0.2);
      }

      .btn-horizon-primary {
        background: linear-gradient(90deg, #0284c7 0%, #4f46e5 100%);
        color: #ffffff;
        font-weight: 700;
        border-radius: 0.75rem;
        box-shadow: 0 10px 25px -5px rgba(2, 132, 199, 0.3);
        transition: all 0.2s ease-in-out;
      }
      .btn-horizon-primary:hover {
        background: linear-gradient(90deg, #38bdf8 0%, #6366f1 100%);
        transform: translateY(-1px);
      }

      .input-horizon {
        background-color: rgba(2, 6, 23, 0.8);
        border: 1px solid rgba(51, 65, 85, 0.8);
        border-radius: 0.75rem;
        color: #ffffff;
        padding: 0.75rem 1rem;
        outline: none;
        transition: all 0.2s ease-in-out;
      }
      .input-horizon:focus {
        border-color: #38bdf8;
        box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2);
      }

      /* Custom Scrollbar for Horizon Aesthetic */
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      ::-webkit-scrollbar-track {
        background: #020617;
      }
      ::-webkit-scrollbar-thumb {
        background: #1e293b;
        border-radius: 4px;
        border: 1px solid rgba(56, 189, 248, 0.2);
      }
      ::-webkit-scrollbar-thumb:hover {
        background: #0284c7;
      }
    `}</style>
  );
};

export default GlobalStyles;
