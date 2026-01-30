import React from 'react';

const Input = React.forwardRef(({ label, className = '', ...props }, ref) => {
    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
        marginBottom: 'var(--space-4)',
    };

    const labelStyle = {
        color: 'var(--color-text-secondary)',
        fontSize: '0.875rem',
        fontWeight: '500',
    };

    const inputStyle = {
        padding: '0.75rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-secondary-hover)',
        fontSize: '1rem',
        outline: 'none',
        transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
        width: '100%',
    };

    return (
        <div style={containerStyle}>
            {label && <label style={labelStyle}>{label}</label>}
            <input
                ref={ref}
                style={inputStyle}
                className={className}
                {...props}
                onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-primary)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(66, 153, 225, 0.2)';
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = 'var(--color-secondary-hover)';
                    e.target.style.boxShadow = 'none';
                }}
            />
        </div>
    );
});

export default Input;
