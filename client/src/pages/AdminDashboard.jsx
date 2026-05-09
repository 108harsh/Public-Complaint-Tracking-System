import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Briefcase, TrendingUp, Clock, FileWarning } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [catData, setCatData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [sumRes, catRes] = await Promise.all([
          api.get('/admin/analytics/summary'),
          api.get('/admin/analytics/category')
        ]);
        setSummary(sumRes.data);
        
        // Format category data for charts
        const formatted = catRes.data.map(c => ({
          name: c.name,
          value: parseInt(c.count)
        }));
        setCatData(formatted);
      } catch (err) {
        toast.error('Failed to load admin analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) return <div className="animate-pulse space-y-6"><div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div></div>;

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Platform overview and KPI tracking.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Complaints', value: summary?.total || 0, icon: FileWarning, color: 'text-indigo-600', bg: 'bg-indigo-100' },
          { label: 'Resolved Issues', value: summary?.resolved || 0, icon: Briefcase, color: 'text-emerald-600', bg: 'bg-emerald-100' },
          { label: 'Resolution Rate', value: summary?.resolutionRate || '0%', icon: TrendingUp, color: 'text-rose-600', bg: 'bg-rose-100' },
          { label: 'Avg Process Time', value: summary?.avgResolutionTime || '0 days', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10 flex items-center">
              <div className={`p-3 rounded-lg ${stat.bg} ${stat.color} dark:bg-opacity-20`}>
                 <Icon className="h-6 w-6" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{stat.label}</p>
                <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm ring-1 ring-black ring-opacity-5">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Complaints by Category</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={catData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm ring-1 ring-black ring-opacity-5">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Distribution Setup</h3>
          <div className="h-72 w-full flex justify-center items-center">
            {catData.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={catData}
                     cx="50%"
                     cy="50%"
                     innerRadius={80}
                     outerRadius={100}
                     paddingAngle={5}
                     dataKey="value"
                   >
                     {catData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                   </Pie>
                   <Tooltip />
                 </PieChart>
               </ResponsiveContainer>
            ) : (
                <p className="text-gray-500">No data available to render chart</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
