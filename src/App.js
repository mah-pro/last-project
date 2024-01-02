// App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import DashboardPage from "./Pages/DashboardPage";
import IndexPage from "./Pages/IndexPage";
import ChatroomPage from "./Pages/ChatroomPage";
import io from "socket.io-client";
import makeToast from "./Toaster";

function App() {
  const [socket, setSocket] = useState(null);

  const setupSocket = () => {
    const token = localStorage.getItem("CC_Token");

    if (token && !socket) {
      const newSocket = io("http://localhost:8000", {
        query: {
          token,
        },
      });

      newSocket.on("disconnect", () => {
        setSocket(null);
        setTimeout(() => {
          setupSocket();
        }, 3000);
        makeToast("error", "Socket Disconnected!");
      });

      newSocket.on("connect", () => {
        makeToast("success", "Socket Connected!");
      });

      setSocket(newSocket);
    }
  };

  useEffect(() => {
    setupSocket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/login" element={<LoginPage setupSocket={setupSocket} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage socket={socket} />} />
        <Route path="/chatroom/:id" element={<ChatroomPage socket={socket} />} />
      </Routes>
    </Router>
  );
}

export default App;
