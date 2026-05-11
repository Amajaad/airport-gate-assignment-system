import axios from 'axios';

const client = axios.create({
  // Use environment variable for production, fallback to local for development
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default client;
