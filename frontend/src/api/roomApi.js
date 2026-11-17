import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// GET /api/rooms
export const getRooms = () => axiosClient.get('/rooms');

// POST /api/rooms
export const createRoom = (payload) => axiosClient.post('/rooms', payload);

// PUT /api/rooms/:id
export const updateRoom = (id, payload) => axiosClient.put(`/rooms/${id}`, payload);

// DELETE /api/rooms/:id
export const deleteRoom = (id) => axiosClient.delete(`/rooms/${id}`);

export default axiosClient;
