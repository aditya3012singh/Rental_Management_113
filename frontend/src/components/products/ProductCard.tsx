import React from 'react';
import { Star } from 'lucide-react';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onViewDetails }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Eco: {product.ecoScore}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            product.condition === 'Excellent' ? 'bg-green-100 text-green-800' :
            product.condition === 'Good' ? 'bg-blue-100 text-blue-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {product.condition}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-500">{product.category}</span>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">{product.rating}</span>
          </div>
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-3">{product.name}</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className="text-gray-500">Stock:</span>
            <span className="font-medium ml-1">{product.stock}</span>
          </div>
          <div>
            <span className="text-gray-500">Available:</span>
            <span className="font-medium ml-1 text-green-600">{product.available}</span>
          </div>
          <div>
            <span className="text-gray-500">Rented:</span>
            <span className="font-medium ml-1 text-blue-600">{product.rented}</span>
          </div>
          <div>
            <span className="text-gray-500">Revenue:</span>
            <span className="font-medium ml-1">{product.revenue}</span>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-2">Pricing Structure:</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span>${product.price.day}/day</span>
            <span>${product.price.week}/week</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-500">
            Last Maintenance: {product.lastMaintenance}
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => onEdit?.(product)}
            className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
          >
            Edit
          </button>
          <button 
            onClick={() => onViewDetails?.(product)}
            className="flex-1 bg-green-50 text-green-600 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;