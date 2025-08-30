
import React, { useCallback } from 'react';
import type { FundamentalData } from '../types';
import { Download } from 'lucide-react';

declare const jspdf: any;
declare const html2canvas: any;

interface ReportDownloaderProps {
    reportRef: React.RefObject<HTMLDivElement>;
    ticker: string;
    fundamentalData: FundamentalData;
    fullReportText: string;
}

export const ReportDownloader: React.FC<ReportDownloaderProps> = ({ reportRef, ticker, fundamentalData, fullReportText }) => {

    const downloadPdf = useCallback(() => {
        if (reportRef.current && typeof html2canvas !== 'undefined' && typeof jspdf !== 'undefined') {
            const { jsPDF } = jspdf;
            const element = reportRef.current;
            const originalBg = element.style.backgroundColor;
            element.style.backgroundColor = '#111827'; // Same as bg-gray-900

            html2canvas(element, {
                scale: 2,
                backgroundColor: '#111827',
                useCORS: true,
            }).then((canvas: HTMLCanvasElement) => {
                element.style.backgroundColor = originalBg;
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`${ticker}-Research-Report.pdf`);
            });
        }
    }, [reportRef, ticker]);

    const downloadCsv = useCallback(() => {
        const headers = ['Metric', 'Value'];
        const rows = Object.entries(fundamentalData).map(([key, value]) => [key, value]);
        
        let csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n" 
            + rows.map(e => e.join(",")).join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${ticker}-Fundamental-Data.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [fundamentalData, ticker]);
    
    const downloadTxt = useCallback(() => {
        const element = document.createElement("a");
        const file = new Blob([fullReportText], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `${ticker}-Full-Report.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }, [fullReportText, ticker]);

    return (
        <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold mr-2">Download Report:</span>
            <button onClick={downloadPdf} title="Download as PDF" className="p-2 bg-gray-700 rounded-md hover:bg-cyan-600 transition-colors">
                <Download className="h-5 w-5" />
            </button>
            <button onClick={downloadCsv} title="Download as CSV" className="p-2 bg-gray-700 rounded-md hover:bg-cyan-600 transition-colors">
                <span className="font-bold text-sm">CSV</span>
            </button>
            <button onClick={downloadTxt} title="Download as Text/Word" className="p-2 bg-gray-700 rounded-md hover:bg-cyan-600 transition-colors">
                <span className="font-bold text-sm">TXT</span>
            </button>
        </div>
    );
};
