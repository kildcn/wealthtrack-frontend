import api from './index';

const SimulationService = {
  // Get all simulations
  getAllSimulations: async () => {
    const response = await api.get('/simulations');
    return response.data;
  },

  // Get simulation by ID
  getSimulationById: async (id) => {
    const response = await api.get(`/simulations/${id}`);
    return response.data;
  },

  // Create new simulation
  createSimulation: async (simulationData) => {
    const response = await api.post('/simulations', simulationData);
    return response.data;
  },

  // Delete simulation
  deleteSimulation: async (id) => {
    await api.delete(`/simulations/${id}`);
    return { success: true };
  }
};

export default SimulationService;
