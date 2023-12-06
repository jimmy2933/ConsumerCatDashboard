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
    const [loginData, setLoginData] = useState({
      labels: [],
      datasets: [],
    });
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
    const [deleteData, setDeleteData] = useState({
      labels: [],
      datasets: [],
    });
    const [scannedData, setScannedData] = useState({
      labels: [],
      datasets: [],
    });
    const [scannedItemAddData, setScannedItemAddData] = useState({
      labels: [],
      datasets: [],
    });

    // Scanned Item Add
    useEffect(() => {
      const fetchScannedInventoryAddData = async () => {
        const dateLogsRef = collection(db, 'eventLogs', 'scannedItemAdd', 'date');
        const dateLogsSnap = await getDocs(dateLogsRef);
        const inventoryAddCountsByDate = {};
    
        for (const dateDoc of dateLogsSnap.docs) {
          const date = dateDoc.id; // The document ID is the date
          const inventoryData = dateDoc.data();
    
          // Count the number of inventory add events (from scanning) for each date
          inventoryAddCountsByDate[date] = Object.keys(inventoryData).reduce((sum, key) => {
            return sum + (inventoryData[key].quantityAdded || 0); // Sum up quantities added for each event
          }, 0);
        }
    
        const sortedDates = Object.keys(inventoryAddCountsByDate).sort();
        const inventoryAddCounts = sortedDates.map(date => inventoryAddCountsByDate[date]);
    
        setScannedItemAddData({
          labels: sortedDates,
          datasets: [
            {
              label: 'Scanned Items Added',
              data: inventoryAddCounts,
              backgroundColor: 'rgba(255, 206, 86, 0.5)',
            }
          ],
        });
      };
    
      fetchScannedInventoryAddData();
    }, []);
    
    // Item Add Graph
    useEffect(() => {
      const fetchInventoryData = async () => {
        const dateLogsRef = collection(db, 'eventLogs', 'itemAdd', 'date');
        const dateLogsSnap = await getDocs(dateLogsRef);
        const inventoryCountsByDate = {};
    
        for (const dateDoc of dateLogsSnap.docs) {
          const date = dateDoc.id; // The document ID is the date
          const inventoryData = dateDoc.data();
    
          // Count the number of inventory add events for each date
          inventoryCountsByDate[date] = Object.keys(inventoryData).reduce((sum, key) => {
            return sum + inventoryData[key].quantityAdded; // Sum up quantities added for each event
          }, 0);
        }
    
        const sortedDates = Object.keys(inventoryCountsByDate).sort();
        const inventoryCounts = sortedDates.map(date => inventoryCountsByDate[date]);
    
        setAnalyticsData({
          labels: sortedDates,
          datasets: [
            {
              label: 'Items Added',
              data: inventoryCounts,
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
            }
          ],
        });
      };
    
      fetchInventoryData();
    }, []);
    
    // Login Graph
    useEffect(() => {
      const fetchLoginData = async () => {
        const dateLogsRef = collection(db, 'eventLogs', 'login', 'date');
        const dateLogsSnap = await getDocs(dateLogsRef);
        const loginCountsByDate = {};
    
        for (const dateDoc of dateLogsSnap.docs) {
          const date = dateDoc.id; // The document ID is the date
          const loginData = dateDoc.data();
    
          // Count the number of logins for each date
          loginCountsByDate[date] = Object.keys(loginData).length;
        }
    
        const sortedDates = Object.keys(loginCountsByDate).sort();
        const loginCounts = sortedDates.map(date => loginCountsByDate[date]);
    
        setLoginData({
          labels: sortedDates,
          datasets: [
            {
              label: 'Logins',
              data: loginCounts,
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
            }
          ],
        });
      };
    
      fetchLoginData();
    }, []);

    // Scanned Item Graph
    useEffect(() => {
      const fetchBarcodeScanData = async () => {
        const dateLogsRef = collection(db, 'eventLogs', 'barcodeScan', 'date');
        const dateLogsSnap = await getDocs(dateLogsRef);
        const barcodeScanCountsByDate = {};
    
        for (const dateDoc of dateLogsSnap.docs) {
          const date = dateDoc.id; // The document ID is the date
          const scanData = dateDoc.data();
    
          // Count the number of barcode scan events for each date
          barcodeScanCountsByDate[date] = Object.keys(scanData).length;
        }
    
        const sortedDates = Object.keys(barcodeScanCountsByDate).sort();
        const barcodeScanCounts = sortedDates.map(date => barcodeScanCountsByDate[date]);
    
        setScannedData({
          labels: sortedDates,
          datasets: [
            {
              label: 'Barcode Scans',
              data: barcodeScanCounts,
              backgroundColor: 'rgba(153, 102, 255, 0.5)',
            }
          ],
        });
      };
    
      fetchBarcodeScanData();
    }, []);
    
    
    // Feedback Graph
    useEffect(() => {
      const fetchFeedbackData = async () => {
        const feedbackTypes = ['Scanner', 'Report', 'Inventory'];
        const feedbackCounts = {
          Scanner: { A: 0, B: 0 },
          Report: { A: 0, B: 0 },
          Inventory: { A: 0, B: 0 }
        };
    
        for (const type of feedbackTypes) {
          const feedbackRef = collection(db, 'userFeedback', type, 'feedback');
          const feedbackSnap = await getDocs(feedbackRef);
    
          feedbackSnap.forEach((doc) => {
            const feedbackData = doc.data();
            if (feedbackData.Option === 'A') {
              feedbackCounts[type].A += 1;
            } else if (feedbackData.Option === 'B') {
              feedbackCounts[type].B += 1;
            }
          });
        }
    
        setNewGraphData({
          labels: feedbackTypes,
          datasets: [
            {
              label: 'Option A',
              data: feedbackTypes.map((type) => feedbackCounts[type].A),
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
              label: 'Option B',
              data: feedbackTypes.map((type) => feedbackCounts[type].B),
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
            },
          ],
        });
      };
    
      fetchFeedbackData();
    }, []);
    
    useEffect(() => {
      const fetchItemDeletionData = async () => {
        const dateLogsRef = collection(db, 'eventLogs', 'itemDelete', 'date');
        const dateLogsSnap = await getDocs(dateLogsRef);
        const itemDeletionCountsByDate = {};
    
        for (const dateDoc of dateLogsSnap.docs) {
          const date = dateDoc.id; // The document ID is the date
          const deletionData = dateDoc.data();
    
          // Count the number of item deletion events for each date
          itemDeletionCountsByDate[date] = Object.keys(deletionData).length;
        }
    
        const sortedDates = Object.keys(itemDeletionCountsByDate).sort();
        const itemDeletionCounts = sortedDates.map(date => itemDeletionCountsByDate[date]);
    
        setDeleteData({
          labels: sortedDates,
          datasets: [
            {
              label: 'Items Deleted',
              data: itemDeletionCounts,
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }
          ],
        });
      };
    
      fetchItemDeletionData();
    }, []);
    

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
              <h3>App Metrics</h3> {/* Label for the first graph */}
              <Bar data={chartData} />
            </div>
            <div className="chart-container">
              <h3>Item Add Metrics</h3> {/* Label for the second graph */}
              <Bar data={analyticsData} />
            </div>
            <div className="chart-container">
              <h3>A/B Testing Metrics</h3> {/* Label for the third graph */}
              <Bar data={newGraphData} />
            </div>
            <div className="chart-container">
              <h3>Login Metrics</h3>
              <Bar data={loginData} />
            </div>
            <div className="chart-container">
              <h3>Item Delete Metrics</h3>
              <Bar data={deleteData} />
            </div>
            <div className="chart-container">
              <h3>Scanned Items Metrics</h3>
              <Bar data={scannedData} />
            </div>
            <div className="chart-container">
              <h3>Scanned Items Added Metrics</h3>
              <Bar data={scannedItemAddData} />
            </div>
          </div>
        </div>
      </div>
    );
}

export default AdminScreen;
