import { useState, useEffect } from "react";
import { MapPin, DollarSign, Package, Loader } from "lucide-react";
import { api } from "../../lib/api";
import { Crop } from "../../types";

interface Filters {
  minPrice?: number;
  maxPrice?: number;
  latitude?: number;
  longitude?: number;
}

interface CropWithDistance extends Crop {
  distance?: number;
}

export default function CropList() {
  const [crops, setCrops] = useState<CropWithDistance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<Filters>({});

  useEffect(() => {
    fetchCrops();
  }, [filters]);

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

  const fetchCrops = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.minPrice)
        params.append("minPrice", filters.minPrice.toString());
      if (filters.maxPrice)
        params.append("maxPrice", filters.maxPrice.toString());

      const response = await api.get(`/crops?${params.toString()}`);
      if (response.data.success) {
        let cropsWithDistance = response.data.crops;

        // If location filter is active, calculate and sort by distance
        if (filters.latitude && filters.longitude) {
          cropsWithDistance = cropsWithDistance
            .map((crop: CropWithDistance) => ({
              ...crop,
              distance: calculateDistance(
                filters.latitude!,
                filters.longitude!,
                crop.location.latitude,
                crop.location.longitude
              ),
            }))
            .sort(
              (a: CropWithDistance, b: CropWithDistance) =>
                (a.distance || 0) - (b.distance || 0)
            );
        }

        setCrops(cropsWithDistance);
      }
    } catch (err) {
      setError("Failed to fetch crops");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationFilter = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFilters((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("Failed to get your location");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
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
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Available Crops
        </h2>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Range
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                className="w-full rounded-lg border-gray-300 focus:ring-theme-500 focus:border-theme-500"
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    minPrice: Number(e.target.value),
                  }))
                }
              />
              <input
                type="number"
                placeholder="Max"
                className="w-full rounded-lg border-gray-300 focus:ring-theme-500 focus:border-theme-500"
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    maxPrice: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>

          <button
            onClick={handleLocationFilter}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-theme-600 hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
          >
            <MapPin className="h-5 w-5 mr-2" />
            Sort by Distance
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crops.map((crop) => (
          <div
            key={crop.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {crop.name}
                </h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {crop.status}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <Package className="h-5 w-5 mr-2" />
                  <span>
                    {crop.quantity} {crop.unit}
                  </span>
                </div>

                <div className="flex items-center text-gray-600">
                  <DollarSign className="h-5 w-5 mr-2" />
                  <span>
                    ${crop.price.toFixed(2)} per {crop.unit}
                  </span>
                </div>

                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  <div className="flex flex-col">
                    <span>
                      {crop.location.latitude.toFixed(2)},{" "}
                      {crop.location.longitude.toFixed(2)}
                    </span>
                    {crop.distance !== undefined && (
                      <span className="text-sm text-theme-600">
                        {crop.distance.toFixed(1)} km away
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Listed by {crop.farmerName}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(crop.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {crops.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No crops available matching your filters
          </p>
        </div>
      )}
    </div>
  );
}
