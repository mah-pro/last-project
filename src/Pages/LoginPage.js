import React, { useRef } from "react";
import makeToast from "../Toaster";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import { GoArrowLeft } from "react-icons/go";


const LoginPage = (props) => {
const emailRef = useRef();
const passwordRef = useRef();
const navigate = useNavigate(); 

const loginUser = () => {
const email = emailRef.current.value;
const password = passwordRef.current.value;

axios
    .post("http://localhost:8000/user/login", {
    email,
    password,
    })
    .then((response) => {
    makeToast("success", response.data.message);
    localStorage.setItem("CC_Token", response.data.token);
    navigate("/dashboard"); // Utilisez la fonction de navigation (navigate) au lieu de props.history.push
    props.setupSocket();
    })
    .catch((err) => {
    if (
        err &&
        err.response &&
        err.response.data &&
        err.response.data.message
    )
        makeToast("error", err.response.data.message);
    });
};

const handleBackClick = () => {
    // Retour à la page d'accueil
    navigate("/");
    };

return (
<div className="card">
    <div className="cardHeader">Connexion</div>
    <div className="cardBody">
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
    <button onClick={loginUser}>Se Connecter</button>
    </div>
    <br />
    <div>
    <button onClick={handleBackClick}><GoArrowLeft /></button>
    </div>
</div>
);
};

export default LoginPage;
