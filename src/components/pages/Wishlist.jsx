import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import { useWishlist } from '@/hooks/useWishlist';
import { productService } from '@/services/api/productService';
import { useCart } from '@/hooks/useCart';
import { motion } from 'framer-motion';

const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlistItems, loading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);

  // Load product details for wishlist items
  useEffect(() => {
    const loadProducts = async () => {
      if (wishlistItems.length === 0) {
        setProducts([]);
        return;
      }

      try {
        setProductsLoading(true);
        const allProducts = await productService.getAll();
        const wishlistProducts = allProducts.filter(product => 
          wishlistItems.some(item => item.productId === product.Id)
        );
        setProducts(wishlistProducts);
      } catch (error) {
        console.error('Failed to load wishlist products:', error);
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };

    loadProducts();
  }, [wishlistItems]);

  const handleRemoveFromWishlist = async (productId) => {
    await removeFromWishlist(productId);
  };

  const handleAddToCart = (productId) => {
    addToCart(productId, 1);
  };

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading || productsLoading) {
    return <Loading message="Loading your wishlist..." />;
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-display text-secondary mb-2">
              My Wishlist
            </h1>
            <p className="text-gray-600 font-body">
              Save your favorite products for later
            </p>
          </div>
          
          <Empty
            icon="Heart"
            title="Your wishlist is empty"
            message="Start adding products to your wishlist to see them here"
            action={
              <Button
                onClick={() => navigate('/')}
                className="mt-4"
              >
                <ApperIcon name="ShoppingBag" className="w-4 h-4 mr-2" />
                Start Shopping
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display text-secondary mb-2">
            My Wishlist
          </h1>
          <p className="text-gray-600 font-body">
            {products.length} {products.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
            >
              {/* Product Image */}
              <div 
                className="aspect-square bg-gray-100 relative overflow-hidden cursor-pointer"
                onClick={() => handleViewProduct(product.Id)}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <ApperIcon name="Package" className="w-16 h-16 text-gray-400" />
                </div>
                
                {/* Remove from Wishlist Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFromWishlist(product.Id);
                  }}
                  className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all duration-200"
                >
                  <ApperIcon name="X" className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 
                  className="font-semibold font-body text-secondary mb-1 line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleViewProduct(product.Id)}
                >
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold font-display text-primary">
                    ${product.price}
                  </span>
                  {product.rating && (
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="Star" className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{product.rating}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button
                    onClick={() => handleAddToCart(product.Id)}
                    className="w-full"
                    size="sm"
                  >
                    <ApperIcon name="ShoppingCart" className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    onClick={() => handleViewProduct(product.Id)}
                    variant="outline"
                    className="w-full"
                    size="sm"
                  >
                    <ApperIcon name="Eye" className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Continue Shopping */}
        <div className="mt-12 text-center">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            size="lg"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;