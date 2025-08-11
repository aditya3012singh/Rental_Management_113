import React from 'react';
import { Calendar, Clock, MapPin, Leaf, Truck, AlertCircle, Plus, Star } from 'lucide-react';
import { Rental } from '../../types/customer';

interface RentalCardProps {
  rental: Rental;
  onExtend?: (rentalId: string) => void;
  onTrack?: (rentalId: string) => void;
  onRate?: (rentalId: string, rating: number) => void;
  onUploadScan?: (rentalId: string) => void;
}

const RentalCard: React.FC<RentalCardProps> = ({ 
  rental, 
  onExtend, 
  onTrack, 
  onRate, 
  onUploadScan 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start gap-6">
          <img 
            src={rental.image} 
            alt={rental.product}
            className="w-24 h-24 object-cover rounded-lg"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <div className="text-lg font-semibold text-gray-900">{rental.id}</div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  rental.status === 'Active' ? 'bg-green-100 text-green-800' : 
                  rental.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                  rental.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {rental.status}
                </span>
                {rental.status === 'Active' && (
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${rental.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{rental.progress}%</span>
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-gray-900">{rental.amount}</div>
                <div className="text-sm text-gray-500">{rental.duration}</div>
              </div>
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 mb-3">{rental.product}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Pickup: {rental.pickup}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Return: {rental.return}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{rental.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600 font-medium">CO₂: {rental.co2Saved}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-600 font-medium">{rental.nextAction}</span>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => onTrack?.(rental.id)}
                  className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                >
                  Track Order
                </button>
                {rental.canExtend && (
                  <button 
                    onClick={() => onExtend?.(rental.id)}
                    className="bg-green-50 text-green-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
                  >
                    Extend Rental
                  </button>
                )}
                {rental.status === 'Active' && (
                  <button 
                    onClick={() => onUploadScan?.(rental.id)}
                    className="bg-purple-50 text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors"
                  >
                    Upload Return Scan
                  </button>
                )}
                {rental.status === 'Completed' && !rental.rating && (
                  <button 
                    onClick={() => onRate?.(rental.id, 5)}
                    className="bg-yellow-50 text-yellow-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-100 transition-colors"
                  >
                    Rate Experience
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {rental.status === 'Active' && (
        <div className="bg-blue-50 px-6 py-3 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-800">Tracking ID: {rental.trackingId}</span>
            </div>
            <button className="text-blue-600 text-sm hover:text-blue-800">View Timeline</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentalCard;