import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import PortfolioService from '../../api/portfolios';
import SimulationService from '../../api/simulations';
import { useAuth } from '../../context/AuthContext';
import PortfolioSummary from '../../components/dashboard/PortfolioSummary';
import PerformanceChart from '../../components/dashboard/PerformanceChart';
import AssetAllocation from '../../components/dashboard/AssetAllocation';
import RecentTransactions from '../../components/dashboard/RecentTransactions';

const Dashboard = () => {
  const { user } = useAuth();

  // Fetch portfolios
  const { data: portfolios, isLoading: portfoliosLoading } = useQuery(
    ['portfolios'], // Note: This must be an array, not a string
    () => PortfolioService.getAllPortfolios(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Fetch simulations
  const { data: simulations, isLoading: simulationsLoading } = useQuery(
    ['simulations'], // Note: This must be an array, not a string
    () => SimulationService.getAllSimulations(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Welcome Back, {user?.firstName}!</h1>
        <p className="text-gray-600">Here's an overview of your financial dashboard</p>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Link
          to="/portfolios/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
          New Portfolio
        </Link>
        <Link
          to="/simulations/new"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
          New Simulation
        </Link>
      </div>

      {/* Top row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Portfolios summary */}
        <div className="bg-white rounded-lg shadow p-4 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Your Portfolios</h2>
            <Link
              to="/portfolios"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          {portfoliosLoading ? (
            <div className="flex justify-center items-center h-48">
              <p>Loading portfolios...</p>
            </div>
          ) : portfolios?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">You don't have any portfolios yet</p>
              <Link
                to="/portfolios/new"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Create Your First Portfolio
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {portfolios?.slice(0, 4).map((portfolio) => (
                <PortfolioSummary key={portfolio.id} portfolio={portfolio} />
              ))}
            </div>
          )}
        </div>

        {/* Simulations summary */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Investment Simulations</h2>
            <Link
              to="/simulations"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          {simulationsLoading ? (
            <div className="flex justify-center items-center h-48">
              <p>Loading simulations...</p>
            </div>
          ) : simulations?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">You don't have any simulations yet</p>
              <Link
                to="/simulations/new"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Create Your First Simulation
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {simulations?.slice(0, 3).map((simulation) => (
                <div key={simulation.id} className="border rounded-lg p-3 hover:bg-gray-50">
                  <Link to={`/simulations/${simulation.id}`}>
                    <h3 className="font-semibold text-lg">{simulation.name}</h3>
                    <div className="text-gray-600 text-sm mt-1">
                      <div>Initial: ${simulation.initialInvestment.toLocaleString()}</div>
                      <div>Monthly: ${simulation.monthlyContribution.toLocaleString()}</div>
                      <div>Return: {simulation.annualReturnRate}%</div>
                      <div className="font-semibold text-blue-600 mt-1">
                        Final: ${simulation.finalAmount.toLocaleString()}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance chart */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-bold mb-4">Portfolio Performance</h2>
          {portfoliosLoading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading chart data...</p>
            </div>
          ) : portfolios?.length === 0 ? (
            <div className="flex justify-center items-center h-64 text-gray-500">
              <p>No portfolio data available</p>
            </div>
          ) : (
            <PerformanceChart portfolios={portfolios} />
          )}
        </div>

        {/* Asset allocation */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-bold mb-4">Asset Allocation</h2>
          {portfoliosLoading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading asset data...</p>
            </div>
          ) : portfolios?.length === 0 ? (
            <div className="flex justify-center items-center h-64 text-gray-500">
              <p>No asset data available</p>
            </div>
          ) : (
            <AssetAllocation portfolios={portfolios} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
