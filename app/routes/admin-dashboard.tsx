import { useState, useEffect } from "react";
import { Link } from "react-router";
import { supabase } from "/utils/supabase/client";
import { FolderOpen, FileText, CheckCircle, Clock, Plus, ArrowRight, AlertCircle } from "lucide-react";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => [
  { title: "Dashboard — SEO Command" },
  { name: "robots", content: "noindex, nofollow" },
];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-[#333] text-[#888]",
  researching: "bg-amber-500/15 text-amber-400",
  research_done: "bg-amber-500/15 text-amber-400",
  writing: "bg-blue-500/15 text-blue-400",
  writing_done: "bg-blue-500/15 text-blue-400",
  imaging: "bg-purple-500/15 text-purple-400",
  images_done: "bg-purple-500/15 text-purple-400",
  awaiting_approval: "bg-orange-500/15 text-orange-400",
  publishing: "bg-emerald-500/15 text-emerald-400",
  published: "bg-green-500/15 text-green-400",
  error: "bg-red-500/15 text-red-400",
};

export default function AdminDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [{ data: p }, { data: j }] = await Promise.all([
        supabase.from("seo_projects").select("*").order("created_at", { ascending: false }),
        supabase.from("seo_jobs").select("*, seo_projects(name, domain)").order("created_at", { ascending: false }).limit(8),
      ]);
      setProjects(p ?? []);
      setJobs(j ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const published = jobs.filter(j => j.status === "published").length;
  const awaiting = jobs.filter(j => j.status === "awaiting_approval").length;
  const inProgress = jobs.filter(j => !["published", "pending", "error"].includes(j.status)).length;

  const stats = [
    { label: "Projects", value: projects.length, icon: FolderOpen, color: "text-[#007aff]", bg: "bg-[#007aff]/10" },
    { label: "Total Jobs", value: jobs.length, icon: FileText, color: "text-purple-400", bg: "bg-purple-500/10" },
    { label: "Published", value: published, icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/10" },
    { label: "Awaiting Approval", value: awaiting, icon: AlertCircle, color: "text-orange-400", bg: "bg-orange-500/10" },
  ];

  return (
    <div className="p-8 text-white">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-[#555] text-sm mt-1">Your SEO pipeline at a glance</p>
        </div>
        <Link
          id="new-job-btn"
          to="/admin/jobs"
          className="flex items-center gap-2 bg-[#007aff] hover:bg-[#0066d6] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
        >
          <Plus size={15} />
          New Job
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-5">
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon size={16} className={color} />
            </div>
            <div className="text-3xl font-bold text-white mb-0.5">{loading ? "—" : value}</div>
            <div className="text-[#555] text-xs">{label}</div>
          </div>
        ))}
      </div>

      {/* Recent Jobs */}
      <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1f1f1f]">
          <h2 className="text-sm font-semibold text-white">Recent Jobs</h2>
          <Link to="/admin/jobs" className="text-[#007aff] text-xs hover:underline flex items-center gap-1">
            View all <ArrowRight size={11} />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-[#007aff] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <FileText size={32} className="text-[#333] mx-auto mb-3" />
            <p className="text-[#555] text-sm">No jobs yet. Create your first one.</p>
            <Link to="/admin/jobs" className="mt-3 inline-flex items-center gap-1.5 text-[#007aff] text-sm hover:underline">
              <Plus size={13} /> Create job
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-[#444] text-xs uppercase tracking-wider border-b border-[#1a1a1a]">
                <th className="text-left px-6 py-3 font-medium">Topic</th>
                <th className="text-left px-6 py-3 font-medium">Project</th>
                <th className="text-left px-6 py-3 font-medium">Status</th>
                <th className="text-left px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id} className="border-b border-[#1a1a1a] last:border-0 hover:bg-[#161616] transition-colors">
                  <td className="px-6 py-3.5 text-sm text-white font-medium truncate max-w-[200px]">{job.topic}</td>
                  <td className="px-6 py-3.5 text-sm text-[#666]">{job.seo_projects?.domain}</td>
                  <td className="px-6 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[job.status] ?? "bg-[#333] text-[#888]"}`}>
                      {job.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-[#555]">
                    {new Date(job.created_at).toLocaleDateString("de-DE")}
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <Link to={`/admin/jobs/${job.id}`} className="text-[#007aff] text-xs hover:underline">
                      Open →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
