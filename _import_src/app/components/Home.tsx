import { Link } from "react-router";
import { ArrowRight, Star, Truck, Shield, Headphones, Clock } from "lucide-react";
import { products } from "../data/products";
import { useRecentlyViewed } from "../context/RecentlyViewedContext";

export function Home() {
  const { recentlyViewed } = useRecentlyViewed();
  const featuredProducts = products.slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              Welcome to ShopHub
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Discover amazing products at unbeatable prices. Quality you can
              trust, service you'll love.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition"
            >
              Shop Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold mb-2 dark:text-white">Free Shipping</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                On orders over $50
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold mb-2 dark:text-white">Secure Payment</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                100% secure transactions
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg">
              <Headphones className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold mb-2 dark:text-white">24/7 Support</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Dedicated customer service
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t dark:border-gray-800">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold dark:text-white flex items-center gap-3">
              <Clock className="w-8 h-8 text-blue-600" />
              Recently Viewed
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentlyViewed.slice(0, 4).map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition group"
              >
                <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2 dark:text-white">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {product.rating}
                      </span>
                    </div>
                  </div>
                  <p className="text-xl font-bold text-blue-600">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold dark:text-white">Featured Products</h2>
          <Link
            to="/products"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-2"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition group"
            >
              <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2 dark:text-white">{product.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {product.rating}
                    </span>
                  </div>
                </div>
                <p className="text-xl font-bold text-blue-600">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
