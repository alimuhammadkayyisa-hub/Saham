
export interface FundamentalData {
    companyName: string;
    eps: number;
    per: number;
    pbv: number;
    roe: number;
    der: number;
    dividendYield: number;
}

export interface ChartData {
    date: string;
    price: [number, number, number, number]; // OHLC: Open, High, Low, Close
    rsi: number;
}

export interface Sentiment {
    sentiment: 'Positive' | 'Neutral' | 'Negative';
    summary: string;
    justification: string;
}

export interface Recommendation {
    recommendation: 'Buy' | 'Hold' | 'Sell';
    confidence: 'High' | 'Medium' | 'Low';
    summary: string;
    fundamentalAnalysis: string;
    technicalAnalysis: string;
    sentimentAnalysis: string;
    riskDisclaimer: string;
}

export interface AnalysisResult {
    ticker: string;
    companyName: string;
    fundamentalData: FundamentalData;
    chartData: ChartData[];
    sentiment: Sentiment;
    recommendation: Recommendation;
}

export interface RecommendationParams {
    ticker: string;
    companyName: string;
    fundamentalData: FundamentalData;
    sentiment: Sentiment;
}
