import React from 'react';

const Card = ({ children, className = '', noPadding = false, ...props }) => {
    const style = {
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--glass-backdrop)',
        WebkitBackdropFilter: 'var(--glass-backdrop)', // Safari support
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--glass-shadow)',
        border: 'var(--glass-border)',
        padding: noPadding ? '0' : 'var(--space-6)',
        ...props.style
    };

    return (
        <div style={style} className={className} {...props}>
            {children}
        </div>
    );
};

export default Card;
