import React from "react";
import { db } from "./firebase.config";
import { products } from "./data";
import { addDoc, collection } from "firebase/firestore";

function MyComponent() {
  const transferProductsToFirestore = async () => {
    try {
      const productsCollectionRef = collection(db, "products");

      for (const product of products) {
        await addDoc(productsCollectionRef, product);
        console.log(`Product ${product.name} added to Firestore.`);
      }

      console.log("All products transferred to Firestore.");
    } catch (error) {
      console.error("Error transferring products to Firestore:", error);
    }
  };

  return (
    <div>
      <h1>Product Data Transfer to Firestore</h1>
      <button onClick={transferProductsToFirestore}>Transfer Products</button>
    </div>
  );
}

export default MyComponent;
