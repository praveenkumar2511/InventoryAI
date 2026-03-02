"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Package, Mail, Lock, LogIn, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { signIn } from "next-auth/react";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const msg = searchParams.get("message");
        if (msg) setSuccessMsg(msg);
    }, [searchParams]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccessMsg("");

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError(result.error);
            } else {
                router.push("/");
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
                    <h2 className="text-3xl font-bold tracking-tight text-white">Welcome Back</h2>
                    <p className="mt-2 text-neutral-400">Login to manage your inventory</p>
                </div>

                <form onSubmit={handleLogin} className="bg-neutral-900/50 border border-neutral-800 p-8 rounded-3xl backdrop-blur-sm space-y-6">
                    {successMsg && (
                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
                            <CheckCircle size={16} />
                            {successMsg}
                        </div>
                    )}
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
                                <LogIn size={20} />
                                <span>Login Account</span>
                                <ArrowRight size={18} className="ml-1 opacity-70" />
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-neutral-400">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold underline-offset-4 hover:underline transition-colors">
                        Register for free
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function Login() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
