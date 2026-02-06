import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import ReactMarkdown from "react-markdown";
import { useChat } from "../../hooks/useChat";
import { RiRobot2Line } from "react-icons/ri";

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, isLoading, sendMessage } = useChat();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSend = () => {
    if (!inputValue.trim() || isLoading) return;
    sendMessage(inputValue);
    setInputValue("");
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Floating button when chat is closed
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full color-primary-bg text-white shadow-lg hover:scale-110 transition-all duration-300 group"
        aria-label="Mở trợ lý AI"
      >
        <span className="material-symbols-outlined text-[28px]">
          <RiRobot2Line />
        </span>
        {/* Pulse animation */}
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full color-primary-bg opacity-20"></span>
      </button>
    );
  }

  // Minimized state - show only header bar
  if (isMinimized) {
    return (
      <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 w-full sm:w-[360px] sm:rounded-xl rounded-t-xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
        <div
          className="flex items-center justify-between color-primary-bg px-4 py-3 cursor-pointer"
          onClick={() => setIsMinimized(false)}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <span className="material-symbols-outlined text-white text-[24px]">
                  <RiRobot2Line />
                </span>
              </div>
              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 border-2 border-white"></div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Trợ lý AI IES</h3>
              <span className="text-[10px] font-medium text-white/80">
                Đang trực tuyến
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(false);
              }}
              className="text-white/80 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">
                expand_less
              </span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="text-white/80 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">
                close
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Full chat window - harmonious sizing
  return (
    <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 w-full h-[85vh] sm:w-[360px] sm:h-[450px] md:w-[400px] md:h-[500px] flex flex-col rounded-t-xl sm:rounded-xl bg-white shadow-2xl border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between color-primary-bg px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <span className="material-symbols-outlined text-white text-[24px]">
                <RiRobot2Line />
              </span>
            </div>
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 border-2 border-white"></div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Trợ lý AI IES</h3>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-medium text-emerald-300">
                ● Đang trực tuyến
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(true)}
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Thu nhỏ"
          >
            <span className="material-symbols-outlined text-[20px]">
              remove
            </span>
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Đóng"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-blue-50/30 space-y-3 sm:space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-2 ${message.sender === "user" ? "flex-row-reverse" : ""}`}
          >
            {/* Avatar */}
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                message.sender === "ai" ? "color-primary-bg" : "bg-gray-500"
              }`}
            >
              <span className="material-symbols-outlined text-white text-[16px]">
                {message.sender === "ai" ? <RiRobot2Line /> : "person"}
              </span>
            </div>

            {/* Message Bubble */}
            <div
              className={`max-w-[85%] flex flex-col ${message.sender === "user" ? "items-end" : ""}`}
            >
              <div
                className={`rounded-2xl p-3 text-sm shadow-sm ${
                  message.sender === "user"
                    ? "rounded-tr-none color-primary-bg text-white"
                    : "rounded-tl-none bg-white text-gray-700 border border-gray-100"
                }`}
              >
                {message.sender === "ai" ? (
                  <div className="prose prose-sm max-w-none prose-p:m-0 prose-p:mb-2 prose-ul:m-0 prose-ul:pl-4 prose-ol:m-0 prose-ol:pl-4 prose-li:m-0 prose-headings:m-0 prose-headings:mb-2 prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded prose-pre:bg-gray-800 prose-pre:text-gray-100 prose-pre:p-2 prose-pre:rounded-lg prose-pre:overflow-x-auto">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                ) : (
                  message.content
                )}
              </div>
              <span className="mt-1 block text-[10px] text-gray-400">
                {formatTime(message.timestamp)}
              </span>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-start gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full color-primary-bg">
              <span className="material-symbols-outlined text-white text-[16px]">
                smart_toy
              </span>
            </div>
            <div className="rounded-2xl rounded-tl-none bg-white p-3 shadow-sm border border-gray-100">
              <div className="flex gap-1">
                <span
                  className="h-2 w-2 rounded-full color-primary-bg animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></span>
                <span
                  className="h-2 w-2 rounded-full color-primary-bg animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></span>
                <span
                  className="h-2 w-2 rounded-full color-primary-bg animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 sm:p-4 bg-white border-t border-gray-100">
        <div className="flex items-center gap-2 rounded-xl bg-gray-50 border border-gray-200 px-4 py-2.5 focus-within:border-[#1E90FF] focus-within:ring-2 focus-within:ring-[#1E90FF]/20 transition-all">
          <input
            ref={inputRef}
            className="flex-1 bg-transparent border-none p-0 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-0 focus:outline-none"
            placeholder="Nhập tin nhắn..."
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            className="flex items-center justify-center color-primary hover:scale-110 transition-transform disabled:opacity-50 disabled:hover:scale-100"
            aria-label="Gửi tin nhắn"
          >
            <span className="material-symbols-outlined text-[24px]">send</span>
          </button>
        </div>
        <p className="mt-2 text-[10px] text-gray-400 text-center">
          Powered by AI • Hỗ trợ học tập 24/7
        </p>
      </div>
    </div>
  );
};

export default AIChatbot;
