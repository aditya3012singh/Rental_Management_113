import React from 'react';
import { Download, Award } from 'lucide-react';

const Sustainability: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Environmental Impact Dashboard</h2>
        <p className="text-green-100">Track your platform's contribution to sustainability</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">2.4 Tons</div>
          <div className="text-gray-600">Total CO₂ Saved</div>
          <div className="text-sm text-green-600 mt-1">+18% this month</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">1,247</div>
          <div className="text-gray-600">Products Rented</div>
          <div className="text-sm text-blue-600 mt-1">vs 1,156 bought</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">$89K</div>
          <div className="text-gray-600">Customer Savings</div>
          <div className="text-sm text-purple-600 mt-1">vs buying new</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">156</div>
          <div className="text-gray-600">Trees Equivalent</div>
          <div className="text-sm text-orange-600 mt-1">CO₂ absorption</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">CO₂ Savings by Category</h3>
          <div className="space-y-4">
            {[
              { category: 'Power Tools', saved: '450 kg', percentage: '32%', color: 'bg-blue-500' },
              { category: 'Electronics', saved: '380 kg', percentage: '27%', color: 'bg-green-500' },
              { category: 'Furniture', saved: '290 kg', percentage: '21%', color: 'bg-purple-500' },
              { category: 'Sports Equipment', saved: '180 kg', percentage: '13%', color: 'bg-yellow-500' },
              { category: 'Others', saved: '100 kg', percentage: '7%', color: 'bg-gray-500' },
            ].map((item) => (
              <div key={item.category} className="flex items-center justify-between">
                <span className="text-gray-600">{item.category}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${item.color} h-2 rounded-full`} 
                      style={{ width: item.percentage }}
                    ></div>
                  </div>
                  <span className="font-medium text-gray-900 w-16 text-right">{item.saved}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sustainability Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-900">Eco Champion</span>
              </div>
              <span className="text-green-600 font-bold">Level 5</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Waste Reduction</span>
                <span className="font-medium">87%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '87%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Energy Efficiency</span>
                <span className="font-medium">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
          </div>
          <button className="w-full mt-4 bg-green-50 text-green-700 py-3 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center gap-2">
            <Download className="h-4 w-4" />
            Download Sustainability Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sustainability;