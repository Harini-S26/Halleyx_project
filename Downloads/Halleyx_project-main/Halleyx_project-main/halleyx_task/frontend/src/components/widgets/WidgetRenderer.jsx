import React from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  AreaChart, Area, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LabelList
} from 'recharts';
import { BarChart2 } from 'lucide-react';

const COLORS = ['#6366f1','#22d3ee','#f59e0b','#10b981','#f43f5e','#a78bfa','#fb923c','#14b8a6'];

const tooltipStyle = {
  contentStyle: { borderRadius: '12px', border: '1px solid #e4e4e7', fontSize: '12px', background: '#fff' }
};

function NoDataState({ message = 'No order data available' }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-2 py-4 text-center">
      <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
        <BarChart2 size={18} className="text-zinc-300 dark:text-zinc-600" />
      </div>
      <p className="text-xs text-zinc-400 dark:text-zinc-500 max-w-[160px] leading-snug">{message}</p>
    </div>
  );
}

export default function WidgetRenderer({ widget, data }) {
  const { type, config = {} } = widget;
  const color = config.color || COLORS[0];
  const xLabel = config.xAxis || 'Product';
  const yLabel = config.yAxis || 'Value';
  const commonMargin = { top: 10, right: 15, left: -5, bottom: 30 };

  /* ── KPI ── */
  if (type === 'kpi') {
    const val = config.value ?? data?.value ?? 0;
    const decimals = config.decimals ?? 0;
    const formatted = (config.format === 'Currency' || config.format === 'currency')
      ? `$${Number(val).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`
      : Number(val).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    return (
      <div className="flex flex-col justify-center h-full px-3 py-2">
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">{config.title || 'KPI Metric'}</p>
        <p className="text-3xl font-black text-zinc-900 dark:text-zinc-100 leading-none">{formatted}</p>
        {config.description && <p className="text-xs text-zinc-400 mt-2">{config.description}</p>}
      </div>
    );
  }

  /* ── Chart types — NEVER render without real data ── */
  const chartTypes = ['bar','line','area','scatter','pie','revenue-product'];
  if (chartTypes.includes(type)) {
    const chartData = Array.isArray(data) ? data : [];
    if (!chartData.length) {
      return <NoDataState message="Create orders first to populate this chart" />;
    }

    if (type === 'bar') return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={commonMargin}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#a1a1aa' }}
            label={{ value: xLabel, position: 'insideBottom', offset: -18, fontSize: 10, fill: '#a1a1aa' }} />
          <YAxis tick={{ fontSize: 10, fill: '#a1a1aa' }}
            label={{ value: yLabel, angle: -90, position: 'insideLeft', offset: 10, fontSize: 10, fill: '#a1a1aa' }} />
          <Tooltip {...tooltipStyle} />
          <Bar dataKey="value" fill={color} radius={[4,4,0,0]}>
            {config.showDataLabel && <LabelList dataKey="value" position="top" style={{ fontSize: 10, fill: color }} />}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );

    if (type === 'line') return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={commonMargin}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#a1a1aa' }}
            label={{ value: xLabel, position: 'insideBottom', offset: -18, fontSize: 10, fill: '#a1a1aa' }} />
          <YAxis tick={{ fontSize: 10, fill: '#a1a1aa' }}
            label={{ value: yLabel, angle: -90, position: 'insideLeft', offset: 10, fontSize: 10, fill: '#a1a1aa' }} />
          <Tooltip {...tooltipStyle} />
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={{ fill: color, r: 3 }}>
            {config.showDataLabel && <LabelList dataKey="value" position="top" style={{ fontSize: 10, fill: color }} />}
          </Line>
        </LineChart>
      </ResponsiveContainer>
    );

    if (type === 'area') return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={commonMargin}>
          <defs>
            <linearGradient id={`ag-${widget.i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={color} stopOpacity={0.18} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#a1a1aa' }}
            label={{ value: xLabel, position: 'insideBottom', offset: -18, fontSize: 10, fill: '#a1a1aa' }} />
          <YAxis tick={{ fontSize: 10, fill: '#a1a1aa' }}
            label={{ value: yLabel, angle: -90, position: 'insideLeft', offset: 10, fontSize: 10, fill: '#a1a1aa' }} />
          <Tooltip {...tooltipStyle} />
          <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#ag-${widget.i})`}>
            {config.showDataLabel && <LabelList dataKey="value" position="top" style={{ fontSize: 10, fill: color }} />}
          </Area>
        </AreaChart>
      </ResponsiveContainer>
    );

    if (type === 'pie') return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={chartData} cx="50%" cy="48%" innerRadius="32%" outerRadius="62%" dataKey="value" paddingAngle={3}>
            {chartData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
          </Pie>
          <Tooltip {...tooltipStyle} />
          {config.showLegend !== false && <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />}
        </PieChart>
      </ResponsiveContainer>
    );

    if (type === 'scatter') {
      const scatterData = chartData.map((d, i) => ({ x: i, y: typeof d.value === 'number' ? d.value : 0, name: d.name }));
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={commonMargin}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
            <XAxis dataKey="x" type="number" tick={{ fontSize: 10, fill: '#a1a1aa' }}
              label={{ value: xLabel, position: 'insideBottom', offset: -18, fontSize: 10, fill: '#a1a1aa' }} />
            <YAxis dataKey="y" type="number" tick={{ fontSize: 10, fill: '#a1a1aa' }}
              label={{ value: yLabel, angle: -90, position: 'insideLeft', offset: 10, fontSize: 10, fill: '#a1a1aa' }} />
            <Tooltip {...tooltipStyle} cursor={{ strokeDasharray: '3 3' }} />
            <Scatter data={scatterData} fill={color} />
          </ScatterChart>
        </ResponsiveContainer>
      );
    }

    if (type === 'revenue-product') return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={commonMargin}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#a1a1aa' }} />
          <YAxis tick={{ fontSize: 10, fill: '#a1a1aa' }} />
          <Tooltip {...tooltipStyle} />
          <Bar dataKey="value" fill={color} radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  /* ── Table ── */
  if (type === 'table') {
    const cols = config.columns?.length ? config.columns : ['Product', 'Status', 'Total amount'];
    let rows = Array.isArray(data) ? [...data] : [];
    if (!rows.length) return <NoDataState message="Create orders to populate this table" />;

    if (config.sortBy === 'Ascending') rows.sort((a,b) => String(a[cols[0]]||'').localeCompare(String(b[cols[0]]||'')));
    else if (config.sortBy === 'Descending') rows.sort((a,b) => String(b[cols[0]]||'').localeCompare(String(a[cols[0]]||'')));
    else if (config.sortBy === 'Order date') rows.sort((a,b) => new Date(b['Order date']||0) - new Date(a['Order date']||0));

    if (config.applyFilter && config.filters?.length) {
      config.filters.forEach(f => {
        if (f.column && f.value) {
          rows = rows.filter(r => String(r[f.column]||'').toLowerCase().includes(f.value.toLowerCase()));
        }
      });
    }

    const pageSize = Number(config.pagination || 5);
    rows = rows.slice(0, pageSize);

    const fs = config.fontSize || 14;
    const hBg = config.headerBg || '#54bd95';
    return (
      <div className="overflow-auto h-full" style={{ fontSize: fs }}>
        <table className="w-full">
          <thead>
            <tr>
              {cols.map(c => (
                <th key={c} className="text-left py-2 px-3 text-white font-semibold text-xs uppercase tracking-wider whitespace-nowrap"
                  style={{ background: hBg, fontSize: fs - 2 }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-zinc-50 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                {cols.map(c => <td key={c} className="py-2 px-3 text-zinc-700 dark:text-zinc-300">{row[c] ?? '-'}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return <div className="flex items-center justify-center h-full text-zinc-400 text-sm">{type}</div>;
}
