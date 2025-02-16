import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
import useAuth from "../hooks/useAuth";

//TODO
const Home = () => {
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const { auth } = useAuth();

  function logout() {
    setAuth({});
    navigate('/', {});
    window.location.reload();
  }

    return (
      <section>
      <h1>Pet Connect</h1>
      <br />
      <Link to="/admin">Go to the Admin page</Link>
      <br />
      <Link to="/profile/">Go to profile page</Link>
    </section>
    )
};

export default Home;
