
import type { FundamentalData, ChartData } from '../types';

const companyData: { [key: string]: { name: string; base: FundamentalData } } = {
    'BBCA': {
        name: 'PT Bank Central Asia Tbk',
        base: { companyName: 'PT Bank Central Asia Tbk', eps: 250, per: 24.5, pbv: 4.8, roe: 21.5, der: 1.2, dividendYield: 2.1 }
    },
    'BBRI': {
        name: 'PT Bank Rakyat Indonesia Tbk',
        base: { companyName: 'PT Bank Rakyat Indonesia Tbk', eps: 450, per: 15.2, pbv: 2.5, roe: 18.9, der: 1.5, dividendYield: 3.5 }
    },
    'TLKM': {
        name: 'PT Telkom Indonesia Tbk',
        base: { companyName: 'PT Telkom Indonesia Tbk', eps: 180, per: 18.1, pbv: 2.9, roe: 16.2, der: 0.8, dividendYield: 4.2 }
    },
    'DEFAULT': {
        name: 'PT Contoh Sejahtera Tbk',
        base: { companyName: 'PT Contoh Sejahtera Tbk', eps: 150, per: 20.0, pbv: 3.0, roe: 15.0, der: 1.0, dividendYield: 3.0 }
    }
};

// Function to add a bit of randomness to make data seem more dynamic
const randomize = (value: number, percent: number = 0.1): number => {
    const amount = value * percent;
    return parseFloat((value + (Math.random() * amount * 2) - amount).toFixed(2));
};

export const getMockFundamentalData = (ticker: string): FundamentalData => {
    const data = companyData[ticker] || companyData['DEFAULT'];
    return {
        companyName: data.name,
        eps: randomize(data.base.eps),
        per: randomize(data.base.per),
        pbv: randomize(data.base.pbv),
        roe: randomize(data.base.roe),
        der: randomize(data.base.der),
        dividendYield: randomize(data.base.dividendYield),
    };
};

export const getMockChartData = (): ChartData[] => {
    const data: ChartData[] = [];
    let lastClose = Math.random() * 2000 + 3000;
    const today = new Date();

    for (let i = 60; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        
        const open = lastClose * (1 + (Math.random() - 0.5) * 0.05);
        const close = open * (1 + (Math.random() - 0.5) * 0.06);
        const high = Math.max(open, close) * (1 + Math.random() * 0.03);
        const low = Math.min(open, close) * (1 - Math.random() * 0.03);
        const rsi = 30 + Math.random() * 40;

        data.push({
            date: date.toISOString().split('T')[0],
            price: [parseFloat(open.toFixed(2)), parseFloat(high.toFixed(2)), parseFloat(low.toFixed(2)), parseFloat(close.toFixed(2))],
            rsi: parseFloat(rsi.toFixed(2)),
        });
        lastClose = close;
    }
    return data;
};
