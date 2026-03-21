import { useState, useEffect } from 'react';
import api from '../utils/api';

export function useInsights(dateFilter = 'all') {
  const [insights, setInsights] = useState(null);
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const [insRes, revenueRes, ordersRes, statusRes] = await Promise.all([
        api.get('/widgets/insights'),
        api.get('/widgets/chart-data', { params: { type: 'revenue-by-product', dateFilter } }),
        api.get('/widgets/chart-data', { params: { type: 'orders-over-time', dateFilter } }),
        api.get('/widgets/chart-data', { params: { type: 'status-distribution', dateFilter } }),
      ]);
      setInsights(insRes.data);
      setChartData({ revenue: revenueRes.data, orders: ordersRes.data, status: statusRes.data });
    } catch (err) {
      console.error('Insights fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInsights(); }, [dateFilter]);

  return { insights, chartData, loading, refetch: fetchInsights };
}
