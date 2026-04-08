"use client";
import React, { useState } from 'react';
import { ChevronLeft, Building2, TrendingUp, Shield, DollarSign, Activity, BarChart3, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Institution {
    name: string;
    ticker: string;
    type: string;
    marketCap: number;
    rating: string;
}

const INSTITUTIONS: Institution[] = [
    { name: 'HDFC Bank', ticker: 'HDFCBANK.NS', type: 'Private Bank', marketCap: 958420, rating: 'AAA' },
    { name: 'Kotak Mahindra Bank', ticker: 'KOTAKBANK.NS', type: 'Private Bank', marketCap: 352140, rating: 'AAA' },
    { name: 'ICICI Bank', ticker: 'ICICIBANK.NS', type: 'Private Bank', marketCap: 782350, rating: 'AAA' },
    { name: 'State Bank of India', ticker: 'SBIN.NS', type: 'Public Bank', marketCap: 712830, rating: 'AAA' },
    { name: 'Axis Bank', ticker: 'AXISBANK.NS', type: 'Private Bank', marketCap: 315240, rating: 'AA+' },
    { name: 'Bajaj Finance', ticker: 'BAJFINANCE.NS', type: 'NBFC', marketCap: 485620, rating: 'AAA' },
    { name: 'TCS', ticker: 'TCS.NS', type: 'IT Services', marketCap: 1245780, rating: 'AAA' },
    { name: 'Infosys', ticker: 'INFY.NS', type: 'IT Services', marketCap: 681250, rating: 'AAA' },
    { name: 'BSE', ticker: 'BSE.NS', type: 'Stock Exchange', marketCap: 12450, rating: 'AA+' },
    { name: 'Reliance Industries', ticker: 'RELIANCE.NS', type: 'Conglomerate', marketCap: 1784500, rating: 'AAA' },
    { name: 'Adani Enterprises', ticker: 'ADANIENT.NS', type: 'Conglomerate', marketCap: 342180, rating: 'A+' },
    { name: 'Hindustan Unilever', ticker: 'HINDUNILVR.NS', type: 'FMCG', marketCap: 584320, rating: 'AAA' },
    { name: 'MRF', ticker: 'MRF.NS', type: 'Auto Components', marketCap: 48650, rating: 'AA+' },
    { name: 'Tata Steel', ticker: 'TATASTEEL.NS', type: 'Steel', marketCap: 152840, rating: 'AA' },
    { name: 'Bharti Airtel', ticker: 'BHARTIARTL.NS', type: 'Telecom', marketCap: 785420, rating: 'AA+' }
];

interface BalanceSheet {
    assets: {
        cash: number;
        investments: number;
        receivables: number;
        inventory: number;
        fixedAssets: number;
        otherAssets: number;
    };
    liabilities: {
        currentLiabilities: number;
        longTermDebt: number;
        otherLiabilities: number;
    };
    equity: number;
}

const generateBalanceSheet = (institution: Institution): BalanceSheet => {
    // Generate realistic balance sheet based on market cap and industry
    const mcap = institution.marketCap;
    const isBank = institution.type.includes('Bank');
    const isIT = institution.type.includes('IT');
    const isNBFC = institution.type === 'NBFC';

    // Different multipliers for different types
    let assetMultiplier = isBank || isNBFC ? 12 : 3;
    let debtRatio = isBank || isNBFC ? 0.85 : 0.35;

    const totalAssets = mcap * assetMultiplier;

    if (isBank || isNBFC) {
        return {
            assets: {
                cash: totalAssets * 0.08,
                investments: totalAssets * 0.22,
                receivables: totalAssets * 0.58, // Loans for banks
                inventory: 0,
                fixedAssets: totalAssets * 0.04,
                otherAssets: totalAssets * 0.08
            },
            liabilities: {
                currentLiabilities: totalAssets * 0.72, // Deposits
                longTermDebt: totalAssets * 0.12,
                otherLiabilities: totalAssets * 0.06
            },
            equity: totalAssets * 0.10
        };
    } else if (isIT) {
        return {
            assets: {
                cash: totalAssets * 0.30,
                investments: totalAssets * 0.15,
                receivables: totalAssets * 0.25,
                inventory: totalAssets * 0.02,
                fixedAssets: totalAssets * 0.18,
                otherAssets: totalAssets * 0.10
            },
            liabilities: {
                currentLiabilities: totalAssets * 0.22,
                longTermDebt: totalAssets * 0.08,
                otherLiabilities: totalAssets * 0.05
            },
            equity: totalAssets * 0.65
        };
    } else {
        // Manufacturing/Other
        return {
            assets: {
                cash: totalAssets * 0.12,
                investments: totalAssets * 0.08,
                receivables: totalAssets * 0.18,
                inventory: totalAssets * 0.22,
                fixedAssets: totalAssets * 0.32,
                otherAssets: totalAssets * 0.08
            },
            liabilities: {
                currentLiabilities: totalAssets * 0.28,
                longTermDebt: totalAssets * 0.25,
                otherLiabilities: totalAssets * 0.07
            },
            equity: totalAssets * 0.40
        };
    }
};

export default function InstitutionsPage() {
    const router = useRouter();
    const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
    const [balanceSheet, setBalanceSheet] = useState<BalanceSheet | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInstitutionClick = async (institution: Institution) => {
        setSelectedInstitution(institution);
        setLoading(true);
        setError(null);

        try {
            // Fetch real balance sheet data from backend
            const response = await fetch(`http://localhost:8001/api/balance-sheet/${institution.ticker}`);

            if (!response.ok) {
                throw new Error('Failed to fetch balance sheet data');
            }

            const data = await response.json();
            setBalanceSheet(data);
        } catch (err) {
            console.error('Error fetching balance sheet:', err);
            setError('Unable to load real data. Displaying estimated values.');

            // Fallback to calculated data if API fails
            setBalanceSheet(generateFallbackBalanceSheet(institution));
        } finally {
            setLoading(false);
        }
    };

    // Fallback calculation if API fails
    const generateFallbackBalanceSheet = (institution: Institution): BalanceSheet => {
        const mcap = institution.marketCap;
        const isBank = institution.type.includes('Bank');
        const isIT = institution.type.includes('IT');
        const isNBFC = institution.type === 'NBFC';

        const assetMultiplier = isBank || isNBFC ? 12 : 3;
        const totalAssets = mcap * assetMultiplier;

        if (isBank || isNBFC) {
            return {
                assets: {
                    cash: totalAssets * 0.08,
                    investments: totalAssets * 0.22,
                    receivables: totalAssets * 0.58,
                    inventory: 0,
                    fixedAssets: totalAssets * 0.04,
                    otherAssets: totalAssets * 0.08
                },
                liabilities: {
                    currentLiabilities: totalAssets * 0.72,
                    longTermDebt: totalAssets * 0.12,
                    otherLiabilities: totalAssets * 0.06
                },
                equity: totalAssets * 0.10
            };
        } else if (isIT) {
            return {
                assets: {
                    cash: totalAssets * 0.30,
                    investments: totalAssets * 0.15,
                    receivables: totalAssets * 0.25,
                    inventory: totalAssets * 0.02,
                    fixedAssets: totalAssets * 0.18,
                    otherAssets: totalAssets * 0.10
                },
                liabilities: {
                    currentLiabilities: totalAssets * 0.22,
                    longTermDebt: totalAssets * 0.08,
                    otherLiabilities: totalAssets * 0.05
                },
                equity: totalAssets * 0.65
            };
        } else {
            return {
                assets: {
                    cash: totalAssets * 0.12,
                    investments: totalAssets * 0.08,
                    receivables: totalAssets * 0.18,
                    inventory: totalAssets * 0.22,
                    fixedAssets: totalAssets * 0.32,
                    otherAssets: totalAssets * 0.08
                },
                liabilities: {
                    currentLiabilities: totalAssets * 0.28,
                    longTermDebt: totalAssets * 0.25,
                    otherLiabilities: totalAssets * 0.07
                },
                equity: totalAssets * 0.40
            };
        }
    };

    const formatCurrency = (value: number) => {
        return `₹${(value / 1000).toFixed(1)}K Cr`;
    };

    const totalAssets = balanceSheet
        ? balanceSheet.assets.cash + balanceSheet.assets.investments + balanceSheet.assets.receivables + balanceSheet.assets.inventory + balanceSheet.assets.fixedAssets + balanceSheet.assets.otherAssets
        : 0;

    const totalLiabilities = balanceSheet
        ? balanceSheet.liabilities.currentLiabilities + balanceSheet.liabilities.longTermDebt + balanceSheet.liabilities.otherLiabilities
        : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
                    >
                        <ChevronLeft size={20} />
                        <span className="text-sm font-medium">Back to Simulation</span>
                    </button>
                    <h1 className="text-3xl font-bold text-slate-900">Financial Overview</h1>
                    <p className="text-slate-600 mt-2">Comprehensive balance sheet analysis for network institutions</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: Institutions List */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Building2 size={20} className="text-indigo-600" />
                            All Institutions ({INSTITUTIONS.length})
                        </h2>
                        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                            {INSTITUTIONS.map((institution) => (
                                <button
                                    key={institution.ticker}
                                    onClick={() => handleInstitutionClick(institution)}
                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selectedInstitution?.ticker === institution.ticker
                                        ? 'border-indigo-500 bg-indigo-50 shadow-md'
                                        : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-bold text-slate-900">{institution.name}</h3>
                                        <span className={`text-xs px-2 py-1 rounded-full font-bold ${institution.rating.includes('AAA') ? 'bg-emerald-100 text-emerald-700' :
                                            institution.rating.includes('AA') ? 'bg-blue-100 text-blue-700' :
                                                'bg-amber-100 text-amber-700'
                                            }`}>
                                            {institution.rating}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <span className="font-mono">{institution.ticker}</span>
                                        <span>•</span>
                                        <span className="text-indigo-600">{institution.type}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Balance Sheet */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-full text-center py-16">
                                <Loader2 size={48} className="text-indigo-600 animate-spin mb-4" />
                                <h3 className="text-lg font-bold text-slate-700 mb-2">Fetching Real Data...</h3>
                                <p className="text-sm text-slate-400">Loading balance sheet from Yahoo Finance</p>
                            </div>
                        ) : selectedInstitution && balanceSheet ? (
                            <>
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                        <BarChart3 size={20} className="text-indigo-600" />
                                        Balance Sheet
                                    </h2>
                                    <p className="text-sm text-slate-600 mt-1">{selectedInstitution.name}</p>
                                    <div className="mt-3 flex items-center gap-3 flex-wrap">
                                        <div className="flex items-center gap-1">
                                            <Shield size={14} className="text-emerald-600" />
                                            <span className="text-xs text-slate-500">Rating: <span className="font-bold text-emerald-600">{selectedInstitution.rating}</span></span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <TrendingUp size={14} className="text-blue-600" />
                                            <span className="text-xs text-slate-500">MCap: <span className="font-bold text-blue-600">₹{(selectedInstitution.marketCap / 1000).toFixed(0)}K Cr</span></span>
                                        </div>
                                        {!error && (
                                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">
                                                ● LIVE DATA
                                            </span>
                                        )}
                                        {error && (
                                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full">
                                                ESTIMATED
                                            </span>
                                        )}
                                    </div>
                                    {error && (
                                        <div className="mt-2 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                                            {error}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    {/* Assets */}
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1">
                                            <TrendingUp size={14} className="text-emerald-600" />
                                            Assets
                                        </h3>
                                        <div className="space-y-2 pl-4">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-600">Cash & Equivalents</span>
                                                <span className="font-mono font-bold text-slate-900">{formatCurrency(balanceSheet.assets.cash)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-600">Investments</span>
                                                <span className="font-mono font-bold text-slate-900">{formatCurrency(balanceSheet.assets.investments)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-600">Receivables {selectedInstitution.type.includes('Bank') && '(Loans)'}</span>
                                                <span className="font-mono font-bold text-slate-900">{formatCurrency(balanceSheet.assets.receivables)}</span>
                                            </div>
                                            {balanceSheet.assets.inventory > 0 && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-slate-600">Inventory</span>
                                                    <span className="font-mono font-bold text-slate-900">{formatCurrency(balanceSheet.assets.inventory)}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-600">Fixed Assets</span>
                                                <span className="font-mono font-bold text-slate-900">{formatCurrency(balanceSheet.assets.fixedAssets)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-600">Other Assets</span>
                                                <span className="font-mono font-bold text-slate-900">{formatCurrency(balanceSheet.assets.otherAssets)}</span>
                                            </div>
                                            <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold">
                                                <span className="text-slate-700">Total Assets</span>
                                                <span className="font-mono text-emerald-600">{formatCurrency(totalAssets)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Liabilities */}
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1">
                                            <DollarSign size={14} className="text-red-600" />
                                            Liabilities
                                        </h3>
                                        <div className="space-y-2 pl-4">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-600">Current Liabilities {selectedInstitution.type.includes('Bank') && '(Deposits)'}</span>
                                                <span className="font-mono font-bold text-slate-900">{formatCurrency(balanceSheet.liabilities.currentLiabilities)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-600">Long-term Debt</span>
                                                <span className="font-mono font-bold text-slate-900">{formatCurrency(balanceSheet.liabilities.longTermDebt)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-600">Other Liabilities</span>
                                                <span className="font-mono font-bold text-slate-900">{formatCurrency(balanceSheet.liabilities.otherLiabilities)}</span>
                                            </div>
                                            <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold">
                                                <span className="text-slate-700">Total Liabilities</span>
                                                <span className="font-mono text-red-600">{formatCurrency(totalLiabilities)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Equity */}
                                    <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-bold text-indigo-900">Shareholder Equity</span>
                                            <span className="font-mono font-bold text-lg text-indigo-600">{formatCurrency(balanceSheet.equity)}</span>
                                        </div>
                                        <p className="text-xs text-indigo-700 mt-2">Assets - Liabilities = Equity</p>
                                    </div>

                                    {/* Balance Check */}
                                    <div className="text-xs text-slate-400 text-center pt-4 border-t border-slate-100">
                                        Balance: {formatCurrency(totalAssets)} = {formatCurrency(totalLiabilities + balanceSheet.equity)}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center py-16">
                                <Building2 size={48} className="text-slate-300 mb-4" />
                                <h3 className="text-lg font-bold text-slate-400 mb-2">No Institution Selected</h3>
                                <p className="text-sm text-slate-400">Click on an institution from the list to view its balance sheet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
