import React from 'react';
import { Link } from 'react-router-dom';

const PortfolioSummary = ({ portfolio }) => {
  // Calculate total value and performance
  const totalValue = portfolio.investments?.reduce(
    (sum, investment) => sum + investment.quantity * investment.asset.currentPrice,
    0
  ) || 0;

  const totalInvested = portfolio.investments?.reduce(
    (sum, investment) => sum + investment.initialAmount,
    0
  ) || 0;

  const performanceValue = totalValue - totalInvested;
  const performancePercentage = totalInvested > 0
    ? (performanceValue / totalInvested) * 100
    : 0;

  // Determine performance class (positive/negative)
  const isPositive = performanceValue >= 0;
  const performanceClass = isPositive ? 'text-green-600' : 'text-red-600';

  return (
    <Link
      to={`/portfolios/${portfolio.id}`}
      className="block border rounded-lg p-4 hover:bg-gray-50 transition-colors"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">{portfolio.name}</h3>
        <div className={`font-medium ${performanceClass}`}>
          {isPositive ? '+' : ''}{performancePercentage.toFixed(2)}%
        </div>
      </div>

      <p className="text-gray-500 text-sm mb-3 line-clamp-2">
        {portfolio.description || 'No description provided'}
      </p>

      <div className="text-xl font-bold mb-1">
        ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>

      <div className="text-sm text-gray-600">
        <span className={performanceClass}>
          {isPositive ? '+' : ''}${Math.abs(performanceValue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        {' '}&middot;{' '}
        {portfolio.investments?.length || 0} investment{portfolio.investments?.length !== 1 ? 's' : ''}
      </div>
    </Link>
  );
};

export default PortfolioSummary;
