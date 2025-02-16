import { Link } from "react-router-dom";
import Users from "./Users";
import useAuth from '../hooks/useAuth';
import Missing from "./Missing";
import Unauthorized from "./Unauthorized";

const Admin = () => {

  const { auth } = useAuth();
  console.log(JSON.stringify(auth.userRole));

 if (auth.userRole === 'Admin') {
    return (
      <section>
        <h1>Admins Page</h1>
        <br />
        <Users />
        <br />
        <div className="flexGrow">
          <Link to="/">Home</Link>
        </div>
      </section>
    );
  } else if(auth.userRole === 'PetSitter' || auth.userRole === 'PetOwner') { 
    return <Missing />
  } else {
    return <Unauthorized />
  }
};

export default Admin;
