import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { collection, getDocs, where, query } from "firebase/firestore";
import { db } from "../firebase.config";
import ProductsCard from "../components/ProductsCard";

const SearchPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [
    selectedAlphabeticallySortMethod,
    setSelectedAlphabeticallySortMethod,
  ] = useState("none");
  const [selectedPriceSortMethod, setSelectedPriceSortMethod] =
    useState("none");
  const [selectedRatingSortMethod, setSelectedRatingSortMethod] =
    useState("none");
  const [discounts, setDiscounts] = useState(false);

  const calculateAverageRating = (reviewsData) => {
    if (reviewsData.length === 0) {
      return 0;
    }

    const totalRating = reviewsData.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    return totalRating / reviewsData.length;
  };

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const productsCollectionRef = collection(db, "products");
        const querySnapshot = await getDocs(productsCollectionRef);

        const productsData = querySnapshot.docs.map((doc) => ({
          ids: doc.id,
          ...doc.data(),
        }));

        const productsWithReviews = await Promise.all(
          productsData.map(async (product) => {
            const reviewsQuerySnapshot = await getDocs(
              query(
                collection(db, "reviews"),
                where("productId", "==", product.ids)
              )
            );

            const reviewsData = reviewsQuerySnapshot.docs.map((reviewDoc) =>
              reviewDoc.data()
            );
            const averageRating = calculateAverageRating(reviewsData);

            return { ...product, reviews: reviewsData, averageRating };
          })
        );

        setProducts(productsWithReviews);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
        setError("Fetching products failed!");
      }
    };

    fetchTopProducts();
  }, []);

  const searched = products.filter((item) => {
    return search.toLowerCase() === ""
      ? item
      : item.name.toLowerCase().includes(search);
  });

  const handlePriceRangeChange = (e, field) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue) && newValue >= 0) {
      const updatedPriceRange = { ...priceRange, [field]: newValue.toString() };
      setPriceRange(updatedPriceRange);
    }
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSubCategoryChange = (e) => {
    setSubCategory(e.target.value);
  };

  let filteredProducts = searched.filter((product) => {
    const matchesPriceRange =
      (priceRange.min === "" ||
        product.sell_price >= parseFloat(priceRange.min)) &&
      (priceRange.max === "" ||
        product.sell_price <= parseFloat(priceRange.max));

    const matchesCategory = category === "" || product.category === category;
    const matchesSubCategory =
      subCategory === "" || product.brand === subCategory;

    const matchesDiscounts = !discounts || product.hasOwnProperty("old_price");

    return (
      matchesPriceRange &&
      matchesCategory &&
      matchesSubCategory &&
      matchesDiscounts
    );
  });

  const handleAlphabeticallySortMethodChange = (e) => {
    setSelectedAlphabeticallySortMethod(e.target.value);
  };

  const handlePriceSortMethodChange = (e) => {
    setSelectedPriceSortMethod(e.target.value);
  };

  const handleRatingSortMethodChange = (e) => {
    setSelectedRatingSortMethod(e.target.value);
  };

  let sortedProducts = [...filteredProducts];

  if (selectedAlphabeticallySortMethod === "asc") {
    sortedProducts = sortedProducts.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );
  } else if (selectedAlphabeticallySortMethod === "desc") {
    sortedProducts = sortedProducts.sort((a, b) =>
      b.name.toLowerCase().localeCompare(a.name.toLowerCase())
    );
  }

  if (selectedPriceSortMethod === "asc") {
    sortedProducts = sortedProducts.sort((a, b) => a.sell_price - b.sell_price);
  } else if (selectedPriceSortMethod === "desc") {
    sortedProducts = sortedProducts.sort((a, b) => b.sell_price - a.sell_price);
  }

  if (selectedRatingSortMethod === "asc") {
    sortedProducts = sortedProducts.sort(
      (a, b) => a.averageRating - b.averageRating
    );
  } else if (selectedRatingSortMethod === "desc") {
    sortedProducts = sortedProducts.sort(
      (a, b) => b.averageRating - a.averageRating
    );
  }

  return (
    <div>
      <div className="bg-productimg w-full h-[300px] object-cover">
        <div className="pt-[120px] pl-[560px] text-7xl font-extrabold tracking-wider text-white">
          Products
        </div>
      </div>
      <div className="ml-[440px] mb-[20px] mt-[30px]">
        <input
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search here..."
          type="text"
          className="border-4 flex items-center justify-between rounded-md p-2 w-[500px] "
        />
      </div>
      <div>
        {loading ? (
          <Loader />
        ) : error ? (
          <div className="p-[20px] bg-red-500 text-white">{error}</div>
        ) : searched.length === 0 ? (
          <h1 className="p-[50px] ml-[80px] bg-red-500 text-white">
            No products are found!
          </h1>
        ) : (
          <div className="flex">
            <div className="w-1/4 p-4 border-r border-gray-300">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>
              <div className="mb-4">
                <label className="block mb-2">Price Range:</label>
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => handlePriceRangeChange(e, "min")}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => handlePriceRangeChange(e, "max")}
                  className="w-full p-2 border rounded mt-2"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Category:</label>
                <select
                  value={category}
                  onChange={handleCategoryChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">All</option>
                  <option value="Games">Games</option>
                  <option value="Consoles">Consoles</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>
              {category === "Games" ? (
                <div className="mb-4">
                  <label className="block mb-2">Subcategory:</label>
                  <select
                    value={subCategory}
                    onChange={handleSubCategoryChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">All</option>
                    <option value="Playstation">Playstation</option>
                    <option value="Xbox">Xbox</option>
                    <option value="Nintendo">Nintendo</option>
                    <option value="PC">PC</option>
                  </select>
                </div>
              ) : (
                <>
                  {category === "Consoles" ? (
                    <div className="mb-4">
                      <label className="block mb-2">Subcategory:</label>
                      <select
                        value={subCategory}
                        onChange={handleSubCategoryChange}
                        className="w-full p-2 border rounded"
                      >
                        <option value="">All</option>
                        <option value="Playstation">Playstation</option>
                        <option value="Xbox">Xbox</option>
                        <option value="Nintendo">Nintendo</option>
                      </select>
                    </div>
                  ) : (
                    <>
                      {category === "Accessories" && (
                        <div className="mb-4">
                          <label className="block mb-2">Subcategory:</label>
                          <select
                            value={subCategory}
                            onChange={handleSubCategoryChange}
                            className="w-full p-2 border rounded"
                          >
                            <option value="">All</option>
                            <option value="Headset">Headset</option>
                            <option value="Controller">Controller</option>
                            <option value="Gift Cards">Gift Cards</option>
                          </select>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
              <h2 className="text-lg font-semibold mb-4 mt-[30px]">Sorting</h2>
              <div className="mb-4">
                <label className="block mb-2">Sort Alphabetically:</label>
                <select
                  value={selectedAlphabeticallySortMethod}
                  onChange={handleAlphabeticallySortMethodChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="none">None</option>
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Sort Price:</label>
                <select
                  value={selectedPriceSortMethod}
                  onChange={handlePriceSortMethodChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="none">None</option>
                  <option value="asc">Low to High</option>
                  <option value="desc">High to Low</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Sort Rating:</label>
                <select
                  value={selectedRatingSortMethod}
                  onChange={handleRatingSortMethodChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="none">None</option>
                  <option value="asc">Low to High</option>
                  <option value="desc">High to Low</option>
                </select>
              </div>
              <div className="mt-[50px] text-xl">
                <span className="mr-[10px]">Discounts</span>
                <input
                  type="checkbox"
                  checked={discounts}
                  onChange={(e) => setDiscounts(e.target.checked)}
                />
              </div>
            </div>
            <div className="w-3/4 p-4 grid grid-cols-4 gap-4">
              {sortedProducts.map((item) => (
                <ProductsCard val={item.val} item={item} key={item.ids} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
