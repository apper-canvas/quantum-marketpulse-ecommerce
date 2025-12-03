import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import { orderService } from "@/services/api/orderService";
import { motion } from "framer-motion";

const OrderConfirmation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrder = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError("");
      const orderData = await orderService.getById(id);
      setOrder(orderData);
    } catch (err) {
      setError("Failed to load order details");
      console.error("Order loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  if (loading) {
    return <Loading message="Loading order confirmation..." />;
  }

  if (error || !order) {
    return (
      <ErrorView 
        message={error || "Order not found"} 
        onRetry={loadOrder}
        showRetry={!!error}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="CheckCircle" className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold font-display gradient-text mb-4">
            Order Confirmed!
          </h1>
          
          <p className="text-xl text-gray-600 font-body">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
        </motion.div>

        {/* Order Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl card-shadow p-8 mb-8"
        >
          {/* Order Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-gray-200">
            <div className="space-y-2 mb-4 md:mb-0">
              <div className="flex items-center space-x-3">
                <h2 className="text-2xl font-bold font-display text-secondary">
                  Order #{order.Id}
                </h2>
                <Badge variant="success">
                  <ApperIcon name="Clock" className="w-3 h-3 mr-1" />
                  {order.status}
                </Badge>
              </div>
              
              <div className="text-gray-600 font-body">
                Placed on {format(new Date(order.createdAt), "MMMM dd, yyyy 'at' hh:mm a")}
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl font-bold font-display gradient-text">
                ${order.total.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600 font-body">
                Total Amount
              </div>
            </div>
          </div>
{/* Order Items */}
          <div className="mb-8">
            <h3 className="text-lg font-bold font-display text-secondary mb-4 flex items-center">
              <ApperIcon name="Package" className="mr-2 text-primary" size={20} />
              Items Ordered ({order.items.length})
            </h3>
            
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-18 h-18 object-cover rounded-xl"
                  />
                  
                  <div className="flex-1 space-y-2">
                    <h4 className="font-semibold font-body text-secondary text-lg">
                      {item.name}
                    </h4>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="Hash" size={14} />
                        <span>Qty: {item.quantity}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="DollarSign" size={14} />
                        <span>${item.price.toFixed(2)} each</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block">
                      Estimated delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold font-body text-xl text-primary">
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

          {/* Delivery Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Shipping Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold font-display text-secondary flex items-center">
                <ApperIcon name="MapPin" className="w-5 h-5 mr-2" />
                Shipping Address
              </h3>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="space-y-1 text-gray-700 font-body">
                  <p className="font-medium">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && (
                    <p>{order.shippingAddress.addressLine2}</p>
                  )}
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                  <p className="text-sm text-gray-600">{order.shippingAddress.phone}</p>
                </div>
              </div>
            </div>

            {/* Payment & Delivery */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold font-display text-secondary flex items-center">
                <ApperIcon name="CreditCard" className="w-5 h-5 mr-2" />
                Payment & Delivery
              </h3>
              
              <div className="space-y-3">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="CheckCircle" className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-800">Payment Confirmed</span>
                    </div>
                    <p className="text-sm text-green-700">{order.paymentMethod}</p>
                  </div>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Truck" className="w-4 h-4 text-orange-600" />
                      <span className="font-medium text-orange-800">Estimated Delivery</span>
                    </div>
                    <p className="text-sm text-orange-700">
                      {format(new Date(order.estimatedDelivery), "EEEE, MMMM dd, yyyy")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
        >
          <Button
            onClick={() => navigate("/orders")}
            size="lg"
            className="w-full sm:w-auto"
          >
            <ApperIcon name="List" className="w-5 h-5 mr-2" />
            View All Orders
          </Button>
          
          <Button
            variant="secondary"
            onClick={() => navigate("/")}
            size="lg"
            className="w-full sm:w-auto"
          >
            <ApperIcon name="ShoppingBag" className="w-5 h-5 mr-2" />
            Continue Shopping
          </Button>
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12 p-6 bg-gray-50 rounded-xl"
        >
          <h3 className="text-lg font-bold font-display text-secondary mb-2">
            Need Help?
          </h3>
          <p className="text-gray-600 font-body mb-4">
            If you have any questions about your order, we're here to help.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6">
            <button className="text-primary hover:text-red-500 font-medium font-body flex items-center">
              <ApperIcon name="MessageCircle" className="w-4 h-4 mr-2" />
              Contact Support
            </button>
            
            <button className="text-primary hover:text-red-500 font-medium font-body flex items-center">
              <ApperIcon name="HelpCircle" className="w-4 h-4 mr-2" />
              FAQ
            </button>
            
            <button className="text-primary hover:text-red-500 font-medium font-body flex items-center">
              <ApperIcon name="MapPin" className="w-4 h-4 mr-2" />
              Track Order
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmation;