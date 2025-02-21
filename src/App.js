import React, { useState } from "react";
import "./App.css"; // Import external CSS

const App= () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [translatedMessages, setTranslatedMessages] = useState([]);
  const [summarizedMessages, setSummarizedMessages] = useState({});

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

  const summarizeText = async (text) => {
    try {
        const response = await fetch("https://hf.space/embed/sshleifer/distilbart-cnn-12-6/api/predict/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                data: [text],
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch summary");
        }

        const data = await response.json();
        return data.data[0]; 
    } catch (error) {
        console.error("Summarization failed:", error);
        return "Summarization Error.";
    }
};

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const newMessage = { text: inputText, language: "English" };
    setMessages([...messages, newMessage]);
    setInputText("");
  };

  // function for translation
  const handleTranslate = async () => {
    if (messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];
    const translatedText = await translateText(lastMessage.text, selectedLanguage);
    
    const newTranslatedMessage = { text: translatedText, language: languageOptions[selectedLanguage] };
    setTranslatedMessages([...translatedMessages, newTranslatedMessage]);
  };

  // function for summary
  const handleSummarize = async (index, text) => {
    const summary = await summarizeText(text);
    setSummarizedMessages({ ...summarizedMessages, [index]: summary });
  };

  return (
    <div className="chat-container">
      <h2 className="chat-header">AI-Powered Text Processor</h2>
      <div className="output-area">
        {messages.map((msg, index) => (
          <div key={index} className="message user-message">
            <p>{summarizedMessages[index] || msg.text}</p>
            <small>{msg.language}</small>
            {msg.text.split(" ").length > 150 && !summarizedMessages[index] && (
              <button className="summarize-button" onClick={() => handleSummarize(index, msg.text)}>
                Summarize
              </button>
            )}
          </div>
        ))}
        {translatedMessages.map((msg, index) => (
          <div key={index} className="message bot-message">
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
        <button onClick={handleSend} className="send-button">Send</button>
      </div>
      <div className="translate-container">
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="language-select"
        >
          {Object.entries(languageOptions).map(([code, name]) => (
            <option key={code} value={code}>{name}</option>
          ))}
        </select>
        <button onClick={handleTranslate} className="translate-button">Translate</button>
      </div>
    </div>
  );
};

export default App;
