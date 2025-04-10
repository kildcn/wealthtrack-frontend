import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import SimulationService from '../../api/simulations';

const SimulationList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all simulations
  const { data: simulations, isLoading, error } = useQuery(
    'simulations',
    () => SimulationService.getAllSimulations(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Filter simulations based on search term
  const filteredSimulations = simulations?.filter(simulation =>
    simulation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (simulation.description && simulation.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Format currency
  const formatCurrency = (value) => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Investment Simulations</h1>
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

      {/* Search bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 sm:text-sm"
            placeholder="Search simulations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Simulations grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading simulations...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">Failed to load simulations. Please try again.</p>
            </div>
          </div>
        </div>
      ) : simulations?.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No simulations yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first investment simulation.</p>
          <div className="mt-6">
            <Link
              to="/simulations/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create First Simulation
            </Link>
          </div>
        </div>
      ) : filteredSimulations?.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">No simulations matching "{searchTerm}"</h3>
          <p className="mt-1 text-sm text-gray-500">Try a different search term or clear the search.</p>
          <div className="mt-6">
            <button
              onClick={() => setSearchTerm('')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Clear Search
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSimulations.map((simulation) => (
            <Link
              key={simulation.id}
              to={`/simulations/${simulation.id}`}
              className="block bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{simulation.name}</h3>
                {simulation.description && (
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{simulation.description}</p>
                )}

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500">Initial Investment</p>
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(simulation.initialInvestment)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Monthly Contribution</p>
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(simulation.monthlyContribution)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Annual Return</p>
                    <p className="text-sm font-medium text-gray-900">{simulation.annualReturnRate}%</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Duration</p>
                    <p className="text-sm font-medium text-gray-900">{simulation.investmentDurationYears} years</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-baseline">
                    <p className="text-xs font-medium text-gray-500">Final Amount</p>
                    <p className="text-lg font-bold text-green-600">{formatCurrency(simulation.finalAmount)}</p>
                  </div>
                  <div className="mt-1 flex justify-between items-baseline">
                    <p className="text-xs font-medium text-gray-500">Total Earnings</p>
                    <p className="text-sm font-medium text-green-600">{formatCurrency(simulation.totalEarnings)}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SimulationList;
