"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatMessage } from "@/lib/types";
import { sendMessageToGemini } from "@/lib/gemini";

// Simple markdown renderer for AI responses
function renderMarkdown(text: string) {
  // Split into lines
  const lines = text.split("\n");
  return lines.map((line, i) => {
    // Process bold **text**
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const rendered = parts.map((part, j) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={j} className="font-bold text-white">{part.slice(2, -2)}</strong>;
      }
      return part;
    });

    // Bullet points
    if (line.startsWith("• ") || line.startsWith("- ")) {
      return <div key={i} className="flex gap-2 ml-1"><span className="text-[var(--color-teal-300)]">•</span><span>{rendered.slice(0)}</span></div>;
    }

    // Empty line = spacer
    if (line.trim() === "") return <div key={i} className="h-2" />;

    return <div key={i}>{rendered}</div>;
  });
}

export function AIChatPanel({ isOpen, onClose, isSidePane = false }: { isOpen: boolean; onClose: () => void; isSidePane?: boolean }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await sendMessageToGemini([...messages, userMsg]);
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-resp`,
        role: "assistant",
        content: response.content,
        timestamp: Date.now(),
        functionCall: response.functionCall,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-err`,
          role: "assistant",
          content: "Sorry, I had trouble processing that. Please try again!",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  const quickActions = [
    "Where's the nearest restroom?",
    "What are the queue times?",
    "Order me a beer",
    "Where are my friends?",
    "What's the score?",
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {!isSidePane && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
              onClick={onClose}
            />
          )}
          <motion.div
            initial={isSidePane ? { opacity: 0 } : { opacity: 0, y: 50, scale: 0.9 }}
            animate={isSidePane ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={isSidePane ? { opacity: 0 } : { opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={
              isSidePane
                ? "h-full w-full bg-[#111424] flex flex-col z-[101]"
                : "fixed right-4 bottom-24 h-[600px] max-h-[80vh] w-[calc(100%-2rem)] max-w-md bg-[#1a1c1c]/95 backdrop-blur-xl border border-[var(--color-border)] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] z-[101] flex flex-col overflow-hidden"
            }
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)] bg-[var(--color-surface)]/50 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <motion.div 
                  drag
                  dragConstraints={{ top: -20, left: -20, right: 20, bottom: 20 }}
                  dragElastic={0.2}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 rounded-full flex items-center justify-center relative cursor-grab active:cursor-grabbing"
                >
                  <svg width="48" height="48" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <filter id="glow-panel" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                      <linearGradient id="orbGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#32b8c6" />
                        <stop offset="50%" stopColor="#a855f6" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="35" fill="none" stroke="url(#orbGradient)" strokeWidth="4" filter="url(#glow-panel)" opacity="0.8">
                      <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="8s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="50" cy="50" r="25" fill="url(#orbGradient)" opacity="0.9">
                      <animate attributeName="r" values="25;28;25" dur="3s" repeatCount="indefinite" />
                    </circle>
                    <polygon points="50,35 65,60 35,60" fill="#ffffff" opacity="0.9">
                      <animateTransform attributeName="transform" type="rotate" from="360 50 50" to="0 50 50" dur="4s" repeatCount="indefinite" />
                    </polygon>
                  </svg>
                </motion.div>
                <div>
                  <h2 className="font-bold text-white tracking-wide">Gemini Concierge</h2>
                  <p className="text-xs text-[var(--color-text-secondary)]">Powered by Google AI</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#32b8c6]/10 to-purple-500/10 flex items-center justify-center relative">
                     <svg width="80" height="80" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="absolute">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#32b8c6" strokeWidth="1" strokeDasharray="10 15" opacity="0.5">
                        <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="-360 50 50" dur="20s" repeatCount="indefinite" />
                      </circle>
                    </svg>
                    <span className="text-5xl drop-shadow-2xl">🏟️</span>
                  </div>
                  <h3 className="font-bold text-lg text-white mb-2 tracking-wide">Stadium Concierge</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-6">
                    Ask me anything about the venue, food, navigation, or your crew!
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {quickActions.map((action) => (
                      <button
                        key={action}
                        onClick={() => {
                          setInput(action);
                          setTimeout(() => {
                            const syntheticMsg: ChatMessage = {
                              id: `msg-${Date.now()}`,
                              role: "user",
                              content: action,
                              timestamp: Date.now(),
                            };
                            setMessages((prev) => [...prev, syntheticMsg]);
                            setIsLoading(true);
                            sendMessageToGemini([syntheticMsg]).then((resp) => {
                              setMessages((prev) => [
                                ...prev,
                                { id: `msg-${Date.now()}-r`, role: "assistant", content: resp.content, timestamp: Date.now(), functionCall: resp.functionCall },
                              ]);
                              setIsLoading(false);
                            });
                            setInput("");
                          }, 100);
                        }}
                        className="text-xs px-3 py-2 rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-teal-300)] hover:text-[var(--color-teal-300)] transition-colors"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-5 py-3.5 text-sm leading-relaxed shadow-lg ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-[#21808d] to-[#1a6873] text-white rounded-2xl rounded-br-sm glow-teal"
                        : "glass-card text-[var(--color-text)] rounded-2xl rounded-bl-sm border border-[var(--color-border)]"
                    }`}
                  >
                    <div>{renderMarkdown(msg.content)}</div>
                    {msg.functionCall && (
                      <div className="mt-3 p-2 bg-[#1f2121]/50 border border-[#32b8c6]/30 rounded-lg text-xs text-[#32b8c6] flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-[#32b8c6] rounded-full animate-pulse" />
                        Executed: {msg.functionCall.name}()
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                  <div className="glass-card rounded-2xl rounded-bl-md px-5 py-3.5 flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#32b8c6] animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span className="text-xs font-bold glitch-text text-[var(--color-text-secondary)]" data-text="PROCESSING...">PROCESSING...</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-md">
              <div className="flex gap-2 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Ask Gemini anything..."
                  className="flex-1 bg-[#1a1c1c] border border-[var(--color-border)] rounded-xl px-4 py-3.5 text-sm text-white placeholder-[var(--color-text-secondary)] focus:outline-none focus:border-[#32b8c6] focus:ring-1 focus:ring-[#32b8c6]/50 transition-all shadow-inner"
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className="magnetic-btn px-5 py-3.5 bg-gradient-to-r from-[#21808d] to-purple-600 text-white rounded-xl font-bold hover:shadow-[0_0_15px_rgba(50,184,198,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                >
                  Send
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
