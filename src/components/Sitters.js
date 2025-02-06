import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../constants/constants";
import '../components/styles/sitters.css';

const Sitters = () => {
  const [petSitters, setPetSitters] = useState([]);

  function DisplayPicture(pfp) {
    return `data:image/jpeg;base64,${pfp}`;
  }

  useEffect(() => {
    const getPetSitters = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.PET_SITTERS);
        setPetSitters(response.data);
      } catch (err) {
        console.error(err.toJSON());
      }
    };

    getPetSitters();
  }, []);

  return (
    <section>
      <div className="sitters-header">
        <h1>Pet Sitters</h1>
      </div>
      <div className="sitters-content">
      {petSitters.length > 0 ? (
        <div className="sitters-list">
          {petSitters.map((sitter) => (
            <div className="sitter-item" key={sitter.id}>
              <Link to={`/sitter/${sitter.id}`}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={DisplayPicture(sitter.profilePic)}
                    alt=" "
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      marginRight: "10px",
                    }}
                  />
                  <div>
                    {sitter.name ? (
                      <h2>
                        <p>
                          {sitter.name} {sitter.surname}
                        </p>
                      </h2>
                    ) : (
                      <h2>
                        <p>Сиделка без имени</p>
                      </h2>
                    )}
                    <p>{sitter.description}</p>
                    <p>Rating: {sitter.rating}</p>
                    <p>Experience: {sitter.experienceYears} years</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>No pet sitters available.</p>
      )}
      </div>
    </section>
  );
};

export default Sitters;