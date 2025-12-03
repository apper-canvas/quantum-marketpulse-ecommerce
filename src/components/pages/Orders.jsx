import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import { orderService } from "@/services/api/orderService";
import { motion } from "framer-motion";

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const ordersData = await orderService.getAll();
      setOrders(ordersData);
    } catch (err) {
      setError("Failed to load orders");
      console.error("Orders loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const getStatusVariant = (status) => {
    switch (status) {
      case "Processing": return "info";
      case "Shipped": return "warning";
      case "Delivered": return "success";
      default: return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Processing": return "Clock";
      case "Shipped": return "Truck";
      case "Delivered": return "CheckCircle";
      default: return "Package";
    }
  };

  if (loading) {
    return <Loading message="Loading your orders..." />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadOrders} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display text-secondary mb-2">
            Your Orders
          </h1>
          <p className="text-gray-600 font-body">
            Track and manage your recent purchases
          </p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <Empty
            icon="ShoppingBag"
            title="No orders yet"
            message="When you place orders, they'll appear here for tracking and management"
            actionLabel="Start Shopping"
            onAction={() => navigate("/")}
          />
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl card-shadow p-6"
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-bold font-display text-secondary">
                        Order #{order.Id}
                      </h3>
                      <Badge variant={getStatusVariant(order.status)}>
                        <ApperIcon 
                          name={getStatusIcon(order.status)} 
                          className="w-3 h-3 mr-1" 
                        />
                        {order.status}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-gray-600 font-body space-x-4">
                      <span>
                        Placed on {format(new Date(order.createdAt), "MMM dd, yyyy")}
                      </span>
                      <span>
                        Total: <span className="font-medium text-secondary">${order.total.toFixed(2)}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {order.status === "Delivered" && (
                      <Button variant="secondary" size="sm">
                        <ApperIcon name="Star" className="w-4 h-4 mr-2" />
                        Review
                      </Button>
                    )}
                    
                    <Button variant="ghost" size="sm">
                      <ApperIcon name="Eye" className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.productId} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1 space-y-1">
                        <h4 className="font-medium font-body text-secondary">
                          {item.name}
                        </h4>
                        <div className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </div>
                        <div className="text-sm font-medium text-secondary">
                          ${item.price.toFixed(2)} each
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-bold font-display text-lg gradient-text">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Information */}
                {order.status !== "Processing" && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start space-x-3">
                      <ApperIcon name="Truck" className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="space-y-1">
                        <h5 className="font-medium text-blue-900 font-body">
                          Shipping Information
                        </h5>
                        <div className="text-sm text-blue-700 space-y-1">
                          <p>
                            <strong>Address:</strong> {order.shippingAddress.addressLine1}, {order.shippingAddress.city}
                          </p>
                          <p>
                            <strong>Estimated Delivery:</strong> {format(new Date(order.estimatedDelivery), "MMM dd, yyyy")}
                          </p>
                          <p>
                            <strong>Payment Method:</strong> {order.paymentMethod}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Order Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 pt-6 border-t border-gray-200 space-y-3 sm:space-y-0">
                  <div className="text-sm text-gray-600 font-body">
                    Need help with this order?{" "}
                    <button className="text-primary hover:text-red-500 font-medium">
                      Contact Support
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {order.status !== "Delivered" && (
                      <Button variant="secondary" size="sm">
                        <ApperIcon name="MapPin" className="w-4 h-4 mr-2" />
                        Track Order
                      </Button>
                    )}
                    
                    <Button variant="ghost" size="sm">
                      <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
                      Reorder
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;