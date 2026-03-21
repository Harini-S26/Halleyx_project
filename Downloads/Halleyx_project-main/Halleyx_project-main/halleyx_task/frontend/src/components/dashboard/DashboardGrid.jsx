import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import WidgetCard from '../widgets/WidgetCard';

const ResponsiveGridLayout = WidthProvider(Responsive);

// Build proper layout entries ensuring widgets have good default positions
function buildLayouts(widgets, savedLayouts) {
  const lg = savedLayouts?.lg?.length ? savedLayouts.lg : [];
  const hasSaved = lg.length > 0;

  if (hasSaved) return savedLayouts;

  // Auto-layout: place widgets in a sensible grid
  let curX = 0, curY = 0;
  const autoLg = widgets.map(w => {
    const colW = w.w || (w.type === 'kpi' ? 3 : w.type === 'table' ? 6 : 6);
    const colH = w.h || (w.type === 'kpi' ? 2 : 5);
    if (curX + colW > 12) { curX = 0; curY += colH; }
    const item = { i: w.i, x: curX, y: curY, w: colW, h: colH };
    curX += colW;
    return item;
  });

  return { lg: autoLg, md: [], sm: [] };
}

export default function DashboardGrid({ widgets, layouts, onLayoutChange, onDeleteWidget, onSettingsWidget, chartData, readOnly = false }) {
  if (!widgets.length) return null;

  const resolvedLayouts = buildLayouts(widgets, layouts);

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={resolvedLayouts}
      onLayoutChange={onLayoutChange}
      breakpoints={{ lg: 1200, md: 768, sm: 480 }}
      cols={{ lg: 12, md: 8, sm: 4 }}
      rowHeight={80}
      margin={[16, 16]}
      containerPadding={[0, 0]}
      resizeHandles={['se']}
      isDraggable={!readOnly}
      isResizable={!readOnly}
    >
      {widgets.map(w => {
        const gridItem = resolvedLayouts?.lg?.find(l => l.i === w.i) || { x: w.x||0, y: w.y||0, w: w.w||6, h: w.h||5 };
        const data = chartData?.[w.i];
        const enriched = w.type === 'kpi' && data ? { ...w, config: { ...w.config, ...data } } : w;
        return (
          <div key={w.i} data-grid={gridItem}>
            <WidgetCard
              widget={enriched}
              data={w.type !== 'kpi' ? data : undefined}
              onDelete={!readOnly ? onDeleteWidget : undefined}
              onSettings={!readOnly ? onSettingsWidget : undefined}
              readOnly={readOnly}
            />
          </div>
        );
      })}
    </ResponsiveGridLayout>
  );
}
