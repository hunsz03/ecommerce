import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { CreditCard, Lock, Tag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";

const PROMO_CODES = {
  SAVE10: { discount: 0.1, description: "10% off" },
  SAVE20: { discount: 0.2, description: "20% off" },
  FREESHIP: { discount: 0, freeShipping: true, description: "Free shipping" },
};

export function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zip: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<keyof typeof PROMO_CODES | null>(null);

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Your cart is empty</h2>
        <Link
          to="/products"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save order to localStorage
    const order = {
      id: "ORD-" + Date.now(),
      date: new Date().toISOString(),
      items: cart,
      total: finalTotal,
      status: "processing",
      ...formData,
    };

    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    localStorage.setItem("orders", JSON.stringify([order, ...existingOrders]));

    toast.success("Order placed successfully!");
    clearCart();
    setTimeout(() => navigate("/orders"), 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyPromo = () => {
    const code = promoCode.toUpperCase() as keyof typeof PROMO_CODES;
    if (PROMO_CODES[code]) {
      setAppliedPromo(code);
      toast.success(`Promo code "${code}" applied: ${PROMO_CODES[code].description}`);
    } else {
      toast.error("Invalid promo code");
    }
  };

  const baseShipping = totalPrice > 50 ? 0 : 9.99;
  const shipping = appliedPromo && PROMO_CODES[appliedPromo].freeShipping ? 0 : baseShipping;
  const discount = appliedPromo ? totalPrice * PROMO_CODES[appliedPromo].discount : 0;
  const tax = (totalPrice - discount) * 0.08;
  const finalTotal = totalPrice - discount + shipping + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8 dark:text-white">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4 dark:text-white">Contact Information</h2>
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-white">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-900 dark:text-white"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4 dark:text-white">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-white">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-white">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-900 dark:text-white"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2 dark:text-white">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-white">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-white">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    name="zip"
                    required
                    value={formData.zip}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 dark:text-white">
                <CreditCard className="w-5 h-5" />
                Payment Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-white">
                    Card Number
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    required
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-900 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-white">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      name="expiry"
                      required
                      placeholder="MM/YY"
                      value={formData.expiry}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-white">
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      required
                      placeholder="123"
                      value={formData.cvv}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Lock className="w-4 h-4" />
                Your payment information is secure and encrypted
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold mb-6 dark:text-white">Order Summary</h2>
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 text-sm">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate dark:text-white">{item.name}</p>
                      <p className="text-gray-600 dark:text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold dark:text-white">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Promo Code */}
              <div className="mb-6 pb-6 border-b dark:border-gray-700">
                <label className="block text-sm font-medium mb-2 dark:text-white flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="flex-1 px-4 py-2 border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-900 dark:text-white"
                    disabled={!!appliedPromo}
                  />
                  {appliedPromo ? (
                    <button
                      type="button"
                      onClick={() => {
                        setAppliedPromo(null);
                        setPromoCode("");
                      }}
                      className="px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/40 transition"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Apply
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  Try: SAVE10, SAVE20, FREESHIP
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-semibold dark:text-white">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({appliedPromo})</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span className="font-semibold dark:text-white">
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Tax</span>
                  <span className="font-semibold dark:text-white">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t dark:border-gray-700 pt-3 flex justify-between">
                  <span className="font-bold dark:text-white">Total</span>
                  <span className="font-bold text-xl text-blue-600">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold mt-6"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
