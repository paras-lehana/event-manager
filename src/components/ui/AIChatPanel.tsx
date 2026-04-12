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

export function AIChatPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#1a1c1c] border-l border-[var(--color-border)] z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-teal-300)] to-purple-500 flex items-center justify-center">
                  <span className="text-lg">✨</span>
                </div>
                <div>
                  <h2 className="font-bold text-white">Gemini Concierge</h2>
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
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[var(--color-teal-300)]/20 to-purple-500/20 flex items-center justify-center">
                    <span className="text-3xl">🏟️</span>
                  </div>
                  <h3 className="font-bold text-lg text-white mb-2">Stadium Concierge</h3>
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
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[var(--color-teal-500)] text-white rounded-br-md"
                        : "bg-[var(--color-surface)] text-[var(--color-text)] rounded-bl-md border border-[var(--color-border)]"
                    }`}
                  >
                    <div>{renderMarkdown(msg.content)}</div>
                    {msg.functionCall && (
                      <div className="mt-2 pt-2 border-t border-white/10 text-xs opacity-70">
                        ⚡ Action: {msg.functionCall.name}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[var(--color-teal-300)] animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 rounded-full bg-[var(--color-teal-300)] animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 rounded-full bg-[var(--color-teal-300)] animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-[var(--color-border)]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm text-white placeholder-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-teal-300)] transition-colors"
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className="px-4 py-3 bg-[var(--color-teal-500)] text-white rounded-xl font-medium hover:bg-[var(--color-teal-600)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
