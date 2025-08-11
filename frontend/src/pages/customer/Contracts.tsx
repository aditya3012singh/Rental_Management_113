import React, { useState } from 'react';
import { Download, Eye, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { mockContracts } from '../../data/customerData';
import Pagination from '../../components/common/Pagination';
import { usePagination } from '../../hooks/usePagination';
import { Contract } from '../../types/customer';

const Contracts: React.FC = () => {
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  const pagination = usePagination<Contract>({ 
    data: mockContracts, 
    itemsPerPage: 10 
  });

  const handleViewContract = (contract: Contract) => {
    setSelectedContract(contract);
  };

  const handleDownloadContract = (contract: Contract) => {
    console.log('Download contract:', contract.id);
    // Handle contract download
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Rental Contracts</h2>
          <p className="text-gray-600 mt-1">View and manage your rental agreements</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contract</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rental</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Signed Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pagination.currentData.map((contract) => (
                <tr key={contract.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <span className="font-medium text-gray-900">{contract.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{contract.rentalId}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full font-medium ${
                      contract.status === 'Active' ? 'bg-green-100 text-green-800' :
                      contract.status === 'Completed' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {contract.status === 'Active' && <CheckCircle className="h-3 w-3" />}
                      {contract.status === 'Completed' && <CheckCircle className="h-3 w-3" />}
                      {contract.status === 'Pending' && <Clock className="h-3 w-3" />}
                      {contract.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{contract.totalAmount}</div>
                      <div className="text-sm text-gray-500">Deposit: {contract.deposit}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{contract.signedDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewContract(contract)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDownloadContract(contract)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
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

      {/* Contract Details Modal */}
      {selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Contract Details</h3>
                <button
                  onClick={() => setSelectedContract(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Contract ID</label>
                  <div className="text-gray-900">{selectedContract.id}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Rental ID</label>
                  <div className="text-gray-900">{selectedContract.rentalId}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="text-gray-900">{selectedContract.status}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Signed Date</label>
                  <div className="text-gray-900">{selectedContract.signedDate}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Total Amount</label>
                  <div className="text-lg font-semibold text-gray-900">{selectedContract.totalAmount}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Deposit</label>
                  <div className="text-lg font-semibold text-gray-900">{selectedContract.deposit}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Insurance</label>
                  <div className="text-lg font-semibold text-gray-900">{selectedContract.insurance}</div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500 mb-2 block">Terms & Conditions</label>
                <ul className="space-y-2">
                  {selectedContract.terms.map((term, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>{term}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Cancellation Policy</label>
                <div className="text-gray-900">{selectedContract.cancellationPolicy}</div>
              </div>
              
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => handleDownloadContract(selectedContract)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </button>
                <button
                  onClick={() => setSelectedContract(null)}
                  className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contracts;