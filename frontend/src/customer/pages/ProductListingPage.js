import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import axios from "../../api/axios.js";
import BannerCarousel from "../../components/BannerCarousel";
import {
  FaAngleLeft,
  FaAngleRight,
  FaSearch,
  FaList,
  FaThLarge,
  FaSortAmountDown,
  FaShoppingCart,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./ProductListingPage.css";

const ProductListingPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState("");
  const [filteredSubcategory, setFilteredSubcategory] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;
  const navigate = useNavigate();

  const subcategoryOptions = {
    Men: ["T-Shirts", "Shirts", "Pants"],
    Women: ["Sarees", "Kurtis", "Jeans"],
    Kids: ["Traditional", "Modern"],
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/products");
        console.log('Products API Response:', response.data); // Debug log
        // Extract products array from API response
        setProducts(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]); // Set empty array on error
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    setFilteredSubcategory("");
  }, [filteredCategory]);

  const filteredProducts = (Array.isArray(products) ? products : [])
    .filter((p) => (filteredCategory ? p.category?.name === filteredCategory : true))
    .filter((p) =>
      filteredSubcategory ? p.subcategory === filteredSubcategory : true
    )
    .filter((p) =>
      searchQuery ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
    )
    .sort((a, b) => {
      if (sortOrder === "priceLowHigh") return a.price - b.price;
      if (sortOrder === "priceHighLow") return b.price - a.price;
      return 0;
    });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <div className="product-listing-container">
      {/* ✅ Filters */}
      <div className="filters">
        <div className="input-wrapper">
          <FaList className="input-icon" />
          <select
            value={filteredCategory}
            onChange={(e) => setFilteredCategory(e.target.value)}
            className="filter-dropdown"
          >
            <option value="">All Categories</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div className="input-wrapper">
          <FaThLarge className="input-icon" />
          <select
            value={filteredSubcategory}
            onChange={(e) => setFilteredSubcategory(e.target.value)}
            className="filter-dropdown"
            disabled={!filteredCategory}
          >
            <option value="">All Subcategories</option>
            {subcategoryOptions[filteredCategory]?.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        <div className="input-wrapper">
          <FaSortAmountDown className="input-icon" />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="filter-dropdown"
          >
            <option value="">Sort</option>
            <option value="priceLowHigh">Price: Low to High</option>
            <option value="priceHighLow">Price: High to Low</option>
          </select>
        </div>

        <div className="search-bar input-wrapper">
          <FaSearch className="input-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* ✅ View Cart Button */}
      <div className="view-cart-container">
        <button className="view-cart-btn" onClick={() => navigate("/cart")}>
          <FaShoppingCart /> View Cart
        </button>
      </div>
      </div>

      {/* ✅ Carousel */}
      <BannerCarousel category={filteredCategory} />

      

      {/* ✅ Products Grid */}
      <div className="products-grid">
        {paginatedProducts.map((product, idx) => (
          <ProductCard key={idx} product={product} />
        ))}
      </div>

      {/* ✅ Pagination */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <FaAngleLeft />
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? "active" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          <FaAngleRight />
        </button>
      </div>
    </div>
  );
};

export default ProductListingPage;
