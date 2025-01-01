'use client'

import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function PortfolioTracker() {
  const [entries, setEntries] = useState([]);
  const [activeTab, setActiveTab] = useState('table');
  const [formData, setFormData] = useState({
    investorName: '',
    portfolioKey: '',
    solanaKey: '',
    startDate: '',
    endDate: '',
    initialValue: '',
    finalValue: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addEntry = () => {
    if (!formData.investorName || !formData.portfolioKey || !formData.initialValue || !formData.finalValue) return;
    
    const initial = parseFloat(formData.initialValue);
    const final = parseFloat(formData.finalValue);
    const performance = ((final - initial) / initial) * 100;
    const profit = final - initial;
    const commission = profit > 0 ? profit * 0.10 : 0;

    const newEntry = {
      id: Date.now(),
      startDate: formData.startDate,
      endDate: formData.endDate,
      investorName: formData.investorName,
      portfolioKey: formData.portfolioKey,
      solanaKey: formData.solanaKey,
      initialValue: initial,
      finalValue: final,
      performance: performance,
      profit: profit,
      commission: commission
    };

    setEntries([...entries, newEntry]);
    setFormData({
      investorName: '',
      portfolioKey: '',
      solanaKey: '',
      startDate: '',
      endDate: '',
      initialValue: '',
      finalValue: ''
    });
  };

  const aggregatedData = useMemo(() => {
    const performanceByDate = {};
    entries.forEach(entry => {
      const dateKey = entry.endDate || entry.startDate;
      if (!performanceByDate[dateKey]) {
        performanceByDate[dateKey] = {
          date: dateKey,
          avgPerformance: 0,
          totalProfit: 0,
          count: 0
        };
      }
      performanceByDate[dateKey].avgPerformance += entry.performance;
      performanceByDate[dateKey].totalProfit += entry.profit;
      performanceByDate[dateKey].count += 1;
    });

    return Object.values(performanceByDate).map(data => ({
      ...data,
      avgPerformance: data.avgPerformance / data.count
    }));
  }, [entries]);

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-gray-900 rounded-lg shadow-xl p-6">
          <h2 className="text-white text-xl md:text-2xl mb-6">Portfolio Performance Tracker</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input
              name="investorName"
              value={formData.investorName}
              onChange={handleInputChange}
              placeholder="Investor Name"
              className="p-2 rounded bg-gray-800 border border-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
            <input
              name="portfolioKey"
              value={formData.portfolioKey}
              onChange={handleInputChange}
              placeholder="Portfolio Key"
              className="p-2 rounded bg-gray-800 border border-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
            <input
              name="solanaKey"
              value={formData.solanaKey}
              onChange={handleInputChange}
              placeholder="Solana Key"
              className="p-2 rounded bg-gray-800 border border-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="p-2 rounded bg-gray-800 border border-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className="p-2 rounded bg-gray-800 border border-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
            <input
              type="number"
              name="initialValue"
              value={formData.initialValue}
              onChange={handleInputChange}
              placeholder="Initial Value ($)"
              className="p-2 rounded bg-gray-800 border border-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
            <input
              type="number"
              name="finalValue"
              value={formData.finalValue}
              onChange={handleInputChange}
              placeholder="Final Value ($)"
              className="p-2 rounded bg-gray-800 border border-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
            <button 
              onClick={addEntry} 
              className="p-2 bg-white text-black hover:bg-gray-200 rounded transition-colors md:col-span-2"
            >
              Calculate
            </button>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg shadow-xl p-4">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('table')}
              className={`px-4 py-2 rounded ${activeTab === 'table' ? 'bg-white text-black' : 'bg-gray-800 text-white'}`}
            >
              Data Table
            </button>
            <button
              onClick={() => setActiveTab('charts')}
              className={`px-4 py-2 rounded ${activeTab === 'charts' ? 'bg-white text-black' : 'bg-gray-800 text-white'}`}
            >
              Analytics
            </button>
          </div>

          {activeTab === 'table' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="p-2 text-left">Start Date</th>
                    <th className="p-2 text-left">End Date</th>
                    <th className="p-2 text-left">Investor</th>
                    <th className="p-2 text-left">Portfolio Key</th>
                    <th className="p-2 text-left">Solana Key</th>
                    <th className="p-2 text-right">Initial ($)</th>
                    <th className="p-2 text-right">Final ($)</th>
                    <th className="p-2 text-right">Performance (%)</th>
                    <th className="p-2 text-right">Profit/Loss ($)</th>
                    <th className="p-2 text-right">Commission ($)</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry.id} className="border-b border-gray-800 hover:bg-gray-800">
                      <td className="p-2">{entry.startDate}</td>
                      <td className="p-2">{entry.endDate}</td>
                      <td className="p-2">{entry.investorName}</td>
                      <td className="p-2">{entry.portfolioKey}</td>
                      <td className="p-2">{entry.solanaKey}</td>
                      <td className="p-2 text-right">
                        {entry.initialValue.toLocaleString('en-US', { 
                          style: 'currency', 
                          currency: 'USD' 
                        })}
                      </td>
                      <td className="p-2 text-right">
                        {entry.finalValue.toLocaleString('en-US', { 
                          style: 'currency', 
                          currency: 'USD' 
                        })}
                      </td>
                      <td className="p-2 text-right" style={{
                        color: entry.performance > 0 ? '#10b981' : '#ef4444'
                      }}>
                        {entry.performance.toFixed(2)}%
                      </td>
                      <td className="p-2 text-right" style={{
                        color: entry.profit > 0 ? '#10b981' : '#ef4444'
                      }}>
                        {entry.profit.toLocaleString('en-US', { 
                          style: 'currency', 
                          currency: 'USD' 
                        })}
                      </td>
                      <td className="p-2 text-right">
                        {entry.commission.toLocaleString('en-US', { 
                          style: 'currency', 
                          currency: 'USD' 
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-white mb-4">Performance Over Time</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={aggregatedData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#fff" />
                      <YAxis stroke="#fff" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937',
                          border: '1px solid #374151',
                          color: '#fff'
                        }} 
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="avgPerformance" 
                        stroke="#fff" 
                        name="Avg Performance (%)" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-white mb-4">Cumulative Profit</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={aggregatedData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#fff" />
                      <YAxis stroke="#fff" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937',
                          border: '1px solid #374151',
                          color: '#fff'
                        }} 
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="totalProfit" 
                        stroke="#fff" 
                        name="Total Profit ($)" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}