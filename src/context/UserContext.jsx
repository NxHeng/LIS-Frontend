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
    } catch (error) {
      console.log('Error fetching user list', error);
    }
  }


  return (
    <UserContext.Provider value={{
      getUserList,
      userList,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
