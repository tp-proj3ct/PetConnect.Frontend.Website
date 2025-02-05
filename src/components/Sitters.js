import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../constants/constants";
import '../components/styles/sitters.css';

const Sitters = () => {
  const allowedFileTypes = ["image/png", "image/jpeg", "image/gif"];
  const [petSitters, setPetSitters] = useState([]);
  const [petSittersPicture, setPetSittersPicture] = useState("");

  function DisplayPicture(pfp) {
    let result = `data:image/jpeg;base64,${pfp}`;
    return result;
  }

  useEffect(() => {
    const getPetSitters = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.PET_SITTERS);

        console.log(response);
        setPetSitters(response.data);
      } catch (err) {
        console.error(err.toJSON());
      }
    };

    getPetSitters();
  }, []);

  return (
    <section>
      <h1>Pet Sitters</h1>
      {petSitters.length > 0 ? (
        <ul>
          {petSitters.map((sitter) => (
            <li key={sitter.id}>
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
                    {/* <p>Rating: {sitter.rating}</p>
                    <p>Experience: {sitter.experienceYears} years</p> */}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No pet sitters available.</p>
      )}
    </section>
  );
};

export default Sitters;
