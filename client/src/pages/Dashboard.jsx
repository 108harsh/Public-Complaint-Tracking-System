import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0, pending: 0, in_progress: 0, resolved: 0, rejected: 0
  });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/complaints');
        const complaints = res.data.complaints || [];
        
        let s = { total: complaints.length, pending: 0, in_progress: 0, resolved: 0, rejected: 0 };
        complaints.forEach(c => {
          if (s[c.status] !== undefined) s[c.status]++;
        });
        
        setStats(s);
        setRecent(complaints.slice(0, 5));
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const StatusIcon = ({ status }) => {
    switch(status) {
      case 'resolved': return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case 'in_progress': return <AlertCircle className="h-5 w-5 text-indigo-500" />;
      case 'rejected': return <XCircle className="h-5 w-5 text-rose-500" />;
      default: return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'resolved': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'in_progress': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';
      case 'rejected': return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400';
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
  };

  if (loading) {
    return <div className="animate-pulse space-y-6">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>)}
      </div>
    </div>;
  }

  const statCards = [
    { name: 'Total Submitted', value: stats.total, color: 'text-gray-900 dark:text-white', bg: 'bg-white dark:bg-gray-800' },
    { name: 'Pending', value: stats.pending, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-white dark:bg-gray-800' },
    { name: 'In Progress', value: stats.in_progress, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-white dark:bg-gray-800' },
    { name: 'Resolved', value: stats.resolved, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-white dark:bg-gray-800' },
  ];

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Track the status of your complaints and reports.</p>
        </div>
        <Link to="/complaints/new" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Submit New
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((item) => (
          <div key={item.name} className={`${item.bg} overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10 rounded-xl`}>
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{item.name}</p>
                  <p className={`mt-2 text-3xl font-semibold ${item.color}`}>{item.value}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10 rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Recent Activity</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {recent.length === 0 ? (
            <div className="p-6 text-center text-gray-500">You haven't submitted any complaints yet.</div>
          ) : (
            recent.map((complaint) => (
              <div key={complaint.complaint_id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-150 ease-in-out">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <StatusIcon status={complaint.status} />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-primary truncate">{complaint.title}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center mt-1 text-xs text-gray-500 dark:text-gray-400 space-y-1 sm:space-y-0 text-left">
                        <span className="flex items-center">
                          {complaint.category_name}
                        </span>
                        <span className="hidden sm:mx-2 sm:inline">•</span>
                        <span>{new Date(complaint.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex items-center space-x-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(complaint.status)}`}>
                      {complaint.status.replace('_', ' ')}
                    </span>
                    <Link to={`/complaints/${complaint.complaint_id}`} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                      <ArrowUpRight className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {recent.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-800/80 px-6 py-4 flex justify-center border-t border-gray-200 dark:border-gray-700">
            <Link to="/complaints" className="text-sm font-medium text-primary hover:text-indigo-500">
              View all complaints
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
