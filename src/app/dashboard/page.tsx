"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    MessageSquare,
    Package,
    LogOut,
    Calendar,
    ShieldCheck,
    Loader2,
    RefreshCcw,
    Plus,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

interface InventoryItem {
    id: string;
    name: string;
    quantity: number;
    expiry: string | null;
    warrantyYears: number | null;
    createdAt: string;
    updatedAt: string;
}

export default function Dashboard() {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        total: 0
    });

    const router = useRouter();

    const fetchItems = async (page = 1) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/inventory?page=${page}&limit=10`);
            const data = await res.json();
            if (res.ok) {
                setItems(data.items);
                setPagination(data.pagination);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError("Failed to fetch inventory");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchItems(pagination.page);
    }, [pagination.page]);

    const handleLogout = () => {
        // Basic logout logic: redirect to login
        router.push("/login?message=Logged out successfully");
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    };

    const handlePageChange = (newPage: number) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    return (
        <div className="flex h-screen bg-neutral-950 text-neutral-100 font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 border-r border-neutral-800 bg-neutral-900/50 backdrop-blur-xl flex flex-col p-6 space-y-8 hidden md:flex">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Package className="text-white w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">InventoryAI</span>
                </div>

                <nav className="flex-1 space-y-2">
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-indigo-600 text-white font-bold transition-all shadow-lg shadow-indigo-600/20">
                        <LayoutDashboard size={20} />
                        Dashbord
                    </Link>
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all group">
                        <MessageSquare size={20} className="group-hover:scale-110 transition-transform" />
                        AI Chat
                    </Link>
                </nav>

                <div className="pt-6 border-t border-neutral-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-all font-semibold"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto custom-scrollbar">
                {/* Top Header */}
                <header className="px-8 py-6 flex items-center justify-between sticky top-0 bg-neutral-950/80 backdrop-blur-md z-10 border-b border-neutral-800/50">
                    <div>
                        <h2 className="text-2xl font-bold">Inventory Overview</h2>
                        <p className="text-sm text-neutral-400 mt-0.5">Manage and monitor all your stock items</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => fetchItems(pagination.page)}
                            className="p-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 transition-all text-neutral-400 hover:text-white"
                            title="Refresh Data"
                        >
                            <RefreshCcw size={18} className={isLoading ? "animate-spin" : ""} />
                        </button>
                        <Link
                            href="/"
                            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
                        >
                            <Plus size={18} />
                            Add via AI
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="md:hidden p-3 rounded-xl bg-red-500/10 text-red-400"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </header>

                {/* Table Section */}
                <div className="p-8 pb-20">
                    <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl overflow-hidden backdrop-blur-sm">
                        {isLoading ? (
                            <div className="p-20 flex flex-col items-center justify-center space-y-4">
                                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                                <p className="text-neutral-400 animate-pulse">Scanning database...</p>
                            </div>
                        ) : error ? (
                            <div className="p-20 text-center text-red-400">
                                <p>Error loading inventory: {error}</p>
                            </div>
                        ) : items.length === 0 ? (
                            <div className="p-20 text-center text-neutral-500">
                                <div className="w-16 h-16 bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-4 opacity-50">
                                    <Package size={30} />
                                </div>
                                <p className="text-lg">No items found in database</p>
                                <Link href="/" className="text-indigo-400 hover:underline mt-2 inline-block">Add your first item using the AI Chat</Link>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-neutral-800 bg-neutral-800/30">
                                                <th className="px-6 py-5 text-xs font-bold text-neutral-400 uppercase tracking-widest">Item Details</th>
                                                <th className="px-6 py-5 text-xs font-bold text-neutral-400 uppercase tracking-widest text-center">Quantity</th>
                                                <th className="px-6 py-5 text-xs font-bold text-neutral-400 uppercase tracking-widest">Status</th>
                                                <th className="px-6 py-5 text-xs font-bold text-neutral-400 uppercase tracking-widest">Warranty</th>
                                                <th className="px-6 py-5 text-xs font-bold text-neutral-400 uppercase tracking-widest text-right">Last Updated</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-neutral-800/50">
                                            {items.map((item) => (
                                                <tr key={item.id} className="hover:bg-neutral-800/30 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-all border border-indigo-500/10">
                                                                <Package className="text-indigo-400 w-5 h-5" />
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-neutral-200">{item.name}</div>
                                                                <div className="text-[10px] text-neutral-500 font-mono mt-0.5">{item.id.substring(0, 8)}...</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="font-mono font-bold text-lg text-indigo-400 px-3 py-1 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
                                                            {item.quantity}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium">
                                                        {item.expiry ? (
                                                            <div className="flex items-center gap-1.5 text-amber-400">
                                                                <Calendar size={14} />
                                                                Expires {new Date(item.expiry).toLocaleDateString()}
                                                            </div>
                                                        ) : (
                                                            <div className="text-neutral-500">—</div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {item.warrantyYears ? (
                                                            <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20 flex items-center gap-1.5 w-max">
                                                                <ShieldCheck size={12} />
                                                                {item.warrantyYears} Years
                                                            </div>
                                                        ) : (
                                                            <div className="text-neutral-500">—</div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="text-sm text-neutral-300 font-medium">{formatDate(item.updatedAt)}</div>
                                                        <div className="text-[10px] text-neutral-500">Created: {new Date(item.createdAt).toLocaleDateString()}</div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination UI */}
                                <div className="px-8 py-5 border-t border-neutral-800 bg-neutral-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="text-sm text-neutral-400">
                                        Showing <span className="text-neutral-200 font-bold">{items.length}</span> of <span className="text-neutral-200 font-bold">{pagination.total}</span> items
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handlePageChange(pagination.page - 1)}
                                            disabled={pagination.page <= 1 || isLoading}
                                            className="p-2.5 rounded-xl border border-neutral-800 bg-neutral-800/50 text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-30 disabled:scale-100 transition-all active:scale-95"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>

                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-neutral-400">Page</span>
                                            <div className="bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 px-3 py-1 rounded-lg text-sm font-bold min-w-[40px] text-center">
                                                {pagination.page}
                                            </div>
                                            <span className="text-sm font-semibold text-neutral-400">of {pagination.totalPages}</span>
                                        </div>

                                        <button
                                            onClick={() => handlePageChange(pagination.page + 1)}
                                            disabled={pagination.page >= pagination.totalPages || isLoading}
                                            className="p-2.5 rounded-xl border border-neutral-800 bg-neutral-800/50 text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-30 disabled:scale-100 transition-all active:scale-95"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>

            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #262626;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #333;
        }
      `}</style>
        </div>
    );
}
