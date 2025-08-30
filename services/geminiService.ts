
import { GoogleGenAI, Type } from "@google/genai";
import type { Sentiment, Recommendation, RecommendationParams } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getSentimentAnalysis(ticker: string, companyName: string): Promise<Sentiment> {
    const prompt = `
        Act as a senior financial news analyst for the Indonesian stock market.
        Your task is to provide a sentiment analysis for ${companyName} (${ticker}).
        
        1. Generate a brief, plausible, and hypothetical summary of recent news about the company. The news should be relevant to its financial performance or market position.
        2. Based on this summary, determine the overall sentiment.
        3. Provide a short justification for your sentiment analysis.

        The output must be a JSON object.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        sentiment: { 
                            type: Type.STRING,
                            enum: ['Positive', 'Neutral', 'Negative'],
                            description: 'The overall sentiment.'
                        },
                        summary: { 
                            type: Type.STRING,
                            description: 'A brief summary of recent hypothetical news.'
                        },
                        justification: { 
                            type: Type.STRING,
                            description: 'A short reason for the sentiment classification.'
                        },
                    },
                    required: ["sentiment", "summary", "justification"],
                },
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as Sentiment;

    } catch (error) {
        console.error("Error in getSentimentAnalysis:", error);
        throw new Error("Failed to get sentiment analysis from AI. Please check the console for details.");
    }
}


export async function getInvestmentRecommendation(params: RecommendationParams): Promise<Recommendation> {
    const { ticker, companyName, fundamentalData, sentiment } = params;

    const prompt = `
        You are an expert AI investment advisor specializing in the Indonesian stock market (IDX).
        Your task is to generate a comprehensive investment recommendation for ${companyName} (${ticker}) based on the data provided.

        **Input Data:**
        - **Company:** ${companyName} (${ticker})
        - **Fundamental Metrics:**
          - EPS: ${fundamentalData.eps}
          - PER: ${fundamentalData.per}
          - PBV: ${fundamentalData.pbv}
          - ROE: ${fundamentalData.roe}%
          - DER: ${fundamentalData.der}
          - Dividend Yield: ${fundamentalData.dividendYield}%
        - **News Sentiment:** ${sentiment.sentiment}
          - Justification: ${sentiment.justification}
        - **Technical Snapshot:** Assume the stock has been in a consolidation phase recently after a moderate uptrend, with RSI around 55. The price is currently trading slightly above its 50-day moving average.

        **Your Task:**
        Provide a detailed analysis and a final investment recommendation. The output must be a JSON object with the following structure.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        recommendation: {
                            type: Type.STRING,
                            enum: ['Buy', 'Hold', 'Sell'],
                            description: 'The final investment recommendation.'
                        },
                        confidence: {
                            type: Type.STRING,
                            enum: ['High', 'Medium', 'Low'],
                            description: 'The confidence level in this recommendation.'
                        },
                        summary: {
                            type: Type.STRING,
                            description: 'A concise executive summary of the recommendation and key drivers.'
                        },
                        fundamentalAnalysis: {
                            type: Type.STRING,
                            description: 'A detailed analysis based on the provided fundamental metrics.'
                        },
                        technicalAnalysis: {
                            type: Type.STRING,
                            description: 'A brief analysis of the technical snapshot provided.'
                        },
                        sentimentAnalysis: {
                            type: Type.STRING,
                            description: 'How the news sentiment influences the overall recommendation.'
                        },
                        riskDisclaimer: {
                            type: Type.STRING,
                            description: 'A standard risk disclaimer for this AI-generated report.'
                        }
                    },
                    required: ["recommendation", "confidence", "summary", "fundamentalAnalysis", "technicalAnalysis", "sentimentAnalysis", "riskDisclaimer"],
                },
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as Recommendation;
    } catch (error) {
        console.error("Error in getInvestmentRecommendation:", error);
        throw new Error("Failed to get investment recommendation from AI. Please check the console for details.");
    }
}
