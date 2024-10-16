import React, { createContext, useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        //get userid from local storage
        setUserId(JSON.parse(localStorage.getItem('user'))._id);
        setSocket(io("http://localhost:5000"));
    }, []);

    useEffect(() => {
        socket?.emit("register", userId.toString());
        console.log(userId, socket);
        // console.log("Socket ran");
        socket?.on('newNotification', (notification) => {
            console.log("New notification received", notification); 
            handleNewNotification(notification);

            // Show notification using Snackbar
            // setSnackbarMessage(`New notification: ${notification.caseTitle || notification.taskTitle}`);
            // setSnackbarOpen(true);
        });
    }, [socket, userId]);

    // useEffect(() => {
    //     console.log("Socket ran");
    //     socket.on('newNotification', (notification) => {
    //         console.log("New notification received", notification); 
    //         handleNewNotification(notification);

    //         // Show notification using Snackbar
    //         setSnackbarMessage(`New notification: ${notification.caseTitle || notification.taskTitle}`);
    //         setSnackbarOpen(true);
    //     });
    // }, [socket]);


    const handleNewNotification = (notification) => {
        console.log("New notification received", notification); // Log to verify the event handling
        setNotifications((prevNotifications) => [notification, ...prevNotifications]);

        // Show notification using Snackbar
        // setSnackbarMessage(`New notification: ${notification.caseTitle || notification.taskTitle}`);
        // setSnackbarOpen(true);
    };

    return (
        <SocketContext.Provider value={{
            socket,
            notifications,
            handleNewNotification
        }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocketContext = () => useContext(SocketContext);
