import { useState } from "react";
import { Send, Loader2, Mail, MessageSquare, Calendar } from "lucide-react";
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
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[0.8125rem] tracking-[0.15em] uppercase text-[#0070e3] mb-6 font-semibold">
            {t("contact.label", lang)}
          </p>
          <h2
            className="text-[clamp(1.75rem,8vw,3.25rem)] tracking-[-0.035em] leading-[1.1] mb-8"
            style={{ fontWeight: 600 }}
          >
            {t("contact.title1", lang)}
            <br className="hidden sm:block" />
            {" "}{t("contact.title2", lang)}
          </h2>
          <p className="text-[1.125rem] text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {t("contact.description", lang)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
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
              <motion.div key="form" className="space-y-12">
                <form
                  className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-black/5 p-8 md:p-12 space-y-6"
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
                    <div className="flex p-1.5 bg-[#f5f5f7] rounded-2xl w-full">
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
                      className="w-full bg-foreground text-background py-4.5 h-14 rounded-full text-[1rem] font-medium hover:bg-foreground/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:pointer-events-none shadow-lg shadow-black/5"
                    >
                      {loading ? (
                        <>{t("contact.sending", lang)} <Loader2 size={18} className="animate-spin" /></>
                      ) : (
                        <>{t("contact.send", lang)} <Send size={18} /></>
                      )}
                    </button>
                  </div>
                  
                  <p className="text-[0.8125rem] text-muted-foreground text-center leading-relaxed opacity-60 px-4">
                    {t("contact.reassurance", lang)}
                  </p>
                </form>

                <div className="pt-8 border-t border-black/5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    <div className="text-center group">
                      <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-[#25D366] mx-auto mb-3 transition-transform group-hover:scale-110">
                        <MessageSquare size={20} />
                      </div>
                      <h4 className="text-[0.9375rem] font-semibold mb-1">WhatsApp</h4>
                      <p className="text-[0.75rem] text-muted-foreground mb-2 px-2">
                        {t("contact.whatsapp.cta", lang)}
                      </p>
                      <a 
                        href="https://wa.me/491627176334" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-[0.8125rem] text-[#0071e3] font-medium hover:underline"
                      >
                        {lang === 'tr' ? 'Mesaj Gönder' : (lang === 'de' ? 'Nachricht senden' : 'Send Message')} &rarr;
                      </a>
                    </div>

                    <div className="text-center group">
                      <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-[#ea4335] mx-auto mb-3 transition-transform group-hover:scale-110">
                        <Mail size={20} />
                      </div>
                      <h4 className="text-[0.9375rem] font-semibold mb-1">Email</h4>
                      <p className="text-[0.75rem] text-muted-foreground mb-2 px-2">
                        {t("contact.email.cta", lang)}
                      </p>
                      <a 
                        href="mailto:Halyl@nüll.com" 
                        className="text-[0.8125rem] text-[#0071e3] font-medium hover:underline"
                      >
                        Halyl@nüll.com
                      </a>
                    </div>

                    <div className="text-center group">
                      <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-[#0071e3] mx-auto mb-3 transition-transform group-hover:scale-110">
                        <Calendar size={20} />
                      </div>
                      <h4 className="text-[0.9375rem] font-semibold mb-1">Calendly</h4>
                      <p className="text-[0.75rem] text-muted-foreground mb-2 px-2">
                        {t("contact.calendly.cta", lang)}
                      </p>
                      <a 
                        href="https://calendly.com/atageldiyewhalyl/kostenlose-kanzlei-beratung" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-[0.8125rem] text-[#0071e3] font-medium hover:underline"
                      >
                        {lang === 'tr' ? 'Randevu Al' : (lang === 'de' ? 'Termin buchen' : 'Book Call')} &rarr;
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
