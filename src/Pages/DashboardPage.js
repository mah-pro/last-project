import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"; 
import makeToast from "../Toaster"; 
import { IoHome } from "react-icons/io5";
import { IoEnterOutline } from "react-icons/io5";


const DashboardPage = (props) => {
const navigate = useNavigate(); 

const [chatrooms, setChatrooms] = React.useState([]);
const getChatrooms = () => {
axios
    .get("http://localhost:8000/chatroom", {
    headers: {
        Authorization: "Bearer " + localStorage.getItem("CC_Token"),
    },
    })
    .then((response) => {
    setChatrooms(response.data);
    })
    .catch((err) => {
    setTimeout(getChatrooms, 3000);
    });
};


React.useEffect(() => {
getChatrooms();
// eslint-disable-next-line
}, []);

const createChatroom = () => {
const chatroomName = chatroomNameRef.current.value;

axios
    .post(
    "http://localhost:8000/chatroom",
    {
        name: chatroomName,
    },
    {
        headers: {
        Authorization: "Bearer " + localStorage.getItem("CC_Token"),
        },
    }
    )
    .then((response) => {
    makeToast("success", response.data.message);
    getChatrooms();
    chatroomNameRef.current.value = "";
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


const chatroomNameRef = React.createRef();

const handleBack = () => {
    navigate("/");
};


return (
<div className="card">
    <div className="cardHeader">Chatrooms</div>
    <div className="cardBody">
    <div className="inputGroup">
        <label htmlFor="chatroomName">Chatroom Name</label>
        <input
        type="text"
        name="chatroomName"
        id="chatroomName"
        ref={chatroomNameRef}
        placeholder="ChatterBox Nepal"
        />
    </div>
    </div>
    <button onClick={createChatroom}>Create Chatroom</button>
    <div className="chatrooms">
    {chatrooms.map((chatroom) => (
        <div key={chatroom._id} className="chatroom">
        <div>{chatroom.name}</div>
        <Link to={"/chatroom/" + chatroom._id}>
            <button className="join"><IoEnterOutline /></button>
        </Link>
        </div>
    ))}
    <button onClick={handleBack}><IoHome /></button> 
    </div>
</div>
);
};

export default DashboardPage;


