import React, { createContext, useState, useContext } from 'react';

// Create a context to store the user ID globally
const UserContext = createContext();

// Custom hook to use the UserContext
export const useUser = () => {
  return useContext(UserContext);
};

// Provider component to wrap around your app and provide user state
export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null); // Store user ID in state

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};
