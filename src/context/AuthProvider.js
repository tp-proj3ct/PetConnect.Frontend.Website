import { createContext, useState, useEffect } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  // Функция для получения данных из localStorage
  const getInitialAuthState = () => {
    const authData = localStorage.getItem('auth');
    return authData ? JSON.parse(authData) : {
      login: '',
      password: '',
      accessToken: '',
      userRole: ''
    };
  };

  const [auth, setAuth] = useState(getInitialAuthState());

  // При изменении состояния аутентификации, сохраняем данные в localStorage
  useEffect(() => {
    localStorage.setItem('auth', JSON.stringify(auth));
  }, [auth]);

  const logout = () => {
    setAuth({
      login: '',
      password: '',
      accessToken: '',
      userRole: ''
    });
    localStorage.removeItem('auth'); // Очищаем localStorage
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;