import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "/utils/supabase/client";
import { Zap, Lock } from "lucide-react";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => [
  { title: "Admin Login — Nüll." },
  { name: "robots", content: "noindex, nofollow" },
];

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      setError(err.message);
      setLoading(false);
    } else {
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 bg-[#007aff] rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_40px_rgba(0,122,255,0.3)]">
            <Zap size={24} className="text-white" />
          </div>
          <h1 className="text-white text-2xl font-bold tracking-tight">SEO Command Center</h1>
          <p className="text-[#555] text-sm mt-1">Admin access only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[#888] text-xs font-medium mb-1.5 uppercase tracking-wider">Email</label>
            <input
              id="admin-email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#161616] border border-[#2a2a2a] text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[#007aff] focus:ring-2 focus:ring-[#007aff]/20 transition-all placeholder:text-[#444]"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-[#888] text-xs font-medium mb-1.5 uppercase tracking-wider">Password</label>
            <input
              id="admin-password"
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-[#161616] border border-[#2a2a2a] text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[#007aff] focus:ring-2 focus:ring-[#007aff]/20 transition-all placeholder:text-[#444]"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <button
            id="admin-login-btn"
            type="submit"
            disabled={loading}
            className="w-full bg-[#007aff] hover:bg-[#0066d6] disabled:opacity-50 text-white font-semibold rounded-xl py-3 text-sm transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Lock size={14} />
                Sign In
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
