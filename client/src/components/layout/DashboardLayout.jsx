import React, { useState } from 'react';
import { Link, useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, LayoutDashboard, PlusCircle, List, LogOut, Menu, X, User, Users } from 'lucide-react';
import { cn } from '../ui/Button';

export default function DashboardLayout({ children }) {
  const { user, logout, loading } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const navItems = user.role === 'admin' 
    ? [
        { name: 'Admin Overview', path: '/admin', icon: LayoutDashboard },
        { name: 'Manage Complaints', path: '/admin/complaints', icon: List },
        { name: 'Manage Users', path: '/admin/users', icon: Users }
      ]
    : [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'New Complaint', path: '/complaints/new', icon: PlusCircle },
        { name: 'My Complaints', path: '/complaints', icon: List },
      ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
          <ShieldCheck className="h-8 w-8 text-primary" />
          <span className="ml-2 font-bold text-xl text-gray-900 dark:text-white">CivicResolve</span>
        </div>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
          <div className="h-10 w-10 bg-indigo-100 text-primary rounded-full flex items-center justify-center font-bold">
            {user.full_name?.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.full_name}</p>
            <p className="text-xs text-gray-500 truncate capitalize">{user.role}</p>
          </div>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive 
                    ? "bg-indigo-50 text-primary dark:bg-indigo-900/50 dark:text-indigo-300"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-white"
                )}
              >
                <Icon className={cn("mr-3 flex-shrink-0 h-5 w-5", isActive ? "text-primary dark:text-indigo-300" : "text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300")} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={logout}
            className="group flex w-full items-center px-2 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-md transition-colors"
          >
            <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-rose-500 group-hover:text-rose-600" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Top Navbar */}
        <header className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 w-full h-16 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <span className="ml-2 font-bold text-lg text-gray-900 dark:text-white">CivicResolve</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="h-6 w-6 text-gray-500" />
          </button>
        </header>

        {/* Mobile Overlays/Menu could go here, but for now using bottom tab bar on mobile */}

        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Tab Bar */}
        <div className="md:hidden fixed bottom-0 inset-x-0 glass border-t border-gray-200 dark:border-gray-700 grid grid-cols-4 z-50">
           {navItems.map((item) => {
             const Icon = item.icon;
             const isActive = location.pathname === item.path;
             return (
               <Link
                 key={item.name}
                 to={item.path}
                 className={cn(
                   "flex flex-col items-center justify-center py-3 px-1 text-xs font-medium",
                   isActive ? "text-primary" : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                 )}
               >
                 <Icon className={cn("h-6 w-6 mb-1", isActive ? "text-primary" : "")} />
                 <span className="truncate w-full text-center">{item.name}</span>
               </Link>
             );
           })}
           <button onClick={logout} className="flex flex-col items-center justify-center py-3 px-1 text-xs font-medium text-rose-500">
             <LogOut className="h-6 w-6 mb-1" />
             Sign Out
           </button>
        </div>
      </div>
    </div>
  );
}
