import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import './Login.css'; // Assuming you have a separate CSS file for styling

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user type from Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userType = userDoc.data().userType;
        // Redirect based on user type
        if (userType === 'admin') {
          navigate('/AdminScreen');
        } else {
          navigate('/UserScreen');
        }
      } else {
        console.log('User document does not exist!');
        // Handle case where user document is not found
      }
    } catch (error) {
      console.error('Error logging in: ', error);
      // Handle login errors (e.g., user not found, wrong password, etc.)
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email"
          className="login-input"
        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password"
          className="login-input"
        />
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
}

export default Login;
