import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, MapPin, Calendar, CheckSquare, MessageSquare } from 'lucide-react';

export default function ComplaintDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/complaints/${id}`);
        setData(res.data);
      } catch (err) {
        console.error('Error fetching detail', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <div className="animate-pulse space-y-4 max-w-4xl mx-auto"><div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div><div className="h-64 bg-gray-200 dark:bg-gray-700 rounded w-full"></div></div>;

  if (!data || !data.complaint) return <div>Complaint not found.</div>;

  const { complaint, timeline } = data;

  const getStatusColor = (status) => {
    switch(status) {
      case 'resolved': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'in_progress': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'rejected': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/complaints" className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 mb-6">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to complaints
      </Link>

      <div className="bg-white dark:bg-gray-800 shadow-sm ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10 rounded-2xl overflow-hidden mb-8">
         <div className="px-6 py-6 border-b border-gray-200 dark:border-gray-700 sm:flex sm:items-center sm:justify-between">
           <div>
              <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400 mb-2">
                 <span className="font-medium bg-gray-100 dark:bg-gray-700 px-2.5 py-0.5 rounded-full">{complaint.category_name}</span>
                 <span className="flex items-center text-xs"><Calendar className="w-3.5 h-3.5 mr-1" /> {new Date(complaint.created_at).toLocaleDateString()}</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{complaint.title}</h1>
           </div>
           <div className="mt-4 sm:mt-0 flex-shrink-0">
              <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold border capitalize ${getStatusColor(complaint.status)}`}>
                 {complaint.status.replace('_', ' ')}
              </span>
           </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-700">
           <div className="col-span-2 p-6">
             <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">Description</h3>
             <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{complaint.description}</p>
             
             {complaint.image_url && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">Attached Photo</h3>
                  <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                     <img src={complaint.image_url} alt="Complaint attachment" className="w-full h-auto object-cover" />
                  </div>
                </div>
             )}
           </div>
           
           <div className="col-span-1 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-6">
             <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center">
               <MapPin className="w-4 h-4 mr-2 text-gray-500" /> Location Details
             </h3>
             <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-gray-500 dark:text-gray-400">Area</dt>
                  <dd className="font-medium text-gray-900 dark:text-white">{complaint.area}</dd>
                </div>
                <div>
                  <dt className="text-gray-500 dark:text-gray-400">Street</dt>
                  <dd className="font-medium text-gray-900 dark:text-white">{complaint.street}</dd>
                </div>
                <div>
                  <dt className="text-gray-500 dark:text-gray-400">City</dt>
                  <dd className="font-medium text-gray-900 dark:text-white">{complaint.city} - {complaint.pincode}</dd>
                </div>
             </dl>
           </div>
         </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10 rounded-2xl overflow-hidden p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <CheckSquare className="w-5 h-5 mr-2 text-primary" /> Status Timeline
        </h3>
        
        <div className="flow-root">
          <ul role="list" className="-mb-8">
            {timeline.length === 0 ? (
               <li className="text-sm text-gray-500 pb-8">No status updates yet. It is currently pending review.</li>
            ) : timeline.map((log, logIdx) => (
              <li key={log.log_id}>
                <div className="relative pb-8">
                  {logIdx !== timeline.length - 1 ? (
                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true" />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-800 ${log.new_status === 'resolved' ? 'bg-emerald-500' : 'bg-primary'}`}>
                        {log.new_status === 'resolved' ? <CheckCircle2 className="h-5 w-5 text-white" aria-hidden="true" /> : <MessageSquare className="h-4 w-4 text-white" aria-hidden="true" />}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Status changed from <span className="font-medium text-gray-900 dark:text-white capitalize">{log.old_status}</span> to{' '}
                          <span className="font-medium text-gray-900 dark:text-white capitalize">{log.new_status}</span>
                        </p>
                        {log.note && (
                           <div className="mt-2 text-sm bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                              <p className="text-gray-700 dark:text-gray-300 italic">"{log.note}"</p>
                              <p className="text-xs text-gray-500 mt-1">- {log.changed_by_name} ({log.role})</p>
                           </div>
                        )}
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        <time dateTime={log.changed_at}>{new Date(log.changed_at).toLocaleDateString()}</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
