import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import Rating from "./Rating";
import ReviewRating from "./ReviewRating";
import { toast } from "react-toastify";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineShoppingCart,
  AiTwotoneExperiment,
} from "react-icons/ai";
import ProductsCard from "./ProductsCard";
import { Link, useParams } from "react-router-dom";
import { db, auth } from "../firebase.config";
import {
  deleteDoc,
  addDoc,
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Product = () => {
  const { slug } = useParams();
  let [baseQty, setBaseQty] = useState(1);
  const [currentUser, setCurrentUser] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredRelated, setFilteredRelated] = useState([]);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [userReview, setUserReview] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [rentStartDate, setRentStartDate] = useState(null);
  const [rentEndDate, setRentEndDate] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productsCollection = collection(db, "products");
        const q = query(productsCollection, where("slug", "==", slug));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const item = querySnapshot.docs[0].data();
          setProduct(item);
        } else {
          console.log("Product not found.");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollectionRef = collection(db, "products");
        const f = query(productsCollectionRef, where("slug", "==", slug));
        const querySnapshot = await getDocs(productsCollectionRef);
        const filterSnapshot = await getDocs(f);
        const rel = filterSnapshot.docs[0].data();

        const productsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const related = productsData.filter(
          (item) =>
            item.related === true &&
            item.category === rel.category &&
            item.brand === rel.brand
        );
        setFilteredRelated(related);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
        setError("Fetching products failed!");
      }
    };

    fetchProducts();
  }, [slug]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userRef);
        setCurrentUser({
          uid: user.uid,
          displayName: userSnapshot.data()?.username,
          imageUrl: userSnapshot.data()?.imageUrl,
          role: userSnapshot.data()?.role,
        });
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsCollection = collection(db, "reviews");
        const q = query(
          reviewsCollection,
          where("productId", "==", product.ids)
        );
        const querySnapshot = await getDocs(q);

        const fetchedReviews = querySnapshot.docs.map((doc) => ({
          ids: doc.ids,
          ...doc.data(),
        }));

        setReviews(fetchedReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    if (product) {
      fetchReviews();
    }
  }, [product]);

  useEffect(() => {
    if (!currentUser) {
      setIsInWishlist(false);
      return;
    }

    const wishlistRef = doc(db, "wishlist", currentUser.uid);

    const checkWishlistStatus = async () => {
      const wishlistDoc = await getDoc(wishlistRef);
      const wishlistData = wishlistDoc.exists()
        ? wishlistDoc.data()
        : { wishlist: [] };

      setIsInWishlist(
        wishlistData.wishlist.some((item) => item.ids === product.ids)
      );
    };

    checkWishlistStatus();
  }, [currentUser, product]);

  const handleWishlist = async () => {
    if (!currentUser) {
      toast.error("You need to log in to add items to your wishlist.");
      return;
    }

    const wishlistRef = doc(db, "wishlist", currentUser.uid);

    try {
      const wishlistDoc = await getDoc(wishlistRef);
      const wishlistData = wishlistDoc.exists()
        ? wishlistDoc.data()
        : { wishlist: [] };

      let updatedWishlist;
      if (isInWishlist) {
        updatedWishlist = wishlistData.wishlist.filter(
          (item) => item.ids !== product.ids
        );
        toast.error(`${product.name} removed from wishlist`);
      } else {
        updatedWishlist = [
          ...wishlistData.wishlist,
          {
            ids: product.ids,
            name: product.name,
            sell_price: product.sell_price,
            image: product.image,
            category: product.category,
            brand: product.brand,
            slug: product.slug,
          },
        ];
        toast.success(`${product.name} added to wishlist`);
      }

      await setDoc(wishlistRef, { wishlist: updatedWishlist });

      setIsInWishlist(!isInWishlist);
    } catch (error) {
      console.error("Error adding/removing from wishlist:", error);
    }
  };

  const addToCart = async (product) => {
    if (!currentUser) {
      toast.error("You need to log in to add items to your cart.");
      return;
    }

    try {
      const cartRef = doc(db, "cart", currentUser.uid);
      const cartDoc = await getDoc(cartRef);

      let updatedCart = [];

      if (cartDoc.exists()) {
        updatedCart = cartDoc.data().cart;
      }

      const existingCartItemIndex = updatedCart.findIndex(
        (item) => item.ids === product.ids
      );

      if (existingCartItemIndex !== -1) {
        updatedCart[existingCartItemIndex].quantity += baseQty;
      } else {
        updatedCart.push({
          ids: product.ids,
          name: product.name,
          sell_price: product.sell_price,
          quantity: baseQty,
          image: product.image,
          category: product.category,
          brand: product.brand,
          slug: product.slug,
        });
      }

      await setDoc(cartRef, { cart: updatedCart });

      toast.success(`${product.name} added to cart`);
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error("An error occurred while adding item to cart.");
    }
  };

  const handleRentButtonClick = async () => {
    if (!currentUser) {
      toast.error("You need to log in to rent this product.");
      return;
    }

    try {
      const cartRef = doc(db, "cart", currentUser.uid);
      const cartDoc = await getDoc(cartRef);

      if (cartDoc.exists()) {
        const cartData = cartDoc.data();
        const isProductInCart = cartData.cart.some(
          (item) => item.ids === product?.ids
        );

        if (isProductInCart) {
          toast.error(
            "This product is already in your cart and cannot be rented."
          );
        } else {
          setShowDatePicker(!showDatePicker);
        }
      } else {
        setShowDatePicker(!showDatePicker);
      }
    } catch (error) {
      console.error("Error checking cart:", error);
      toast.error("An error occurred while checking your cart.");
    }
  };

  const handleConfirmRent = async () => {
    if (!rentStartDate || !rentEndDate) {
      toast.error("Please select rental dates.");
      return;
    }

    const rentalDuration = Math.ceil(
      (rentEndDate - rentStartDate) / (1000 * 60 * 60 * 24)
    );

    if (rentalDuration <= 0) {
      toast.error("Please select valid rental dates.");
      return;
    }

    if (!currentUser) {
      toast.error("You need to log in to rent this product.");
      return;
    }

    const rentedProduct = {
      ids: product.ids,
      name: product.name,
      rent_price: product.rent_price,
      quantity: 1,
      days: rentalDuration,
      image: product.image,
      category: product.category,
      brand: product.brand,
      slug: product.slug,
    };

    try {
      const cartRef = doc(db, "cart", currentUser.uid);
      const cartDoc = await getDoc(cartRef);

      let updatedCart = [];

      if (cartDoc.exists()) {
        updatedCart = cartDoc.data().cart;
      }

      const existingCartItemIndex = updatedCart.findIndex(
        (item) => item.ids === rentedProduct.ids
      );

      if (existingCartItemIndex !== -1) {
        updatedCart[existingCartItemIndex].quantity += rentedProduct.quantity;
      } else {
        updatedCart.push(rentedProduct);
      }

      await setDoc(cartRef, { cart: updatedCart });

      toast.success(
        `${product.name} added to cart for ${rentalDuration} days.`
      );
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error("An error occurred while adding item to cart.");
    }

    setRentStartDate(null);
    setRentEndDate(null);
    setShowDatePicker(false);
  };

  const handleReviewSubmit = async () => {
    if (!currentUser) {
      toast.error("You need to log in to leave a review.");
      return;
    }

    if (userReview.trim() === "" || userRating === 0) {
      toast.error("Please enter a review and rating before submitting.");
      return;
    }

    try {
      const reviewData = {
        username: currentUser.displayName,
        userId: currentUser.uid,
        productId: product.ids,
        review: userReview,
        rating: userRating,
        timestamp: new Date(),
      };

      const reviewsCollectionRef = collection(db, "reviews");
      await addDoc(reviewsCollectionRef, reviewData);

      toast.success("Review submitted successfully!");
      window.location.reload();

      setUserReview("");
      setUserRating(0);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("An error occurred while submitting the review.");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteDoc(doc(db, "reviews", reviewId));
      const updatedReviews = reviews.filter(
        (review) => review.ids !== reviewId
      );
      setReviews(updatedReviews);
      toast.success("Review deleted successfully.");
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("An error occurred while deleting the review.");
    }
  };

  const totalRatingSum = reviews.reduce(
    (total, review) => total + review.rating,
    0
  );

  const averageRating = totalRatingSum / reviews.length;

  return (
    <div>
      {loading ? (
        <Loader />
      ) : error ? (
        <div className="div-[20px] bg-red-500 text-white">{error}</div>
      ) : (
        <div>
          <div className="my-[10px] ml-[70px] text-orange-500">
            <Link to="/"> Home </Link>/
            <Link to={`/${product.category}`}> {product.category} </Link>/
            <Link to={`/${product.category}/${product.brand}`}>
              {" "}
              {product.brand}{" "}
            </Link>
            / {product.slug.toUpperCase()}
          </div>
          <div className="max-w-screen-xl mx-auto pt-2 flex gap-10">
            <div className="w-2/5 relative">
              <img
                className="w-full h-[550px] object-contain"
                src={product.image}
                alt="productImg"
              />
            </div>
            <div className="w-3/5 flex flex-col justify-center gap-12">
              <div>
                <h2 className="text-4xl font-semibold mb-[30px]">
                  {product.name}
                </h2>
                <div className="flex items-center gap-4 mt-3">
                  <div className="text-2xl font-medium text-gray-900">
                    {product.old_price > 0 && (
                      <div className="mb-[20px]">
                        <span className="line-through mr-[50px] text-red-500">
                          ${product.old_price}
                        </span>
                        <span className="bg-red-600 text-white div-[5px]">
                          -
                          {Math.ceil(
                            (1 - product.sell_price / product.old_price) * 100
                          )}
                          %
                        </span>
                      </div>
                    )}
                    <div className="flex flex-wrap">
                      <span className="mb-[10px] mr-[260px]">
                        Selling price:
                      </span>
                      <span>Renting price per day:</span>
                    </div>
                    <div className="flex flex-wrap">
                      <span className="text-5xl mr-[300px]">
                        ${product.sell_price}
                      </span>
                      <span className="text-5xl">${product.rent_price}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex">
                <Rating
                  rating={
                    reviews.length === 0 ? "0.0" : averageRating.toFixed(1)
                  }
                  numReviews={reviews.length}
                />
                <button
                  onClick={handleRentButtonClick}
                  className="bg-black text-white py-3 px-6 active:bg-gray-800 ml-[100px]"
                >
                  <div className="flex justify-between">
                    <AiTwotoneExperiment size={25} className="mr-3" />
                    Rent
                  </div>
                </button>
                {showDatePicker && (
                  <div className="mt-4 ml-[180px]">
                    <h3 className="text-lg font-semibold mb-2">Rental Dates</h3>
                    <div className="flex gap-2">
                      <DatePicker
                        selected={rentStartDate}
                        onChange={(date) => setRentStartDate(date)}
                        selectsStart
                        startDate={rentStartDate}
                        endDate={rentEndDate}
                        minDate={new Date()}
                        placeholderText="Start Date"
                      />
                      <DatePicker
                        selected={rentEndDate}
                        onChange={(date) => setRentEndDate(date)}
                        selectsEnd
                        startDate={rentStartDate}
                        endDate={rentEndDate}
                        minDate={rentStartDate || new Date()}
                        placeholderText="End Date"
                      />
                    </div>
                    <button
                      onClick={handleConfirmRent}
                      className="bg-black text-white py-3 px-6 active:bg-gray-800 mt-3"
                    >
                      Confirm Rental
                    </button>
                  </div>
                )}
              </div>
              <div className="text-base text-gray-500 -mt-3">
                {product.description}
              </div>
              <div className="flex gap-4">
                <div className="w-52 flex items-center justify-between text-gray-500 gap-4 border div-3">
                  <div className="text-sm">Quantity</div>
                  <div className="flex items-center gap-4 text-sm font-semibold">
                    <button
                      onClick={() =>
                        setBaseQty(baseQty === 1 ? (baseQty = 1) : baseQty - 1)
                      }
                      className="border h-5 font-normal text-lg flex items-center justify-center px-2 hover:bg-gray-700 hover:text-white cursor-pointer duration-300 active:bg-black"
                    >
                      -
                    </button>
                    <span>{baseQty}</span>
                    <button
                      onClick={() => setBaseQty(baseQty + 1)}
                      className="border h-5 font-normal text-lg flex items-center justify-center px-2 hover:bg-gray-700 hover:text-white cursor-pointer duration-300 active:bg-black"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className="bg-black text-white py-3 px-6 active:bg-gray-800"
                >
                  <div className="flex justify-between">
                    <AiOutlineShoppingCart size={25} className="mr-3" />
                    Add to Cart
                  </div>
                </button>
                <button
                  onClick={() => handleWishlist(product)}
                  className="bg-black text-white py-3 px-6 active:bg-gray-800"
                >
                  {isInWishlist ? (
                    <div className="flex justify-between">
                      <AiFillHeart size={25} className="mr-3" />
                      Remove from Wishlist
                    </div>
                  ) : (
                    <div className="flex justify-between">
                      <AiOutlineHeart size={25} className="mr-3" />
                      Add to WishList
                    </div>
                  )}
                </button>
              </div>
              <div className="text-base text-gray-500">
                <span>Brand: </span>
                <span className="font-medium capitalize">{product.brand}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 ml-[180px]">
            <h3 className="text-lg font-semibold mb-2">Reviews</h3>
            {reviews.length === 0 ? (
              <p>No reviews available for this product.</p>
            ) : (
              <ul>
                {reviews.map((review, index) => (
                  <li key={index} className="mb-[30px]">
                    {currentUser && (
                      <div>
                        {currentUser.role === "Admin" ||
                        currentUser.uid === review.userId ? (
                          <button
                            className="ml-[600px] text-red-500"
                            onClick={() => handleDeleteReview(review.ids)}
                          >
                            X
                          </button>
                        ) : null}
                      </div>
                    )}
                    <strong className="mr-2">{review.rating} stars</strong>
                    <span>by {review.username}</span>
                    <p>{review.review}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(
                        review.timestamp.toMillis()
                      ).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {currentUser && (
            <div className="mt-[70px] ml-[180px]">
              <h3 className="text-lg font-semibold mb-2">Leave a Review</h3>
              <ReviewRating
                rating={userRating}
                onRatingChange={setUserRating}
              />
              <textarea
                className="w-full p-2 border rounded-md mt-2"
                rows="4"
                placeholder="Write your review here..."
                value={userReview}
                onChange={(e) => setUserReview(e.target.value)}
              ></textarea>
              <button
                className="bg-black text-white py-2 px-4 mt-2"
                onClick={handleReviewSubmit}
              >
                Submit Review
              </button>
            </div>
          )}
          <div className="flex items-center justify-center my-[40px] text-4xl">
            Related Products
          </div>
          <span className="flex ml-[150px] my-[30px]">
            {loading ? (
              <Loader />
            ) : error ? (
              <div className="div-[20px] bg-red-500 text-white">{error}</div>
            ) : filteredRelated.length === 0 ? (
              <h1>No products are found!</h1>
            ) : (
              filteredRelated.map((item) => (
                <div key={item.ids} className="mr-[50px]">
                  <ProductsCard
                    val={`${item.category.toLowerCase()}/${item.brand.toLowerCase()}`}
                    item={item}
                    key={item.ids}
                  />
                </div>
              ))
            )}
          </span>
        </div>
      )}
    </div>
  );
};

export default Product;
