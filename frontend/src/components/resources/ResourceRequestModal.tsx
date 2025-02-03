import { useState } from 'react';
import { Calendar, DollarSign, MessageSquare, X, Loader } from 'lucide-react';
import { api } from '../../lib/api';
import { Resource } from '../../types';

interface ResourceRequestModalProps {
  resource: Resource;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ResourceRequestModal({ resource, onClose, onSuccess }: ResourceRequestModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    offerAmount: resource.pricePerDay.toString(),
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);

      const response = await api.post(`/resources/${resource.id}/request`, {
        ...formData,
        offerAmount: Number(formData.offerAmount)
      });

      if (response.data.success) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Request Resource
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-theme-500 focus:border-theme-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-theme-500 focus:border-theme-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Offer Amount (per day)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.offerAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, offerAmount: e.target.value }))}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-theme-500 focus:border-theme-500"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Listed price: ${resource.pricePerDay}/day
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Message to Owner
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <MessageSquare className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-theme-500 focus:border-theme-500"
                  placeholder="Explain your need for the resource..."
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-theme-600 hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500 disabled:opacity-50"
              >
                {loading ? (
                  <Loader className="animate-spin h-5 w-5" />
                ) : (
                  'Submit Request'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}