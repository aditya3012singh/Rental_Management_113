import React from 'react';
import { Plus, Clock, MapPin, Star } from 'lucide-react';
import { deliverySchedule } from '../data/mockData';

const Delivery: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <select className="px-4 py-2 border border-gray-300 rounded-lg">
            <option>Today's Schedule</option>
            <option>This Week</option>
            <option>All Pending</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg">
            <option>All Drivers</option>
            <option>Mike Wilson</option>
            <option>Lisa Chen</option>
            <option>Tom Rodriguez</option>
          </select>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Schedule Delivery
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Delivery Schedule</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {deliverySchedule.map((delivery) => (
                <div key={delivery.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        delivery.status === 'Completed' ? 'bg-green-500' :
                        delivery.status === 'In Progress' ? 'bg-blue-500' :
                        'bg-yellow-500'
                      }`}></div>
                      <span className="font-medium text-gray-900">{delivery.id}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        delivery.type === 'Pickup' ? 'bg-blue-100 text-blue-800' :
                        delivery.type === 'Return' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {delivery.type}
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      delivery.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      delivery.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {delivery.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900">{delivery.customer}</h4>
                      <p className="text-sm text-gray-600">{delivery.product}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <MapPin className="h-4 w-4" />
                        {delivery.address}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        {delivery.date} at {delivery.time}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Driver: <span className="font-medium">{delivery.driver}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        Track
                      </button>
                      <button className="text-green-600 hover:text-green-800 text-sm">
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Driver Performance</h3>
            <div className="space-y-4">
              {['Mike Wilson', 'Lisa Chen', 'Tom Rodriguez'].map((driver, index) => (
                <div key={driver} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{driver}</div>
                    <div className="text-sm text-gray-500">{3 + index} deliveries today</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{(4.7 + index * 0.1).toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Deliveries</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completed</span>
                <span className="font-medium text-green-600">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">In Progress</span>
                <span className="font-medium text-blue-600">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pending</span>
                <span className="font-medium text-yellow-600">1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Delivery;