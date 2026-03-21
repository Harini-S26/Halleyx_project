import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export function useOrders(dateFilter = 'all') {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/orders', { params: { dateFilter } });
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [dateFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const createOrder = async (orderData) => {
    const { data } = await api.post('/orders', orderData);
    setOrders(prev => [data, ...prev]);
    return data;
  };

  const updateOrder = async (id, orderData) => {
    const { data } = await api.put(`/orders/${id}`, orderData);
    setOrders(prev => prev.map(o => o._id === id ? data : o));
    return data;
  };

  const deleteOrder = async (id) => {
    await api.delete(`/orders/${id}`);
    setOrders(prev => prev.filter(o => o._id !== id));
  };

  return { orders, loading, error, refetch: fetchOrders, createOrder, updateOrder, deleteOrder };
}
