import React from 'react';
import { Star, Heart, Eye, Share2, MapPin, Leaf } from 'lucide-react';
import { Product } from '../../types/customer';
import Pagination from '../common/Pagination';
import { usePagination } from '../../hooks/usePagination';

interface ProductGridProps {
  products: Product[];
  onProductSelect?: (product: Product) => void;
  onWishlistToggle?: (productId: number) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  onProductSelect, 
  onWishlistToggle 
}) => {
  const pagination = usePagination<Product>({ 
    data: products, 
    itemsPerPage: 12 
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pagination.currentData.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
            <div className="relative">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3 flex flex-col gap-2">
                {product.discount > 0 && (
                  <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    -{product.discount}%
                  </span>
                )}
                <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Eco: {product.ecoScore}
                </span>
                {!product.available && (
                  <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs">
                    Unavailable
                  </span>
                )}
              </div>
              <button 
                onClick={() => onWishlistToggle?.(product.id)}
                className="absolute top-3 left-3 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
              >
                <Heart className={`h-4 w-4 ${product.isWishlisted ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
              </button>
              <div className="absolute bottom-3 left-3 right-3">
                <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    <span>{product.distance} away</span>
                    <span>•</span>
                    <span>{product.deliveryTime}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">{product.category}</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-sm text-gray-500">({product.reviews})</span>
                </div>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2">{product.name}</h3>
              
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold text-gray-900">${product.price.day}</span>
                  <span className="text-gray-500">/day</span>
                  {product.discount > 0 && (
                    <span className="text-sm text-gray-400 line-through">${Math.round(product.price.day / (1 - product.discount/100))}</span>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  ${product.price.week}/week • ${product.price.month}/month
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1 text-green-600">
                    <Leaf className="h-4 w-4" />
                    <span className="text-sm font-medium">Save {product.co2Saved} CO₂</span>
                  </div>
                  <div className="text-sm text-blue-600 font-medium">
                    {product.savings}
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  📍 {product.location}
                </div>
              </div>
              
              <div className="mb-4">
                <div className="text-xs text-gray-500 mb-1">Key Features:</div>
                <div className="flex flex-wrap gap-1">
                  {product.features.slice(0, 2).map((feature, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {feature}
                    </span>
                  ))}
                  {product.features.length > 2 && (
                    <span className="text-xs text-gray-500">+{product.features.length - 2} more</span>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => onProductSelect?.(product)}
                  className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                    product.available
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!product.available}
                >
                  {product.available ? 'Rent Now' : 'Notify When Available'}
                </button>
                <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length > 0 && (
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

export default ProductGrid;