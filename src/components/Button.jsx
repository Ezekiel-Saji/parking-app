import React from 'react';
import '../styles/variables.css';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.875rem 1.75rem',
    borderRadius: 'var(--radius-xl)', // Pill shape
    fontWeight: '600',
    border: 'none',
    transition: 'all var(--transition-fast)',
    fontSize: '0.95rem',
    cursor: 'pointer',
    letterSpacing: '0.025em',
  };

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)',
      color: 'white',
      boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.3)',
    },
    secondary: {
      backgroundColor: 'var(--color-secondary)',
      color: 'var(--color-text-primary)',
    },
    outline: {
      backgroundColor: 'transparent',
      border: '2px solid var(--color-primary)',
      color: 'var(--color-primary)',
    },
    danger: {
      backgroundColor: 'var(--color-danger)',
      color: 'white',
      boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.3)',
    },
    success: {
      background: 'linear-gradient(135deg, var(--color-success) 0%, #059669 100%)',
      color: 'white',
      boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.3)',
    }
  };

  // Hover transform effect would strictly need styled-components or CSS class, 
  // but we can assume the transition property handles color changes well.

  const style = { ...baseStyle, ...variants[variant] };

  return (
    <button style={style} className={className} {...props}>
      {children}
    </button>
  );
};

export default Button;
