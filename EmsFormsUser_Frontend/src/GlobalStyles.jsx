import React from 'react';

const GlobalStyles = () => {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
      
      * {
        font-family: 'Inter', sans-serif;
      }
      
      .accent-orange {
        color: #ffffff;
      }
      
      .bg-accent-orange {
        background-color: #ffffff;
        color: #000000;
      }
      
      .bg-accent-yellow {
        background-color: #e4e4e7;
        color: #000000;
      }
      
      .border-accent-orange {
        border-color: #ffffff;
      }
    `}</style>
  );
};

export default GlobalStyles;
