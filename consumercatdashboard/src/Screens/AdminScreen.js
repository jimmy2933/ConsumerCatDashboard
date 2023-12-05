import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { auth, db } from '../firebase';
import Chart from 'chart.js/auto';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import './AdminScreen.css';
import { doc, getDoc } from 'firebase/firestore';


function AdminScreen() {
    const [userCount, setUserCount] = useState(0);
    const [productCount, setProductCount] = useState(0);
    const [feedbackCount, setFeedbackCount] = useState(0);
    const [currentUser, setCurrentUser] = useState(null);
    const today = new Date().toLocaleDateString();

    const [chartData, setChartData] = useState({
      labels: [],
      datasets: [],
    });
    const [analyticsData, setAnalyticsData] = useState({
      labels: [],
      datasets: [],
    });
    const [newGraphData, setNewGraphData] = useState({
      labels: [],
      datasets: [],
    });

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          // Fetch user data from Firestore
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            setCurrentUser({
              displayName: userData.firstName + ' ' + userData.lastName, // Assuming the names are stored in these fields
              email: user.email
            });
          } else {
            console.log("No such document in Firestore!");
          }
        } else {
          // User is signed out
          setCurrentUser(null);
        }
      });

      return () => unsubscribe();
    }, []);

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

    // Function to fetch mock Firebase Analytics data
    const fetchAnalyticsData = () => {
      // This is where you'd fetch data from BigQuery or another source
      // For now, we're using mock data
      const mockData = {
        labels: ['Event 1', 'Event 2', 'Event 3'],
        datasets: [
          {
            label: 'Event Count',
            data: [25, 50, 75], // Replace with real data
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
          }
        ],
      };
      setAnalyticsData(mockData);
      setNewGraphData(mockData);
    };

    useEffect(() => {
      fetchAnalyticsData();
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
          <Link to="/" className="admin-link"><p>Dashboard</p></Link>
          <Link to="/admin/users" className="admin-link"><p>Users</p></Link>
        </div>
        <div className="admin-content">
          <div className="admin-header">
            <h1>Admin Dashboard</h1>
            <button onClick={handleSignOut}>Sign Out</button>
          </div>
          <div className="admin-section">
            <div className="admin-status-cards" style={{ textAlign: 'left' }}>
              {currentUser && (
                <>
                  <div className="status-card">Name: {currentUser.displayName}</div>
                  <div className="status-card">Email: {currentUser.email}</div>
                </>
              )}
              <div className="status-card">Today's Date: {today}</div>
            </div>
          </div>
          <h2>Graphs and Analytics</h2>
          <div className="admin-section">
            <div className="chart-container">
              <Bar data={chartData} />
            </div>
            <div className="chart-container">
              <Bar data={analyticsData} />
            </div>
            <div className="chart-container">
              <Bar data={newGraphData} /> {/* This will start on a new line */}
            </div>
          </div>
        </div>
      </div>
    );
}

export default AdminScreen;
