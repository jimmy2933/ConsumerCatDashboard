import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserScreen from './Screens/UserScreen';
import AdminScreen from './Screens/AdminScreen';
import Login from './Screens/Login';
import { auth } from './firebase'; // Adjust the path as per your project structure
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div style={{ border: '15px solid rgba(0, 0, 0, 0)' }} className="app">
        {!currentUser}
        <Routes>
          <Route path="/" element={currentUser ? <Navigate to="/UserScreen" /> : <Login />} />
          <Route path="/UserScreen" element={currentUser ? <UserScreen /> : <Navigate to="/" />} />
          <Route path="/AdminScreen" element={currentUser ? <AdminScreen /> : <Navigate to="/" />} />
          {/* Add other routes here as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
