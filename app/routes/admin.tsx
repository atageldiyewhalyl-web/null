import { useState, useEffect } from "react";
import { Outlet, useNavigate, NavLink } from "react-router";
import { supabase } from "/utils/supabase/client";
import { LayoutDashboard, FolderOpen, FileText, LogOut, Zap } from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/admin/login");
      else setUserEmail(session.user.email ?? null);
      setChecking(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate("/admin/login");
    });
    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#007aff] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const nav = [
    { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
    { to: "/admin/projects", icon: FolderOpen, label: "Projects" },
    { to: "/admin/jobs", icon: FileText, label: "Jobs" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex font-sans">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-[#111] border-r border-[#1f1f1f] flex flex-col">
        <div className="px-5 py-5 border-b border-[#1f1f1f] flex items-center gap-3">
          <div className="w-8 h-8 bg-[#007aff] rounded-lg flex items-center justify-center shrink-0">
            <Zap size={15} className="text-white" />
          </div>
          <div>
            <div className="text-white font-semibold text-sm leading-tight">SEO Command</div>
            <div className="text-[#555] text-xs">nüll.com</div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {nav.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? "bg-[#007aff]/15 text-[#007aff] font-medium"
                    : "text-[#777] hover:text-white hover:bg-[#1a1a1a]"
                }`
              }
            >
              <Icon size={15} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-[#1f1f1f]">
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="w-6 h-6 rounded-full bg-[#007aff]/20 flex items-center justify-center shrink-0">
              <span className="text-[#007aff] text-xs font-bold">{userEmail?.[0]?.toUpperCase()}</span>
            </div>
            <span className="text-[#555] text-xs truncate flex-1">{userEmail}</span>
            <button onClick={signOut} className="text-[#444] hover:text-red-400 transition-colors p-1 rounded">
              <LogOut size={13} />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
