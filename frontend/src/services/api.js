const API_URL = 'http://localhost:5000/api';

/**
 * Fetch wrapper helper that attaches JWT Token if available
 */
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    const errorMsg = data.message || 'An error occurred during request';
    throw new Error(errorMsg);
  }

  return data;
}

export const authAPI = {
  login: async (email, password) => {
    return await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  register: async (name, email, password) => {
    return await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
  },

  getProfile: async () => {
    return await apiRequest('/auth/me');
  }
};

export const taskAPI = {
  getTasks: async (filters = {}) => {
    // Build query parameters
    const params = new URLSearchParams();
    if (filters.status && filters.status !== 'all') {
      params.append('status', filters.status);
    }
    if (filters.priority && filters.priority !== 'all') {
      params.append('priority', filters.priority);
    }
    if (filters.category && filters.category !== 'all') {
      params.append('category', filters.category);
    }
    if (filters.search) {
      params.append('search', filters.search);
    }

    const queryStr = params.toString() ? `?${params.toString()}` : '';
    return await apiRequest(`/tasks${queryStr}`);
  },

  createTask: async (taskData) => {
    return await apiRequest('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData)
    });
  },

  updateTask: async (id, updateData) => {
    return await apiRequest(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
  },

  deleteTask: async (id) => {
    return await apiRequest(`/tasks/${id}`, {
      method: 'DELETE'
    });
  }
};
