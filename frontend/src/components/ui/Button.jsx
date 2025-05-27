import React from 'react';

const Button = ({ variant = 'primary', size = 'md', onClick, children, className = '', disabled = false }) => {
  const baseClasses = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-[#158fd4] hover:bg-[#0e4a80] text-white focus:ring-[#9daecc]',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-[#9daecc]',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-[#9daecc]',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-[#9daecc]',
    secondary: 'bg-[#0e4a80] hover:bg-[#01050b] text-[#ffffff] focus:ring-[#9daecc]'
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;