const API_URL = 'http://localhost:8000/api';

export const fetchMetrics = async () => {
  const response = await fetch(`${API_URL}/metrics`);
  if (!response.ok) {
    throw new Error('Failed to fetch metrics');
  }
  return response.json();
};

export const predictResponse = async (payload) => {
  const response = await fetch(`${API_URL}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) {
    throw new Error('Prediction failed');
  }
  
  return response.json();
};
