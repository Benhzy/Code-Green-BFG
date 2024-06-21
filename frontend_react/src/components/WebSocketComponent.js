import React, { useEffect, useState } from 'react';

const WebSocketComponent = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Create a new WebSocket connection
        const socket = new WebSocket('wss://kaisukitchen.site/ws');

        // Event listener for when a connection is opened
        socket.onopen = () => {
            console.log('WebSocket connection established');
        };

        // Event listener for receiving messages
        socket.onmessage = (event) => {
            const message = event.data;
            setMessages((prevMessages) => [...prevMessages, message]);
        };

        // Event listener for errors
        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        // Event listener for when the connection is closed
        socket.onclose = (event) => {
            console.log('WebSocket connection closed:', event);
        };

        // Cleanup function to close the WebSocket connection when the component is unmounted
        return () => {
            socket.close();
        };
    }, []);

    return (
        <div>
            <h1>WebSocket Messages</h1>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
        </div>
    );
};

export default WebSocketComponent;
