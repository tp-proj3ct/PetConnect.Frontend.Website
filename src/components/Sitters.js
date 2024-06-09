import { Link, Navigate } from "react-router-dom";
import axios from 'axios';
import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../constants/constants";


const Sitters = () =>{
    const [petSitters, setPetSitters] = useState([]);


    const getPetSitters = async () => {
        try{
            const response = await axios.get(API_ENDPOINTS.PET_SITTERS);
            setPetSitters(response.data);
        } catch(err){
            console.error(err.toJSON())
        }
    };

    useEffect(() => {
        getPetSitters();
    }, []);


    return (
        <div>
            <h1>Pet Sitters</h1>
            {petSitters.length > 0 ? (
                <ul>
                    {petSitters.map((sitter) => (
                        <li key={sitter.id}>
                            <Link to={`/pet-sitters/${sitter.id}`}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <img src={sitter.profilePic} alt={`${sitter.name} ${sitter.surname}`} style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }} />
                                    <div>
                                        <h2>{sitter.name} {sitter.surname}</h2>
                                        <p>{sitter.description}</p>
                                        <p>Rating: {sitter.rating}</p>
                                        <p>Experience: {sitter.experienceYears} years</p>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No pet sitters available.</p>
            )}
        </div>
    );
}

export default Sitters;