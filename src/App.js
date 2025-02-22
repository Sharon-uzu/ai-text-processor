import React, { useState } from "react";
import "./App.css"; // Import external CSS
import { FaTelegram } from "react-icons/fa";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const languageOptions = {
    en: "English",
    es: "Spanish",
    fr: "French",
    de: "German",
    it: "Italian",
    pt: "Portuguese",
    ru: "Russian",
    zh: "Chinese",
    ja: "Japanese",
    ko: "Korean",
    ar: "Arabic",
  };

  // Function to translate text
  const translateText = async (text, targetLanguage) => {
    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${text}&langpair=en|${targetLanguage}`
      );
      const data = await response.json();
      return data.responseData.translatedText;
    } catch (error) {
      console.error("Translation failed:", error);
      return "Translation Error";
    }
  };

  // Function to handle sending messages
  const handleSend = async () => {
    if (!inputText.trim()) return;

    // Add English message first
    const newMessage = { text: inputText, language: "English", isTranslation: false };
    let updatedMessages = [...messages, newMessage];

    // If selected language is NOT English, translate immediately
    if (selectedLanguage !== "en") {
      const translatedText = await translateText(inputText, selectedLanguage);
      updatedMessages.push({
        text: translatedText,
        language: languageOptions[selectedLanguage],
        isTranslation: true,
      });
    }

    setMessages(updatedMessages);
    setInputText("");
  };

  const handleTranslate = async () => {
    if (messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];
    const translatedText = await translateText(lastMessage.text, selectedLanguage);

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        text: translatedText,
        language: languageOptions[selectedLanguage],
        isTranslation: true,
      },
    ]);
  };

  return (
    <div className="chat-container">
      <h2 className="chat-header">AI-Powered Text Processor</h2>
      <div className="output-area">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.isTranslation ? "bot-message" : "user-message"}`}>
            <p>{msg.text}</p>
            <small>{msg.language}</small>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message..."
          className="input-field"
        />
        <FaTelegram onClick={handleSend} className="send-button"/>
      </div>
      <div className="translate-container">
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="language-select"
        >
          {Object.entries(languageOptions).map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
        <button onClick={handleTranslate} className="translate-button">
          Translate
        </button>
      </div>
    </div>
  );
};

export default App;
