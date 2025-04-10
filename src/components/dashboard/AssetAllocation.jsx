// src/components/dashboard/AssetAllocation.jsx
import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

const AssetAllocation = ({ portfolios }) => {
  // Calculate asset allocation across all portfolios
  const calculateAssetAllocation = () => {
    const assetTypeMap = {};

    // Make sure portfolios is an array before using forEach
    if (!Array.isArray(portfolios)) {
      return [];
    }

    // Gather all investments from all portfolios
    portfolios.forEach(portfolio => {
      if (!portfolio.investments) return;

      portfolio.investments.forEach(investment => {
        const assetType = investment.asset.type;
        const value = investment.quantity * investment.asset.currentPrice;

        if (assetTypeMap[assetType]) {
          assetTypeMap[assetType] += value;
        } else {
          assetTypeMap[assetType] = value;
        }
      });
    });

    // Convert to array of { name, value } objects for chart
    const data = Object.entries(assetTypeMap).map(([name, value]) => ({
      name,
      value,
    }));

    // Sort by value (descending)
    return data.sort((a, b) => b.value - a.value);
  };

  const data = calculateAssetAllocation();

  // Format asset type name for display
  const formatAssetType = (type) => {
    if (!type) return "Unknown";

    return type
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Colors for the pie chart
  const COLORS = [
    '#3B82F6', // blue-500
    '#10B981', // emerald-500
    '#F59E0B', // amber-500
    '#6366F1', // indigo-500
    '#EC4899', // pink-500
    '#8B5CF6', // violet-500
    '#EF4444', // red-500
    '#06B6D4', // cyan-500
  ];

  // Calculate total value
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  // If no data or empty array, show empty state
  if (!Array.isArray(portfolios) || portfolios.length === 0 || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <p>No asset data available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-64">
      <ResponsiveContainer width="100%" height="70%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${formatAssetType(name)} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => ['$' + value.toLocaleString(), 'Value']}
            labelFormatter={(label) => formatAssetType(label)}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 mt-2 gap-2">
        {data.slice(0, 4).map((item, index) => (
          <div key={item.name} className="flex items-center text-sm">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></div>
            <div className="mr-1">{formatAssetType(item.name)}:</div>
            <div className="font-semibold">
              {((item.value / totalValue) * 100).toFixed(1)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetAllocation;
