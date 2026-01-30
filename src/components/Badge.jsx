import React from 'react';

const Badge = ({ children, variant = 'info', className = '' }) => {
    const baseStyle = {
        display: 'inline-block',
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    };

    const variants = {
        info: { backgroundColor: '#ebf8ff', color: '#2b6cb0' },
        success: { backgroundColor: '#f0fff4', color: '#2f855a' },
        warning: { backgroundColor: '#fffff0', color: '#b7791f' },
        danger: { backgroundColor: '#fff5f5', color: '#c53030' },
    };

    const style = { ...baseStyle, ...(variants[variant] || variants.info) };

    return (
        <span style={style} className={className}>
            {children}
        </span>
    );
};

export default Badge;
