import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);  // State to handle loading

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);  // Set loading to true
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
        navigate('/');  // Handle as needed, perhaps stay on login page or show an error
      }
    } catch (error) {
      console.error('Error logging in: ', error);
      // Handle login errors here
    } finally {
      setIsLoading(false);  // Set loading to false regardless of outcome
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;  // Or any other loading indicator
  }

  return (
    <form onSubmit={handleLogin}>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="Email"
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
