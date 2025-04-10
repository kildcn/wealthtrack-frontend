import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// This is a simulated chart since we don't have historical data
// In a real app, you would use the actual historical performance data
const PerformanceChart = ({ portfolios }) => {
  // Generate mock data for chart display
  const generateMockData = () => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    // Get current month index (0-11)
    const currentMonth = new Date().getMonth();

    // Generate data for the last 12 months
    const data = [];

    for (let i = 0; i < 12; i++) {
      // Calculate month index (wrapping around to previous year if needed)
      const monthIndex = (currentMonth - 11 + i) % 12;
      const month = months[monthIndex];

      // Create data point for this month
      const dataPoint = {
        name: month,
      };

      // Add data for each portfolio (randomly fluctuating around current value)
      portfolios.forEach((portfolio, index) => {
        const totalValue = portfolio.investments?.reduce(
          (sum, investment) => sum + investment.quantity * investment.asset.currentPrice,
          0
        ) || 0;

        // Create a random fluctuation pattern that generally trends upward
        const baseValue = totalValue * 0.7; // Start at 70% of current value
        const growthFactor = 1 + (0.3 * (i / 11)); // Grows to current value
        const randomness = 0.9 + (Math.random() * 0.2); // +/- 10% randomness

        dataPoint[portfolio.name] = (baseValue * growthFactor * randomness).toFixed(2);
      });

      data.push(dataPoint);
    }

    return data;
  };

  const data = generateMockData();

  // Generate a unique color for each portfolio
  const getPortfolioColor = (index) => {
    const colors = [
      '#3B82F6', // blue-500
      '#10B981', // emerald-500
      '#F59E0B', // amber-500
      '#6366F1', // indigo-500
      '#EC4899', // pink-500
      '#8B5CF6', // violet-500
      '#EF4444', // red-500
    ];

    return colors[index % colors.length];
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => ['$' + Number(value).toLocaleString(), 'Value']} />
        <Legend />
        {portfolios.map((portfolio, index) => (
          <Line
            key={portfolio.id}
            type="monotone"
            dataKey={portfolio.name}
            stroke={getPortfolioColor(index)}
            activeDot={{ r: 8 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PerformanceChart;
