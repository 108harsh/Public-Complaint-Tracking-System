import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { ShieldCheck, User, Users, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      setUsersList(res.data.users || []);
    } catch (err) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.patch(`/admin/users/${userId}/role`, { role: newRole });
      toast.success('Role updated successfully');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update role');
    }
  };

  const getRoleIcon = (role) => {
     switch(role) {
       case 'admin': return <ShieldAlert className="w-5 h-5 text-rose-500" />;
       case 'staff': return <ShieldCheck className="w-5 h-5 text-indigo-500" />;
       default: return <User className="w-5 h-5 text-gray-400" />;
     }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Users className="w-6 h-6 mr-2 text-primary" /> User Management
          </h1>
          <p className="text-gray-500 mt-1">Manage system access levels and roles.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10 rounded-xl overflow-hidden">
        {loading ? (
          <div className="animate-pulse p-6 space-y-4">
             {[1,2,3,4].map(i => <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-md"></div>)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Registered</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role Access</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {usersList.length === 0 ? (
                  <tr><td colSpan="3" className="px-6 py-12 text-center text-gray-500">No users found.</td></tr>
                ) : usersList.map((usr) => (
                  <tr key={usr.user_id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <div className="flex items-center">
                          {getRoleIcon(usr.role)}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{usr.full_name}</div>
                            <div className="text-sm text-gray-500">{usr.email}</div>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className="text-sm text-gray-900 dark:text-white">{new Date(usr.created_at).toLocaleDateString()}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <select 
                          className="text-sm rounded border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-1.5 focus:ring-primary focus:border-primary"
                          value={usr.role}
                          onChange={(e) => handleRoleChange(usr.user_id, e.target.value)}
                       >
                          <option value="citizen">Citizen</option>
                          <option value="staff">Staff</option>
                          <option value="admin">Admin</option>
                       </select>
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
