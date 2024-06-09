import { useRef, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios, { axiosPrivate } from "../api/axios";
import { API_ENDPOINTS } from "../constants/constants";

const Login = () => {
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrorMessage('');
    }, [login, password]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = { login, password };
            console.log('Sending payload:', payload);

            const response = await axios.post(API_ENDPOINTS.LOGIN_URL, 
                JSON.stringify(payload),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log('Response:', response.data);

            const accessToken = response.data?.accessToken;
            setAuth({ login, password, accessToken});
            setLogin('');
            setPassword('');
            navigate(from, { replace: true });
        } catch (error) {
            console.error('Error response:', error.response);
            if (!error.response) {
                setErrorMessage('No server response');
            } else if (error.response?.status === 400) {
                setErrorMessage('Missing login or password');
            } else if (error.response.status === 401) {
                setErrorMessage('Unauthorized');
            } else {
                setErrorMessage('Login Failed');
            }
            errRef.current.focus();
        }
    }

    return (
        <section>
            <p ref={errRef} className={errorMessage ? "errmsg" : "offscreen"} aria-live="assertive">{errorMessage}</p>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="login">Login:</label>
                <input
                    type="text"
                    id="login"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setLogin(e.target.value)}
                    value={login}
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
                <button>Sign In</button>
            </form>
            <p>
                Need an Account?<br />
                <span className="line">
                    <Link to="/registration">Sign Up</Link>
                </span>
            </p>
        </section>
    );
}

export default Login;