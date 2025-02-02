import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, DollarSign, Package, Loader, Sprout } from "lucide-react";
import { api } from "../../lib/api";
import { useAuth } from "../../contexts/AuthContext";

export default function CropForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    unit: "",
    price: "",
    description: "",
    location: {
      latitude: "",
      longitude: "",
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);

      const response = await api.post("/crops", {
        ...formData,
        quantity: Number(formData.quantity),
        price: Number(formData.price),
        location: {
          latitude: Number(formData.location.latitude),
          longitude: Number(formData.location.longitude),
        },
      });

      if (response.data.success) {
        navigate("/crops");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create crop listing"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            location: {
              latitude: position.coords.latitude.toString(),
              longitude: position.coords.longitude.toString(),
            },
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

  if (user?.role !== "farmer") {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Only farmers can create crop listings</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Sprout className="h-8 w-8 text-theme-600" />
            <h2 className="text-2xl font-bold text-gray-900">List Your Crop</h2>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Crop Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-theme-500 focus:border-theme-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      quantity: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-theme-500 focus:border-theme-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Unit
                </label>
                <select
                  required
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, unit: e.target.value }))
                  }
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-theme-500 focus:border-theme-500"
                >
                  <option value="">Select unit</option>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="ton">Tons</option>
                  <option value="lb">Pounds (lb)</option>
                  <option value="piece">Pieces</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price per {formData.unit || "unit"}
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
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, price: e.target.value }))
                  }
                  className="block w-full pl-7 rounded-lg border-gray-300 focus:ring-theme-500 focus:border-theme-500"
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
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-theme-500 focus:border-theme-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-theme-700 bg-theme-100 hover:bg-theme-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  Get Current Location
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  required
                  placeholder="Latitude"
                  value={formData.location.latitude}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: { ...prev.location, latitude: e.target.value },
                    }))
                  }
                  className="block w-full rounded-lg border-gray-300 focus:ring-theme-500 focus:border-theme-500"
                  step="any"
                />
                <input
                  type="number"
                  required
                  placeholder="Longitude"
                  value={formData.location.longitude}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: { ...prev.location, longitude: e.target.value },
                    }))
                  }
                  className="block w-full rounded-lg border-gray-300 focus:ring-theme-500 focus:border-theme-500"
                  step="any"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-theme-600 hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500 disabled:opacity-50"
            >
              {loading ? (
                <Loader className="animate-spin h-5 w-5" />
              ) : (
                "Create Listing"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
