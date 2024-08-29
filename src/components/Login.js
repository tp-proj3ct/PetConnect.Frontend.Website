import { useRef, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { axiosPrivate } from "../api/axios";
import { API_ENDPOINTS } from "../constants/constants";

const Login = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/profile";

  const userRef = useRef();
  const errRef = useRef();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrorMessage("");
  }, [login, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = { login, password };
      console.log("Sending payload:", payload);

      const response = await axiosPrivate.post(
        API_ENDPOINTS.LOGIN_URL,
        JSON.stringify(payload),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log("Response:", response.data);

      const accessToken = response.data?.value;
      const [header, pload, signature] = accessToken.split(".");
      const decodedPload = atob(pload);
      const parsedPload = JSON.parse(decodedPload);

      // Извлечение роли пользователя
      const userRole =
        parsedPload[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];

        
      console.log("Role: ", userRole);
      setAuth({ login, password, accessToken, userRole});
      setLogin("");
      setPassword("");
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Error response:", error.response);
      if (!error.response) {
        setErrorMessage("No server response");
      } else if (error.response?.status === 400) {
        setErrorMessage("Wrong login or password");
      } else if (error.response.status === 401) {
        setErrorMessage("Unauthorized");
      } else {
        setErrorMessage("Login Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <section>
      <p ref={errRef}>{errorMessage}</p>
      <h1>Войти</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="login">Логин:</label>
        <input
          type="text"
          id="login"
          ref={userRef}
          autoComplete="off"
          onChange={(e) => setLogin(e.target.value)}
          value={login}
          required
        />
        <label htmlFor="password">Пароль:</label>
        <input
          type="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
        />
        <button disabled={!login || !password}>Войти</button>
      </form>
      <p>
        Нужен аккаунт?
        <br />
        <span>
          <Link to="/registration">Регистрация</Link>
        </span>
      </p>
    </section>
  );
};

export default Login;
