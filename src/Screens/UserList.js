import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import './UserList.css';

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollectionRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollectionRef);
      const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    };

    fetchUsers();
  }, []);
  
  const capitalizeFirstLetter = (string) => {
    if (!string) return ''; // Return an empty string if the input is undefined or null
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  

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
          <h1>User List</h1>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
        <div className="user-list">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>User Type</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.firstName} {user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{capitalizeFirstLetter(user.userType)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserList;
