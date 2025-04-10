import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import PortfolioService from '../../api/portfolios';

const PortfolioForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch portfolio data if in edit mode
  const { data: portfolio, isLoading: portfolioLoading, error: portfolioError } = useQuery(
    ['portfolio', id],
    () => PortfolioService.getPortfolioById(id),
    {
      enabled: isEditMode,
      onSuccess: (data) => {
        // Pre-fill the form with existing data
        reset({
          name: data.name,
          description: data.description || '',
        });
      },
    }
  );

  // Create portfolio mutation
  const createPortfolioMutation = useMutation(
    (portfolioData) => PortfolioService.createPortfolio(portfolioData),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('portfolios');
        toast.success('Portfolio created successfully!');
        navigate(`/portfolios/${data.id}`);
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to create portfolio';
        toast.error(message);
        setIsSubmitting(false);
      },
    }
  );

  // Update portfolio mutation
  const updatePortfolioMutation = useMutation(
    (portfolioData) => PortfolioService.updatePortfolio(id, portfolioData),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['portfolio', id]);
        queryClient.invalidateQueries('portfolios');
        toast.success('Portfolio updated successfully!');
        navigate(`/portfolios/${data.id}`);
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to update portfolio';
        toast.error(message);
        setIsSubmitting(false);
      },
    }
  );

  // Handle form submission
  const onSubmit = (data) => {
    setIsSubmitting(true);

    if (isEditMode) {
      updatePortfolioMutation.mutate(data);
    } else {
      createPortfolioMutation.mutate(data);
    }
  };

  // Show loading state when fetching portfolio data in edit mode
  if (isEditMode && portfolioLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading portfolio data...</p>
      </div>
    );
  }

  // Show error message if portfolio not found in edit mode
  if (isEditMode && portfolioError) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Failed to load portfolio data. The portfolio may have been deleted or you don't have permission to edit it.
            </p>
            <div className="mt-4">
              <Link
                to="/portfolios"
                className="text-sm font-medium text-red-700 hover:text-red-600"
              >
                Go back to portfolios
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Edit Portfolio' : 'Create New Portfolio'}
          </h1>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            to={isEditMode ? `/portfolios/${id}` : '/portfolios'}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </Link>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Portfolio Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="name"
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.name ? 'border-red-300' : ''
                    }`}
                    {...register('name', {
                      required: 'Portfolio name is required',
                      minLength: {
                        value: 2,
                        message: 'Portfolio name must be at least 2 characters',
                      },
                      maxLength: {
                        value: 100,
                        message: 'Portfolio name cannot exceed 100 characters',
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
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
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

          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditMode ? 'Update Portfolio' : 'Create Portfolio'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PortfolioForm;
