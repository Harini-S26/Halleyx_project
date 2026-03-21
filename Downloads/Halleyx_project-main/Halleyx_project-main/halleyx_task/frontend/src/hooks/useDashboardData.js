import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

// Map widget config fields to backend query params
function buildChartParams(widget, dateFilter) {
  const { type, config = {} } = widget;
  const base = { dateFilter };

  if (type === 'revenue-product') {
    return { ...base, type: 'revenue-by-product' };
  }
  if (['bar', 'line', 'area', 'scatter'].includes(type)) {
    return {
      ...base,
      xAxis: config.xAxis || 'Product',
      yAxis: config.yAxis || 'Total amount',
    };
  }
  if (type === 'pie') {
    return { ...base, type: 'pie', chartData: config.chartData || 'Status' };
  }
  if (type === 'table') {
    return { ...base, type: 'table' };
  }
  return base;
}

export function useDashboardData(widgets = [], dateFilter = 'all') {
  const [chartData, setChartData] = useState({});
  const [loading,   setLoading]   = useState(false);

  const fetchAllData = useCallback(async () => {
    if (!widgets.length) { setChartData({}); return; }
    setLoading(true);
    const map = {};

    await Promise.all(widgets.map(async (w) => {
      try {
        const { type, config = {} } = w;

        // KPI widget
        if (type === 'kpi') {
          const { data } = await api.get('/widgets/insights');
          const { stats = {} } = data;
          const metricMap = {
            'Total amount':  stats.revenue,
            'Unit price':    stats.revenue,
            'Quantity':      stats.total,
            'Customer ID':   stats.total,
            'Status':        stats.pending,
            'Created by':    stats.total,
            'Product':       stats.total,
            'Customer name': stats.total,
            'Email id':      stats.total,
            'Address':       stats.total,
            'Order date':    stats.total,
          };
          const key = config?.metric || 'Total amount';
          let value = metricMap[key] ?? stats.total ?? 0;

          // Aggregation
          if (config.aggregation === 'Average' && stats.total > 0) {
            value = value / stats.total;
          } else if (config.aggregation === 'Count') {
            value = stats.total;
          }

          map[w.i] = { value: Number(Number(value).toFixed(config.decimals ?? 0)) };
          return;
        }

        // Chart / Table widgets — fetch from chart-data endpoint
        if (['bar','line','area','scatter','pie','revenue-product','table'].includes(type)) {
          const params = buildChartParams(w, dateFilter);

          if (type === 'table') {
            // Table: get full orders and map to column-keyed rows
            const { data: orders } = await api.get('/orders', { params: { dateFilter } });
            if (!orders.length) { map[w.i] = []; return; }
            const colMap = {
              'Customer ID':   o => o._id?.slice(-6)?.toUpperCase() || '-',
              'Customer name': o => `${o.firstName} ${o.lastName}`,
              'Email id':      o => o.email,
              'Phone number':  o => o.phone,
              'Address':       o => `${o.street}, ${o.city}`,
              'Order ID':      o => o._id?.slice(-8)?.toUpperCase() || '-',
              'Order date':    o => o.orderDate ? new Date(o.orderDate).toLocaleDateString() : new Date(o.createdAt).toLocaleDateString(),
              'Product':       o => o.product,
              'Quantity':      o => o.quantity,
              'Unit price':    o => `$${o.unitPrice}`,
              'Total amount':  o => `$${o.totalAmount}`,
              'Status':        o => o.status,
              'Created by':    o => o.createdBy,
            };
            const cols = config.columns?.length ? config.columns : ['Product', 'Status', 'Total amount'];
            map[w.i] = orders.map(o => {
              const row = {};
              cols.forEach(c => { row[c] = colMap[c] ? colMap[c](o) : '-'; });
              return row;
            });
            return;
          }

          const { data } = await api.get('/widgets/chart-data', { params });
          map[w.i] = Array.isArray(data) ? data : [];
        }
      } catch {
        map[w.i] = [];
      }
    }));

    setChartData(map);
    setLoading(false);
  }, [widgets, dateFilter]);

  // Re-fetch when widget configs change (axis selects, etc.)
  const widgetConfigKey = widgets.map(w => `${w.i}:${w.config?.xAxis}:${w.config?.yAxis}:${w.config?.chartData}:${w.config?.metric}:${w.config?.columns?.join(',')}`).join('|');

  useEffect(() => { fetchAllData(); }, [widgetConfigKey, dateFilter]);

  return { chartData, loading, refetch: fetchAllData };
}
