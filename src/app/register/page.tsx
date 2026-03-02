"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package, Mail, Lock, UserPlus, ArrowRight, Loader2 } from "lucide-react";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // Simulate the AI output format for the register action
                body: JSON.stringify({
                    query: `SIMULATED_ACTION`,
                    manualAction: {
                        module: "auth",
                        action: "register",
                        data: { email, password }
                    }
                }),
            });

            const data = await res.json();
            if (res.ok) {
                router.push("/login?message=Account created successfully");
            } else {
                setError(data.error || "Registration failed");
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6 font-sans">
            <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in-95 duration-500">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 shadow-xl shadow-indigo-500/20 mb-6">
                        <Package className="text-white w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Create Account</h2>
                    <p className="mt-2 text-neutral-400">Join InventoryAI to start managing</p>
                </div>

                <form onSubmit={handleRegister} className="bg-neutral-900/50 border border-neutral-800 p-8 rounded-3xl backdrop-blur-sm space-y-6">
                    {error && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="email"
                                required
                                className="w-full bg-neutral-800 border-2 border-neutral-700/50 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-indigo-500/50 transition-all text-neutral-100"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="password"
                                required
                                minLength={6}
                                className="w-full bg-neutral-800 border-2 border-neutral-700/50 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-indigo-500/50 transition-all text-neutral-100"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                            <>
                                <UserPlus size={20} />
                                <span>Register Now</span>
                                <ArrowRight size={18} className="ml-1 opacity-70" />
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-neutral-400">
                    Already have an account?{" "}
                    <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold underline-offset-4 hover:underline transition-colors">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
}
