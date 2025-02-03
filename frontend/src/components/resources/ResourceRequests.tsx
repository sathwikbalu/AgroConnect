import { useState, useEffect } from 'react';
import { Calendar, DollarSign, Clock, CheckCircle, XCircle, Loader } from 'lucide-react';
import { api } from '../../lib/api';

interface ResourceRequest {
  id: string;
  resource: {
    id: string;
    name: string;
    type: string;
    pricePerDay: number;
  };
  requester: {
    id: string;
    name: string;
    email: string;
  };
  startDate: string;
  endDate: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  offerAmount: number;
  message: string;
  createdAt: string;
}

export default function ResourceRequests() {
  const [requests, setRequests] = useState<ResourceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get('/resources/requests');
      if (response.data.success) {
        setRequests(response.data.requests);
      }
    } catch (err) {
      setError('Failed to fetch requests');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (requestId: string, status: 'accepted' | 'rejected') => {
    try {
      const response = await api.patch(`/resources/requests/${requestId}/respond`, { status });
      if (response.data.success) {
        fetchRequests();
      }
    } catch (err) {
      setError('Failed to update request');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader className="w-8 h-8 animate-spin text-theme-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Resource Requests</h2>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {requests.map((request) => (
          <div
            key={request.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {request.resource.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {request.resource.type}
                  </p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  request.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : request.status === 'accepted'
                    ? 'bg-green-100 text-green-800'
                    : request.status === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {request.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>
                      {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="h-5 w-5 mr-2" />
                    <span>
                      Offered: ${request.offerAmount}/day (Listed: ${request.resource.pricePerDay}/day)
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Requester Details</h4>
                  <p className="text-gray-600">{request.requester.name}</p>
                  <p className="text-gray-600">{request.requester.email}</p>
                </div>
              </div>

              {request.message && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">{request.message}</p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Requested {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                  
                  {request.status === 'pending' && (
                    <div className="space-x-2">
                      <button
                        onClick={() => handleResponse(request.id, 'accepted')}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Accept
                      </button>
                      <button
                        onClick={() => handleResponse(request.id, 'rejected')}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {requests.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No resource requests found</p>
          </div>
        )}
      </div>
    </div>
  );
}