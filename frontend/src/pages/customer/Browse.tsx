import React, { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import { mockProducts, categories } from '../../data/customerData';
import ProductGrid from '../../components/customer/ProductGrid';
import { Product } from '../../types/customer';

const Browse: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const filteredProducts = useMemo(() => {
    let filtered = mockProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || 
                            product.category.toLowerCase().replace(' ', '-') === selectedCategory;
      
      let matchesPrice = true;
      if (priceRange !== 'all') {
        const [min, max] = priceRange.split('-').map(p => p === '100+' ? 1000 : parseInt(p));
        matchesPrice = product.price.day >= min && (max ? product.price.day <= max : true);
      }
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price.day - b.price.day);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price.day - a.price.day);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'eco':
        filtered.sort((a, b) => b.ecoScore - a.ecoScore);
        break;
      default:
        filtered.sort((a, b) => b.popularity - a.popularity);
    }

    return filtered;
  }, [searchTerm, selectedCategory, priceRange, sortBy]);

  const handleProductSelect = (product: Product) => {
    console.log('Selected product:', product.id);
    // Handle product selection (e.g., open rental modal)
  };

  const handleWishlistToggle = (productId: number) => {
    console.log('Toggle wishlist for product:', productId);
    // Handle wishlist toggle
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products, brands, or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <select 
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Prices</option>
              <option value="0-50">$0 - $50/day</option>
              <option value="50-100">$50 - $100/day</option>
              <option value="100+">$100+/day</option>
            </select>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="eco">Eco Score</option>
            </select>
          </div>
        </div>
      </div>

      {/* Featured Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {categories.slice(1).map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`bg-white rounded-lg p-4 text-center hover:shadow-md transition-all cursor-pointer border-2 ${
              selectedCategory === category.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
          >
            <div className="text-2xl mb-2">{category.icon}</div>
            <span className="text-sm font-medium text-gray-700">{category.name}</span>
            <div className="text-xs text-gray-500 mt-1">{category.count} items</div>
          </button>
        ))}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          {filteredProducts.length} Products Found
        </h2>
        <div className="text-sm text-gray-600">
          Showing results for "{searchTerm || 'all products'}"
        </div>
      </div>

      {/* Products Grid */}
      <ProductGrid
        products={filteredProducts}
        onProductSelect={handleProductSelect}
        onWishlistToggle={handleWishlistToggle}
      />
    </div>
  );
};

export default Browse;