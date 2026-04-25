import { Link } from "react-router";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";

export function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product: any) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <Heart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Your wishlist is empty</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Start adding products you love!
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
      <h1 className="text-4xl font-bold mb-8 dark:text-white">My Wishlist</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition group relative"
          >
            <button
              onClick={() => {
                removeFromWishlist(product.id);
                toast.success("Removed from wishlist");
              }}
              className="absolute top-3 right-3 z-10 p-2 bg-white dark:bg-gray-900 rounded-full shadow-md hover:bg-red-50 dark:hover:bg-red-900/20 transition"
            >
              <Trash2 className="w-5 h-5 text-red-600" />
            </button>
            <Link to={`/products/${product.id}`}>
              <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
              </div>
            </Link>
            <div className="p-4">
              <Link to={`/products/${product.id}`}>
                <h3 className="font-semibold mb-2 line-clamp-2 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                  {product.name}
                </h3>
              </Link>
              <p className="text-xl font-bold text-blue-600 mb-3">
                ${product.price.toFixed(2)}
              </p>
              <button
                onClick={() => handleAddToCart(product)}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
