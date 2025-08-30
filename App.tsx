
import React, { useState, useCallback, useRef } from 'react';
import { SearchBar } from './components/SearchBar';
import { Loader } from './components/Loader';
import { FundamentalDataCard } from './components/FundamentalDataCard';
import { TechnicalChart } from './components/TechnicalChart';
import { SentimentAnalysis } from './components/SentimentAnalysis';
import { Recommendation } from './components/Recommendation';
import { ReportDownloader } from './components/ReportDownloader';
import { getSentimentAnalysis, getInvestmentRecommendation } from './services/geminiService';
import { getMockFundamentalData, getMockChartData } from './services/mockDataService';
import type { AnalysisResult, FundamentalData, ChartData, Sentiment, Recommendation as RecommendationType } from './types';
import { Briefcase, BarChart2, Newspaper, Target } from 'lucide-react';

const App: React.FC = () => {
    const [ticker, setTicker] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const reportRef = useRef<HTMLDivElement>(null);

    const handleSearch = useCallback(async (searchTicker: string) => {
        if (!searchTicker) {
            setError('Please enter a stock ticker.');
            return;
        }
        setLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const upperTicker = searchTicker.toUpperCase();
            
            // Step 1 & 2: Get Mock Fundamental and Chart Data
            const fundamentalData: FundamentalData = getMockFundamentalData(upperTicker);
            const chartData: ChartData[] = getMockChartData();

            // Step 3: Get Sentiment Analysis from Gemini
            const sentiment: Sentiment = await getSentimentAnalysis(upperTicker, fundamentalData.companyName);

            // Step 4: Get Investment Recommendation from Gemini
            const recommendation: RecommendationType = await getInvestmentRecommendation({
                ticker: upperTicker,
                companyName: fundamentalData.companyName,
                fundamentalData,
                sentiment,
            });
            
            setAnalysisResult({
                ticker: upperTicker,
                companyName: fundamentalData.companyName,
                fundamentalData,
                chartData,
                sentiment,
                recommendation,
            });

        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred. Check your API key and try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    const WelcomeMessage = () => (
        <div className="text-center p-8">
            <h2 className="text-3xl font-bold text-white mb-4">AI Stock Research Assistant</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
                Enter a stock ticker for an Indonesian company (e.g., BBCA, TLKM, BBRI) to get a comprehensive analysis powered by AI. We'll provide fundamental data, technical charts, news sentiment, and an investment recommendation.
            </p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans">
            <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10 shadow-lg">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center space-x-2">
                           <Briefcase className="h-8 w-8 text-cyan-400"/>
                           <h1 className="text-xl font-bold">AI Stock Research</h1>
                        </div>
                        <div className="w-full max-w-md">
                           <SearchBar onSearch={handleSearch} loading={loading} setTicker={setTicker} ticker={ticker}/>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                {loading && <Loader />}
                {error && <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</div>}
                
                {!loading && !analysisResult && !error && <WelcomeMessage />}

                {analysisResult && (
                    <div ref={reportRef} className="bg-gray-900 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-4xl font-extrabold">{analysisResult.companyName}</h2>
                                <p className="text-2xl text-gray-400">{analysisResult.ticker}</p>
                            </div>
                            <ReportDownloader
                                reportRef={reportRef}
                                ticker={analysisResult.ticker}
                                fundamentalData={analysisResult.fundamentalData}
                                fullReportText={generateReportText(analysisResult)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            <div className="lg:col-span-2 xl:col-span-3">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-3">
                                        <Recommendation recommendation={analysisResult.recommendation} />
                                    </div>
                                    <div className="lg:col-span-3">
                                        <TechnicalChart data={analysisResult.chartData} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <FundamentalDataCard data={analysisResult.fundamentalData} />
                                <SentimentAnalysis sentiment={analysisResult.sentiment} />
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

const generateReportText = (result: AnalysisResult): string => {
    return `
STOCK RESEARCH REPORT
=======================

Company: ${result.companyName} (${result.ticker})
Date: ${new Date().toLocaleDateString()}

---

EXECUTIVE SUMMARY
Recommendation: ${result.recommendation.recommendation}
Confidence: ${result.recommendation.confidence}

${result.recommendation.summary}

---

FUNDAMENTAL ANALYSIS
${result.recommendation.fundamentalAnalysis}

Key Metrics:
- EPS: ${result.fundamentalData.eps}
- PER: ${result.fundamentalData.per}

- PBV: ${result.fundamentalData.pbv}
- ROE: ${result.fundamentalData.roe}%
- DER: ${result.fundamentalData.der}
- Dividend Yield: ${result.fundamentalData.dividendYield}%

---

TECHNICAL ANALYSIS
${result.recommendation.technicalAnalysis}
(See charts for visual details)

---

NEWS SENTIMENT ANALYSIS
Sentiment: ${result.sentiment.sentiment}
${result.recommendation.sentimentAnalysis}

Summary: ${result.sentiment.summary}

---

RISKS & DISCLAIMER
${result.recommendation.riskDisclaimer}
This report is generated by an AI assistant and is for informational purposes only. It does not constitute financial advice. Always do your own research before making any investment decisions.
    `;
};


export default App;
