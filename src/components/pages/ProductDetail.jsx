import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productService } from "@/services/api/productService";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import StarRating from "@/components/atoms/StarRating";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ProductGrid from "@/components/organisms/ProductGrid";
import Home from "@/components/pages/Home";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const loadProduct = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError("");
      const productData = await productService.getById(id);
      setProduct(productData);
      setSelectedImageIndex(0);
      loadRelatedProducts(id);
    } catch (err) {
      setError("Failed to load product details");
      console.error("Product detail loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedProducts = async (productId) => {
    try {
      setRelatedLoading(true);
      const related = await productService.getRelatedProducts(productId);
      setRelatedProducts(related);
    } catch (err) {
      console.error("Related products loading error:", err);
    } finally {
      setRelatedLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

const handleAddToCart = async () => {
    if (!product) {
toast.error('Product information not available');
      return;
    }
    
    if (addingToCart) {
      return; // Prevent duplicate requests
    }
    
    if (isOutOfStock) {
toast.error('Product is out of stock');
      return;
    }

    try {
      setAddingToCart(true);
      await addToCart(product.Id, quantity);
      // Success toast is handled by the useCart hook
      // Add visual feedback with cart animation
      const button = document.querySelector('[data-cart-button]');
      if (button) {
        button.classList.add('animate-bounce-cart');
        setTimeout(() => {
          button.classList.remove('animate-bounce-cart');
        }, 600);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
toast.error('Failed to add item to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product.Id, quantity);
      navigate("/checkout");
    }
  };

  if (loading) {
    return <Loading message="Loading product details..." />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadProduct} />;
  }

  if (!product) {
    return <ErrorView message="Product not found" showRetry={false} />;
  }

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock < 10 && product.stock > 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600 font-body">
            <button onClick={() => navigate("/")} className="hover:text-primary">
              Home
            </button>
            <ApperIcon name="ChevronRight" className="w-4 h-4" />
            <button 
              onClick={() => navigate(`/?category=${product.category}`)}
              className="hover:text-primary"
            >
              {product.category}
            </button>
            <ApperIcon name="ChevronRight" className="w-4 h-4" />
            <span className="text-secondary">{product.name}</span>
          </div>
        </nav>

        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div
              key={selectedImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square bg-gray-100 rounded-xl overflow-hidden"
            >
              <img
                src={product.images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex space-x-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === selectedImageIndex 
                        ? "border-primary" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category */}
            <div className="text-primary font-medium text-sm uppercase tracking-wider">
              {product.category}
            </div>

            {/* Title and Rating */}
            <div className="space-y-4">
              <h1 className="text-3xl lg:text-4xl font-bold font-display text-secondary leading-tight">
                {product.name}
              </h1>
              <StarRating rating={product.rating} size={20} />
            </div>

            {/* Price and Stock */}
            <div className="space-y-3">
              <div className="text-4xl font-bold font-display gradient-text">
                ${product.price}
              </div>
              
              <div className="flex items-center space-x-3">
                {isOutOfStock && (
                  <Badge variant="error">Out of Stock</Badge>
                )}
                {isLowStock && (
                  <Badge variant="warning">Only {product.stock} left</Badge>
                )}
                {!isOutOfStock && !isLowStock && (
                  <Badge variant="success">In Stock ({product.stock} available)</Badge>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-gray">
              <p className="text-gray-600 font-body text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-secondary font-body">
                Quantity
              </label>
              <div className="flex items-center space-x-3">
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    <ApperIcon name="Minus" className="w-4 h-4" />
                  </button>
                  
                  <span className="px-4 py-2 text-lg font-medium min-w-[60px] text-center">
                    {quantity}
                  </span>
                  
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    <ApperIcon name="Plus" className="w-4 h-4" />
                  </button>
                </div>
                
                <span className="text-sm text-gray-500 font-body">
                  ${(product.price * quantity).toFixed(2)} total
                </span>
              </div>
            </div>

{/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <div className="flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || addingToCart}
                  className="flex-1"
                  size="lg"
                  data-cart-button
                >
                  <ApperIcon name="ShoppingCart" className="w-5 h-5 mr-2" />
                  {addingToCart ? "Adding..." : isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </Button>
                
                <Button
                  onClick={handleBuyNow}
                  variant="secondary"
                  disabled={isOutOfStock}
                  size="lg"
                >
                  Buy Now
                </Button>
              </div>
              
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => navigate(-1)}
              >
                <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
                Back to Products
              </Button>
            </div>
          </div>
        </div>

        {/* Specifications */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="mb-16">
            <div className="bg-white rounded-xl card-shadow p-8">
              <h2 className="text-2xl font-bold font-display text-secondary mb-6">
                Specifications
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-3 border-b border-gray-100">
                    <span className="font-medium text-secondary font-body">
                      {key}
                    </span>
                    <span className="text-gray-600 font-body">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold font-display text-secondary mb-4">
                Related Products
              </h2>
              <p className="text-gray-600 font-body">
                You might also be interested in these items
              </p>
            </div>
            
            <ProductGrid
              products={relatedProducts}
              loading={relatedLoading}
              error=""
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;