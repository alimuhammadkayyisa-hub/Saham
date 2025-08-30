
import React from 'react';
import type { FundamentalData } from '../types';
import { AnalysisCard } from './AnalysisCard';
import { BookOpen } from 'lucide-react';

interface FundamentalDataProps {
    data: FundamentalData;
}

const Metric: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="flex justify-between items-baseline py-2 border-b border-gray-700 last:border-b-0">
        <dt className="text-sm font-medium text-gray-400">{label}</dt>
        <dd className="text-md font-semibold text-white">{value}</dd>
    </div>
);

export const FundamentalDataCard: React.FC<FundamentalDataProps> = ({ data }) => {
    return (
        <AnalysisCard title="Fundamental Data" icon={<BookOpen className="h-6 w-6 text-cyan-400" />}>
            <dl className="space-y-2">
                <Metric label="EPS" value={data.eps} />
                <Metric label="PER" value={data.per.toFixed(2)} />
                <Metric label="PBV" value={data.pbv.toFixed(2)} />
                <Metric label="ROE" value={`${data.roe.toFixed(2)}%`} />
                <Metric label="DER" value={data.der.toFixed(2)} />
                <Metric label="Dividend Yield" value={`${data.dividendYield.toFixed(2)}%`} />
            </dl>
        </AnalysisCard>
    );
};
