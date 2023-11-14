import React from 'react';
import { auth } from '../firebase'; // Adjust the path as per your project structure
import { signOut } from 'firebase/auth';

function AdminScreen() {
    const handleSignOut = async () => {
      try {
        await signOut(auth);
        console.log('User signed out successfully');
        // Redirect to the login page or handle the sign-out state as needed
      } catch (error) {
        console.error('Error signing out: ', error);
      }
    };
  return (
    <div>
      <h1>Admin Dashboard</h1>
      {/* Add your admin-specific components and functionality here */}
      <p>Welcome to the admin dashboard!</p>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
}

export default AdminScreen;
