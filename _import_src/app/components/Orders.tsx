import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface Order {
  id: string;
  date: string;
  total: number;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  items: any[];
}

export function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(savedOrders);
  }, []);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Please login to view your orders</h2>
        <Link
          to="/login"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "processing":
        return <Clock className="w-5 h-5 text-blue-600" />;
      case "shipped":
        return <Truck className="w-5 h-5 text-purple-600" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "processing":
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-600";
      case "shipped":
        return "bg-purple-100 dark:bg-purple-900/20 text-purple-600";
      case "delivered":
        return "bg-green-100 dark:bg-green-900/20 text-green-600";
      case "cancelled":
        return "bg-red-100 dark:bg-red-900/20 text-red-600";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-600";
    }
  };

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4 dark:text-white">No orders yet</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Start shopping to see your orders here!
        </p>
        <Link
          to="/products"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8 dark:text-white">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Order #{order.id}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Placed on {new Date(order.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(order.status)}
                <span
                  className={`px-3 py-1 rounded-full text-sm capitalize ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>
            </div>

            <div className="border-t dark:border-gray-700 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {order.items.map((item, idx) => (
                  <Link
                    key={idx}
                    to={`/products/${item.id}`}
                    className="flex gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded transition"
                  >
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate dark:text-white">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold text-blue-600">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t dark:border-gray-700">
                <span className="font-semibold dark:text-white">Total</span>
                <span className="text-xl font-bold text-blue-600">
                  ${order.total.toFixed(2)}
                </span>
              </div>

              {/* Order Tracking */}
              {order.status !== "cancelled" && (
                <div className="mt-6 pt-6 border-t dark:border-gray-700">
                  <h3 className="font-semibold mb-4 dark:text-white">Order Tracking</h3>
                  <div className="flex items-center justify-between relative">
                    <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700" />
                    <div
                      className="absolute top-5 left-0 h-0.5 bg-blue-600 transition-all"
                      style={{
                        width:
                          order.status === "delivered"
                            ? "100%"
                            : order.status === "shipped"
                            ? "66%"
                            : "33%",
                      }}
                    />
                    {["processing", "shipped", "delivered"].map((status, idx) => (
                      <div
                        key={status}
                        className="flex flex-col items-center relative z-10"
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                            order.status === status ||
                            (order.status === "delivered" && idx <= 2) ||
                            (order.status === "shipped" && idx <= 1)
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {status === "processing" && <Clock className="w-5 h-5" />}
                          {status === "shipped" && <Truck className="w-5 h-5" />}
                          {status === "delivered" && <CheckCircle className="w-5 h-5" />}
                        </div>
                        <span className="text-xs capitalize dark:text-white">{status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
