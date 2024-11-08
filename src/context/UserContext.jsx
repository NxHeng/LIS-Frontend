import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

export const UserContextProvider = ({ children }) => {
  const [userList, setUserList] = useState([]);

  //get user list
  const getUserList = async () => {
    try {
      const response = await fetch(`${API_URL}/user/getUserList`);
      const data = await response.json();
      setUserList(data);
      console.log('User list fetched', data);
    } catch (error) {
      console.log('Error fetching user list', error);
    }
  }

  const updateUserRole = async (userId, role) => {
    try {
      const response = await fetch(`${API_URL}/user/updateRole`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, role }),
      });
      const data = await response.json();
      console.log('User role updated', data);
    } catch (error) {
      console.log('Error updating user role', error);
    }
  }

  const deleteUser = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/user/deleteUser`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      console.log('User deleted', data);
    } catch (error) {
      console.log('Error deleting user', error);
    }
  }

  return (
    <UserContext.Provider value={{
      getUserList,
      userList,
      updateUserRole,
      deleteUser
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
