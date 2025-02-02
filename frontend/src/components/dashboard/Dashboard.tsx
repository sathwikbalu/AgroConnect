import { useAuth } from "../../contexts/AuthContext";
import { Plane as Plant, Sun, CloudRain, Wind } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto bg-pattern min-h-screen py-8">
      <div className="glass-effect shadow-xl rounded-lg overflow-hidden">
        <div className="p-8">
          <div className="flex items-center space-x-4 mb-8">
            <Plant className="h-8 w-8 text-theme-700 animate-float" />
            <h2 className="text-3xl font-bold text-theme-800">
              Welcome, {user?.fullName}!
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/80 p-6 rounded-lg shadow-md">
              <Sun className="h-8 w-8 text-yellow-500 mb-4 animate-float" />
              <h3 className="text-lg font-semibold text-theme-800 mb-2">
                Today's Weather
              </h3>
              <p className="text-gray-600">Sunny, 25°C</p>
            </div>

            <div className="bg-white/80 p-6 rounded-lg shadow-md">
              <CloudRain className="h-8 w-8 text-blue-500 mb-4 animate-float" />
              <h3 className="text-lg font-semibold text-theme-800 mb-2">
                Rainfall Forecast
              </h3>
              <p className="text-gray-600">30% chance of rain</p>
            </div>

            <div className="bg-white/80 p-6 rounded-lg shadow-md">
              <Wind className="h-8 w-8 text-gray-500 mb-4 animate-float" />
              <h3 className="text-lg font-semibold text-theme-800 mb-2">
                Wind Speed
              </h3>
              <p className="text-gray-600">12 km/h NE</p>
            </div>
          </div>

          <div className="bg-white/80 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-theme-800 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-white rounded-lg">
                <Plant className="h-6 w-6 text-theme-600" />
                <div>
                  <p className="font-medium text-gray-800">
                    New crop listing added
                  </p>
                  <p className="text-sm text-gray-600">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-white rounded-lg">
                <Plant className="h-6 w-6 text-theme-600" />
                <div>
                  <p className="font-medium text-gray-800">
                    Weather alert: Rain expected
                  </p>
                  <p className="text-sm text-gray-600">5 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
