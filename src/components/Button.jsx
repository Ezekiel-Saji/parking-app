import React from 'react';
import '../styles/variables.css'; // Ensure variables are loaded if using modular CSS, though global import in main works too.

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.75rem 1.5rem',
    borderRadius: 'var(--radius-md)',
    fontWeight: '600',
    border: 'none',
    transition: 'background-color var(--transition-fast), transform var(--transition-fast)',
    fontSize: '0.95rem',
  };

  const variants = {
    primary: {
      backgroundColor: 'var(--color-primary)',
      color: 'white',
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
    },
    success: {
        backgroundColor: 'var(--color-success)',
        color: 'white'
    }
  };

  const style = { ...baseStyle, ...variants[variant] };

  return (
    <button style={style} className={className} {...props}>
      {children}
    </button>
  );
};

export default Button;
