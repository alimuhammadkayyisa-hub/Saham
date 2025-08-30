
import React from 'react';
import type { Recommendation as RecommendationType } from '../types';
import { AnalysisCard } from './AnalysisCard';
import { Target } from 'lucide-react';

interface RecommendationProps {
    recommendation: RecommendationType;
}

const getRecommendationClasses = (rec: 'Buy' | 'Hold' | 'Sell') => {
    switch (rec) {
        case 'Buy':
            return 'bg-green-500 text-white';
        case 'Sell':
            return 'bg-red-500 text-white';
        default:
            return 'bg-yellow-500 text-gray-900';
    }
};

const Section: React.FC<{title: string, content: string}> = ({title, content}) => (
    <div>
        <h4 className="font-bold text-lg text-gray-100 mb-2 border-b border-gray-700 pb-1">{title}</h4>
        <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{content}</p>
    </div>
);

export const Recommendation: React.FC<RecommendationProps> = ({ recommendation }) => {
    return (
        <AnalysisCard title="AI Investment Recommendation" icon={<Target className="h-6 w-6 text-cyan-400" />}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 p-4 bg-gray-900/50 rounded-lg">
                <div className="mb-4 md:mb-0">
                    <span className="text-gray-400 text-sm">Recommendation</span>
                    <p className={`text-4xl font-extrabold ${getRecommendationClasses(recommendation.recommendation).split(' ')[1]}`}>
                        {recommendation.recommendation.toUpperCase()}
                    </p>
                </div>
                <div>
                    <span className="text-gray-400 text-sm">Confidence Level</span>
                    <p className="text-2xl font-bold">{recommendation.confidence}</p>
                </div>
            </div>
            
            <div className="space-y-6">
                <Section title="Executive Summary" content={recommendation.summary} />
                <Section title="Fundamental Analysis" content={recommendation.fundamentalAnalysis} />
                <Section title="Technical Analysis" content={recommendation.technicalAnalysis} />
                <Section title="Sentiment Analysis" content={recommendation.sentimentAnalysis} />
                <Section title="Risks & Disclaimer" content={recommendation.riskDisclaimer} />
            </div>
        </AnalysisCard>
    );
};
