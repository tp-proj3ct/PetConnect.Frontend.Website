import { useNavigate, useLocation } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const login = () => {
    navigate('/login');
  }

  const goBack = () => {
    if (location.state && location.state.from) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <section>
      <h1>Unauthorized</h1>
      <br />
      <p>You do not have access to the requested page. Please, login.</p>
      <div className="flexGrow">
        <button onClick={login}>Login</button>
        <button onClick={goBack}>Go Back</button>
      </div>
    </section>
  );
};

export default Unauthorized;
