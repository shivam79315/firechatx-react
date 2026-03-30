import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const defaultUser = {
  id: 'user-1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  avatar: 'https://images.pexels.com/photos/764529/pexels-photo-764529.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150&w=150',
  status: 'online'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('chat-user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          const userData = { ...defaultUser, email };
          setUser(userData);
          localStorage.setItem('chat-user', JSON.stringify(userData));
          resolve(userData);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 800);
    });
  };

  const register = (name, email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (name && email && password) {
          const userData = { ...defaultUser, name, email };
          setUser(userData);
          localStorage.setItem('chat-user', JSON.stringify(userData));
          resolve(userData);
        } else {
          reject(new Error('Please fill all fields'));
        }
      }, 800);
    });
  };

  const loginWithGoogle = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userData = {
          ...defaultUser,
          name: 'Google User',
          email: 'googleuser@gmail.com'
        };
        setUser(userData);
        localStorage.setItem('chat-user', JSON.stringify(userData));
        resolve(userData);
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('chat-user');
  };

  const updateProfile = (updates) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem('chat-user', JSON.stringify(updatedUser));
        resolve(updatedUser);
      }, 500);
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      register, 
      loginWithGoogle, 
      logout,
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
