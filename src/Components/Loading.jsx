import React from 'react';

const Loading = ({ message = 'Loading...', size = 'md' }) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12'
    };

    return (
        <div className="flex items-center justify-center h-64">
            <div className={`animate-spin rounded-full border-b-2 border-red-500 ${sizeClasses[size]}`}></div>
            <span className="ml-3 text-gray-600">{message}</span>
        </div>
    );
};

// Small inline loading spinner for buttons
export const InlineLoading = ({ size = 'sm' }) => {
    const sizeClasses = {
        xs: 'h-3 w-3',
        sm: 'h-4 w-4',
        md: 'h-5 w-5'
    };

    return (
        <div className={`animate-spin rounded-full border-b-2 border-current ${sizeClasses[size]}`}></div>
    );
};

export default Loading;
