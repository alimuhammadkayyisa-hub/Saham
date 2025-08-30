
import React from 'react';
import { ResponsiveContainer, ComposedChart, XAxis, YAxis, Tooltip, Legend, Candlestick, Line, Area, CartesianGrid } from 'recharts';
import type { ChartData } from '../types';
import { AnalysisCard } from './AnalysisCard';
import { BarChart2 } from 'lucide-react';

interface TechnicalChartProps {
    data: ChartData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const ohlc = payload[0].payload.price;
        const rsi = payload[0].payload.rsi;
        return (
            <div className="p-3 bg-gray-700 border border-gray-600 rounded-lg shadow-xl text-sm">
                <p className="font-bold text-white">{`Date: ${label}`}</p>
                <p className="text-green-400">{`Open: ${ohlc[0]}`}</p>
                <p className="text-green-400">{`High: ${ohlc[1]}`}</p>
                <p className="text-red-400">{`Low: ${ohlc[2]}`}</p>
                <p className="text-white">{`Close: ${ohlc[3]}`}</p>
                <p className="text-cyan-400">{`RSI: ${rsi}`}</p>
            </div>
        );
    }
    return null;
};


export const TechnicalChart: React.FC<TechnicalChartProps> = ({ data }) => {
    const yDomain = [
        Math.min(...data.map(d => d.price[2])) * 0.98,
        Math.max(...data.map(d => d.price[1])) * 1.02,
    ];

    return (
        <AnalysisCard title="Technical Analysis" icon={<BarChart2 className="h-6 w-6 text-cyan-400" />} className="h-[500px]">
             <div className="h-[420px] w-full">
                <ResponsiveContainer width="100%" height="70%">
                    <ComposedChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                        <XAxis dataKey="date" tick={{ fill: '#A0AEC0', fontSize: 12 }} />
                        <YAxis domain={yDomain} tick={{ fill: '#A0AEC0', fontSize: 12 }} orientation="right" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Candlestick dataKey="price" fill="#2D3748" stroke="#A0AEC0" upColor="#48BB78" downColor="#F56565" name="Price" />
                    </ComposedChart>
                </ResponsiveContainer>
                <ResponsiveContainer width="100%" height="30%">
                    <ComposedChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                        <XAxis dataKey="date" tick={{ fill: '#A0AEC0', fontSize: 12 }} hide={true} />
                        <YAxis domain={[0, 100]} tick={{ fill: '#A0AEC0', fontSize: 12 }} orientation="right" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <defs>
                            <linearGradient id="colorRsi" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2B6CB0" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#2B6CB0" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="rsi" stroke="#319795" fillOpacity={1} fill="url(#colorRsi)" name="RSI" />
                        <Line type="monotone" dot={false} dataKey={() => 70} stroke="#F56565" strokeDasharray="5 5" name="Overbought" />
                        <Line type="monotone" dot={false} dataKey={() => 30} stroke="#48BB78" strokeDasharray="5 5" name="Oversold" />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </AnalysisCard>
    );
};
