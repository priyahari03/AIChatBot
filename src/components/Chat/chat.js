import React, { useState } from 'react';
import axios from 'axios';
import './chat.css';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const handleSend = async () => {
        if (input.trim() === '') return;

        // Add user message to chat
        const newMessage = { role: 'user', content: input };
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        try {
            // Send the message to the backend
            const response = await axios.post('http://localhost:3000/converse', {
                message: input,
            });

            // Add the chatbot's response to the chat
            const botMessage = { role: 'bot', content: response.data.reply };

            const sentimentMessage = `Sentiment: ${getSentimentLabel(response.data.sentimentScore)}`;
            const sentimentInfo = { role: 'bot', content: sentimentMessage };

            setMessages((prevMessages) => [...prevMessages, botMessage,sentimentInfo]);
        } catch (error) {
            console.error('Error communicating with backend:', error);
            const errorMessage = { role: 'bot', content: 'Something went wrong. Please try again later.' };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
        }

        // Clear input
        setInput('');
    };

    const getSentimentLabel = (score) => {
        if (score > 0) {
            return 'Positive';
        } else if (score < 0) {
            return 'Negative';
        } else {
            return 'Neutral';
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`chat-message ${msg.role === 'user' ? 'user-message' : 'bot-message'}`}
                    >
                          {/* Display the speaker's role (User or Bot) */}
                          <div className="message-content-wrapper">
                          <div className="message-role">{msg.role === 'user' ? 'User:' : 'Bot:'}{}</div>
                        <div className="message-content">{msg.content}</div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="input-box">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
