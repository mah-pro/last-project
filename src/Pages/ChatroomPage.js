import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { GoArrowLeft } from "react-icons/go";
import { IoSendSharp } from "react-icons/io5";


const ChatroomPage = ({ socket, profileImage }) => {
    const { id: chatroomId } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const messageRef = useRef();
    const [userId, setUserId] = useState("");
    const [userStatus, setUserStatus] = useState("offline");
    const [usersInRoom, setUsersInRoom] = useState([]);
    const [enlargedImages, setEnlargedImages] = useState(Array(3).fill(false));

    const toggleImageSize = (index) => {
        const updatedEnlargedImages = [...enlargedImages];
        updatedEnlargedImages[index] = !updatedEnlargedImages[index];
        setEnlargedImages(updatedEnlargedImages);
    };

    const updateUserStatus = (newStatus) => {
        setUserStatus(newStatus);
    };

    // Load messages from local storage on component mount
    useEffect(() => {
        const storedMessages = localStorage.getItem(`chatroom-${chatroomId}`);
        if (storedMessages) {
            setMessages(JSON.parse(storedMessages));
        }
    }, [chatroomId]);

    useEffect(() => {
        if (socket) {
            socket.on("usersInRoom", (users) => {
                setUsersInRoom(users);
            });
        }
    }, [socket]);

    useEffect(() => {
        localStorage.setItem(`chatroom-${chatroomId}`, JSON.stringify(messages));
    }, [chatroomId, messages]);

    const sendMessage = () => {
        if (socket) {
            socket.emit("chatroomMessage", {
                chatroomId,
                message: messageRef.current.value,
            });

            messageRef.current.value = "";
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("CC_Token");
        if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]));
            setUserId(payload.id);
        }
        if (socket) {
            socket.on("newMessage", (message) => {
                const newMessages = [...messages, message];
                setMessages(newMessages);
                // Save messages to local storage
                localStorage.setItem(`chatroom-${chatroomId}`, JSON.stringify(newMessages));
            });
        }
    }, [messages, socket, chatroomId]);

    useEffect(() => {
        if (socket) {
            socket.emit("joinRoom", {
                chatroomId,
            });

            // Request previous messages when joining the room
            socket.emit("getPreviousMessages", { chatroomId });
        }
    }, [chatroomId, socket]);

    useEffect(() => {
        if (socket) {
            socket.on("userStatusChanged", ({ userId, status }) => {
                console.log("User status changed:", userId, status);
                // Mettez à jour le statut de l'utilisateur dans votre état local ou dans votre contexte global
                updateUserStatus(status);
            });
            socket.emit("setOnlineStatus", "online");
        }
    }, [socket]);

    useEffect(() => {
        return () => {
            if (socket) {
                socket.emit("leaveRoom", {
                    chatroomId,
                });
            }
        };
    }, [chatroomId, socket]);

    const handleBack = () => {
        navigate("/dashboard");
    };

    return (
        <>
            <div className="chatroomPage">
                <button onClick={handleBack}><GoArrowLeft /></button>
                <h4>Profile</h4>
                <div className="gallery-wrap">
                    <div className="statusContainer">
                        <div>
                        <span>
                            <img
                                id="image"
                                src={profileImage} 
                                alt=""
                                className={enlargedImages[0] ? "enlarged" : ""}
                                onClick={() => toggleImageSize(0)}
                            />
                        </span>
                        </div>
                    </div>
                </div>
                <div className="online">
                <div className={`user ${userStatus === "online" ? "online" : "offline"}`}>
                    {messages.length > 0 && messages[0].username}
                    <div className="usersListcontainer">
                        <p>Users online:</p>
                        <ul className="usersList">
                            {usersInRoom.map((user, index) => (
                                <li key={index}>
                                    {user}
                                    {messages.length > 0 && user === messages[0].username && (
                                        <span className={`status-indicator ${userStatus === "online" ? "online" : "offline"}`}></span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="chatroomSection">
                <div className="cardHeader">Chatroom Name</div>
                <div className="chatroomContent">
                    {messages.map((message, i) => (
                        <div key={i} className="message">
                            <span
                                className={
                                    userId === message.userId ? "ownMessage" : "otherMessage"
                                }
                            >
                                {message.name}:
                            </span>{" "}
                            {message.message}
                        </div>
                    ))}
                </div>
                <div className="chatroomActions">
                    <div>
                        <input
                            type="text"
                            name="message"
                            placeholder="Say something!"
                            ref={messageRef}
                        />
                    </div>
                    <div>
                        <button className="join" onClick={sendMessage}>
                            <IoSendSharp />
                        </button>
                    </div>
                </div>
            </div>
            </div>
            
        </>
    );
};

export default ChatroomPage;
