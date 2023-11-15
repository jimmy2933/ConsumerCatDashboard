import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserScreen from './Screens/UserScreen';
import AdminScreen from './Screens/AdminScreen';
import Login from './Screens/Login';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserType(userDoc.data().userType);
          setCurrentUser(user);
          setIsLoading(false);
        } else {
          // Handle where user document doesn't exist
        }
      } else {
        setCurrentUser(null);
        setUserType('');
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <div></div>;
  }

  const renderBasedOnUserType = () => {
    if (!currentUser) return <Login />;
    return userType === 'admin' ? <AdminScreen /> : <UserScreen />;
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={renderBasedOnUserType()} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
