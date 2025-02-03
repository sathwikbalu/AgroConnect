import { useState, useEffect } from 'react';
import { PenTool as Tool, DollarSign, Calendar, Loader, Filter } from 'lucide-react';
import { api } from '../../lib/api';
import { Resource } from '../../types';
import ResourceRequestModal from './ResourceRequestModal';

export default function ResourceList() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [filters, setFilters] = useState({
    type: '',
    availability: '',
    maxPrice: ''
  });

  useEffect(() => {
    fetchResources();
  }, [filters]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.availability) params.append('availability', filters.availability);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

      const response = await api.get(`/resources?${params.toString()}`);
      if (response.data.success) {
        setResources(response.data.resources);
      }
    } catch (err) {
      setError('Failed to fetch resources');
      console.error(err);
    } finally {
      setLoading(false);
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
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Resources</h2>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resource Type
            </label>
            <select
              className="w-full rounded-lg border-gray-300 focus:ring-theme-500 focus:border-theme-500"
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            >
              <option value="">All Types</option>
              <option value="equipment">Equipment</option>
              <option value="tool">Tool</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Availability
            </label>
            <select
              className="w-full rounded-lg border-gray-300 focus:ring-theme-500 focus:border-theme-500"
              value={filters.availability}
              onChange={(e) => setFilters(prev => ({ ...prev, availability: e.target.value }))}
            >
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="in_use">In Use</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Price per Day
            </label>
            <input
              type="number"
              placeholder="Enter max price"
              className="w-full rounded-lg border-gray-300 focus:ring-theme-500 focus:border-theme-500"
              value={filters.maxPrice}
              onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{resource.name}</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  resource.availability === 'available' 
                    ? 'bg-green-100 text-green-800'
                    : resource.availability === 'in_use'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {resource.availability}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <Tool className="h-5 w-5 mr-2" />
                  <span>{resource.type}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <DollarSign className="h-5 w-5 mr-2" />
                  <span>${resource.pricePerDay.toFixed(2)} per day</span>
                </div>

                <p className="text-gray-600 mt-2">{resource.description}</p>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      Owner: {resource.ownerName}
                    </p>
                    <p className="text-xs text-gray-500">
                      Listed {new Date(resource.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  {resource.availability === 'available' && (
                    <button
                      onClick={() => setSelectedResource(resource)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-theme-600 hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      Request
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {resources.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No resources available matching your filters</p>
        </div>
      )}

      {selectedResource && (
        <ResourceRequestModal
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
          onSuccess={() => {
            setSelectedResource(null);
            fetchResources();
          }}
        />
      )}
    </div>
  );
}