import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../api";
import {toast}from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useCart } from "../Context/cart";
import { motion, AnimatePresence } from "framer-motion";
// import MainComponent from "../components/component/Store/MainCompo";
import { Modal, Select, Input, Radio } from "antd";
import { FiShoppingCart, FiFilter, FiSearch } from "react-icons/fi";
import { Prices } from "../components/Prices";

const { Option } = Select;

const Store = () => {
  // State management
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(['Drone', '3D-Printing-Object', 'IOT-component']);
  const [checked, setChecked] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(9);
  const [radio, setRadio] = useState([]);
  const [categories, setCategories] = useState([]);

  const { cart, setCart } = useCart();
  const navigate = useNavigate();

  // Fetch products and apply initial filters
  useEffect(() => {
    getAllProducts();
    getAllCategories();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [checked, sortBy, searchTerm, products, radio]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [checked, sortBy, searchTerm]);

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/product/get-product`);
      
      if (response?.data?.success) {
        setProducts(response.data.products);
        setFilteredProducts(response.data.products);
      } else {
        toast.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error(error.response?.data?.message || "Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  const getAllCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/category/get-category`);
      if (response?.data?.success) {
        setCategories(response.data.category);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    }
  };

  const filterAndSortProducts = () => {
    let tempProducts = [...products];

    // Apply search filter
    if (searchTerm) {
      tempProducts = tempProducts.filter(
        prod => prod.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (checked.length > 0) {
      tempProducts = tempProducts.filter(prod => 
        checked.includes(prod.category._id)
      );
    }

    // Apply price range filter
    if (radio.length > 0) {
      const [min, max] = radio;
      tempProducts = tempProducts.filter(
        prod => prod.price >= min && prod.price <= max
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "price-asc":
        tempProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        tempProducts.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        tempProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        tempProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    setFilteredProducts(tempProducts);
  };

  // Enhanced add to cart function
  const handleAddToCart = (product) => {
    try {
      const existingProductIndex = cart.findIndex((item) => item._id === product._id);
      let updatedCart;

      if (existingProductIndex >= 0) {
        updatedCart = cart.map((item, index) =>
          index === existingProductIndex 
            ? { ...item, quantity: (item.quantity || 1) + 1 } 
            : item
        );
        toast.success(`Increased ${product.name} quantity in cart`);
      } else {
        updatedCart = [...cart, { ...product, quantity: 1 }];
        toast.success(`${product.name} added to cart`);
      }

      setCart(updatedCart);
      localStorage.setItem("Flytium", JSON.stringify(updatedCart));
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const PaginationControls = () => (
    <div className="flex justify-center mt-8 gap-2">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
      >
        Previous
      </button>
      
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index + 1}
          onClick={() => handlePageChange(index + 1)}
          className={`px-4 py-2 rounded-lg ${
            currentPage === index + 1
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          {index + 1}
        </button>
      ))}
      
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
      >
        Next
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    
    <div>
      {/* <MainComponent /> */}
      <div className="w-full px-4 py-8">
        
        {/* Main content container with filters and products */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left sidebar filters */}
          <div className="hidden md:block w-72 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="space-y-8">
                {/* Categories Section */}
                <div>
                  <h6 className="text-lg font-medium text-gray-900 mb-4">Categories</h6>
                  <div className="space-y-3">
                    {categories.map((cat) => (
                      <div key={cat._id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`category-${cat._id}`}
                          className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                          checked={checked.includes(cat._id)}
                          onChange={() => {
                            const updatedChecked = checked.includes(cat._id)
                              ? checked.filter(c => c !== cat._id)
                              : [...checked, cat._id];
                            setChecked(updatedChecked);
                          }}
                        />
                        <label
                          htmlFor={`category-${cat._id}`}
                          className="ml-3 text-sm text-gray-600 cursor-pointer"
                        >
                          {cat.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range Section */}
                <div>
                  <h6 className="text-lg font-medium text-gray-900 mb-4">Price Range</h6>
                  <Radio.Group 
                    onChange={(e) => setRadio(e.target.value)}
                    value={radio}
                    className="space-y-3"
                  >
                    {Prices.map((p) => (
                      <div key={p.id} className="flex items-center">
                        <Radio
                          value={p.array}
                          className="text-sm text-gray-600"
                        >
                          {p.name}
                        </Radio>
                      </div>
                    ))}
                  </Radio.Group>
                </div>

                {/* Reset Filters Button */}
                <button
                  onClick={() => {
                    setChecked([]);
                    setRadio([]);
                  }}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1">
            {/* Search and Sort Controls */}
            <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex-1 min-w-[200px] max-w-md">
                <Input
                  prefix={<FiSearch className="text-gray-400" />}
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="flex gap-4">
                <Select
                  defaultValue="default"
                  onChange={setSortBy}
                  className="w-[150px]"
                >
                  <Option value="default">Sort By</Option>
                  <Option value="price-asc">Price: Low to High</Option>
                  <Option value="price-desc">Price: High to Low</Option>
                  <Option value="name-asc">Name: A to Z</Option>
                  <Option value="name-desc">Name: Z to A</Option>
                </Select>

                {/* Mobile filter button */}
                <button 
                  onClick={() => setIsModalVisible(true)}
                  className="md:hidden flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  <FiFilter /> Filters
                </button>
              </div>
            </div>

            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-center mb-8"
            >
              All Products
            </motion.h2>

            {products.length === 0 ? (
              <div className="text-center text-gray-500">No products available</div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4"
              >
                {currentProducts.map((product) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                  >
                    <div className="relative">
                      <div className="absolute top-2 left-2 z-10">
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                          New
                        </span>
                      </div>
                      
                      <div className="relative h-48 overflow-hidden bg-gray-100">
                        <img
                          src={product.image}
                          className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                          alt={product.name}
                        />
                      </div>
                    </div>

                    <div className="px-4 pt-4">
                      <button
                        onClick={() => navigate(`/product/${product.slug}`)}
                        className="text-gray-600 hover:text-blue-500 text-sm border border-gray-300 rounded-full px-4 py-1 transition-colors"
                      >
                        Quick Look
                      </button>
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-800">
                        {product.name}
                      </h3>
                      
                      <div className="mt-2 mb-4">
                        <span className="text-xl font-semibold text-gray-900">
                          ₹{product.price.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center mb-4">
                        {[...Array(5)].map((_, index) => (
                          <svg
                            key={index}
                            className="w-4 h-4 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-gray-500 text-sm ml-2">(0)</span>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        Add to Cart
                      </motion.button>

                      <button
                        onClick={() => navigate(`/product/${product.slug}`)}
                        className="w-full mt-2 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Learn more
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Pagination controls */}
            {totalPages > 1 && <PaginationControls />}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal - only shown on mobile */}
      <Modal
        title="Filter Products"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <button 
            key="reset" 
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 mr-2"
            onClick={() => {
              setChecked([]);
              setRadio([]);
              setIsModalVisible(false);
            }}
          >
            Reset
          </button>,
          <button
            key="apply"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={() => setIsModalVisible(false)}
          >
            Apply
          </button>
        ]}
      >
        <div className="space-y-6">
          {/* Same filter content as sidebar */}
          <div>
            <h6 className="font-semibold mb-3">Categories</h6>
            {categories.map((cat) => (
              <div key={cat._id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={checked.includes(cat._id)}
                  onChange={() => {
                    const updatedChecked = checked.includes(cat._id)
                      ? checked.filter(c => c !== cat._id)
                      : [...checked, cat._id];
                    setChecked(updatedChecked);
                  }}
                />
                <label>{cat.name}</label>
              </div>
            ))}
          </div>

          <div>
            <h6 className="font-semibold mb-3">Price Range</h6>
            <Radio.Group 
              onChange={(e) => setRadio(e.target.value)}
              value={radio}
            >
              <div className="space-y-2">
                {Prices.map((p) => (
                  <div key={p.id}>
                    <Radio value={p.array}>
                      {p.name}
                    </Radio>
                  </div>
                ))}
              </div>
            </Radio.Group>
          </div>
        </div>
      </Modal>

      
    </div>

    
  );
};

export default Store;
