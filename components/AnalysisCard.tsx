
import React from 'react';

interface AnalysisCardProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({ title, icon, children, className }) => {
    return (
        <div className={`bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-700/50 transition-all duration-300 hover:border-cyan-500/50 ${className}`}>
            <div className="flex items-center mb-4">
                <div className="p-2 bg-gray-700 rounded-lg mr-4">
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-white">{title}</h3>
            </div>
            <div className="text-gray-300">
                {children}
            </div>
        </div>
    );
};
