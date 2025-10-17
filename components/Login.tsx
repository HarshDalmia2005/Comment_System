"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (res?.error) {
      setError(res.error);
      return;
    }
    
    router.push("/");
  };

  return (
    <form onSubmit={onSubmit} className="max-w-md w-full space-y-4 p-4 bg-[#1f1f1f] rounded">
      <h2 className="text-lg font-semibold text-[#988F2A]">Login</h2>
      {error && <div className="text-red-400 text-sm">{error}</div>}
      <input
        className="w-full p-2 rounded bg-white/5 text-white"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        required
      />
      <input
        className="w-full p-2 rounded bg-white/5 text-white"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        required
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-[#988F2A] text-black rounded font-medium"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-gray-600 text-white rounded font-medium"
          onClick={() => router.push("/Auth/register")}
          disabled={loading}
        >
          Register
        </button>
      </div>
    </form>
  );
};

export default Login;