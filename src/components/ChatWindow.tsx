"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Send, Bot, User, Loader2, Package, Search, PlusCircle, Trash2, Key, LogOut } from "lucide-react";

interface Message {
    role: "user" | "ai";
    content: string;
    data?: any;
}

export default function ChatWindow() {
    const [messages, setMessages] = useState<Message[]>([
        { role: "ai", content: "Hello! I am your AI Inventory Assistant. How can I help you today?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: input }),
            });

            const data = await res.json();

            if (data.error) {
                setMessages((prev) => [...prev, { role: "ai", content: `Error: ${data.error}` }]);
            } else {
                let aiResponse = data.message || "Operation successful.";
                if (data.items) {
                    aiResponse = `Found ${data.items.length} items.`;
                }
                setMessages((prev) => [...prev, { role: "ai", content: aiResponse, data: data }]);
            }
        } catch (err) {
            setMessages((prev) => [...prev, { role: "ai", content: "Something went wrong. Please check console." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-neutral-950 text-neutral-100 font-sans">
            {/* Header */}
            <header className="px-6 py-4 border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-md flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Package className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-tight">InventoryAI</h1>
                        <p className="text-xs text-neutral-400 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            System Ready
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="text-sm font-semibold text-neutral-400 hover:text-white transition-colors">Dashbord</Link>
                    <button
                        onClick={() => signOut({ callbackUrl: "/login?message=Logged out successfully" })}
                        className="flex items-center gap-2 text-sm font-semibold text-neutral-400 hover:text-red-400 transition-colors"
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                    <Link href="/register" className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-bold text-white transition-all shadow-lg shadow-indigo-600/20 active:scale-95">Sign Up</Link>
                </div>
            </header>

            {/* Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar"
            >
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                    >
                        <div className={`flex gap-4 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm ${msg.role === "user" ? "bg-indigo-600" : "bg-neutral-800"}`}>
                                {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
                            </div>
                            <div className="space-y-2">
                                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === "user"
                                    ? "bg-indigo-600 text-white rounded-tr-none"
                                    : "bg-neutral-800/80 text-neutral-200 border border-neutral-700/50 rounded-tl-none"
                                    }`}>
                                    {msg.content}
                                </div>

                                {/* Data Display */}
                                {msg.data && msg.data.items && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                                        {msg.data.items.map((item: any) => (
                                            <div key={item.id} className="bg-neutral-900 border border-neutral-800 p-3 rounded-xl flex items-center justify-between hover:border-neutral-700 transition-colors group">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                                                        <Package className="text-indigo-400 w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-sm text-neutral-200">{item.name}</div>
                                                        <div className="text-xs text-neutral-500">Qty: {item.quantity}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {msg.data && msg.data.item && (
                                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl mt-2 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                            <PlusCircle className="text-emerald-400 w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm text-emerald-200">{msg.data.item.name}</div>
                                            <div className="text-xs text-emerald-400/70">Updated Quantity: {msg.data.item.quantity}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start animate-in fade-in duration-300">
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center">
                                <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
                            </div>
                            <div className="px-4 py-3 rounded-2xl bg-neutral-800/80 border border-neutral-700/50 rounded-tl-none">
                                <div className="flex gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce delay-75"></span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce delay-150"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-neutral-800 bg-neutral-900/50 backdrop-blur-md">
                <div className="max-w-4xl mx-auto relative group">
                    <input
                        type="text"
                        className="w-full bg-neutral-800 border-2 border-neutral-700 rounded-full py-4 pl-6 pr-14 focus:outline-none focus:border-indigo-500 transition-all duration-300 placeholder:text-neutral-500 text-neutral-100 shadow-xl"
                        placeholder="Type a command (e.g., 'Add 10 apples' or 'Register user@test.com')..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 top-2 bottom-2 w-12 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg shadow-indigo-600/20 active:scale-95 group-hover:shadow-indigo-600/40"
                    >
                        <Send className="w-5 h-5 text-white" />
                    </button>
                </div>
                <div className="flex gap-4 mt-4 justify-center text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">
                    <span className="flex items-center gap-1.5"><Key size={10} /> Secure Auth</span>
                    <span className="flex items-center gap-1.5"><Package size={10} /> Smart Inventory</span>
                    <span className="flex items-center gap-1.5"><Search size={10} /> Instant Lookup</span>
                </div>
            </div>

            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #444;
        }
      `}</style>
        </div>
    );
}
