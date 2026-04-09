import { useState } from "react";
import { Send, MapPin, Loader2, Mail, MessageSquare, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { useLanguage, t } from "./LanguageContext";

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-ea5edff4`;

export function Contact() {
  const { lang } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    city: "",
    practiceArea: "",
    hasWebsite: "no" as "yes" | "no"
  });

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <p className="text-[0.8125rem] tracking-[0.15em] uppercase text-[#0070e3] mb-6 font-semibold">
              {t("contact.label", lang)}
            </p>
            <h2
              className="text-[clamp(1.75rem,8vw,3.25rem)] tracking-[-0.035em] leading-[1.08] mb-8"
              style={{ fontWeight: 600 }}
            >
              {t("contact.title1", lang)}
              <br className="hidden sm:block" />
              {" "}{t("contact.title2", lang)}
            </h2>
            <p className="text-[1.125rem] text-muted-foreground leading-relaxed mb-12 max-w-lg">
              {t("contact.description", lang)}
            </p>

            <div className="space-y-8">
              <div className="group cursor-default">
                <div className="flex items-start gap-4 mb-2">
                  <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#25D366]">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h4 className="text-[1rem] font-semibold mb-1">WhatsApp</h4>
                    <p className="text-[0.875rem] text-muted-foreground">
                      {t("contact.whatsapp.cta", lang)}
                    </p>
                    <a 
                      href="https://wa.me/491627176334" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-block mt-3 text-[0.875rem] text-[#0071e3] font-medium hover:underline"
                    >
                      WhatsApp &rarr;
                    </a>
                  </div>
                </div>
              </div>

              <div className="group cursor-default">
                <div className="flex items-start gap-4 mb-2">
                  <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#ea4335]">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="text-[1rem] font-semibold mb-1">Email</h4>
                    <p className="text-[0.875rem] text-muted-foreground">
                      {t("contact.email.cta", lang)}
                    </p>
                    <a 
                      href="mailto:Halyl@nüll.com" 
                      className="inline-block mt-3 text-[0.875rem] text-[#0071e3] font-medium hover:underline"
                    >
                      Halyl@nüll.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="group cursor-default">
                <div className="flex items-start gap-4 mb-2">
                  <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#0071e3]">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <h4 className="text-[1rem] font-semibold mb-1">Calendly</h4>
                    <p className="text-[0.875rem] text-muted-foreground">
                      {t("contact.calendly.cta", lang)}
                    </p>
                    <a 
                      href="https://calendly.com" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-block mt-3 text-[0.875rem] text-[#0071e3] font-medium hover:underline"
                    >
                      Calendly &rarr;
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div 
                  key="sent"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-black/5 p-12 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-[#34c759]/10 flex items-center justify-center mx-auto mb-6">
                    <Send size={24} className="text-[#34c759]" />
                  </div>
                  <h3 className="text-[1.5rem] mb-3" style={{ fontWeight: 600 }}>
                    {t("contact.sent", lang)}
                  </h3>
                  <p className="text-[1rem] text-muted-foreground">
                    {t("contact.sentDesc", lang)}
                  </p>
                </motion.div>
              ) : (
                <motion.div key="form" className="space-y-8">
                  <form
                    className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-black/5 p-8 md:p-10 space-y-6"
                    onSubmit={handleSubmit}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[0.8125rem] font-medium text-muted-foreground ml-1">
                          {t("contact.name", lang)}
                        </label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full px-5 py-3.5 rounded-2xl bg-[#f5f5f7] border-none focus:ring-2 focus:ring-[#0071e3]/20 outline-none transition-all text-[0.9375rem]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[0.8125rem] font-medium text-muted-foreground ml-1">
                          {t("contact.email", lang)}
                        </label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full px-5 py-3.5 rounded-2xl bg-[#f5f5f7] border-none focus:ring-2 focus:ring-[#0071e3]/20 outline-none transition-all text-[0.9375rem]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[0.8125rem] font-medium text-muted-foreground ml-1">
                          {t("contact.city", lang)}
                        </label>
                        <input
                          type="text"
                          required
                          value={form.city}
                          onChange={(e) => setForm({ ...form, city: e.target.value })}
                          className="w-full px-5 py-3.5 rounded-2xl bg-[#f5f5f7] border-none focus:ring-2 focus:ring-[#0071e3]/20 outline-none transition-all text-[0.9375rem]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[0.8125rem] font-medium text-muted-foreground ml-1">
                          {t("contact.practiceArea", lang)}
                        </label>
                        <input
                          type="text"
                          required
                          value={form.practiceArea}
                          onChange={(e) => setForm({ ...form, practiceArea: e.target.value })}
                          className="w-full px-5 py-3.5 rounded-2xl bg-[#f5f5f7] border-none focus:ring-2 focus:ring-[#0071e3]/20 outline-none transition-all text-[0.9375rem]"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 pt-2">
                      <label className="text-[0.8125rem] font-medium text-muted-foreground ml-1">
                        {t("contact.hasWebsite", lang)}
                      </label>
                      <div className="flex p-1.5 bg-[#f5f5f7] rounded-2xl w-full max-w-[400px]">
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, hasWebsite: "yes" })}
                          className={`flex-1 py-2.5 rounded-xl text-[0.875rem] font-medium transition-all ${
                            form.hasWebsite === "yes" 
                              ? "bg-white text-foreground shadow-sm" 
                              : "text-muted-foreground"
                          }`}
                        >
                          {t("contact.websiteOpt.yes", lang)}
                        </button>
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, hasWebsite: "no" })}
                          className={`flex-1 py-2.5 rounded-xl text-[0.875rem] font-medium transition-all ${
                            form.hasWebsite === "no" 
                              ? "bg-white text-foreground shadow-sm" 
                              : "text-muted-foreground"
                          }`}
                        >
                          {t("contact.websiteOpt.no", lang)}
                        </button>
                      </div>
                    </div>

                    {error && (
                      <p className="text-red-500 text-sm px-1">{error}</p>
                    )}

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-foreground text-background py-4.5 h-14 rounded-full text-[1rem] font-medium hover:bg-foreground/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:pointer-events-none"
                      >
                        {loading ? (
                          <>{t("contact.sending", lang)} <Loader2 size={18} className="animate-spin" /></>
                        ) : (
                          <>{t("contact.send", lang)} <Send size={18} /></>
                        )}
                      </button>
                    </div>
                  </form>
                  
                  <p className="text-[0.875rem] text-muted-foreground text-center leading-relaxed px-4 opacity-70">
                    {t("contact.reassurance", lang)}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
