import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, AlertCircle, XCircle, ArrowUpRight, Search, Filter } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStr, setFilterStr] = useState('all');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        let url = '/complaints';
        if (filterStr !== 'all') {
          url += `?status=${filterStr}`;
        }
        const res = await api.get(url);
        setComplaints(res.data.complaints || []);
      } catch (err) {
        console.error('Error fetching complaints', err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, [filterStr]);

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

  return (
    <div>
      <div className="mb-8 sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Complaints</h1>
          <p className="text-gray-500 mt-1">View and track all your filed reports.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <select 
            value={filterStr} 
            onChange={(e) => setFilterStr(e.target.value)}
            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
          <Link to="/complaints/new">
             <Button>Submit New</Button>
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10 rounded-xl overflow-hidden">
        {loading ? (
          <div className="animate-pulse p-6 space-y-4">
             {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-md"></div>)}
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {complaints.length === 0 ? (
              <div className="p-12 text-center">
                <Filter className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No complaints found</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new complaint.</p>
                <div className="mt-6">
                  <Link to="/complaints/new">
                    <Button>Submit Complaint</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                 {complaints.map(complaint => (
                   <li key={complaint.complaint_id}>
                     <Link to={`/complaints/${complaint.complaint_id}`} className="block hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                       <div className="px-4 py-4 sm:px-6">
                         <div className="flex items-center justify-between">
                           <div className="flex items-center text-sm font-medium text-primary truncate max-w-lg">
                              <StatusIcon status={complaint.status} />
                              <p className="ml-3 truncate font-semibold">{complaint.title}</p>
                           </div>
                           <div className="ml-2 flex-shrink-0 flex">
                             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(complaint.status)}`}>
                               {complaint.status.replace('_', ' ')}
                             </span>
                           </div>
                         </div>
                         <div className="mt-2 sm:flex sm:justify-between">
                           <div className="sm:flex text-sm text-gray-500 dark:text-gray-400">
                             <p className="flex items-center truncate">
                               {complaint.category_name}
                             </p>
                             <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                               <span className="truncate">{complaint.area}, {complaint.city}</span>
                             </p>
                           </div>
                           <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                             <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                             <p>
                               Filed on {new Date(complaint.created_at).toLocaleDateString()}
                             </p>
                           </div>
                         </div>
                       </div>
                     </Link>
                   </li>
                 ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
