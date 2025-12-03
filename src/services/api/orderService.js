import ordersData from "@/services/mockData/orders.json";

const ORDERS_STORAGE_KEY = "marketpulse_orders";

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 400 + 300));

const getStoredOrders = () => {
  const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  } else {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(ordersData));
    return [...ordersData];
  }
};

export const orderService = {
  async getAll() {
    await delay();
    const orders = getStoredOrders();
    return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getById(id) {
    await delay();
    const orders = getStoredOrders();
    const order = orders.find(o => o.Id === parseInt(id));
    if (!order) throw new Error("Order not found");
    return { ...order };
  },

  async createOrder(orderData) {
    await delay();
    const orders = getStoredOrders();
    const newId = Math.max(...orders.map(o => o.Id), 0) + 1;
    
    const newOrder = {
      Id: newId,
      ...orderData,
      status: "Processing",
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    orders.push(newOrder);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    return { ...newOrder };
  },

  async updateOrderStatus(id, status) {
    await delay();
    const orders = getStoredOrders();
    const orderIndex = orders.findIndex(o => o.Id === parseInt(id));
    
    if (orderIndex === -1) throw new Error("Order not found");
    
    orders[orderIndex].status = status;
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    return { ...orders[orderIndex] };
  }
};