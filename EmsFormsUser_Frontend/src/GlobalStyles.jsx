import React from 'react';

const GlobalStyles = () => {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
      
      :root {
        color-scheme: dark;
      }

      * {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        box-sizing: border-box;
      }
      
      body {
        background-color: #000000;
        color: #ffffff;
        margin: 0;
        padding: 0;
        -webkit-font-smoothing: antialiased;
      }
      
      .accent-orange {
        color: #ffffff;
      }
      
      .bg-accent-orange {
        background-color: #ffffff;
        color: #000000;
      }
      
      .bg-accent-yellow {
        background-color: #d4d4d8;
        color: #000000;
      }
      
      .border-accent-orange {
        border-color: #ffffff;
      }

      /* Custom Scrollbar for Dark Aesthetic */
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      ::-webkit-scrollbar-track {
        background: #09090b;
      }
      ::-webkit-scrollbar-thumb {
        background: #27272a;
        border-radius: 4px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: #3f3f46;
      }
    `}</style>
  );
};

export default GlobalStyles;
