"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import OAuthButtons from "@/components/OAuthButtons";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="liquid-glass rounded-3xl p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 relative z-10">
          Todo Music
        </h1>
        <p className="text-sm text-gray-500 mb-8 relative z-10">
          Play your tasks like music
        </p>

        <OAuthButtons />

        <div className="flex items-center gap-3 my-6 relative z-10">
          <div className="flex-1 h-px bg-gray-300/50" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-300/50" />
        </div>

        <form onSubmit={handleLogin} className="space-y-4 relative z-10">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-4 py-3 rounded-xl liquid-glass-input text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-4 py-3 rounded-xl liquid-glass-input text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
          />

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full liquid-glass-dark rounded-xl px-5 py-3 text-white text-sm font-medium hover:bg-black/30 transition-all disabled:opacity-50"
          >
            <span className="relative z-10">
              {loading ? "Signing in..." : "Sign in with email"}
            </span>
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-6 relative z-10">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-gray-800 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
