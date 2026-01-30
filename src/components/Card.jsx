import React from 'react';

const Card = ({ children, className = '', noPadding = false, ...props }) => {
    const style = {
        backgroundColor: 'var(--color-bg-card)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        padding: noPadding ? '0' : 'var(--space-6)',
        border: '1px solid var(--color-secondary)',
        ...props.style
    };

    return (
        <div style={style} className={className} {...props}>
            {children}
        </div>
    );
};

export default Card;
