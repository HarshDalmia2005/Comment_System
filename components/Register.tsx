"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data?.error || "Registration failed");
        setLoading(false);
        return;
      }
      setMsg("Registered successfully — redirecting to login...");
      localStorage.setItem("id",String(data.id))
      setTimeout(() => router.push("/Auth/login"), 900);
    } catch (err) {
      setMsg("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-md w-full space-y-4 p-4 bg-[#1f1f1f] rounded">
      <h2 className="text-lg font-semibold text-[#988F2A]">Register</h2>
      {msg && <div className="text-sm text-[#988F2A]">{msg}</div>}
      <input
        className="w-full p-2 rounded bg-white/5 text-white"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
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
        minLength={6}
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-[#988F2A] text-black rounded font-medium"
          disabled={loading}
        >
          {loading ? "Registering..." : "Create account"}
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-gray-600 text-white rounded font-medium"
          onClick={() => router.push("/Auth/login")}
          disabled={loading}
        >
          Back to Login
        </button>
      </div>
    </form>
  );
};

export default Register;