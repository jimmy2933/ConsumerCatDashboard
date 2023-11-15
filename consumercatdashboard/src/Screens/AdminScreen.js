import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase'; // Adjust the import path as necessary
import { signOut } from 'firebase/auth';
import { collection, query, getDocs } from 'firebase/firestore';
import './AdminScreen.css';

function AdminScreen() {
    const [userCount, setUserCount] = useState(0);
    const [productCount, setProductCount] = useState(0);
    const [feedbackCount, setFeedbackCount] = useState(0);

    useEffect(() => {
      // Fetch Users Count
      const fetchUsersCount = async () => {
        const querySnapshot = await getDocs(collection(db, "users"));
        setUserCount(querySnapshot.size);
      };

      // Fetch Product Database Count
      const fetchProductCount = async () => {
        const querySnapshot = await getDocs(collection(db, "productDatabase"));
        setProductCount(querySnapshot.size);
      };

      // Fetch Feedback Responses Count (adjust collection path as per your database)
      const fetchFeedbackCount = async () => {
        const querySnapshot = await getDocs(collection(db, "feedbackResponses"));
        setFeedbackCount(querySnapshot.size);
      };

      fetchUsersCount();
      fetchProductCount();
      fetchFeedbackCount();
    }, []);

    const handleSignOut = async () => {
      try {
        await signOut(auth);
        console.log('User signed out successfully');
      } catch (error) {
        console.error('Error signing out: ', error);
      }
    };

    return (
      <div className="admin-container">
        <div className="admin-sidebar">
          <p>Dashboard</p>
          <p>Users</p>
          <p>Settings</p>
        </div>
        <div className="admin-content">
          <div className="admin-header">
            <h1>Admin Dashboard</h1>
            <button onClick={handleSignOut}>Sign Out</button>
          </div>

          {/* Status Cards Section */}
          <div className="admin-section">
            <div className="admin-status-cards">
              <div className="status-card">Users: {userCount}</div>
              <div className="status-card">Product Database Count: {productCount}</div>
              <div className="status-card">Feedback Responses: {feedbackCount}</div>
            </div>
          </div>

          {/* Graphs and Analytics Section */}
          <div className="admin-section">
            <h2>Graphs and Analytics</h2>
            {/* Content for graphs and analytics */}
          </div>

          {/* More Data Section */}
          <div className="admin-section">
            <h2>More Data</h2>
            {/* Content for other data */}
          </div>

          {/* Additional sections as needed */}
        </div>
      </div>
    );
}

export default AdminScreen;
