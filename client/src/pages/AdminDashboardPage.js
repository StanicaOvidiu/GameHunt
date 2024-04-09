import React, { useState, useEffect } from "react";
import { db } from "../firebase.config";
import {
  addDoc,
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";

const AdminDashboardPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [orderCount, setOrderCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [products, setProducts] = useState([]);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    ids: 0,
    name: "",
    slug: "",
    image: "",
    sell_price: 0,
    old_price: 0,
    rent_price: 0,
    category: "",
    brand: "",
    brandType: "",
    val: "",
    sellInStock: 0,
    rentInStock: 0,
    related: false,
    description: "",
  });
  const [editedProduct, setEditedProduct] = useState({
    ids: 0,
    name: "",
    slug: "",
    image: "",
    sell_price: 0,
    old_price: 0,
    rent_price: 0,
    category: "",
    brand: "",
    brandType: "",
    val: "",
    sellInStock: 0,
    rentInStock: 0,
    related: false,
    description: "",
  });

  const fetchUsers = async () => {
    try {
      const usersCollectionRef = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollectionRef);
      const userList = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const filteredUsers = userList.filter((user) => user.role !== "Admin");
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const ordersCollectionRef = collection(db, "orders");
        const ordersSnapshot = await getDocs(ordersCollectionRef);

        const orders = ordersSnapshot.docs.map((doc) => doc.data());

        const totalCount = orders.length;
        setOrderCount(totalCount);

        const totalAmountSum = orders.reduce(
          (sum, order) => sum + order.totalAmount,
          0
        );
        setTotalAmount(totalAmountSum);
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const productsCollectionRef = collection(db, "products");
        const productsSnapshot = await getDocs(productsCollectionRef);
        const productList = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        productList.sort((a, b) => a.name.localeCompare(b.name));
        setProducts(productList);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
    fetchOrderData();
    fetchUsers();
  }, []);

  const handlePromoteAdmin = async () => {
    if (selectedUser) {
      try {
        const usersCollectionRef = collection(db, "users");
        const querySnapshot = await getDocs(usersCollectionRef);
        const userDoc = querySnapshot.docs.find(
          (doc) => doc.data().username === selectedUser
        );

        if (userDoc) {
          await updateDoc(doc(db, "users", userDoc.id), {
            role: "Admin",
          });
          setSelectedUser("");
          fetchUsers();
        } else {
          console.error("User not found");
        }
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!userId) {
      console.error("Invalid user ID");
      return;
    }

    try {
      await deleteDoc(doc(db, "users", userId));
      const updatedUsers = users.filter((user) => user.id !== userId);
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleAddProduct = async (event) => {
    event.preventDefault();

    try {
      const productsCollectionRef = collection(db, "products");
      const newProductDocRef = await addDoc(productsCollectionRef, newProduct);

      setNewProduct({
        ids: 0,
        name: "",
        slug: "",
        image: "",
        sell_price: 0,
        old_price: 0,
        rent_price: 0,
        category: "",
        brand: "",
        brandType: "",
        val: "",
        sellInStock: 0,
        rentInStock: 0,
        related: false,
        description: "",
      });

      console.log("New product added with ids:", newProductDocRef.id);
      toast.success("New product added");
    } catch (error) {
      console.error("Error adding new product:", error);
    }
  };

  const handleEditProductChange = (field, value) => {
    setEditedProduct({
      ...editedProduct,
      [field]: value,
    });
  };

  const handleEditProductSubmit = async (event) => {
    event.preventDefault();

    if (selectedProduct) {
      try {
        const productDocRef = doc(db, "products", selectedProduct);
        await updateDoc(productDocRef, editedProduct);
        toast.success("Product updated successfully");
      } catch (error) {
        console.error("Error updating product:", error);
      }
    }
  };

  const handleDeleteProduct = async () => {
    if (deleteProduct) {
      try {
        await deleteDoc(doc(db, "products", deleteProduct));
        const updatedProducts = products.filter(
          (product) => product.ids !== deleteProduct
        );
        setProducts(updatedProducts);
        setDeleteProduct("");
        toast.success("Product deleted succesfully");
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  return (
    <>
      <div className="bg-admin w-full h-[300px] object-cover">
        <div className="pt-[120px] pl-[370px] text-7xl font-extrabold tracking-wider text-white">
          Admin Dashboard
        </div>
      </div>
      <div className="mt-[50px] ml-[100px]">
        <div className="flex mb-[50px]">
          <div className="font-bold text-5xl mr-[350px]">
            Total Orders: {orderCount}
          </div>
          <div className="font-bold text-5xl">
            Total Amount: ${totalAmount.toFixed(2)}
          </div>
        </div>
        <div>
          <div className="font-semibold text-xl">Select User to Promote:</div>
          <select
            className="mb-[30px] mt-[35px]"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">Select a user</option>
            {users.map((user, index) => (
              <option key={index} value={user.ids}>
                {user.username}
              </option>
            ))}
          </select>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-2 rounded ml-[30px] mr-2"
            onClick={handlePromoteAdmin}
          >
            Promote to Admin
          </button>
        </div>
        <div>
          {users.length === 0 ? (
            <p>All users gone.</p>
          ) : (
            <>
              <h3 className="font-semibold text-xl mb-[10px]">All Users</h3>
              <ul>
                {users.map((user, index) => (
                  <li className="mb-[20px]" key={index}>
                    {index + 1}. {user.username}{" "}
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-2 rounded ml-[30px] mr-2"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        {showAddProductForm && (
          <form onSubmit={handleAddProduct}>
            <h3 className="font-semibold mt-[30px] mb-[10px]">
              Add New Product
            </h3>
            <div className="my-[20px]">
              IDs:
              <input
                type="number"
                placeholder="IDs"
                value={newProduct.ids}
                className="ml-[20px]"
                onChange={(e) =>
                  setNewProduct({ ...newProduct, ids: e.target.value })
                }
                required
              />
            </div>
            <div className="my-[20px]">
              Name:
              <input
                type="text"
                placeholder="Name"
                value={newProduct.name}
                className="ml-[20px]"
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                required
              />
            </div>
            <div className="my-[20px]">
              Slug:
              <input
                type="text"
                placeholder="Slug"
                value={newProduct.slug}
                className="ml-[20px]"
                onChange={(e) =>
                  setNewProduct({ ...newProduct, slug: e.target.value })
                }
                required
              />
            </div>
            <div className="my-[20px]">
              Image URL:
              <input
                type="text"
                placeholder="ImageURL"
                value={newProduct.image}
                className="ml-[20px]"
                onChange={(e) =>
                  setNewProduct({ ...newProduct, image: e.target.value })
                }
                required
              />
            </div>
            <div className="my-[20px]">
              Sell Price:
              <input
                type="number"
                placeholder="Sell Price"
                value={newProduct.sell_price}
                className="ml-[20px]"
                onChange={(e) =>
                  setNewProduct({ ...newProduct, sell_price: e.target.value })
                }
                required
              />
            </div>
            <div className="my-[20px]">
              Old Price:
              <input
                type="number"
                placeholder="Old Price"
                value={newProduct.old_price}
                className="ml-[20px]"
                onChange={(e) =>
                  setNewProduct({ ...newProduct, old_price: e.target.value })
                }
              />
            </div>
            <div className="my-[20px]">
              Rent Price:
              <input
                type="number"
                placeholder="Rent Price"
                value={newProduct.rent_price}
                className="ml-[20px]"
                onChange={(e) =>
                  setNewProduct({ ...newProduct, rent_price: e.target.value })
                }
                required
              />
            </div>
            <div className="my-[20px]">
              Category:
              <input
                type="text"
                placeholder="Category"
                value={newProduct.category}
                className="ml-[20px]"
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
                required
              />
            </div>
            <div className="my-[20px]">
              Brand:
              <input
                type="text"
                placeholder="Brand"
                value={newProduct.brand}
                className="ml-[20px]"
                onChange={(e) =>
                  setNewProduct({ ...newProduct, brand: e.target.value })
                }
                required
              />
            </div>
            <div className="my-[20px]">
              Brand Type:
              <input
                type="text"
                placeholder="Brand Type"
                value={newProduct.brandType}
                className="ml-[20px]"
                onChange={(e) =>
                  setNewProduct({ ...newProduct, brandType: e.target.value })
                }
              />
            </div>
            <div className="my-[20px]">
              Val:
              <input
                type="text"
                placeholder="Val"
                value={newProduct.val}
                className="ml-[20px]"
                onChange={(e) =>
                  setNewProduct({ ...newProduct, val: e.target.value })
                }
                required
              />
            </div>
            <div className="my-[20px]">
              Sell In Stock:
              <input
                type="number"
                placeholder="Sell In Stock"
                value={newProduct.sellInStock}
                className="ml-[20px]"
                onChange={(e) =>
                  setNewProduct({ ...newProduct, sellInStock: e.target.value })
                }
                required
              />
            </div>
            <div className="my-[20px]">
              Rent In Stock:
              <input
                type="number"
                placeholder="Rent In Stock"
                value={newProduct.rentInStock}
                className="ml-[20px]"
                onChange={(e) =>
                  setNewProduct({ ...newProduct, rentInStock: e.target.value })
                }
                required
              />
            </div>
            <div className="my-[20px]">
              Description:
              <textarea
                placeholder="Description"
                value={newProduct.description}
                className="ml-[20px]"
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
                required
              />
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-2 rounded ml-[30px] mr-2"
              type="submit"
            >
              Add Product
            </button>
          </form>
        )}
        <button
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition duration-300 ml-[45px] my-[30px]"
          onClick={() => setShowAddProductForm(!showAddProductForm)}
        >
          {showAddProductForm ? "Cancel" : "Add New Product"}
        </button>
        <h3 className="font-semibold text-xl mb-[20px]">Edit Product:</h3>
        <select
          value={selectedProduct}
          onChange={(e) => {
            setSelectedProduct(e.target.value);
            const selectedProductData = products.find(
              (product) => product.id === e.target.value
            );
            setEditedProduct(selectedProductData);
          }}
        >
          <option value="">Select a product</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
        <div>
          {selectedProduct && (
            <form onSubmit={handleEditProductSubmit}>
              <div className="my-[20px]">
                IDs:
                <input
                  type="number"
                  value={editedProduct.ids}
                  placeholder="IDs"
                  className="ml-[20px]"
                  onChange={(e) =>
                    handleEditProductChange("ids", e.target.value)
                  }
                />
              </div>
              <div className="my-[20px]">
                Name:
                <textarea
                  type="text"
                  value={editedProduct.name}
                  placeholder="Name"
                  className="ml-[20px]"
                  onChange={(e) =>
                    handleEditProductChange("name", e.target.value)
                  }
                />
              </div>
              <div className="my-[20px]">
                Slug:
                <textarea
                  type="text"
                  value={editedProduct.slug}
                  placeholder="Slug"
                  className="ml-[20px]"
                  onChange={(e) =>
                    handleEditProductChange("slug", e.target.value)
                  }
                />
              </div>
              <div className="my-[20px]">
                Image URL:
                <textarea
                  type="text"
                  value={editedProduct.image}
                  placeholder="Image URL"
                  className="ml-[20px]"
                  onChange={(e) =>
                    handleEditProductChange("image", e.target.value)
                  }
                />
              </div>
              <div className="my-[20px]">
                Sell Price:
                <input
                  type="number"
                  value={editedProduct.sell_price}
                  placeholder="Sell Price"
                  className="ml-[20px]"
                  onChange={(e) =>
                    handleEditProductChange("sell_price", e.target.value)
                  }
                />
              </div>
              <div className="my-[20px]">
                Old Price:
                <input
                  type="number"
                  value={editedProduct.old_price}
                  placeholder="Old Price"
                  className="ml-[20px]"
                  onChange={(e) =>
                    handleEditProductChange("old_price", e.target.value)
                  }
                />
              </div>
              <div className="my-[20px]">
                Rent Price:
                <input
                  type="number"
                  value={editedProduct.rent_price}
                  placeholder="Rent Price"
                  className="ml-[20px]"
                  onChange={(e) =>
                    handleEditProductChange("rent_price", e.target.value)
                  }
                />
              </div>
              <div className="my-[20px]">
                Category:
                <input
                  type="text"
                  value={editedProduct.category}
                  placeholder="Category"
                  className="ml-[20px]"
                  onChange={(e) =>
                    handleEditProductChange("category", e.target.value)
                  }
                />
              </div>
              <div className="my-[20px]">
                Brand:
                <input
                  type="text"
                  value={editedProduct.brand}
                  placeholder="Brand"
                  className="ml-[20px]"
                  onChange={(e) =>
                    handleEditProductChange("brand", e.target.value)
                  }
                />
              </div>
              <div className="my-[20px]">
                Brand Type:
                <input
                  type="text"
                  value={editedProduct.brandType}
                  placeholder="Brand Type"
                  className="ml-[20px]"
                  onChange={(e) =>
                    handleEditProductChange("brandType", e.target.value)
                  }
                />
              </div>
              <div className="my-[20px]">
                Val:
                <input
                  type="text"
                  value={editedProduct.val}
                  placeholder="Val"
                  className="ml-[20px]"
                  onChange={(e) =>
                    handleEditProductChange("val", e.target.value)
                  }
                />
              </div>
              <div className="my-[20px]">
                Sell in stock:
                <input
                  type="number"
                  value={editedProduct.sellInStock}
                  placeholder="Sell in stock"
                  className="ml-[20px]"
                  onChange={(e) =>
                    handleEditProductChange("sellInStock", e.target.value)
                  }
                />
              </div>
              <div className="my-[20px]">
                Rent in stock:
                <input
                  type="number"
                  value={editedProduct.rentInStock}
                  placeholder="Rent in stock"
                  className="ml-[20px]"
                  onChange={(e) =>
                    handleEditProductChange("rentInStock", e.target.value)
                  }
                />
              </div>
              <div className="my-[20px]">
                Description:
                <textarea
                  type="text"
                  value={editedProduct.description}
                  placeholder="Description"
                  className="ml-[20px]"
                  onChange={(e) =>
                    handleEditProductChange("description", e.target.value)
                  }
                />
              </div>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-2 rounded ml-[30px] mr-2"
                type="submit"
              >
                Save Changes
              </button>
            </form>
          )}
        </div>
        <div className="mt-[40px]">
          <div className="font-semibold text-xl">Select Product to Remove:</div>
          <select
            value={deleteProduct}
            className="mb-[30px] mt-[35px]"
            onChange={(e) => setDeleteProduct(e.target.value)}
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-2 rounded ml-[30px] mr-2"
            onClick={handleDeleteProduct}
          >
            Remove Product
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminDashboardPage;
