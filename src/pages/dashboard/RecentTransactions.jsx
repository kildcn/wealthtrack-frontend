import React from 'react';

const RecentTransactions = ({ portfolios }) => {
  // Extract all transactions from all investments and sort by date (newest first)
  const getAllTransactions = () => {
    const transactions = [];

    portfolios.forEach(portfolio => {
      if (!portfolio.investments) return;

      portfolio.investments.forEach(investment => {
        if (!investment.transactions) return;

        investment.transactions.forEach(transaction => {
          transactions.push({
            ...transaction,
            portfolioName: portfolio.name,
            portfolioId: portfolio.id,
            assetName: investment.asset.name,
            assetSymbol: investment.asset.symbol,
          });
        });
      });
    });

    return transactions.sort((a, b) =>
      new Date(b.transactionDate) - new Date(a.transactionDate)
    ).slice(0, 5); // Get only the 5 most recent
  };

  const transactions = getAllTransactions();

  // Format date to be more readable
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
      <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>

      {transactions.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          <p>No recent transactions</p>
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Asset
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(transaction.transactionDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{transaction.assetSymbol}</div>
                  <div className="text-sm text-gray-500">{transaction.portfolioName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    transaction.type === 'BUY'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {transaction.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.quantity.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${transaction.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RecentTransactions;
