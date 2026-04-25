import { useParams, Link, useNavigate } from "react-router";
import { Star, ShoppingCart, ArrowLeft, Heart, Truck, Shield, Package } from "lucide-react";
import { products } from "../data/products";
import { useCart, ProductVariant } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useRecentlyViewed } from "../context/RecentlyViewedContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const { user } = useAuth();
  const product = products.find((p) => p.id === id);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>();
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product);
      if (product.variants && product.variants.length > 0) {
        setSelectedVariant(product.variants[0]);
      }
    }
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center dark:text-white">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Link to="/products" className="text-blue-600 hover:text-blue-700">
          Back to Products
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product.variants && !selectedVariant) {
      toast.error("Please select a variant");
      return;
    }
    addToCart({ ...product, selectedVariant });
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist");
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to write a review");
      return;
    }
    toast.success("Review submitted! (Mock implementation)");
    setReviewText("");
    setReviewRating(5);
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const uniqueSizes = product.variants
    ? [...new Set(product.variants.map((v) => v.size).filter(Boolean))]
    : [];
  const uniqueColors = product.variants
    ? [...new Set(product.variants.map((v) => v.color).filter(Boolean))]
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Image */}
        <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div>
          <p className="text-sm text-blue-600 mb-2">{product.category}</p>
          <h1 className="text-4xl font-bold mb-4 dark:text-white">{product.name}</h1>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(product.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-600 dark:text-gray-400">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>
          <p className="text-4xl font-bold text-blue-600 mb-6">
            ${product.price.toFixed(2)}
          </p>

          {/* Stock Status */}
          <div className="mb-6">
            {product.stock > 20 ? (
              <p className="text-green-600 flex items-center gap-2">
                <Package className="w-4 h-4" />
                In Stock ({product.stock} available)
              </p>
            ) : product.stock > 0 ? (
              <p className="text-orange-600 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Only {product.stock} left in stock!
              </p>
            ) : (
              <p className="text-red-600 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Out of Stock
              </p>
            )}
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
            {product.description}
          </p>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-6 space-y-4">
              {uniqueColors.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-white">
                    Color: {selectedVariant?.color}
                  </label>
                  <div className="flex gap-2">
                    {uniqueColors.map((color) => (
                      <button
                        key={color}
                        onClick={() =>
                          setSelectedVariant(
                            product.variants?.find((v) => v.color === color)
                          )
                        }
                        className={`px-4 py-2 border-2 rounded-lg transition ${
                          selectedVariant?.color === color
                            ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-300 dark:border-gray-700 hover:border-gray-400"
                        } dark:text-white`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {uniqueSizes.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-white">
                    Size: {selectedVariant?.size}
                  </label>
                  <div className="flex gap-2">
                    {uniqueSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() =>
                          setSelectedVariant(
                            product.variants?.find((v) => v.size === size)
                          )
                        }
                        className={`px-4 py-2 border-2 rounded-lg transition ${
                          selectedVariant?.size === size
                            ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-300 dark:border-gray-700 hover:border-gray-400"
                        } dark:text-white`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-4 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
            <button
              onClick={handleWishlistToggle}
              className="px-6 border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:border-red-500 transition"
            >
              <Heart
                className={`w-6 h-6 ${
                  isInWishlist(product.id)
                    ? "fill-red-500 text-red-500"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              />
            </button>
          </div>

          <div className="space-y-4 border-t dark:border-gray-700 pt-8">
            <div className="flex items-center gap-3 text-sm">
              <Truck className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-semibold dark:text-white">Free shipping</p>
                <p className="text-gray-600 dark:text-gray-400">On orders over $50</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shield className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-semibold dark:text-white">30-day return policy</p>
                <p className="text-gray-600 dark:text-gray-400">Easy returns & exchanges</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">Customer Reviews</h2>

        {/* Write Review */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg mb-6">
          <h3 className="font-semibold mb-4 dark:text-white">Write a Review</h3>
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-white">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setReviewRating(rating)}
                  >
                    <Star
                      className={`w-6 h-6 ${
                        rating <= reviewRating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-white">
                Your Review
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-900 dark:text-white"
                rows={4}
                placeholder="Share your experience with this product..."
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Submit Review
            </button>
          </form>
        </div>

        {/* Mock Reviews */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="font-semibold dark:text-white">John Doe</span>
              <span className="text-sm text-gray-500">2 days ago</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              Excellent product! Exceeded my expectations in every way. Highly recommend!
            </p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6 dark:text-white">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                to={`/products/${relatedProduct.id}`}
                className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition group"
              >
                <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2 dark:text-white">
                    {relatedProduct.name}
                  </h3>
                  <p className="text-xl font-bold text-blue-600">
                    ${relatedProduct.price.toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
