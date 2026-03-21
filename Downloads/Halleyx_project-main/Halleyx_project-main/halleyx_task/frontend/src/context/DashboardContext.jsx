import React, { createContext, useContext, useState } from 'react';
const DashboardContext = createContext();
export const DashboardProvider = ({ children }) => {
  const [dateFilter, setDateFilter] = useState('all');
  const [widgets, setWidgets] = useState([]);
  const [layouts, setLayouts] = useState({ lg: [], md: [], sm: [] });
  return <DashboardContext.Provider value={{ dateFilter, setDateFilter, widgets, setWidgets, layouts, setLayouts }}>{children}</DashboardContext.Provider>;
};
export const useDashboard = () => useContext(DashboardContext);
