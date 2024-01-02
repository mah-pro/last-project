import React, { useRef, useState } from "react";
import axios from "axios";
import makeToast from "../Toaster";
import { useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";

const RegisterPage = () => {
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const imageRef = useRef();
    const [errorMessage, setErrorMessage] = useState("");
    const [profileImage, setProfileImage] = useState("./téléchargement.png");

    const navigate = useNavigate();

    const registerUser = async () => {
        const name = nameRef.current.value;
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        const profileImage = imageRef.current.files[0];

        if (!profileImage) {
            setErrorMessage("Ajouter une photo pour que vos amis puissent vous reconnaître.");
            return;
        }

        const formData = new FormData();
        formData.append("profileImage", profileImage);

        try {
            const response = await axios.post("http://localhost:8000/user/register", {
                name,
                email,
                password,
                profileImage,
            });

            
            setProfileImage(URL.createObjectURL(profileImage));
            makeToast("success", response.data.message);
            navigate("/dashboard");
        } catch (err) {
            if (err && err.response && err.response.data && err.response.data.message)
                makeToast("error", err.response.data.message);
        }
    };

    const handleImageChange = () => {
        // Update the profile image when the user selects a new image
        const profileImage = imageRef.current.files[0];
        if (profileImage) {
            setProfileImage(URL.createObjectURL(profileImage));
        }
    };

    const handleBackClick = () => {
        navigate("/");
    };

    return (
        <div className="card">
            <div className="cardHeader">Inscription</div>
            <div className="cardBody">
                <div className="circular-profile-picture">
                    <input
                        type="file"
                        name="profileImage"
                        id="profileImage"
                        accept="image/*"
                        ref={imageRef}
                        style={{ display: "none" }}
                        onChange={handleImageChange} 
                    />
                    <img
                        src={profileImage} 
                        alt="Profile"
                        onClick={() => imageRef.current.click()}
                    />
                </div>
                {errorMessage && <div className="errorMessage">{errorMessage}</div>}
                <div className="inputGroup">
                    <label htmlFor="name">Nom</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        placeholder="John Doe"
                        ref={nameRef}
                    />
                </div>
                <div className="inputGroup">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="abc@example.com"
                        ref={emailRef}
                    />
                </div>
                <div className="inputGroup">
                    <label htmlFor="password">Mot de passe</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Votre mot de passe"
                        ref={passwordRef}
                    />
                </div>
                <button onClick={registerUser}>S'inscrire</button>
            </div>
            <br />
            <div>
                <button onClick={handleBackClick}><GoArrowLeft /></button>
            </div>
        </div>
    );
};

export default RegisterPage;
