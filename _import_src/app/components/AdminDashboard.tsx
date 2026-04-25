import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router";
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Users,
  Plus,
  Edit,
  Trash2,
  BarChart3,
} from "lucide-react";
import { products as initialProducts } from "../data/products";
import { toast } from "sonner";

export function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders">("overview");
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(savedOrders);
  }, []);

  if (!user || !isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Admin Access Required</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          You need admin privileges to access this page
        </p>
        <Link
          to="/login"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const totalProducts = initialProducts.length;
  const totalStock = initialProducts.reduce((sum, p) => sum + p.stock, 0);

  const recentOrders = orders.slice(0, 5);
  const topProducts = [...initialProducts]
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold dark:text-white">Admin Dashboard</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b dark:border-gray-700">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-6 py-3 border-b-2 transition ${
            activeTab === "overview"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`px-6 py-3 border-b-2 transition ${
            activeTab === "products"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-6 py-3 border-b-2 transition ${
            activeTab === "orders"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          Orders
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-green-600 text-sm flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +12%
                </span>
              </div>
              <p className="text-2xl font-bold mb-1 dark:text-white">
                ${totalRevenue.toFixed(2)}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Revenue</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <ShoppingCart className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-green-600 text-sm flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +8%
                </span>
              </div>
              <p className="text-2xl font-bold mb-1 dark:text-white">{totalOrders}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Orders</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <Package className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <p className="text-2xl font-bold mb-1 dark:text-white">{totalProducts}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Products</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-2xl font-bold mb-1 dark:text-white">{totalStock}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Stock</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-4 dark:text-white">Recent Orders</h2>
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-sm dark:text-white">
                        Order #{order.id}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">
                        ${order.total.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                        {order.status}
                      </p>
                    </div>
                  </div>
                ))}
                {recentOrders.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No orders yet
                  </p>
                )}
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-4 dark:text-white">Top Products</h2>
              <div className="space-y-3">
                {topProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate dark:text-white">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {product.reviewCount} reviews
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-blue-600">
                        ${product.price.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Stock: {product.stock}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === "products" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold dark:text-white">Product Management</h2>
            <button
              onClick={() => toast.info("Add product feature (mock)")}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {initialProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-medium dark:text-white">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          product.stock > 20
                            ? "bg-green-100 dark:bg-green-900/20 text-green-600"
                            : product.stock > 0
                            ? "bg-orange-100 dark:bg-orange-900/20 text-orange-600"
                            : "bg-red-100 dark:bg-red-900/20 text-red-600"
                        }`}
                      >
                        {product.stock} units
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => toast.info("Edit feature (mock)")}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toast.info("Delete feature (mock)")}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div>
          <h2 className="text-2xl font-bold mb-6 dark:text-white">Order Management</h2>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium dark:text-white">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {order.items.length} items
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-blue-600">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-600 capitalize">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      No orders yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
