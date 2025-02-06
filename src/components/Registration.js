import { useRef, useState, useEffect } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import "./styles/Registration.module.css";

const REGISTER_URL = "/auth/registration";

//TODO: create css for registration page
const Register = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [matchPwd, setMatchPwd] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [login, password, matchPwd, email, role]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!login || !password || !email || !role) {
      setErrMsg("Invalid Entry");
      return;
    }

    const roleValue =  role === "Сиделка" ? "PetSitter" : "PetOwner";

    try {
      const payload = { login, password, email, role: roleValue };

      const response = await axios.post(REGISTER_URL, JSON.stringify(payload), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      console.log(JSON.stringify(response?.data));
      setSuccess(true);
      setLogin("");
      setPassword("");
      setMatchPwd("");
      setEmail("");
      setRole("");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 409) {
        setErrMsg("Username or Email Taken");
      } else {
        setErrMsg("Registration Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      {success ? (
        <section>
          <h1>Регистрация прошла успешно!</h1>
          <p>
            <Link to="/login">Войти в аккаунт</Link>
          </p>
        </section>
      ) : (
        <section>
          <p ref={errRef} className="error-message">
            {errMsg}
          </p>
          <h1>Регистрация</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Имя пользователя:</label>
            <input
              type="text"
              id="username"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setLogin(e.target.value)}
              value={login}
              required
            />

            <label htmlFor="email">Эл. почта:</label>
            <input
              type="email"
              id="email"
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
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

            <label htmlFor="confirm_pwd">Повторите пароль:</label>
            <input
              type="password"
              id="confirm_pwd"
              onChange={(e) => setMatchPwd(e.target.value)}
              value={matchPwd}
              required
            />

            <label htmlFor="role">Роль: </label>
            <select
              type="role"
              id="role"
              onChange={(e) => setRole(e.target.value)}
              value={role}
              required
            >
              <option value="">Вы хозяин или сиделка?</option>
              <option value="Сиделка">Сиделка</option>
              <option value="Хозяин">Хозяин</option>
            </select>

            <button disabled={!login || !password || !email || !role}>
              Зарегистрироваться
            </button>
          </form>
          <p>
            Уже есть аккаунт?
            <br />
            <span>
              <Link to="/login">Войти</Link>
            </span>
          </p>
        </section>
      )}
    </>
  );
};

export default Register;
