import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import ErrorView from '@/components/ui/ErrorView';
import { orderService } from '@/services/api/orderService';
import { toast } from 'react-toastify';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrderDetails();
  }, [id]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const orderData = await orderService.getById(id);
      setOrder(orderData);
    } catch (err) {
      setError(err.message || 'Failed to load order details');
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeliveryEstimate = (estimatedDelivery) => {
    const deliveryDate = new Date(estimatedDelivery);
    const today = new Date();
    const diffTime = deliveryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Delivery date passed';
    if (diffDays === 0) return 'Delivering today';
    if (diffDays === 1) return 'Delivering tomorrow';
    return `${diffDays} days remaining`;
  };

  if (loading) return <Loading message="Loading order details..." />;
  if (error) return <ErrorView message={error} onRetry={loadOrderDetails} showRetry />;
  if (!order) return <ErrorView message="Order not found" />;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/orders')}
              className="flex items-center space-x-2 text-gray-600 hover:text-secondary"
            >
              <ApperIcon name="ArrowLeft" size={20} />
              <span>Back to Orders</span>
            </Button>
            
            <Badge className={getStatusColor(order.status)}>
              {order.status}
            </Badge>
          </div>

          <div>
            <h1 className="text-3xl font-bold font-display text-secondary mb-2">
              Order #{order.Id}
            </h1>
            <p className="text-gray-600">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl card-shadow p-6">
              <h2 className="text-xl font-bold font-display text-secondary mb-6 flex items-center">
                <ApperIcon name="Package" className="mr-3 text-primary" size={24} />
                Order Items ({order.items.length})
              </h2>

              <div className="space-y-6">
                {order.items.map((item, index) => (
                  <motion.div
                    key={item.productId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-xl"
                    />
                    
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold font-body text-secondary text-lg">
                        {item.name}
                      </h3>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="Hash" size={16} />
                          <span>Qty: {item.quantity}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="DollarSign" size={16} />
                          <span>Unit Price: ${item.price.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold font-body text-primary">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Subtotal
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Order Summary & Delivery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Delivery Information */}
            <div className="bg-white rounded-2xl card-shadow p-6">
              <h3 className="text-lg font-bold font-display text-secondary mb-4 flex items-center">
                <ApperIcon name="Truck" className="mr-3 text-primary" size={20} />
                Delivery Information
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-blue-900">Estimated Delivery</span>
                    <ApperIcon name="Calendar" size={16} className="text-blue-600" />
                  </div>
                  <div className="text-blue-700 font-semibold">
                    {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="text-sm text-blue-600 mt-1">
                    {getDeliveryEstimate(order.estimatedDelivery)}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="font-medium text-secondary">Shipping Address:</div>
                  <div className="text-sm text-gray-600 leading-relaxed">
                    <div className="font-medium">{order.shippingAddress.fullName}</div>
                    <div>{order.shippingAddress.addressLine1}</div>
                    {order.shippingAddress.addressLine2 && (
                      <div>{order.shippingAddress.addressLine2}</div>
                    )}
                    <div>
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                    </div>
                    <div className="mt-2 flex items-center">
                      <ApperIcon name="Phone" size={14} className="mr-2" />
                      {order.shippingAddress.phone}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl card-shadow p-6">
              <h3 className="text-lg font-bold font-display text-secondary mb-4 flex items-center">
                <ApperIcon name="Receipt" className="mr-3 text-primary" size={20} />
                Order Summary
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${order.total.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-secondary">Total</span>
                    <span className="text-2xl font-bold text-primary">${order.total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500 mt-2">
                  Payment Method: {order.paymentMethod}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={() => navigate('/orders')}
                className="w-full btn-primary"
              >
                View All Orders
              </Button>
              
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="w-full btn-secondary"
              >
                Continue Shopping
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;