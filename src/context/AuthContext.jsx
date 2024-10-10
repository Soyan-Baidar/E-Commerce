import { createContext, useContext, useEffect, useState } from "react";

// Create context for authentication
export const AuthContext = createContext();

// Custom hook to manage local storage state
function useLocalStorage(key, initialValue) {
  const [state, setState] = useState(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

// Custom hook to manage authentication state
export function useAuth() {
  const [authState, setAuthState] = useLocalStorage("authState", {
    user: { roles: [] },
    expiresAt: null,
  });

  const isAuthenticated = () => {
    if (!authState || !authState.expiresAt) {
      return false; 
    }

    const expDate = new Date(authState.expiresAt);
    const currentDate = new Date();
    return currentDate < expDate;
  };

  return { authState, setAuthState, isAuthenticated };
}

// AuthProvider component to wrap your app
export const AuthProvider = ({ children }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access auth context
export const useAuthContext = () => useContext(AuthContext);
