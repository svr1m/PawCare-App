'use client';

import { useState, useRef, useEffect } from 'react';
import { FaRobot, FaUserCircle, FaTrash, FaDownload, FaMoon, FaSun } from 'react-icons/fa';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import ReactMarkdown from 'react-markdown';

type Message = {
  from: 'user' | 'bot';
  text: string;
  time: string;
};

export default function ChatBotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const getCurrentTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { from: 'user', text: input, time: getCurrentTime() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      const botMessage: Message = { from: 'bot', text: data.reply, time: getCurrentTime() };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { from: 'bot', text: 'Sorry, something went wrong.', time: getCurrentTime() },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Clear chat messages
  const clearChat = () => setMessages([]);

  // Export chat as text file
  const exportChat = () => {
    const text = messages
      .map((m) => `${m.time} [${m.from === 'user' ? 'You' : 'Bot'}]: ${m.text}`)
      .join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pawcare_chat.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`${
        darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'
      } flex flex-col h-screen p-4`}
    >
      <SignedIn>
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold">🐾 PawCare Chatbot</h1>

          <button
            onClick={() => setDarkMode((d) => !d)}
            title="Toggle Dark Mode"
            className="p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          >
            {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto border rounded-lg shadow-inner p-4 bg-white dark:bg-gray-800 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-end ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.from === 'bot' && (
                <FaRobot className="text-purple-600 dark:text-purple-400 text-xl mr-2" />
              )}
              {msg.from === 'user' && (
                <FaUserCircle className="text-blue-600 dark:text-blue-400 text-xl mr-2" />
              )}

              <div
                className={`max-w-xs px-4 py-2 rounded-lg text-sm shadow-md ${
                  msg.from === 'user'
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none'
                }`}
              >
                {msg.from === 'bot' ? (
                  <div className="prose prose-sm dark:prose-invert max-w-full">
                    <ReactMarkdown
                      components={{
                        p: ({ node, ...props }) => <p className="m-0" {...props} />,
                        li: ({ node, ...props }) => <li className="ml-4 list-disc" {...props} />,
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p>{msg.text}</p>
                )}
                <p className="text-[0.7rem] text-right opacity-70 mt-1">{msg.time}</p>
              </div>
            </div>
          ))}

          {/* Typing animation */}
          {isTyping && (
            <div className="flex items-center justify-start space-x-2">
              <FaRobot className="text-purple-600 dark:text-purple-400 text-xl mr-2" />
              <div className="text-gray-600 dark:text-gray-300 italic">Bot is typing...</div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </main>

        <footer className="mt-4 flex items-center space-x-2">
          <input
            type="text"
            placeholder="Ask something about your pet..."
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-100"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-r-lg transition"
            aria-label="Send message"
          >
            Send
          </button>
        </footer>

        <div className="mt-4 flex justify-end space-x-3">
          <button
            onClick={clearChat}
            title="Clear Chat"
            className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition flex items-center space-x-1"
          >
            <FaTrash />
            <span>Clear</span>
          </button>
          <button
            onClick={exportChat}
            title="Export Chat"
            className="p-2 bg-green-600 hover:bg-green-700 text-white rounded transition flex items-center space-x-1"
          >
            <FaDownload />
            <span>Export</span>
          </button>
        </div>
      </SignedIn>
      <SignedOut>
        <h2 className="text-center text-red-600 mt-10">You must be signed in nigga.</h2>
      </SignedOut>
    </div>
  );
}
