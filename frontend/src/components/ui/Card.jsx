import React from 'react';

export const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`rounded-xl border border-slate-200/85 bg-white shadow-sm dark:border-slate-800/80 dark:bg-slate-900/40 p-5 transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
