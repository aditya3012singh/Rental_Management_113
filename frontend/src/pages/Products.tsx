import React, { useState, useMemo } from 'react';
import { mockProducts } from '../data/mockData';
import ProductCard from '../components/products/ProductCard';
import ProductFilters from '../components/products/ProductFilters';
import Pagination from '../components/common/Pagination';
import { usePagination } from '../hooks/usePagination';
import { Product } from '../types';

const Products: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return mockProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [mockProducts, searchTerm, selectedCategory]);

  const pagination = usePagination<Product>({ 
    data: filteredProducts, 
    itemsPerPage: 12 
  });

  const handleEdit = (product: Product) => {
    console.log('Edit product:', product.id);
  };

  const handleViewDetails = (product: Product) => {
    console.log('View product details:', product.id);
  };

  const handleAddProduct = () => {
    console.log('Add new product');
  };

  return (
    <div className="space-y-6">
      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onAddProduct={handleAddProduct}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Products ({pagination.totalItems} found)
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {pagination.currentData.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEdit}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>

        {pagination.currentData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">No products found matching your criteria</div>
          </div>
        )}
      </div>

      {filteredProducts.length > 0 && (
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

export default Products;