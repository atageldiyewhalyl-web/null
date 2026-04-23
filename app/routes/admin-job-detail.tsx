import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { supabase } from "/utils/supabase/client";
import {
  ArrowLeft, Search, PenLine, Image, Rocket, CheckCircle,
  RefreshCw, AlertCircle, ExternalLink, ChevronDown, ChevronUp, Copy, Check
} from "lucide-react";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => [
  { title: "Job Detail — SEO Command" },
  { name: "robots", content: "noindex, nofollow" },
];

const STAGES = [
  { key: "research", label: "Research", icon: Search, doneStatus: "research_done", runningStatus: "researching" },
  { key: "write", label: "Write", icon: PenLine, doneStatus: "writing_done", runningStatus: "writing" },
  { key: "images", label: "Images", icon: Image, doneStatus: "images_done", runningStatus: "imaging" },
  { key: "publish", label: "Publish", icon: Rocket, doneStatus: "published", runningStatus: "publishing" },
];

const ORDER = ["pending", "researching", "research_done", "writing", "writing_done", "imaging", "images_done", "awaiting_approval", "publishing", "published"];

function stageIndex(status: string) { return ORDER.indexOf(status); }

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
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
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colors[status] ?? "bg-[#333] text-[#888]"}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="p-1.5 text-[#555] hover:text-white hover:bg-[#2a2a2a] rounded-lg transition-all">
      {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
    </button>
  );
}

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#161616] transition-colors">
        <span className="text-white font-semibold text-sm">{title}</span>
        {open ? <ChevronUp size={15} className="text-[#555]" /> : <ChevronDown size={15} className="text-[#555]" />}
      </button>
      {open && <div className="border-t border-[#1f1f1f] px-5 py-4">{children}</div>}
    </div>
  );
}

export default function AdminJobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState<any>(null);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [articleDraft, setArticleDraft] = useState("");
  const [editingArticle, setEditingArticle] = useState(false);

  const load = async () => {
    const { data: j } = await supabase.from("seo_jobs").select("*, seo_projects(*)").eq("id", id).single();
    setJob(j);
    setProject(j?.seo_projects);
    setArticleDraft(j?.article_markdown ?? "");
    setLoading(false);
  };
  useEffect(() => { load(); }, [id]);

  const invokeAgent = async (agent: string, extraBody = {}) => {
    setRunning(agent);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`https://srnynewvauzymnljqskj.supabase.co/functions/v1/${agent}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ job_id: id, ...extraBody }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `Agent failed: ${res.status}`);
      await load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setRunning(null);
    }
  };

  const saveArticle = async () => {
    await supabase.from("seo_jobs").update({ article_markdown: articleDraft }).eq("id", id);
    setEditingArticle(false);
    await load();
  };

  const approveAndPublish = async () => {
    if (!confirm("This will publish the article live to GitHub → Vercel. Proceed?")) return;
    await supabase.from("seo_jobs").update({ status: "awaiting_approval" }).eq("id", id);
    await invokeAgent("seo-agent-publish");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen bg-[#0a0a0a]">
        <div className="w-6 h-6 border-2 border-[#007aff] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!job) return <div className="p-8 text-[#555]">Job not found.</div>;

  const si = stageIndex(job.status);
  const canResearch = si <= stageIndex("pending") || si === stageIndex("research_done");
  const canWrite = si >= stageIndex("research_done") && si < stageIndex("writing");
  const canImages = si >= stageIndex("writing_done") && si < stageIndex("imaging");
  const canApprove = si >= stageIndex("images_done") && !["awaiting_approval", "publishing", "published"].includes(job.status);
  const isPublished = job.status === "published";

  return (
    <div className="p-8 text-white max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Link to="/admin/jobs" className="inline-flex items-center gap-1.5 text-[#555] hover:text-white text-sm transition-colors mb-4">
          <ArrowLeft size={13} /> All Jobs
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight leading-tight">{job.topic}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-[#555] text-sm">{project?.domain}</span>
              <span className="text-[#333]">·</span>
              <span className="text-[#555] text-sm uppercase">{job.target_language}</span>
              <span className="text-[#333]">·</span>
              <StatusBadge status={job.status} />
            </div>
          </div>
          {isPublished && job.published_url && (
            <a href={job.published_url} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-500/20 transition-all shrink-0">
              <ExternalLink size={13} /> View Live
            </a>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between">
          {STAGES.map((stage, i) => {
            const done = si > stageIndex(stage.doneStatus);
            const active = job.status === stage.runningStatus || job.status === stage.doneStatus;
            const Icon = stage.icon;
            return (
              <div key={stage.key} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    done ? "bg-green-500/15 text-green-400" :
                    active ? "bg-[#007aff]/15 text-[#007aff]" :
                    "bg-[#1a1a1a] text-[#444]"
                  }`}>
                    {done ? <CheckCircle size={16} /> : running === `seo-agent-${stage.key}` ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : <Icon size={16} />}
                  </div>
                  <span className={`text-xs mt-1.5 font-medium ${done ? "text-green-400" : active ? "text-[#007aff]" : "text-[#444]"}`}>
                    {stage.label}
                  </span>
                </div>
                {i < STAGES.length - 1 && (
                  <div className={`flex-1 h-px mx-3 mt-[-14px] ${si > stageIndex(stage.doneStatus) ? "bg-green-500/30" : "bg-[#222]"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Error */}
      {(error || job.error) && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm mb-6 flex items-start gap-2">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <span>{error || job.error}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Stage 1: Research */}
        <Section title="① Research" defaultOpen={!job.research_output}>
          {job.research_output ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[#555] text-xs uppercase tracking-wider">Primary Keyword</div>
                <button
                  onClick={() => {
                    const text = `Topic: ${job.topic}\nPrimary Keyword: ${job.research_output.primary_keyword}\nKeyword Cluster: ${job.research_output.keyword_cluster?.join(", ")}\n\nContent Gaps:\n${job.research_output.content_gaps?.map((g: string) => `- ${g}`).join("\n")}\n\nSources:\n${job.research_output.sources?.map((s: any) => `- ${s.title}: ${s.url}`).join("\n")}`;
                    navigator.clipboard.writeText(text);
                  }}
                  className="flex items-center gap-1 text-[#007aff] hover:text-[#0066d6] text-xs font-medium transition-all"
                >
                  <Copy size={11} /> Copy All
                </button>
              </div>
              <div className="text-white font-semibold mb-4">{job.research_output.primary_keyword}</div>
              <div>
                <div className="text-[#555] text-xs uppercase tracking-wider mb-2">Keyword Cluster</div>
                <div className="flex flex-wrap gap-2">
                  {job.research_output.keyword_cluster?.map((kw: string) => (
                    <span key={kw} className="bg-[#1a1a1a] text-[#888] px-2.5 py-1 rounded-full text-xs">{kw}</span>
                  ))}
                </div>
              </div>
              {job.research_output.content_gaps?.length > 0 && (
                <div>
                  <div className="text-[#555] text-xs uppercase tracking-wider mb-2">Content Gaps Found</div>
                  <ul className="space-y-1.5">
                    {job.research_output.content_gaps.map((gap: string, i: number) => (
                      <li key={i} className="text-sm text-[#888] flex items-start gap-2">
                        <span className="text-[#007aff] mt-0.5">→</span> {gap}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {job.research_output.sources?.length > 0 && (
                <div>
                  <div className="text-[#555] text-xs uppercase tracking-wider mb-2">Sources ({job.research_output.sources.length})</div>
                  <div className="space-y-1">
                    {job.research_output.sources.map((s: any, i: number) => (
                      <a key={i} href={s.url} target="_blank" rel="noreferrer"
                        className="flex items-center gap-2 text-xs text-[#666] hover:text-[#007aff] transition-colors">
                        <ExternalLink size={11} className="shrink-0" />
                        <span className="truncate">{s.title || s.url}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
              <button
                onClick={() => invokeAgent("seo-agent-research")}
                disabled={!!running}
                className="flex items-center gap-2 text-xs text-[#555] hover:text-white bg-[#1a1a1a] hover:bg-[#222] px-3 py-2 rounded-lg transition-all disabled:opacity-40"
              >
                <RefreshCw size={12} /> Re-run Research
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center py-6">
              <p className="text-[#555] text-sm mb-4">Run the research agent to discover keywords and analyze competitors.</p>
              <button
                id="run-research-btn"
                onClick={() => invokeAgent("seo-agent-research")}
                disabled={!!running}
                className="flex items-center gap-2 bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
              >
                {running === "seo-agent-research" ? <div className="w-4 h-4 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" /> : <Search size={14} />}
                Run Research
              </button>
            </div>
          )}
        </Section>

        {/* Stage 2: Article */}
        <Section title="② Article" defaultOpen={!!job.research_output}>
          {job.article_markdown ? (
            <div className="space-y-3">
              {job.article_metadata && (
                <div className="bg-[#0d0d0d] rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[#555] text-xs uppercase tracking-wider font-bold">Metadata</span>
                    <button
                      onClick={() => {
                        const text = `Title: ${job.article_metadata.title}\nSlug: ${job.article_metadata.slug}\nDescription: ${job.article_metadata.description}\n\n${job.article_markdown}`;
                        navigator.clipboard.writeText(text);
                      }}
                      className="flex items-center gap-1 text-[#007aff] hover:text-[#0066d6] text-xs font-medium transition-all"
                    >
                      <Copy size={11} /> Copy Full Article
                    </button>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#1a1a1a] pt-2">
                    <span className="text-[#555] text-xs uppercase tracking-wider">Slug</span>
                    <div className="flex items-center gap-1">
                      <code className="text-[#007aff] text-xs font-mono">{job.article_metadata.slug}</code>
                      <CopyButton text={job.article_metadata.slug} />
                    </div>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-[#555] text-xs uppercase tracking-wider shrink-0">Title</span>
                    <span className="text-white text-xs text-right">{job.article_metadata.title}</span>
                  </div>
                  {job.article_metadata.description && (
                    <div>
                      <span className="text-[#555] text-xs uppercase tracking-wider block mb-1">Meta Description</span>
                      <span className="text-[#888] text-xs">{job.article_metadata.description}</span>
                    </div>
                  )}
                </div>
              )}

              {editingArticle ? (
                <div>
                  <textarea
                    id="article-editor"
                    value={articleDraft}
                    onChange={e => setArticleDraft(e.target.value)}
                    rows={20}
                    className="w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white rounded-xl px-4 py-3 text-sm font-mono outline-none focus:border-[#007aff] resize-none"
                  />
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => setEditingArticle(false)} className="bg-[#1a1a1a] hover:bg-[#222] text-[#888] px-4 py-2 rounded-xl text-sm transition-all">Cancel</button>
                    <button onClick={saveArticle} className="bg-[#007aff] hover:bg-[#0066d6] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all">Save Changes</button>
                  </div>
                </div>
              ) : (
                <div className="bg-[#0d0d0d] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[#555] text-xs">{articleDraft.length} chars · ~{Math.round(articleDraft.split(" ").length)} words</span>
                    <button onClick={() => setEditingArticle(true)} className="text-[#007aff] text-xs hover:underline">Edit Article</button>
                  </div>
                  <pre className="text-[#666] text-xs leading-relaxed overflow-auto max-h-48 whitespace-pre-wrap">{articleDraft.slice(0, 500)}...</pre>
                </div>
              )}

              <button
                onClick={() => invokeAgent("seo-agent-write")}
                disabled={!!running}
                className="flex items-center gap-2 text-xs text-[#555] hover:text-white bg-[#1a1a1a] hover:bg-[#222] px-3 py-2 rounded-lg transition-all disabled:opacity-40"
              >
                <RefreshCw size={12} /> Regenerate Article
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center py-6">
              <p className="text-[#555] text-sm mb-4">
                {!job.research_output ? "Complete research first." : "Generate a 2500+ word article based on the research."}
              </p>
              <button
                id="run-write-btn"
                onClick={() => invokeAgent("seo-agent-write")}
                disabled={!!running || !job.research_output}
                className="flex items-center gap-2 bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
              >
                {running === "seo-agent-write" ? <div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" /> : <PenLine size={14} />}
                Generate Article
              </button>
            </div>
          )}
        </Section>

        {/* Stage 3: Images */}
        <Section title="③ Images" defaultOpen={!!job.article_markdown && !job.image_urls}>
          {job.image_urls ? (
            <div className="space-y-4">
              {job.image_urls.hero && (
                <div>
                  <div className="text-[#555] text-xs uppercase tracking-wider mb-2">Hero Image</div>
                  <img src={job.image_urls.hero.url} alt={job.image_urls.hero.alt} className="w-full max-h-48 object-cover rounded-xl border border-[#2a2a2a]" />
                  <p className="text-[#555] text-xs mt-1">{job.image_urls.hero.alt}</p>
                </div>
              )}
              {job.image_urls.inline?.length > 0 && (
                <div>
                  <div className="text-[#555] text-xs uppercase tracking-wider mb-2">Inline Images ({job.image_urls.inline.length})</div>
                  <div className="grid grid-cols-2 gap-3">
                    {job.image_urls.inline.map((img: any, i: number) => (
                      <div key={i}>
                        <img src={img.url} alt={img.alt} className="w-full h-32 object-cover rounded-xl border border-[#2a2a2a]" />
                        <p className="text-[#555] text-xs mt-1 truncate">{img.alt}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <button
                onClick={() => invokeAgent("seo-agent-images")}
                disabled={!!running}
                className="flex items-center gap-2 text-xs text-[#555] hover:text-white bg-[#1a1a1a] hover:bg-[#222] px-3 py-2 rounded-lg transition-all disabled:opacity-40"
              >
                <RefreshCw size={12} /> Regenerate Images
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center py-6">
              <p className="text-[#555] text-sm mb-4">
                {!job.article_markdown ? "Generate the article first." : "Generate hero + inline images with Gemini Imagen."}
              </p>
              <button
                id="run-images-btn"
                onClick={() => invokeAgent("seo-agent-images")}
                disabled={!!running || !job.article_markdown}
                className="flex items-center gap-2 bg-purple-500/15 hover:bg-purple-500/25 text-purple-400 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
              >
                {running === "seo-agent-images" ? <div className="w-4 h-4 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" /> : <Image size={14} />}
                Generate Images
              </button>
            </div>
          )}
        </Section>

        {/* Stage 4: Publish */}
        <Section title="④ Approve & Publish" defaultOpen={canApprove}>
          {isPublished ? (
            <div className="text-center py-6">
              <CheckCircle size={36} className="text-green-400 mx-auto mb-3" />
              <div className="text-white font-semibold mb-1">Published!</div>
              {job.published_url && (
                <a href={job.published_url} target="_blank" rel="noreferrer" className="text-[#007aff] text-sm hover:underline flex items-center justify-center gap-1">
                  {job.published_url} <ExternalLink size={12} />
                </a>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center py-6">
              <p className="text-[#555] text-sm mb-2 text-center max-w-sm">
                {!job.image_urls ? "Complete all steps above first." : "Review the article and images above, then approve to publish directly to GitHub → Vercel."}
              </p>
              {job.image_urls && (
                <p className="text-amber-400/70 text-xs mb-4 text-center">⚠ This will commit directly to main and trigger a Vercel deploy.</p>
              )}
              <button
                id="approve-publish-btn"
                onClick={approveAndPublish}
                disabled={!!running || !job.image_urls}
                className="flex items-center gap-2 bg-green-500/15 hover:bg-green-500/25 text-green-400 border border-green-500/20 px-6 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
              >
                {running === "seo-agent-publish" ? <div className="w-4 h-4 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin" /> : <Rocket size={14} />}
                Approve & Publish Live
              </button>
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}
