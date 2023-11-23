import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import './UserScreen.css';

function UserScreen() {
  const [brand, setBrand] = useState('');
  const [itemSize, setItemSize] = useState('');
  const [productName, setProductName] = useState('');
  const [upc, setUpc] = useState('');
  const [firstName, setFirstName] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setFirstName(userDoc.data().firstName);
        } else {
          console.log('No such document!');
        }
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productRef = doc(db, 'productDatabase', upc); // Using UPC as the document ID
      const productData = {
        Brand: brand,
        ItemSize: itemSize,
        ProductName: productName,
        UPC: upc,
        expiresInDays: 7,
        fullName: brand + " " + productName
      };

      await setDoc(productRef, productData);
      console.log('Product uploaded successfully');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error uploading product: ', error);
    }
  };

  return (
    <div className="user-dashboard">
      <div className="sidebar">
        <ul>
          <li>
            <Link to="/ab-testing">A/B Testing</Link> {/* This link leads to the A/B Testing screen */}
          </li>
          <li>
            <a href="#">Link 2</a>
          </li>
          <li>
            <a href="#">Link 3</a>
          </li>
        </ul>
      </div>
      <div className="content">
        <h1>User Dashboard</h1>
        <p>Welcome, {firstName}!</p>
        {showSuccess && <div className="success-message">Product Uploaded Successfully!</div>}
        <form onSubmit={handleSubmit} className="product-upload-form">
          <div className="form-group">
            <label>Brand:</label>
            <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Item Size:</label>
            <input type="text" value={itemSize} onChange={(e) => setItemSize(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Product Name:</label>
            <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>UPC:</label>
            <input type="text" value={upc} onChange={(e) => setUpc(e.target.value)} />
          </div>
          <button type="submit" className="submit-btn">Upload Product</button>
        </form>
        <button onClick={handleSignOut} className="sign-out-btn">Sign Out</button>
      </div>
    </div>
  );
}

export default UserScreen;
