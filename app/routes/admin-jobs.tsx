import { useState, useEffect } from "react";
import { Link } from "react-router";
import { supabase } from "/utils/supabase/client";
import { Plus, FileText, X, Check, ArrowRight } from "lucide-react";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => [
  { title: "Jobs — SEO Command" },
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

export default function AdminJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ project_id: "", topic: "", target_language: "de" });
  const [saving, setSaving] = useState(false);
  const [filterProject, setFilterProject] = useState("all");

  const load = async () => {
    const [{ data: j }, { data: p }] = await Promise.all([
      supabase.from("seo_jobs").select("*, seo_projects(name, domain)").order("created_at", { ascending: false }),
      supabase.from("seo_projects").select("id, name, domain").order("name"),
    ]);
    setJobs(j ?? []);
    setProjects(p ?? []);
    if (p && p.length > 0) setForm(f => ({ ...f, project_id: p[0].id }));
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const createJob = async () => {
    if (!form.project_id || !form.topic.trim()) return;
    setSaving(true);
    const { data } = await supabase.from("seo_jobs").insert(form).select().single();
    setSaving(false);
    setShowForm(false);
    await load();
  };

  const deleteJob = async (id: string) => {
    if (!confirm("Delete this job?")) return;
    await supabase.from("seo_jobs").delete().eq("id", id);
    await load();
  };

  const filtered = filterProject === "all" ? jobs : jobs.filter(j => j.project_id === filterProject);

  return (
    <div className="p-8 text-white">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Jobs</h1>
          <p className="text-[#555] text-sm mt-1">All SEO content pipeline runs</p>
        </div>
        <button
          id="create-job-btn"
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-[#007aff] hover:bg-[#0066d6] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
        >
          <Plus size={15} /> New Job
        </button>
      </div>

      {/* Filter */}
      {projects.length > 0 && (
        <div className="flex gap-2 mb-5 flex-wrap">
          <button
            onClick={() => setFilterProject("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filterProject === "all" ? "bg-[#007aff] text-white" : "bg-[#1a1a1a] text-[#666] hover:text-white"}`}
          >
            All
          </button>
          {projects.map(p => (
            <button
              key={p.id}
              onClick={() => setFilterProject(p.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filterProject === p.id ? "bg-[#007aff] text-white" : "bg-[#1a1a1a] text-[#666] hover:text-white"}`}
            >
              {p.domain}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#007aff] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl text-center py-16">
          <FileText size={36} className="text-[#333] mx-auto mb-3" />
          <p className="text-[#555] text-sm mb-4">No jobs yet</p>
          {projects.length === 0 ? (
            <Link to="/admin/projects" className="text-[#007aff] text-sm hover:underline">Add a project first →</Link>
          ) : (
            <button onClick={() => setShowForm(true)} className="text-[#007aff] text-sm hover:underline flex items-center gap-1 mx-auto">
              <Plus size={13} /> Create your first job
            </button>
          )}
        </div>
      ) : (
        <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-[#444] text-xs uppercase tracking-wider border-b border-[#1a1a1a]">
                <th className="text-left px-6 py-3 font-medium">Topic</th>
                <th className="text-left px-6 py-3 font-medium">Project</th>
                <th className="text-left px-6 py-3 font-medium">Lang</th>
                <th className="text-left px-6 py-3 font-medium">Status</th>
                <th className="text-left px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map(job => (
                <tr key={job.id} className="border-b border-[#1a1a1a] last:border-0 hover:bg-[#161616] transition-colors">
                  <td className="px-6 py-3.5 text-sm text-white font-medium max-w-[220px]">
                    <span className="truncate block">{job.topic}</span>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-[#666]">{job.seo_projects?.domain}</td>
                  <td className="px-6 py-3.5 text-sm text-[#666] uppercase">{job.target_language}</td>
                  <td className="px-6 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[job.status] ?? "bg-[#333] text-[#888]"}`}>
                      {job.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-[#555]">
                    {new Date(job.created_at).toLocaleDateString("de-DE")}
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/jobs/${job.id}`} className="text-[#007aff] text-xs hover:underline flex items-center gap-1">
                        Open <ArrowRight size={11} />
                      </Link>
                      <button onClick={() => deleteJob(job.id)} className="text-[#444] hover:text-red-400 text-xs transition-colors ml-2">✕</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New Job Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative w-full max-w-md bg-[#111] border border-[#2a2a2a] rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#1f1f1f]">
              <h2 className="text-white font-semibold">New SEO Job</h2>
              <button onClick={() => setShowForm(false)} className="text-[#555] hover:text-white p-1.5 rounded-lg hover:bg-[#1a1a1a] transition-all">
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[#888] text-xs font-medium mb-1.5 uppercase tracking-wider">Project</label>
                <select
                  id="job-project"
                  value={form.project_id}
                  onChange={e => setForm({ ...form, project_id: e.target.value })}
                  className="w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#007aff] transition-all"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.domain})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#888] text-xs font-medium mb-1.5 uppercase tracking-wider">Topic / Seed Keyword</label>
                <input
                  id="job-topic"
                  type="text"
                  value={form.topic}
                  onChange={e => setForm({ ...form, topic: e.target.value })}
                  placeholder="e.g. EU Blue Card for lawyers in Germany"
                  className="w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff]/30 transition-all placeholder:text-[#444]"
                />
              </div>

              <div>
                <label className="block text-[#888] text-xs font-medium mb-1.5 uppercase tracking-wider">Target Language</label>
                <select
                  id="job-lang"
                  value={form.target_language}
                  onChange={e => setForm({ ...form, target_language: e.target.value })}
                  className="w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#007aff] transition-all"
                >
                  <option value="de">German (de)</option>
                  <option value="en">English (en)</option>
                </select>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[#1f1f1f] flex gap-3">
              <button onClick={() => setShowForm(false)} className="flex-1 bg-[#1a1a1a] hover:bg-[#222] text-[#888] rounded-xl py-2.5 text-sm font-medium transition-all">
                Cancel
              </button>
              <button
                id="confirm-create-job-btn"
                onClick={createJob}
                disabled={saving || !form.topic.trim() || !form.project_id}
                className="flex-1 bg-[#007aff] hover:bg-[#0066d6] disabled:opacity-40 text-white rounded-xl py-2.5 text-sm font-semibold transition-all flex items-center justify-center gap-2"
              >
                {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Check size={14} /> Create Job</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
