
import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
    onSearch: (ticker: string) => void;
    loading: boolean;
    ticker: string;
    setTicker: (ticker: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, loading, ticker, setTicker }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(ticker);
    };

    return (
        <form onSubmit={handleSubmit} className="flex w-full items-center">
            <div className="relative w-full">
                <input
                    type="text"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value.toUpperCase())}
                    placeholder="Enter stock ticker (e.g., BBCA)"
                    className="w-full pl-4 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white transition-all duration-300"
                    disabled={loading}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                   <Search className="h-5 w-5 text-gray-400" />
                </div>
            </div>
            <button
                type="submit"
                className="px-6 py-3 bg-cyan-600 text-white font-semibold rounded-r-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center"
                disabled={loading}
            >
                {loading ? '...' : 'Analyze'}
            </button>
        </form>
    );
};
