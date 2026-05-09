import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Clock, CheckCircle2, AlertCircle, XCircle, Filter, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStr, setFilterStr] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [updateNote, setUpdateNote] = useState('');

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      let url = '/admin/complaints';
      if (filterStr !== 'all') {
        url += `?status=${filterStr}`;
      }
      const res = await api.get(url);
      setComplaints(res.data.complaints || []);
    } catch (err) {
      toast.error('Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
      case 'resolved': return 'bg-emerald-100 text-emerald-800';
      case 'in_progress': return 'bg-indigo-100 text-indigo-800';
      case 'rejected': return 'bg-rose-100 text-rose-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const handleUpdateStatus = async (complaintId) => {
    try {
      if(!newStatus) return toast.error('Select a status');
      await api.patch(`/admin/complaints/${complaintId}`, {
        status: newStatus,
        note: updateNote
      });
      toast.success('Status updated successfully');
      setEditingId(null);
      setNewStatus('');
      setUpdateNote('');
      fetchComplaints();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Complaints</h1>
          <p className="text-gray-500 mt-1">Review and update civic duty reports.</p>
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
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10 rounded-xl overflow-hidden">
        {loading ? (
          <div className="animate-pulse p-6 space-y-4">
             {[1,2,3,4,5].map(i => <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-md"></div>)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Complaint</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Citizen</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {complaints.length === 0 ? (
                  <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-500">No complaints found.</td></tr>
                ) : complaints.map((complaint) => (
                  <tr key={complaint.complaint_id}>
                    <td className="px-6 py-4">
                       <div className="flex items-center">
                          <StatusIcon status={complaint.status} />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{complaint.title}</div>
                            <div className="text-sm text-gray-500">{complaint.category_name}</div>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <div className="text-sm text-gray-900 dark:text-white">{complaint.citizen_name}</div>
                       <div className="text-sm text-gray-500">{complaint.citizen_email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(complaint.status)}`}>
                         {complaint.status.replace('_', ' ')}
                       </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                       {editingId === complaint.complaint_id ? (
                          <div className="flex flex-col space-y-2 items-end">
                            <select 
                              className="text-sm rounded border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-1"
                              value={newStatus}
                              onChange={(e) => setNewStatus(e.target.value)}
                            >
                               <option value="" disabled>Select Status</option>
                               <option value="pending">Pending</option>
                               <option value="in_progress">In Progress</option>
                               <option value="resolved">Resolved</option>
                               <option value="rejected">Rejected</option>
                            </select>
                            <input 
                              type="text" 
                              placeholder="Update Note (Optional)" 
                              className="text-sm rounded border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-1 w-48"
                              value={updateNote}
                              onChange={(e) => setUpdateNote(e.target.value)}
                            />
                            <div className="flex space-x-2">
                               <button onClick={() => setEditingId(null)} className="text-xs text-gray-500 hover:text-gray-700">Cancel</button>
                               <button onClick={() => handleUpdateStatus(complaint.complaint_id)} className="text-xs text-primary hover:text-indigo-800 font-bold">Save</button>
                            </div>
                          </div>
                       ) : (
                          <button onClick={() => setEditingId(complaint.complaint_id)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center justify-end w-full">
                            <Edit className="w-4 h-4 mr-1" /> Edit
                          </button>
                       )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
