import { Link } from "react-router";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";

export function Cart() {
  const { cart, updateQuantity, removeFromCart, totalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Your cart is empty</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Add some products to get started!
        </p>
        <Link
          to="/products"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8 dark:text-white">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 flex gap-4 shadow-sm"
            >
              <Link
                to={`/products/${item.id}`}
                className="w-24 h-24 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover hover:scale-105 transition"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link
                  to={`/products/${item.id}`}
                  className="font-semibold hover:text-blue-600 transition dark:text-white dark:hover:text-blue-400"
                >
                  {item.name}
                </Link>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.category}</p>
                {item.selectedVariant && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {item.selectedVariant.size && `Size: ${item.selectedVariant.size}`}
                    {item.selectedVariant.size && item.selectedVariant.color && " • "}
                    {item.selectedVariant.color && `Color: ${item.selectedVariant.color}`}
                  </p>
                )}
                <p className="font-bold text-blue-600 mt-2">
                  ${item.price.toFixed(2)}
                </p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-400 hover:text-red-600 transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition rounded"
                  >
                    <Minus className="w-4 h-4 dark:text-white" />
                  </button>
                  <span className="w-8 text-center font-semibold dark:text-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition rounded"
                  >
                    <Plus className="w-4 h-4 dark:text-white" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold mb-6 dark:text-white">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-semibold dark:text-white">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                <span className="font-semibold dark:text-white">
                  {totalPrice > 50 ? "Free" : "$9.99"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tax</span>
                <span className="font-semibold dark:text-white">
                  ${(totalPrice * 0.08).toFixed(2)}
                </span>
              </div>
              <div className="border-t dark:border-gray-700 pt-3 flex justify-between">
                <span className="font-bold dark:text-white">Total</span>
                <span className="font-bold text-xl text-blue-600">
                  $
                  {(
                    totalPrice +
                    (totalPrice > 50 ? 0 : 9.99) +
                    totalPrice * 0.08
                  ).toFixed(2)}
                </span>
              </div>
            </div>
            {totalPrice < 50 && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                Add ${(50 - totalPrice).toFixed(2)} more for free shipping!
              </p>
            )}
            <Link
              to="/checkout"
              className="block w-full bg-blue-600 text-white text-center px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Proceed to Checkout
            </Link>
            <Link
              to="/products"
              className="block w-full text-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mt-4"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
