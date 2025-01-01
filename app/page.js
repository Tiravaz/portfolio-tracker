'use client'

import React, { useState } from 'react';

export default function PortfolioTracker() {
  const [entries, setEntries] = useState([]);
  const [formData, setFormData] = useState({
    investorName: '',
    portfolioKey: '',
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
      date: new Date().toLocaleDateString('en-US'),
      investorName: formData.investorName,
      portfolioKey: formData.portfolioKey,
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
      initialValue: '',
      finalValue: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Portfolio Performance Tracker</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <input
              name="investorName"
              value={formData.investorName}
              onChange={handleInputChange}
              placeholder="Investor Name"
              className="p-2 rounded border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="portfolioKey"
              value={formData.portfolioKey}
              onChange={handleInputChange}
              placeholder="Portfolio Key"
              className="p-2 rounded border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              name="initialValue"
              value={formData.initialValue}
              onChange={handleInputChange}
              placeholder="Initial Value ($)"
              className="p-2 rounded border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              name="finalValue"
              value={formData.finalValue}
              onChange={handleInputChange}
              placeholder="Final Value ($)"
              className="p-2 rounded border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={addEntry} 
              className="col-span-2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              Calculate
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left text-gray-600">Date</th>
                  <th className="p-2 text-left text-gray-600">Investor</th>
                  <th className="p-2 text-left text-gray-600">Portfolio Key</th>
                  <th className="p-2 text-right text-gray-600">Initial ($)</th>
                  <th className="p-2 text-right text-gray-600">Final ($)</th>
                  <th className="p-2 text-right text-gray-600">Performance (%)</th>
                  <th className="p-2 text-right text-gray-600">Profit/Loss ($)</th>
                  <th className="p-2 text-right text-gray-600">Commission ($)</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 text-gray-800">{entry.date}</td>
                    <td className="p-2 text-gray-800">{entry.investorName}</td>
                    <td className="p-2 text-gray-800">{entry.portfolioKey}</td>
                    <td className="p-2 text-right text-gray-800">
                      {entry.initialValue.toLocaleString('en-US', { 
                        style: 'currency', 
                        currency: 'USD' 
                      })}
                    </td>
                    <td className="p-2 text-right text-gray-800">
                      {entry.finalValue.toLocaleString('en-US', { 
                        style: 'currency', 
                        currency: 'USD' 
                      })}
                    </td>
                    <td className="p-2 text-right" style={{
                      color: entry.performance > 0 ? '#16a34a' : '#dc2626'
                    }}>
                      {entry.performance.toFixed(2)}%
                    </td>
                    <td className="p-2 text-right" style={{
                      color: entry.profit > 0 ? '#16a34a' : '#dc2626'
                    }}>
                      {entry.profit.toLocaleString('en-US', { 
                        style: 'currency', 
                        currency: 'USD' 
                      })}
                    </td>
                    <td className="p-2 text-right text-gray-800">
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
        </div>
      </div>
    </div>
  );
}