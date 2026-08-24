'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';

interface Order {
  _id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: any[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        setOrders(response.data.orders);
      } catch (error) {
        console.error('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const requestRefund = async (orderId: string) => {
    const reason = prompt('Enter refund reason:');
    if (!reason) return;

    try {
      await api.post('/payments/refund', { orderId, reason });
      alert('Refund requested successfully! ✅');
      // Refresh orders
      const response = await api.get('/orders');
      setOrders(response.data.orders);
    } catch (error: any) {
      alert('Refund request failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">📦 My Orders</h1>

        {loading ? (
          <div>Loading...</div>
        ) : orders.length === 0 ? (
          <div className="card bg-white text-center py-12">
            <p className="text-xl text-gray-600">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="card bg-white">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">Order #{order._id.slice(-8)}</h3>
                    <p className="text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full font-semibold ${
                    order.status === 'completed' ? 'bg-green-100 text-green-700' :
                    order.status === 'refunded' ? 'bg-orange-100 text-orange-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status.toUpperCase()}
                  </span>
                </div>

                <div className="border-t pt-4">
                  <p className="text-2xl font-bold text-green-600 mb-4">${order.totalAmount.toFixed(2)}</p>
                  <div className="flex gap-2">
                    {order.status === 'completed' && (
                      <button
                        onClick={() => requestRefund(order._id)}
                        className="btn btn-secondary"
                      >
                        Request Refund
                      </button>
                    )}
                    <button className="btn btn-primary">Download Invoice</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
