
import React from 'react';
import type { Sentiment } from '../types';
import { AnalysisCard } from './AnalysisCard';
import { Newspaper } from 'lucide-react';

interface SentimentAnalysisProps {
    sentiment: Sentiment;
}

const getSentimentClasses = (sentiment: 'Positive' | 'Neutral' | 'Negative') => {
    switch (sentiment) {
        case 'Positive':
            return 'bg-green-500/20 text-green-300 border-green-500';
        case 'Negative':
            return 'bg-red-500/20 text-red-300 border-red-500';
        default:
            return 'bg-yellow-500/20 text-yellow-300 border-yellow-500';
    }
};

export const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({ sentiment }) => {
    return (
        <AnalysisCard title="News Sentiment" icon={<Newspaper className="h-6 w-6 text-cyan-400" />}>
            <div className="space-y-4">
                <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getSentimentClasses(sentiment.sentiment)}`}>
                        {sentiment.sentiment}
                    </span>
                    <p className="text-sm italic text-gray-400">{sentiment.justification}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-200 mb-1">News Summary:</h4>
                    <p className="text-sm leading-relaxed">{sentiment.summary}</p>
                </div>
            </div>
        </AnalysisCard>
    );
};
