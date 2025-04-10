import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import SimulationService from '../../api/simulations';

const SimulationForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form validation with react-hook-form
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      description: '',
      initialInvestment: 10000,
      monthlyContribution: 500,
      annualReturnRate: 8,
      investmentDurationYears: 30,
      inflationRate: 2,
      taxRate: 0,
    }
  });

  // Watch values for preview calculations
  const watchedValues = watch();

  // Create simulation mutation
  const createSimulationMutation = useMutation(
    (simulationData) => SimulationService.createSimulation(simulationData),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('simulations');
        toast.success('Simulation created successfully!');
        navigate(`/simulations/${data.id}`);
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to create simulation';
        toast.error(message);
        setIsSubmitting(false);
      },
    }
  );

  // Handle form submission
  const onSubmit = (data) => {
    setIsSubmitting(true);

    // Convert string inputs to numbers for API
    const simulationData = {
      ...data,
      initialInvestment: Number(data.initialInvestment),
      monthlyContribution: Number(data.monthlyContribution),
      annualReturnRate: Number(data.annualReturnRate),
      investmentDurationYears: Number(data.investmentDurationYears),
      inflationRate: Number(data.inflationRate),
      taxRate: Number(data.taxRate),
    };

    createSimulationMutation.mutate(simulationData);
  };

  // Calculate estimated final amount for preview
  const calculateEstimatedFinalAmount = () => {
    const initialInvestment = Number(watchedValues.initialInvestment) || 0;
    const monthlyContribution = Number(watchedValues.monthlyContribution) || 0;
    const annualReturnRate = Number(watchedValues.annualReturnRate) || 0;
    const years = Number(watchedValues.investmentDurationYears) || 0;
    const inflationRate = Number(watchedValues.inflationRate) || 0;

    // Monthly return rate adjusted for inflation
    const monthlyReturnRate = (annualReturnRate / 100) / 12;
    const monthlyInflationRate = (inflationRate / 100) / 12;

    let balance = initialInvestment;

    // Simple estimation for preview purposes
    for (let month = 1; month <= years * 12; month++) {
      // Add monthly contribution
      balance += monthlyContribution;

      // Add monthly return
      balance += balance * monthlyReturnRate;

      // Adjust for inflation (simplified)
      balance = balance / (1 + monthlyInflationRate);
    }

    return balance;
  };

  // Format currency
  const formatCurrency = (value) => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

  // Preview calculation
  const estimatedFinalAmount = calculateEstimatedFinalAmount();
  const totalContributions = (Number(watchedValues.initialInvestment) || 0) +
    (Number(watchedValues.monthlyContribution) || 0) * 12 * (Number(watchedValues.investmentDurationYears) || 0);
  const estimatedEarnings = estimatedFinalAmount - totalContributions;

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900">Create New Simulation</h1>
          <p className="mt-1 text-gray-500">
            Set up parameters for your investment simulation
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            to="/simulations"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Cancel
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Simulation form */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-6">
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Simulation Name
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="name"
                            className={`shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                              errors.name ? 'border-red-300' : ''
                            }`}
                            {...register('name', {
                              required: 'Simulation name is required',
                              minLength: {
                                value: 2,
                                message: 'Simulation name must be at least 2 characters',
                              },
                              maxLength: {
                                value: 100,
                                message: 'Simulation name cannot exceed 100 characters',
                              },
                            })}
                          />
                          {errors.name && (
                            <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                          Description <span className="text-gray-400">(optional)</span>
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="description"
                            rows={3}
                            className={`shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                              errors.description ? 'border-red-300' : ''
                            }`}
                            {...register('description', {
                              maxLength: {
                                value: 1000,
                                message: 'Description cannot exceed 1000 characters',
                              },
                            })}
                          />
                          {errors.description && (
                            <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Investment Parameters */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Investment Parameters</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="initialInvestment" className="block text-sm font-medium text-gray-700">
                          Initial Investment ($)
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            id="initialInvestment"
                            min="0"
                            step="100"
                            className={`shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                              errors.initialInvestment ? 'border-red-300' : ''
                            }`}
                            {...register('initialInvestment', {
                              required: 'Initial investment is required',
                              min: {
                                value: 0,
                                message: 'Initial investment must be positive',
                              },
                            })}
                          />
                          {errors.initialInvestment && (
                            <p className="mt-2 text-sm text-red-600">{errors.initialInvestment.message}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="monthlyContribution" className="block text-sm font-medium text-gray-700">
                          Monthly Contribution ($)
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            id="monthlyContribution"
                            min="0"
                            step="10"
                            className={`shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                              errors.monthlyContribution ? 'border-red-300' : ''
                            }`}
                            {...register('monthlyContribution', {
                              required: 'Monthly contribution is required',
                              min: {
                                value: 0,
                                message: 'Monthly contribution must be positive',
                              },
                            })}
                          />
                          {errors.monthlyContribution && (
                            <p className="mt-2 text-sm text-red-600">{errors.monthlyContribution.message}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="annualReturnRate" className="block text-sm font-medium text-gray-700">
                          Annual Return Rate (%)
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            id="annualReturnRate"
                            min="-100"
                            max="1000"
                            step="0.1"
                            className={`shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                              errors.annualReturnRate ? 'border-red-300' : ''
                            }`}
                            {...register('annualReturnRate', {
                              required: 'Annual return rate is required',
                              min: {
                                value: -100,
                                message: 'Annual return rate cannot be less than -100%',
                              },
                              max: {
                                value: 1000,
                                message: 'Annual return rate cannot exceed 1000%',
                              },
                            })}
                          />
                          {errors.annualReturnRate && (
                            <p className="mt-2 text-sm text-red-600">{errors.annualReturnRate.message}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="investmentDurationYears" className="block text-sm font-medium text-gray-700">
                          Investment Duration (years)
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            id="investmentDurationYears"
                            min="1"
                            max="100"
                            step="1"
                            className={`shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                              errors.investmentDurationYears ? 'border-red-300' : ''
                            }`}
                            {...register('investmentDurationYears', {
                              required: 'Investment duration is required',
                              min: {
                                value: 1,
                                message: 'Investment duration must be at least 1 year',
                              },
                              max: {
                                value: 100,
                                message: 'Investment duration cannot exceed 100 years',
                              },
                            })}
                          />
                          {errors.investmentDurationYears && (
                            <p className="mt-2 text-sm text-red-600">{errors.investmentDurationYears.message}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Advanced Parameters */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Advanced Parameters</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="inflationRate" className="block text-sm font-medium text-gray-700">
                          Inflation Rate (%)
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            id="inflationRate"
                            min="0"
                            max="100"
                            step="0.1"
                            className={`shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                              errors.inflationRate ? 'border-red-300' : ''
                            }`}
                            {...register('inflationRate', {
                              required: 'Inflation rate is required',
                              min: {
                                value: 0,
                                message: 'Inflation rate must be positive',
                              },
                              max: {
                                value: 100,
                                message: 'Inflation rate cannot exceed 100%',
                              },
                            })}
                          />
                          {errors.inflationRate && (
                            <p className="mt-2 text-sm text-red-600">{errors.inflationRate.message}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700">
                          Tax Rate (%)
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            id="taxRate"
                            min="0"
                            max="100"
                            step="0.1"
                            className={`shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                              errors.taxRate ? 'border-red-300' : ''
                            }`}
                            {...register('taxRate', {
                              required: 'Tax rate is required',
                              min: {
                                value: 0,
                                message: 'Tax rate must be positive',
                              },
                              max: {
                                value: 100,
                                message: 'Tax rate cannot exceed 100%',
                              },
                            })}
                          />
                          {errors.taxRate && (
                            <p className="mt-2 text-sm text-red-600">{errors.taxRate.message}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    'Create Simulation'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Preview panel */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg sticky top-6">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Estimated Results</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Preview of investment growth</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Final Amount</dt>
                  <dd className="mt-1 text-2xl font-bold text-green-600">
                    {formatCurrency(estimatedFinalAmount)}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">Total Contributions</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatCurrency(totalContributions)}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">Total Earnings</dt>
                  <dd className="mt-1 text-sm font-semibold text-green-600">
                    {formatCurrency(estimatedEarnings)}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">Return Multiplier</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {totalContributions > 0 ? (estimatedFinalAmount / totalContributions).toFixed(2) : 0}x
                  </dd>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-xs text-gray-500">
                    This is a simplified calculation for preview purposes. The final simulation will use more accurate compounding calculations and account for all parameters.
                  </p>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationForm;
