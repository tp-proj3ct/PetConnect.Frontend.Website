import { Link, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useState } from "react";

const LinkPage = () => {
    const { auth } = useAuth();
    const [redirect, setRedirect] = useState(null);

    const handleNavigation = (path) => {
        if (auth?.user) {
            setRedirect("/");
        } else {
            setRedirect(path);
        }
    };


    if (redirect) {
        return <Navigate to={redirect} />;
    }

    return (
        <section>
            <h1>Links</h1>
            <br />
            <h2>Public</h2>
            <Link to="#" onClick={() => handleNavigation("/login")}>Login</Link>
            <Link to="#" onClick={() => handleNavigation("/registration")}>Register</Link>

            <br />
            <h2>Private</h2>
            <Link to="/">Home</Link>
            {/* <Link to="/editor">Editors Page</Link>
            <Link to="/admin">Admin Page</Link> */}
        </section>
    );
};

export default LinkPage;


// import { Link } from "react-router-dom"
// import {useAuth} from "../hooks/useAuth"

// const LinkPage = () => {
//     return (
//         <section>
//             <h1>Links</h1>
//             <br />
//             <h2>Public</h2>
//             <Link to="/login">Login</Link>
//             <Link to="/registration">Register</Link>
//             <br />
//             <h2>Private</h2>
//             <Link to="/">Home</Link>
//             {/* <Link to="/editor">Editors Page</Link>
//             <Link to="/admin">Admin Page</Link> */}
//         </section>
//     )
// }

// export default LinkPage