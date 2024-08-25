import { useRef, useState, useEffect } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";

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

    const roleValue = role === "Сиделка" ? "PetSitter" : "PetOwner";

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
          <h1>Success!</h1>
          <p>
            <Link to="/login">Sign In</Link>
          </p>
        </section>
      ) : (
        <section>
          <p ref={errRef}>{errMsg}</p>
          <h1>Register</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setLogin(e.target.value)}
              value={login}
              required
            />
  
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
  
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
  
            <label htmlFor="confirm_pwd">Confirm Password:</label>
            <input
              type="password"
              id="confirm_pwd"
              onChange={(e) => setMatchPwd(e.target.value)}
              value={matchPwd}
              required
            />
  
            <label htmlFor="role">Role:</label>
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
              Sign Up
            </button>
          </form>
          <p>
            Already registered?
            <br />
            <span>
              <Link to="/login">Sign In</Link>
            </span>
          </p>
        </section>
      )}
    </>
  );
};

export default Register;
