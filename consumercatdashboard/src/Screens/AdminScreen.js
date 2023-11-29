import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import './AdminScreen.css';


function AdminScreen() {
    const [userCount, setUserCount] = useState(0);
    const [productCount, setProductCount] = useState(0);
    const [feedbackCount, setFeedbackCount] = useState(0);
    const [chartData, setChartData] = useState({
      labels: [],
      datasets: [],
    });

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

      // Fetch Feedback Responses Count
      const fetchFeedbackCount = async () => {
        const querySnapshot = await getDocs(collection(db, "feedbackResponses"));
        setFeedbackCount(querySnapshot.size);
      };

      fetchUsersCount();
      fetchProductCount();
      fetchFeedbackCount();
    }, []);

    useEffect(() => {
      setChartData({
        labels: ['Users', 'Products', 'Feedback'],
        datasets: [
          {
            label: 'Count',
            data: [userCount, productCount, feedbackCount],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
            ],
            borderWidth: 1,
          },
        ],
      });
    }, [userCount, productCount, feedbackCount]);

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
          <div className="admin-section">
            <div className="admin-status-cards">
              <div className="status-card">Users: {userCount}</div>
              <div className="status-card">Product Database Count: {productCount}</div>
              <div className="status-card">Feedback Responses: {feedbackCount}</div>
            </div>
          </div>
          <div className="admin-section">
            <h2>Graphs and Analytics</h2>
            <Bar data={chartData} />
          </div>
          <div className="admin-section">
            <h2>More Data</h2>
          </div>
        </div>
      </div>
    );
}

export default AdminScreen;
