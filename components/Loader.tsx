
import React from 'react';

export const Loader: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500"></div>
            <p className="mt-4 text-lg text-gray-300">AI is analyzing, please wait...</p>
        </div>
    );
};
