import React, { useState, createContext } from "react";

export const AuthContext = createContext(false);

export const AuthProvider = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <AuthContext.Provider value={[isAuthenticated, setIsAuthenticated]}>
      {props.children}
    </AuthContext.Provider>
  );
};
