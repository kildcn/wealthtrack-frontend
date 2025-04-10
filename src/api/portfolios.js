import api from './index';

const PortfolioService = {
  // Get all portfolios for current user
  getAllPortfolios: async () => {
    const response = await api.get('/portfolios');
    return response.data;
  },

  // Get portfolio by ID
  getPortfolioById: async (id) => {
    const response = await api.get(`/portfolios/${id}`);
    return response.data;
  },

  // Get portfolio with all investments
  getPortfolioWithInvestments: async (id) => {
    const response = await api.get(`/portfolios/${id}/investments`);
    return response.data;
  },

  // Create new portfolio
  createPortfolio: async (portfolioData) => {
    const response = await api.post('/portfolios', portfolioData);
    return response.data;
  },

  // Update existing portfolio
  updatePortfolio: async (id, portfolioData) => {
    const response = await api.put(`/portfolios/${id}`, portfolioData);
    return response.data;
  },

  // Delete portfolio
  deletePortfolio: async (id) => {
    const response = await api.delete(`/portfolios/${id}`);
    return response.data;
  }
};

export default PortfolioService;
