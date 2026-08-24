'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Order {
  _id: string;
  userId: any;
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface Analytics {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('analytics');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [analyticsRes, usersRes, ordersRes] = await Promise.all([
        api.get('/admin/analytics'),
        api.get('/admin/users'),
        api.get('/admin/orders'),
      ]);

      setAnalytics(analyticsRes.data.analytics);
      setUsers(usersRes.data.users);
      setOrders(ordersRes.data.orders);
    } catch (error) {
      console.error('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading admin dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">👨‍💼 Admin Dashboard</h1>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card bg-blue-500 text-white">
            <h3 className="text-sm opacity-80">Total Users</h3>
            <p className="text-3xl font-bold">{analytics?.totalUsers || 0}</p>
          </div>
          <div className="card bg-green-500 text-white">
            <h3 className="text-sm opacity-80">Total Orders</h3>
            <p className="text-3xl font-bold">{analytics?.totalOrders || 0}</p>
          </div>
          <div className="card bg-purple-500 text-white">
            <h3 className="text-sm opacity-80">Total Revenue</h3>
            <p className="text-3xl font-bold">${(analytics?.totalRevenue || 0).toFixed(2)}</p>
          </div>
          <div className="card bg-orange-500 text-white">
            <h3 className="text-sm opacity-80">Avg Order Value</h3>
            <p className="text-3xl font-bold">${(analytics?.averageOrderValue || 0).toFixed(2)}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-2 rounded-lg font-semibold ${
              activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-2 rounded-lg font-semibold ${
              activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2 rounded-lg font-semibold ${
              activeTab === 'orders' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'
            }`}
          >
            Orders ({orders.length})
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="card bg-white">
            <h2 className="text-2xl font-bold mb-4">👥 Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Name</th>
                    <th className="text-left py-2">Email</th>
                    <th className="text-left py-2">Role</th>
                    <th className="text-left py-2">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 font-semibold">{user.name}</td>
                      <td className="py-3">{user.email}</td>
                      <td className="py-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          user.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {user.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="card bg-white">
            <h2 className="text-2xl font-bold mb-4">📦 Orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Order ID</th>
                    <th className="text-left py-2">Customer</th>
                    <th className="text-left py-2">Amount</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 font-mono text-sm">{order._id.slice(-8)}</td>
                      <td className="py-3">{order.userId?.name || 'Unknown'}</td>
                      <td className="py-3 font-bold text-green-600">${order.totalAmount.toFixed(2)}</td>
                      <td className="py-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          order.status === 'completed' ? 'bg-green-100 text-green-700' :
                          order.status === 'refunded' ? 'bg-orange-100 text-orange-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
