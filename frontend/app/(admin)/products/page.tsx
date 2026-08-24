'use client';

import React, { useState } from 'react';
import api from '@/lib/api';

interface ProductForm {
  name: string;
  description: string;
  category: string;
  originalPrice: string;
  discountPercentage: string;
  discountedPrice: string;
}

export default function AdminProductsPage() {
  const [form, setForm] = useState<ProductForm>({
    name: '',
    description: '',
    category: '',
    originalPrice: '',
    discountPercentage: '75',
    discountedPrice: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await api.post('/products', {
        name: form.name,
        description: form.description,
        category: form.category,
        originalPrice: parseFloat(form.originalPrice),
        discountPercentage: parseFloat(form.discountPercentage),
        discountedPrice: parseFloat(form.discountedPrice),
      });

      setSuccess(true);
      setForm({
        name: '',
        description: '',
        category: '',
        originalPrice: '',
        discountPercentage: '75',
        discountedPrice: '',
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-4xl font-bold mb-8">📦 Add New Product</h1>

        <div className="card bg-white">
          {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>}
          {success && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">Product created successfully! ✅</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Product Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g., ChatGPT Plus"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Product description"
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="ai">AI Tools</option>
                  <option value="productivity">Productivity</option>
                  <option value="design">Design</option>
                  <option value="development">Development</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Original Price ($)</label>
                <input
                  type="number"
                  name="originalPrice"
                  value={form.originalPrice}
                  onChange={handleChange}
                  placeholder="e.g., 20"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Discount %</label>
                <input
                  type="number"
                  name="discountPercentage"
                  value={form.discountPercentage}
                  onChange={handleChange}
                  placeholder="e.g., 75"
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Discounted Price ($)</label>
                <input
                  type="number"
                  name="discountedPrice"
                  value={form.discountedPrice}
                  onChange={handleChange}
                  placeholder="e.g., 5"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-3 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Add Product'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
