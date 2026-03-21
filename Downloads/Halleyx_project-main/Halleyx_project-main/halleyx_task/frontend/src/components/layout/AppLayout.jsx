import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDashboard } from '../../context/DashboardContext';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Settings2, ShoppingBag, Lightbulb,
  User, LogOut, Bell, ChevronDown, Menu, TrendingUp,
  Sun, Moon, CheckCircle2, Clock, Package, AlertTriangle, Clock3
} from 'lucide-react';

const DATE_OPTIONS = [
  { value: 'all',    label: 'All Time'     },
  { value: 'today',  label: 'Today'        },
  { value: '7days',  label: 'Last 7 Days'  },
  { value: '30days', label: 'Last 30 Days' },
  { value: '90days', label: 'Last 90 Days' },
];

const NAV_ITEMS = [
  { to: '/app/dashboard',     icon: LayoutDashboard, label: 'Dashboard'    },
  { to: '/app/configure',     icon: Settings2,        label: 'Configure'   },
  { to: '/app/orders',        icon: ShoppingBag,      label: 'Orders'      },
  { to: '/app/insights',      icon: Lightbulb,        label: 'Insights'    },
  { to: '/app/time-machine',  icon: Clock3,           label: 'Time Machine'},
  { to: '/app/profile',       icon: User,             label: 'Profile'     },
];

const INITIAL_NOTIFICATIONS = [
  { id: 1, read: false, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', title: 'Order Completed', body: 'An order has been marked as completed.', time: '2 min ago' },
  { id: 2, read: false, icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', title: 'Pending Orders', body: 'You have orders awaiting action.', time: '15 min ago' },
  { id: 3, read: false, icon: Package, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', title: 'New Order', body: 'A new Fiber Internet 1 Gbps order was created.', time: '1 hr ago' },
  { id: 4, read: true,  icon: Clock,  color: 'text-zinc-400',  bg: 'bg-zinc-50 dark:bg-zinc-800', title: 'Dashboard Saved', body: 'Your dashboard configuration was saved.', time: '3 hr ago' },
];

export default function AppLayout() {
  const { user, logout }              = useAuth();
  const { dateFilter, setDateFilter } = useDashboard();
  const { dark, toggle }              = useTheme();
  const navigate                      = useNavigate();

  const [sidebarOpen, setSidebarOpen]     = useState(false);
  const [dateOpen, setDateOpen]           = useState(false);
  const [bellOpen, setBellOpen]           = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const bellRef = useRef(null);
  const dateRef = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false);
      if (dateRef.current && !dateRef.current.contains(e.target)) setDateOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;
  const markRead    = (id) => setNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setNotifications(p => p.map(n => ({ ...n, read: true })));
  const handleLogout = () => { logout(); navigate('/login'); };
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  // Always show initials avatar — no profile photo
  const Avatar = ({ size = 'w-8 h-8' }) => (
    <div className={`${size} rounded-full bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-white text-xs font-black flex-shrink-0`}>
      {initials}
    </div>
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-[#13131a] border-r border-zinc-100 dark:border-zinc-800">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-zinc-100 dark:border-zinc-800 flex-shrink-0">
        <span className="text-base font-black text-zinc-900 dark:text-zinc-100 tracking-tight">Halleyx</span>
        <p className="text-[10px] text-zinc-400 leading-none mt-0.5">Dashboard Platform</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
        <p className="px-3 py-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Main Menu</p>
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} onClick={() => setSidebarOpen(false)}
            className={({ isActive }) => isActive ? 'sidebar-link-active' : 'sidebar-link'}>
            <Icon size={16} /><span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Dark mode toggle */}
      <div className="px-3 pb-3 flex-shrink-0">
        <button onClick={toggle}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
          {dark ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-brand-500" />}
          <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>
          <div className={`ml-auto w-8 h-4 rounded-full transition-colors ${dark ? 'bg-brand-500' : 'bg-zinc-200'}`}>
            <div className={`w-3 h-3 rounded-full bg-white shadow mt-0.5 transition-transform ${dark ? 'translate-x-4 ml-0.5' : 'translate-x-0.5'}`} />
          </div>
        </button>
      </div>

      {/* User — always initials, no photo */}
      <div className="px-3 py-4 border-t border-zinc-100 dark:border-zinc-800 flex-shrink-0">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
          <Avatar />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 truncate">{user?.name}</p>
            <p className="text-[11px] text-zinc-400 truncate">{user?.email}</p>
          </div>
          <button onClick={handleLogout} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-zinc-300 hover:text-red-500 transition-colors" title="Logout">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-[#0f0f11] overflow-hidden">

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 flex-col flex-shrink-0"><SidebarContent /></aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed left-0 top-0 bottom-0 w-60 z-50 lg:hidden">
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Navbar */}
        <header className="h-14 bg-white dark:bg-[#13131a] border-b border-zinc-100 dark:border-zinc-800 flex items-center px-4 gap-3 flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500">
            <Menu size={18} />
          </button>

          {/* Mobile brand */}
          <div className="lg:hidden flex items-center gap-2 flex-shrink-0">
            <span className="font-black text-zinc-900 dark:text-zinc-100 text-sm whitespace-nowrap">Halleyx</span>
          </div>

          <div className="flex-1" />

          {/* Dark mode desktop */}
          <button onClick={toggle}
            className="hidden lg:flex items-center justify-center w-9 h-9 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors"
            title={dark ? 'Switch to light' : 'Switch to dark'}>
            {dark ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
          </button>

          {/* Date filter */}
          <div className="relative" ref={dateRef}>
            <button onClick={() => { setDateOpen(!dateOpen); setBellOpen(false); }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
              <TrendingUp size={13} className="text-brand-500" />
              <span className="hidden sm:inline text-xs">{DATE_OPTIONS.find(d => d.value === dateFilter)?.label}</span>
              <ChevronDown size={13} className="text-zinc-400" />
            </button>
            <AnimatePresence>
              {dateOpen && (
                <motion.div initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  className="absolute right-0 top-full mt-1.5 w-44 bg-white dark:bg-[#1a1a1f] border border-zinc-100 dark:border-zinc-800 rounded-2xl shadow-modal z-50 overflow-hidden p-1">
                  {DATE_OPTIONS.map(opt => (
                    <button key={opt.value} onClick={() => { setDateFilter(opt.value); setDateOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-sm rounded-xl transition-colors font-medium ${dateFilter === opt.value ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 font-bold' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}>
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bell */}
          <div className="relative" ref={bellRef}>
            <button onClick={() => { setBellOpen(!bellOpen); setDateOpen(false); }}
              className="relative p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors">
              <Bell size={17} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[14px] h-[14px] flex items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-black border-2 border-white dark:border-[#13131a] px-0.5">
                  {unreadCount}
                </span>
              )}
            </button>
            <AnimatePresence>
              {bellOpen && (
                <motion.div initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-[#1a1a1f] border border-zinc-100 dark:border-zinc-800 rounded-2xl shadow-modal z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <Bell size={14} className="text-zinc-500" />
                      <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Notifications</span>
                      {unreadCount > 0 && <span className="px-1.5 py-0.5 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 text-[10px] font-black">{unreadCount}</span>}
                    </div>
                    {unreadCount > 0 && <button onClick={markAllRead} className="text-xs text-brand-600 font-semibold hover:text-brand-700 transition-colors">Mark all read</button>}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-zinc-50 dark:divide-zinc-800">
                    {notifications.map(n => {
                      const Icon = n.icon;
                      return (
                        <div key={n.id} onClick={() => markRead(n.id)}
                          className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors ${!n.read ? 'bg-brand-50/30 dark:bg-brand-900/10' : ''}`}>
                          <div className={`w-8 h-8 rounded-xl ${n.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                            <Icon size={14} className={n.color} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className={`text-xs font-bold truncate ${n.read ? 'text-zinc-500 dark:text-zinc-500' : 'text-zinc-900 dark:text-zinc-100'}`}>{n.title}</p>
                              <span className="text-[10px] text-zinc-400 flex-shrink-0">{n.time}</span>
                            </div>
                            <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">{n.body}</p>
                          </div>
                          {!n.read && <div className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0 mt-1.5" />}
                        </div>
                      );
                    })}
                  </div>
                  <div className="px-4 py-2 border-t border-zinc-50 dark:border-zinc-800 text-center">
                    <button onClick={() => setBellOpen(false)} className="text-xs text-zinc-400 hover:text-zinc-600 font-medium">Close</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Avatar — always initials, no photo */}
          <NavLink to="/app/profile" title="Profile">
            <Avatar />
          </NavLink>
        </header>

        <main className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-[#0f0f11]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}