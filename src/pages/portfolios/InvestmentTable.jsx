import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const InvestmentTable = ({ investments }) => {
  const [sortConfig, setSortConfig] = useState({
    key: 'asset.name',
    direction: 'ascending',
  });

  // Sort investments based on current sort configuration
  const sortedInvestments = React.useMemo(() => {
    const sortableInvestments = [...investments];

    if (sortConfig.key) {
      sortableInvestments.sort((a, b) => {
        // Handle nested properties (e.g., asset.name)
        const aValue = sortConfig.key.split('.').reduce((obj, key) => obj?.[key], a);
        const bValue = sortConfig.key.split('.').reduce((obj, key) => obj?.[key], b);

        // Handle different types of values
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          if (sortConfig.direction === 'ascending') {
            return aValue.localeCompare(bValue);
          } else {
            return bValue.localeCompare(aValue);
          }
        } else {
          if (sortConfig.direction === 'ascending') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        }
      });
    }
    return sortableInvestments;
  }, [investments, sortConfig]);

  // Request sort function
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Helper function to get the sort direction indicator
  const getSortDirectionIndicator = (key) => {
    if (sortConfig.key !== key) return null;

    return sortConfig.direction === 'ascending'
      ? <span className="ml-1">▲</span>
      : <span className="ml-1">▼</span>;
  };

  // Helper functions for calculations and formatting
  const calculateCurrentValue = (investment) => {
    return investment.quantity * investment.asset.currentPrice;
  };

  const calculateProfitLoss = (investment) => {
    const currentValue = calculateCurrentValue(investment);
    return currentValue - investment.initialAmount;
  };

  const calculateProfitLossPercentage = (investment) => {
    const profitLoss = calculateProfitLoss(investment);
    return (profitLoss / investment.initialAmount) * 100;
  };

  const formatCurrency = (value) => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('asset.name')}
            >
              Asset
              {getSortDirectionIndicator('asset.name')}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('asset.type')}
            >
              Type
              {getSortDirectionIndicator('asset.type')}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('quantity')}
            >
              Quantity
              {getSortDirectionIndicator('quantity')}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('purchasePrice')}
            >
              Purchase Price
              {getSortDirectionIndicator('purchasePrice')}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('asset.currentPrice')}
            >
              Current Price
              {getSortDirectionIndicator('asset.currentPrice')}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Current Value
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Profit/Loss
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('purchaseDate')}
            >
              Purchase Date
              {getSortDirectionIndicator('purchaseDate')}
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedInvestments.map((investment) => {
            const currentValue = calculateCurrentValue(investment);
            const profitLoss = calculateProfitLoss(investment);
            const profitLossPercentage = calculateProfitLossPercentage(investment);
            const isPositive = profitLoss >= 0;

            return (
              <tr key={investment.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {investment.asset.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {investment.asset.symbol}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {investment.asset.type.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                  {investment.quantity.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                  {formatCurrency(investment.purchasePrice)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                  {formatCurrency(investment.asset.currentPrice)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                  {formatCurrency(currentValue)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? '+' : ''}{formatCurrency(profitLoss)}
                  </div>
                  <div className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? '+' : ''}{profitLossPercentage.toFixed(2)}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                  {formatDate(investment.purchaseDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-900"
                      title="Edit investment"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      title="Delete investment"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
        {/* Table footer with totals */}
        <tfoot className="bg-gray-50">
          <tr>
            <td colSpan="5" className="px-6 py-3 text-right text-sm font-medium text-gray-500">
              Totals:
            </td>
            <td className="px-6 py-3 text-right text-sm font-bold text-gray-900">
              {formatCurrency(
                investments.reduce((sum, investment) => sum + calculateCurrentValue(investment), 0)
              )}
            </td>
            <td className="px-6 py-3 text-right">
              {(() => {
                const totalProfitLoss = investments.reduce(
                  (sum, investment) => sum + calculateProfitLoss(investment),
                  0
                );
                const totalInvested = investments.reduce(
                  (sum, investment) => sum + investment.initialAmount,
                  0
                );
                const totalPercentage = totalInvested > 0
                  ? (totalProfitLoss / totalInvested) * 100
                  : 0;
                const isPositive = totalProfitLoss >= 0;

                return (
                  <>
                    <div className={`text-sm font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {isPositive ? '+' : ''}{formatCurrency(totalProfitLoss)}
                    </div>
                    <div className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {isPositive ? '+' : ''}{totalPercentage.toFixed(2)}%
                    </div>
                  </>
                );
              })()}
            </td>
            <td colSpan="2" className="px-6 py-3"></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default InvestmentTable;
