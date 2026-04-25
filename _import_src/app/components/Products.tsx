import { useState, useMemo } from "react";
import { Link } from "react-router";
import { Star, Search, SlidersHorizontal, Heart } from "lucide-react";
import { products } from "../data/products";
import { useWishlist } from "../context/WishlistContext";
import { toast } from "sonner";

export function Products() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tags?.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Price range filter
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Rating filter
    filtered = filtered.filter((p) => p.rating >= minRating);

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return filtered;
  }, [selectedCategory, searchQuery, sortBy, priceRange, minRating]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleWishlistToggle = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8 dark:text-white">Our Products</h1>

      {/* Search and Filter Bar */}
      <div className="mb-8 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-6 py-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-2 dark:text-white"
          >
            <SlidersHorizontal className="w-5 h-5" />
            Filters
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-white">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <div className="flex gap-4">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-white">
                  Minimum Rating
                </label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg dark:bg-gray-900 dark:text-white"
                >
                  <option value="0">All Ratings</option>
                  <option value="4">4+ Stars</option>
                  <option value="4.5">4.5+ Stars</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-white">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg dark:bg-gray-900 dark:text-white"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setCurrentPage(1);
              }}
              className={`px-6 py-2 rounded-full whitespace-nowrap transition ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {paginatedProducts.length} of {filteredAndSortedProducts.length}{" "}
          products
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {paginatedProducts.map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.id}`}
            className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition group relative"
          >
            <button
              onClick={(e) => handleWishlistToggle(e, product)}
              className="absolute top-3 right-3 z-10 p-2 bg-white dark:bg-gray-900 rounded-full shadow-md hover:scale-110 transition"
            >
              <Heart
                className={`w-5 h-5 ${
                  isInWishlist(product.id)
                    ? "fill-red-500 text-red-500"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              />
            </button>
            <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition"
              />
            </div>
            <div className="p-4">
              <p className="text-xs text-blue-600 mb-1">{product.category}</p>
              <h3 className="font-semibold mb-2 line-clamp-2 dark:text-white">
                {product.name}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {product.rating}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    ({product.reviewCount})
                  </span>
                </div>
              </div>
              <p className="text-xl font-bold text-blue-600 mb-1">
                ${product.price.toFixed(2)}
              </p>
              {product.stock < 20 && (
                <p className="text-xs text-orange-600">
                  Only {product.stock} left!
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg disabled:opacity-50 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 border dark:border-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg disabled:opacity-50 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
