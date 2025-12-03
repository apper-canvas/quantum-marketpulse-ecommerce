import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import { useCart } from "@/hooks/useCart";
import { orderService } from "@/services/api/orderService";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart, loading: cartLoading } = useCart();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [shippingData, setShippingData] = useState({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    phone: ""
  });
  const [paymentData, setPaymentData] = useState({
    method: "card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    upiId: ""
  });

  const cartTotal = getCartTotal();
  const shipping = 10;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shipping + tax;

  useEffect(() => {
    // Redirect if cart is empty
    if (!cartLoading && cartItems.length === 0) {
      navigate("/");
      return;
    }
  }, [cartItems, cartLoading, navigate]);

  const steps = [
    { id: 1, name: "Shipping", icon: "Truck" },
    { id: 2, name: "Payment", icon: "CreditCard" },
    { id: 3, name: "Review", icon: "CheckCircle" }
  ];

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    
    // Validate shipping form
    const requiredFields = ["fullName", "addressLine1", "city", "state", "zipCode", "phone"];
    const missingFields = requiredFields.filter(field => !shippingData[field].trim());
    
    if (missingFields.length > 0) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setCurrentStep(2);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    
    // Validate payment form based on method
    if (paymentData.method === "card") {
      const requiredFields = ["cardNumber", "expiryDate", "cvv", "cardholderName"];
      const missingFields = requiredFields.filter(field => !paymentData[field].trim());
      
      if (missingFields.length > 0) {
        toast.error("Please fill in all card details");
        return;
      }
    } else if (paymentData.method === "upi") {
      if (!paymentData.upiId.trim()) {
        toast.error("Please enter your UPI ID");
        return;
      }
    }
    
    setCurrentStep(3);
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.productId,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.images[0]
        })),
        total: total,
        shippingAddress: shippingData,
        paymentMethod: paymentData.method === "card" 
          ? `Credit Card ending in ${paymentData.cardNumber.slice(-4)}`
          : "UPI Payment"
      };
      
      const order = await orderService.createOrder(orderData);
      await clearCart();
      
      toast.success("Order placed successfully!");
      navigate(`/order-confirmation/${order.Id}`);
    } catch (err) {
      toast.error("Failed to place order. Please try again.");
      console.error("Order placement error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (cartLoading) {
    return <Loading message="Loading checkout..." />;
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Empty
            icon="ShoppingCart"
            title="Your cart is empty"
            message="Add some products to proceed with checkout"
            actionLabel="Start Shopping"
            onAction={() => navigate("/")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display text-secondary mb-4">
            Checkout
          </h1>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-8 mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center space-x-3 ${
                  step.id <= currentStep ? "text-primary" : "text-gray-400"
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step.id <= currentStep 
                      ? "bg-gradient-to-r from-primary to-accent text-white" 
                      : "bg-gray-200"
                  }`}>
                    <ApperIcon name={step.icon} className="w-5 h-5" />
                  </div>
                  <span className="font-medium font-body">{step.name}</span>
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`mx-4 w-12 h-0.5 ${
                    step.id < currentStep ? "bg-primary" : "bg-gray-200"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Shipping Information */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl card-shadow p-6"
              >
                <h2 className="text-xl font-bold font-display text-secondary mb-6">
                  Shipping Information
                </h2>
                
                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <Input
                    label="Full Name"
                    value={shippingData.fullName}
                    onChange={(e) => setShippingData({...shippingData, fullName: e.target.value})}
                    required
                  />
                  
                  <Input
                    label="Address Line 1"
                    value={shippingData.addressLine1}
                    onChange={(e) => setShippingData({...shippingData, addressLine1: e.target.value})}
                    required
                  />
                  
                  <Input
                    label="Address Line 2 (Optional)"
                    value={shippingData.addressLine2}
                    onChange={(e) => setShippingData({...shippingData, addressLine2: e.target.value})}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="City"
                      value={shippingData.city}
                      onChange={(e) => setShippingData({...shippingData, city: e.target.value})}
                      required
                    />
                    
                    <Input
                      label="State"
                      value={shippingData.state}
                      onChange={(e) => setShippingData({...shippingData, state: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="ZIP Code"
                      value={shippingData.zipCode}
                      onChange={(e) => setShippingData({...shippingData, zipCode: e.target.value})}
                      required
                    />
                    
                    <Input
                      label="Phone Number"
                      type="tel"
                      value={shippingData.phone}
                      onChange={(e) => setShippingData({...shippingData, phone: e.target.value})}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" size="lg">
                    Continue to Payment
                    <ApperIcon name="ArrowRight" className="w-5 h-5 ml-2" />
                  </Button>
                </form>
              </motion.div>
            )}

            {/* Step 2: Payment Method */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl card-shadow p-6"
              >
                <h2 className="text-xl font-bold font-display text-secondary mb-6">
                  Payment Method
                </h2>
                
                {/* Payment Method Selection */}
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      paymentData.method === "card" 
                        ? "border-primary bg-primary/5" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentData.method === "card"}
                        onChange={(e) => setPaymentData({...paymentData, method: e.target.value})}
                        className="sr-only"
                      />
                      <div className="flex items-center space-x-3">
                        <ApperIcon name="CreditCard" className="w-6 h-6" />
                        <span className="font-medium font-body">Credit/Debit Card</span>
                      </div>
                    </label>
                    
                    <label className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      paymentData.method === "upi" 
                        ? "border-primary bg-primary/5" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="upi"
                        checked={paymentData.method === "upi"}
                        onChange={(e) => setPaymentData({...paymentData, method: e.target.value})}
                        className="sr-only"
                      />
                      <div className="flex items-center space-x-3">
                        <ApperIcon name="Smartphone" className="w-6 h-6" />
                        <span className="font-medium font-body">UPI Payment</span>
                      </div>
                    </label>
                  </div>
                </div>
                
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  {paymentData.method === "card" && (
                    <>
                      <Input
                        label="Cardholder Name"
                        value={paymentData.cardholderName}
                        onChange={(e) => setPaymentData({...paymentData, cardholderName: e.target.value})}
                        required
                      />
                      
                      <Input
                        label="Card Number"
                        placeholder="1234 5678 9012 3456"
                        value={paymentData.cardNumber}
                        onChange={(e) => setPaymentData({...paymentData, cardNumber: e.target.value})}
                        required
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Expiry Date"
                          placeholder="MM/YY"
                          value={paymentData.expiryDate}
                          onChange={(e) => setPaymentData({...paymentData, expiryDate: e.target.value})}
                          required
                        />
                        
                        <Input
                          label="CVV"
                          placeholder="123"
                          value={paymentData.cvv}
                          onChange={(e) => setPaymentData({...paymentData, cvv: e.target.value})}
                          required
                        />
                      </div>
                    </>
                  )}
                  
                  {paymentData.method === "upi" && (
                    <Input
                      label="UPI ID"
                      placeholder="yourname@upi"
                      value={paymentData.upiId}
                      onChange={(e) => setPaymentData({...paymentData, upiId: e.target.value})}
                      required
                    />
                  )}
                  
                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1"
                    >
                      <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    
                    <Button type="submit" className="flex-1" size="lg">
                      Review Order
                      <ApperIcon name="ArrowRight" className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Step 3: Order Review */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Shipping Address Review */}
                <div className="bg-white rounded-xl card-shadow p-6">
                  <h2 className="text-xl font-bold font-display text-secondary mb-4">
                    Shipping Address
                  </h2>
                  <div className="space-y-1 text-gray-600 font-body">
                    <p className="font-medium text-secondary">{shippingData.fullName}</p>
                    <p>{shippingData.addressLine1}</p>
                    {shippingData.addressLine2 && <p>{shippingData.addressLine2}</p>}
                    <p>{shippingData.city}, {shippingData.state} {shippingData.zipCode}</p>
                    <p>{shippingData.phone}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentStep(1)}
                    className="mt-4"
                  >
                    <ApperIcon name="Edit" className="w-4 h-4 mr-2" />
                    Edit Address
                  </Button>
                </div>

                {/* Payment Method Review */}
                <div className="bg-white rounded-xl card-shadow p-6">
                  <h2 className="text-xl font-bold font-display text-secondary mb-4">
                    Payment Method
                  </h2>
                  <div className="space-y-1 text-gray-600 font-body">
                    {paymentData.method === "card" ? (
                      <>
                        <p className="font-medium text-secondary">Credit/Debit Card</p>
                        <p>**** **** **** {paymentData.cardNumber.slice(-4)}</p>
                        <p>{paymentData.cardholderName}</p>
                      </>
                    ) : (
                      <>
                        <p className="font-medium text-secondary">UPI Payment</p>
                        <p>{paymentData.upiId}</p>
                      </>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentStep(2)}
                    className="mt-4"
                  >
                    <ApperIcon name="Edit" className="w-4 h-4 mr-2" />
                    Edit Payment
                  </Button>
                </div>

                {/* Place Order */}
                <div className="bg-white rounded-xl card-shadow p-6">
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="w-full"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <ApperIcon name="Loader2" className="w-5 h-5 mr-2 animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="ShoppingBag" className="w-5 h-5 mr-2" />
                        Place Order - ${total.toFixed(2)}
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl card-shadow p-6 sticky top-24">
              <h3 className="text-lg font-bold font-display text-secondary mb-6">
                Order Summary
              </h3>
              
              {/* Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex items-start space-x-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium font-body text-secondary text-sm line-clamp-2">
                        {item.product.name}
                      </h4>
                      <div className="text-sm text-gray-600">
                        Qty: {item.quantity} × ${item.product.price}
                      </div>
                    </div>
                    <div className="font-medium font-body text-secondary">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Totals */}
              <div className="space-y-3 border-t border-gray-200 pt-6">
                <div className="flex justify-between text-gray-600 font-body">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-gray-600 font-body">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-gray-600 font-body">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-xl font-bold font-display text-secondary border-t border-gray-200 pt-3">
                  <span>Total</span>
                  <span className="gradient-text">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;