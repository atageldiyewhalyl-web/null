import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { supabase } from "/utils/supabase/client";
import {
  Plus, Pencil, Trash2, Globe, X, Check, Sparkles,
  ArrowRight, RefreshCw, Lightbulb, TrendingUp, BarChart2
} from "lucide-react";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => [
  { title: "Projects — SEO Command" },
  { name: "robots", content: "noindex, nofollow" },
];

const EMPTY = {
  name: "", domain: "", github_repo: "", github_branch: "main",
  framework: "vite-react", blog_dir: "src/content/blog",
  blog_index_file: "src/data/blog-posts.json", sitemap_path: "public/sitemap.xml",
  language: ["de"], brand_voice: "", internal_links: [],
  niche_keywords: "", gsc_property_url: "",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  low: "bg-green-500/15 text-green-400 border-green-500/20",
  medium: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  high: "bg-red-500/15 text-red-400 border-red-500/20",
};

const INTENT_COLORS: Record<string, string> = {
  informational: "bg-blue-500/15 text-blue-400",
  transactional: "bg-purple-500/15 text-purple-400",
  local: "bg-orange-500/15 text-orange-400",
  navigational: "bg-[#333] text-[#888]",
};

const Field = ({ label, id, value, onChange, placeholder, type = "text", mono = false }: any) => (
  <div>
    <label className="block text-[#888] text-xs font-medium mb-1.5 uppercase tracking-wider">{label}</label>
    <input
      id={id} type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className={`w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff]/30 transition-all placeholder:text-[#444] ${mono ? "font-mono" : ""}`}
    />
  </div>
);

function KeywordPanel({ project, onClose }: { project: any; onClose: () => void }) {
  const navigate = useNavigate();
  const [keywords, setKeywords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [discovering, setDiscovering] = useState(false);
  const [creatingJob, setCreatingJob] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadKeywords = useCallback(async () => {
    const { data } = await supabase
      .from("seo_keyword_suggestions")
      .select("*")
      .eq("project_id", project.id)
      .order("created_at", { ascending: false });
    setKeywords(data ?? []);
    setLoading(false);
  }, [project.id]);

  useEffect(() => { loadKeywords(); }, [loadKeywords]);

  const discover = async () => {
    setDiscovering(true);
    setError(null);
    try {
      const res = await fetch("https://srnynewvauzymnljqskj.supabase.co/functions/v1/seo-agent-discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_id: project.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Discovery failed");
      await loadKeywords();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setDiscovering(false);
    }
  };

  const createJob = async (kw: any) => {
    setCreatingJob(kw.id);
    try {
      const { data: job } = await supabase.from("seo_jobs").insert({
        project_id: project.id,
        topic: kw.keyword,
        target_language: Array.isArray(project.language) ? project.language[0] : "de",
      }).select().single();

      // Mark keyword as in-progress
      await supabase.from("seo_keyword_suggestions")
        .update({ status: "in_progress", job_id: job.id })
        .eq("id", kw.id);

      navigate(`/admin/jobs/${job.id}`);
    } catch (e: any) {
      setError(e.message);
      setCreatingJob(null);
    }
  };

  const deleteKeyword = async (id: string) => {
    await supabase.from("seo_keyword_suggestions").delete().eq("id", id);
    setKeywords(kws => kws.filter(k => k.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl max-h-[85vh] bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1f1f1f] shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-[#007aff]" />
              <h2 className="text-white font-semibold">Keyword Opportunities</h2>
              <span className="bg-[#1a1a1a] text-[#666] text-xs px-2 py-0.5 rounded-full">{project.domain}</span>
            </div>
            <p className="text-[#555] text-xs mt-0.5">Pick a keyword and the full SEO pipeline starts automatically</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={discover}
              disabled={discovering}
              className="flex items-center gap-2 bg-[#007aff] hover:bg-[#0066d6] disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all"
            >
              {discovering
                ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <RefreshCw size={12} />}
              {discovering ? "Discovering…" : keywords.length > 0 ? "Refresh" : "Discover Keywords"}
            </button>
            <button onClick={onClose} className="text-[#555] hover:text-white p-1.5 rounded-lg hover:bg-[#1a1a1a] transition-all">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-6 h-6 border-2 border-[#007aff] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : keywords.length === 0 ? (
            <div className="text-center py-16">
              <Lightbulb size={40} className="text-[#333] mx-auto mb-3" />
              <p className="text-[#555] text-sm mb-2">No keyword suggestions yet</p>
              {!project.niche_keywords && (
                <p className="text-[#444] text-xs mb-4">
                  Tip: Add "Niche Keywords" to the project (e.g. "Webdesign, SEO, Deutschland") for better results
                </p>
              )}
              <button
                onClick={discover}
                disabled={discovering}
                className="flex items-center gap-2 bg-[#007aff] hover:bg-[#0066d6] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all mx-auto disabled:opacity-50"
              >
                {discovering
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <Sparkles size={14} />}
                {discovering ? "Discovering…" : "Discover Keywords"}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {keywords.map(kw => (
                <div
                  key={kw.id}
                  className={`bg-[#111] border rounded-2xl p-4 flex flex-col gap-3 transition-all hover:border-[#333] ${
                    kw.status === "published" ? "opacity-50 border-[#1a1a1a]" :
                    kw.status === "in_progress" ? "border-[#007aff]/30" : "border-[#1f1f1f]"
                  }`}
                >
                  {/* Keyword + badges */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-white font-semibold text-sm leading-snug">{kw.keyword}</p>
                      <button
                        onClick={() => deleteKeyword(kw.id)}
                        className="text-[#333] hover:text-red-400 text-xs shrink-0 mt-0.5 transition-colors"
                      >✕</button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${DIFFICULTY_COLORS[kw.difficulty] ?? "bg-[#333] text-[#888] border-[#333]"}`}>
                        {kw.difficulty} competition
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${INTENT_COLORS[kw.intent] ?? "bg-[#333] text-[#888]"}`}>
                        {kw.intent}
                      </span>
                      {kw.estimated_volume && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-[#1a1a1a] text-[#666]">
                          <BarChart2 size={9} /> {kw.estimated_volume}
                        </span>
                      )}
                      {kw.gsc_impressions != null && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400">
                          <TrendingUp size={9} /> {kw.gsc_impressions.toLocaleString()} impr
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content angle */}
                  {kw.content_angle && (
                    <p className="text-[#666] text-xs leading-relaxed border-t border-[#1a1a1a] pt-3">
                      💡 {kw.content_angle}
                    </p>
                  )}

                  {/* Action */}
                  <div className="mt-auto">
                    {kw.status === "published" ? (
                      <span className="text-xs text-green-400">✓ Published</span>
                    ) : kw.status === "in_progress" ? (
                      <span className="text-xs text-[#007aff]">↗ In pipeline</span>
                    ) : (
                      <button
                        onClick={() => createJob(kw)}
                        disabled={!!creatingJob}
                        className="w-full flex items-center justify-center gap-2 bg-[#007aff]/10 hover:bg-[#007aff]/20 border border-[#007aff]/20 text-[#007aff] rounded-xl py-2 text-xs font-semibold transition-all disabled:opacity-40"
                      >
                        {creatingJob === kw.id
                          ? <div className="w-3 h-3 border-2 border-[#007aff]/30 border-t-[#007aff] rounded-full animate-spin" />
                          : <><ArrowRight size={11} /> Write This Article</>}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer hint */}
        {!project.gsc_property_url && keywords.length > 0 && (
          <div className="px-6 py-3 border-t border-[#1f1f1f] flex items-center gap-2 text-xs text-[#444] shrink-0">
            <TrendingUp size={11} />
            Connect Google Search Console to see real impression & click data on these keywords
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [discoveryProject, setDiscoveryProject] = useState<any | null>(null);

  const load = async () => {
    const { data } = await supabase.from("seo_projects").select("*").order("created_at", { ascending: false });
    setProjects(data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(EMPTY); setEditing(null); setShowForm(true); setError(null); };
  const openEdit = (p: any) => { setForm({ ...p, niche_keywords: p.niche_keywords ?? "", gsc_property_url: p.gsc_property_url ?? "" }); setEditing(p); setShowForm(true); setError(null); };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        language: typeof form.language === "string" ? form.language.split(",").map((s: string) => s.trim()) : form.language,
        internal_links: typeof form.internal_links === "string" ? JSON.parse(form.internal_links || "[]") : form.internal_links,
      };
      if (editing) {
        await supabase.from("seo_projects").update(payload).eq("id", editing.id);
      } else {
        await supabase.from("seo_projects").insert(payload);
      }
      setShowForm(false);
      await load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this project and all its jobs?")) return;
    await supabase.from("seo_projects").delete().eq("id", id);
    await load();
  };

  return (
    <div className="p-8 text-white">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-[#555] text-sm mt-1">Manage your registered websites</p>
        </div>
        <button
          id="add-project-btn"
          onClick={openNew}
          className="flex items-center gap-2 bg-[#007aff] hover:bg-[#0066d6] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
        >
          <Plus size={15} /> Add Project
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#007aff] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl text-center py-16">
          <Globe size={36} className="text-[#333] mx-auto mb-3" />
          <p className="text-[#555] text-sm mb-4">No projects yet</p>
          <button onClick={openNew} className="text-[#007aff] text-sm hover:underline flex items-center gap-1 mx-auto">
            <Plus size={13} /> Add your first project
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map(p => (
            <div key={p.id} className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-5 hover:border-[#2a2a2a] transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#007aff]/10 rounded-xl flex items-center justify-center shrink-0">
                    <Globe size={16} className="text-[#007aff]" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{p.name}</div>
                    <div className="text-[#555] text-xs mt-0.5">{p.domain} · {p.github_repo} · {p.framework}</div>
                    {p.niche_keywords && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {p.niche_keywords.split(",").slice(0, 4).map((kw: string) => (
                          <span key={kw} className="bg-[#1a1a1a] text-[#555] text-[10px] px-2 py-0.5 rounded-full">{kw.trim()}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setDiscoveryProject(p)}
                    className="flex items-center gap-1.5 bg-[#007aff]/10 hover:bg-[#007aff]/20 border border-[#007aff]/20 text-[#007aff] px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                  >
                    <Sparkles size={11} /> Keywords
                  </button>
                  <span className="bg-[#1a1a1a] text-[#666] text-xs px-2.5 py-1 rounded-full">
                    {p.language?.join(", ")}
                  </span>
                  <button onClick={() => openEdit(p)} className="p-2 text-[#555] hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-all">
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => remove(p.id)} className="p-2 text-[#555] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Keyword Discovery Panel */}
      {discoveryProject && (
        <KeywordPanel project={discoveryProject} onClose={() => setDiscoveryProject(null)} />
      )}

      {/* Slide-over form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="w-full max-w-md bg-[#111] border-l border-[#1f1f1f] flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#1f1f1f]">
              <h2 className="text-white font-semibold">{editing ? "Edit Project" : "New Project"}</h2>
              <button onClick={() => setShowForm(false)} className="text-[#555] hover:text-white p-1.5 rounded-lg hover:bg-[#1a1a1a] transition-all">
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 p-6 space-y-4">
              <Field id="p-name" label="Project Name" value={form.name} onChange={(v: string) => setForm({ ...form, name: v })} placeholder="Doğru Kanzlei" />
              <Field id="p-domain" label="Domain" value={form.domain} onChange={(v: string) => setForm({ ...form, domain: v })} placeholder="dogrukanzlei.de" />
              <Field id="p-repo" label="GitHub Repo" value={form.github_repo} onChange={(v: string) => setForm({ ...form, github_repo: v })} placeholder="owner/repo-name" mono />
              <Field id="p-branch" label="Branch" value={form.github_branch} onChange={(v: string) => setForm({ ...form, github_branch: v })} placeholder="main" mono />

              <div>
                <label className="block text-[#888] text-xs font-medium mb-1.5 uppercase tracking-wider">Framework</label>
                <select
                  value={form.framework}
                  onChange={e => setForm({ ...form, framework: e.target.value })}
                  className="w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#007aff] transition-all"
                >
                  <option value="vite-react">Vite / React Router</option>
                  <option value="static-html">Static HTML</option>
                  <option value="astro">Astro</option>
                </select>
              </div>

              <Field id="p-blogdir" label="Blog Directory" value={form.blog_dir} onChange={(v: string) => setForm({ ...form, blog_dir: v })} placeholder="src/content/blog" mono />
              <Field id="p-indexfile" label="Blog Index File" value={form.blog_index_file} onChange={(v: string) => setForm({ ...form, blog_index_file: v })} placeholder="src/data/blog-posts.json" mono />
              <Field id="p-sitemap" label="Sitemap Path" value={form.sitemap_path} onChange={(v: string) => setForm({ ...form, sitemap_path: v })} placeholder="public/sitemap.xml" mono />
              <Field id="p-lang" label="Languages (comma separated)" value={Array.isArray(form.language) ? form.language.join(", ") : form.language} onChange={(v: string) => setForm({ ...form, language: v })} placeholder="de, tr" />

              <div>
                <label className="block text-[#888] text-xs font-medium mb-1.5 uppercase tracking-wider">
                  Niche Keywords <span className="text-[#444] normal-case font-normal">(seed for keyword discovery)</span>
                </label>
                <input
                  id="p-niche"
                  type="text"
                  value={form.niche_keywords ?? ""}
                  onChange={e => setForm({ ...form, niche_keywords: e.target.value })}
                  placeholder="Webdesign, SEO, Webentwicklung, Deutschland"
                  className="w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff]/30 transition-all placeholder:text-[#444]"
                />
              </div>

              <div>
                <label className="block text-[#888] text-xs font-medium mb-1.5 uppercase tracking-wider">Brand Voice</label>
                <textarea
                  id="p-voice"
                  rows={4}
                  value={form.brand_voice ?? ""}
                  onChange={e => setForm({ ...form, brand_voice: e.target.value })}
                  placeholder="Professional, trustworthy, German legal authority. Avoid jargon..."
                  className="w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff]/30 transition-all placeholder:text-[#444] resize-none"
                />
              </div>

              {/* GSC Section */}
              <div className="border-t border-[#1f1f1f] pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={12} className="text-[#007aff]" />
                  <span className="text-[#888] text-xs font-medium uppercase tracking-wider">Google Search Console</span>
                  <span className="bg-amber-500/10 text-amber-400 text-[10px] px-1.5 py-0.5 rounded font-medium">Phase 2</span>
                </div>
                <Field id="p-gsc" label="GSC Property URL" value={form.gsc_property_url ?? ""} onChange={(v: string) => setForm({ ...form, gsc_property_url: v })} placeholder="https://dogrukanzlei.de" />
                <p className="text-[#444] text-xs mt-1.5">Add your property URL now. Service account setup guide coming soon.</p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm">{error}</div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-[#1f1f1f] flex gap-3">
              <button onClick={() => setShowForm(false)} className="flex-1 bg-[#1a1a1a] hover:bg-[#222] text-[#888] rounded-xl py-2.5 text-sm font-medium transition-all">
                Cancel
              </button>
              <button
                id="save-project-btn"
                onClick={save}
                disabled={saving || !form.name || !form.domain || !form.github_repo}
                className="flex-1 bg-[#007aff] hover:bg-[#0066d6] disabled:opacity-40 text-white rounded-xl py-2.5 text-sm font-semibold transition-all flex items-center justify-center gap-2"
              >
                {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Check size={14} /> Save</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
