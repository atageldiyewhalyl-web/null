import { useState } from "react";
import { Send, MapPin, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { useLanguage, t } from "./LanguageContext";

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-ea5edff4`;

export function Contact() {
  const { lang } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Contact form error:", data);
        setError(t("contact.error", lang));
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      console.error("Contact form network error:", err);
      setError(t("contact.networkError", lang));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-32 px-4 md:px-6 bg-[#fafafa]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-[0.875rem] tracking-[0.1em] uppercase text-[#0071e3] mb-4">
              {t("contact.label", lang)}
            </p>
            <h2
              className="text-[clamp(1.75rem,4vw,2.75rem)] tracking-[-0.03em] leading-[1.15] mb-6"
              style={{ fontWeight: 600 }}
            >
              {t("contact.title1", lang)}
              <br />
              {t("contact.title2", lang)}
            </h2>
            <p className="text-[1.0625rem] text-muted-foreground leading-relaxed mb-10">
              {t("contact.description", lang)}
            </p>

            <div className="space-y-4">
              <a href="https://wa.me/17736561156" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[0.9375rem] text-muted-foreground hover:text-foreground transition-colors">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
              <div className="flex items-center gap-3 text-[0.9375rem] text-muted-foreground">
                <MapPin size={18} />
                {t("contact.location", lang)}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {submitted ? (
              <div className="bg-white rounded-2xl border border-black/5 p-12 text-center">
                <div className="w-12 h-12 rounded-full bg-[#30d158]/10 flex items-center justify-center mx-auto mb-4">
                  <Send size={20} className="text-[#30d158]" />
                </div>
                <h3 className="text-[1.25rem] mb-2" style={{ fontWeight: 600 }}>
                  {t("contact.sent", lang)}
                </h3>
                <p className="text-[0.9375rem] text-muted-foreground">
                  {t("contact.sentDesc", lang)}
                </p>
              </div>
            ) : (
              <form
                className="bg-white rounded-2xl border border-black/5 p-8 space-y-5"
                onSubmit={handleSubmit}
              >
                <div>
                  <label className="block text-[0.8125rem] text-muted-foreground mb-1.5">
                    {t("contact.name", lang)}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#f5f5f7] border-none focus:ring-2 focus:ring-[#0071e3]/30 outline-none transition-all text-[0.9375rem]"
                    placeholder={t("contact.namePlaceholder", lang)}
                  />
                </div>
                <div>
                  <label className="block text-[0.8125rem] text-muted-foreground mb-1.5">
                    {t("contact.email", lang)}
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#f5f5f7] border-none focus:ring-2 focus:ring-[#0071e3]/30 outline-none transition-all text-[0.9375rem]"
                    placeholder={t("contact.emailPlaceholder", lang)}
                  />
                </div>
                <div>
                  <label className="block text-[0.8125rem] text-muted-foreground mb-1.5">
                    {t("contact.details", lang)}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#f5f5f7] border-none focus:ring-2 focus:ring-[#0071e3]/30 outline-none transition-all text-[0.9375rem] resize-none"
                    placeholder={t("contact.detailsPlaceholder", lang)}
                  />
                </div>
                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-foreground text-background py-3.5 rounded-full text-[0.9375rem] hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <>{t("contact.sending", lang)} <Loader2 size={16} className="animate-spin" /></>
                  ) : (
                    <>{t("contact.send", lang)} <Send size={16} /></>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
