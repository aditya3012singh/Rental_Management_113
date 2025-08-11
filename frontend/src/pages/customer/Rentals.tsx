import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { mockRentals } from '../../data/customerData';
import RentalCard from '../../components/customer/RentalCard';
import Pagination from '../../components/common/Pagination';
import { usePagination } from '../../hooks/usePagination';
import { Rental } from '../../types/customer';

const Rentals: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredRentals = mockRentals.filter(rental => {
    if (activeFilter === 'all') return true;
    return rental.status.toLowerCase() === activeFilter;
  });

  const pagination = usePagination<Rental>({ 
    data: filteredRentals, 
    itemsPerPage: 5 
  });

  const getStatusCount = (status: string) => {
    if (status === 'all') return mockRentals.length;
    return mockRentals.filter(r => r.status.toLowerCase() === status).length;
  };

  const handleExtend = (rentalId: string) => {
    console.log('Extend rental:', rentalId);
  };

  const handleTrack = (rentalId: string) => {
    console.log('Track rental:', rentalId);
  };

  const handleRate = (rentalId: string, rating: number) => {
    console.log('Rate rental:', rentalId, rating);
  };

  const handleUploadScan = (rentalId: string) => {
    console.log('Upload scan for rental:', rentalId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Rentals ({getStatusCount('all')})
          </button>
          <button
            onClick={() => setActiveFilter('active')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === 'active' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Active ({getStatusCount('active')})
          </button>
          <button
            onClick={() => setActiveFilter('upcoming')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === 'upcoming' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Upcoming ({getStatusCount('upcoming')})
          </button>
          <button
            onClick={() => setActiveFilter('completed')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === 'completed' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Completed ({getStatusCount('completed')})
          </button>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Rental
        </button>
      </div>

      <div className="space-y-4">
        {pagination.currentData.map((rental) => (
          <RentalCard
            key={rental.id}
            rental={rental}
            onExtend={handleExtend}
            onTrack={handleTrack}
            onRate={handleRate}
            onUploadScan={handleUploadScan}
          />
        ))}
      </div>

      {filteredRentals.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-gray-500 mb-4">No rentals found for the selected filter</div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Browse Products
          </button>
        </div>
      )}

      {filteredRentals.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            itemsPerPage={pagination.itemsPerPage}
            startIndex={pagination.startIndex}
            endIndex={pagination.endIndex}
            onPageChange={pagination.goToPage}
            canGoNext={pagination.canGoNext}
            canGoPrev={pagination.canGoPrev}
          />
        </div>
      )}
    </div>
  );
};

export default Rentals;