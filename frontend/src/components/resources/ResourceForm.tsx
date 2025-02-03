import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PenTool as Tool, DollarSign, Loader, Wrench } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

export default function ResourceForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    type: 'equipment',
    pricePerDay: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);

      const response = await api.post('/resources', {
        ...formData,
        pricePerDay: Number(formData.pricePerDay),
        availability: 'available'
      });

      if (response.data.success) {
        navigate('/resources');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create resource listing');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'farmer') {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Only farmers can create resource listings</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Wrench className="h-8 w-8 text-theme-600" />
            <h2 className="text-2xl font-bold text-gray-900">List Your Resource</h2>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Resource Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-theme-500 focus:border-theme-500"
                placeholder="e.g., Tractor, Harvester, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-theme-500 focus:border-theme-500"
              >
                <option value="equipment">Equipment</option>
                <option value="tool">Tool</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price per Day
              </label>
              <div className="mt-1 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.pricePerDay}
                  onChange={(e) => setFormData(prev => ({ ...prev, pricePerDay: e.target.value }))}
                  className="block w-full pl-7 rounded-lg border-gray-300 focus:ring-theme-500 focus:border-theme-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-theme-500 focus:border-theme-500"
                placeholder="Describe the resource, its condition, and any special requirements..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-theme-600 hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500 disabled:opacity-50"
            >
              {loading ? (
                <Loader className="animate-spin h-5 w-5" />
              ) : (
                'Create Listing'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}