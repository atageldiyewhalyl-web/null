import { createContext, useContext } from "react";
import type { FieldDef, FieldTranslation, Lang, Questionnaire } from "./types";

export const LANGS: { code: Lang; label: string; name: string }[] = [
  { code: "de", label: "DE", name: "Deutsch" },
  { code: "tr", label: "TR", name: "Türkçe" },
];

export const isLang = (value: unknown): value is Lang => value === "de" || value === "tr";

export type UiText = {
  clientOnboardingFor: (client: string) => string;
  start: string;
  resume: string;
  restart: string;
  autosaveNote: (duration: string) => string;
  welcomeBack: string;
  questionsCount: (n: number) => string;
  beforeStart: string;
  optionalSuffix: string;
  optional: string;
  company: string;
  questionOf: (n: number, total: number) => string;
  sectionDone: (title: string, n: number) => string;
  upNext: string;
  lastStep: string;
  openDrive: string;
  driveLater: string;
  submitFailed: string;
  submitRetry: string;
  submitOffline: string;
  submittedBy: (name: string) => string;
  next: string;
  back: string;
  sending: string;
  saved: string;
  saving: string;
  orPress: string;
  navLabel: string;
  progressLabel: string;
  progressText: (answered: number, total: number) => string;
  languageLabel: string;
  selectUpTo: (max: number) => string;
  selectedOf: (count: number, max: number) => string;
  otherPlaceholder: string;
  otherSrLabel: (option: string) => string;
  rankingHint: string;
  rankPlace: (n: number) => string;
  moveUp: (label: string) => string;
  moveDown: (label: string) => string;
  rankAnnounce: (label: string, position: number, total: number) => string;
  answerPlaceholder: string;
  ctrlEnter: string;
  addCustomLabel: string;
  addCustomPlaceholder: string;
  addCustomButton: string;
  removeEntry: (label: string) => string;
  customAdded: (label: string, position: number) => string;
  customRemoved: (label: string) => string;
  customLimit: (max: number) => string;
  notFoundTitle: string;
  notFoundBody: string;
  errors: ValidationMessages;
};

export type ValidationMessages = {
  selectOne: string;
  selectAtLeastOne: string;
  selectAtMost: (max: number) => string;
  scale: (min: number, max: number) => string;
  required: string;
  name: string;
  email: string;
  emailInvalid: string;
};

export const UI: Record<Lang, UiText> = {
  de: {
    clientOnboardingFor: (client) => `Client Onboarding für ${client}`,
    start: "Fragebogen starten",
    resume: "Fortsetzen",
    restart: "Neu beginnen",
    autosaveNote: (duration) => `${duration}. Ihr Fortschritt wird automatisch gespeichert.`,
    welcomeBack: "Willkommen zurück. Ihre bisherigen Antworten sind gespeichert.",
    questionsCount: (n) => `${n} Fragen`,
    beforeStart: "Bevor es losgeht",
    optionalSuffix: "(optional)",
    optional: "Optional",
    company: "Unternehmen",
    questionOf: (n, total) => `Frage ${n} von ${total}`,
    sectionDone: (title, n) => `${title}: alle ${n} Fragen beantwortet`,
    upNext: "Als Nächstes",
    lastStep: "Letzter Schritt",
    openDrive: "Google-Drive-Ordner öffnen",
    driveLater: "Den Link zum Google-Drive-Ordner senden wir Ihnen separat zu.",
    submitFailed: "Der Fragebogen konnte nicht gesendet werden.",
    submitRetry: "Ihre Antworten sind gespeichert. Bitte versuchen Sie es in einem Moment erneut.",
    submitOffline:
      "Sie scheinen offline zu sein. Ihre Antworten sind gespeichert – senden Sie den Fragebogen, sobald die Verbindung wieder steht.",
    submittedBy: (name) => `, übermittelt von ${name}`,
    next: "Weiter",
    back: "Zurück",
    sending: "Wird gesendet",
    saved: "Gespeichert",
    saving: "Speichert…",
    orPress: "drücken",
    navLabel: "Fragebogen-Navigation",
    progressLabel: "Fortschritt",
    progressText: (answered, total) => `${answered} von ${total} Fragen beantwortet`,
    languageLabel: "Sprache",
    selectUpTo: (max) => `Bis zu ${max} auswählen`,
    selectedOf: (count, max) => `${count} von ${max} ausgewählt`,
    otherPlaceholder: "Bitte kurz angeben (optional)",
    otherSrLabel: (option) => `${option}: bitte angeben (optional)`,
    rankingHint: "Ziehen Sie die Einträge an den Punkten oder nutzen Sie die Pfeile.",
    rankPlace: (n) => `Platz ${n}: `,
    moveUp: (label) => `${label} nach oben verschieben`,
    moveDown: (label) => `${label} nach unten verschieben`,
    rankAnnounce: (label, position, total) => `${label} ist jetzt auf Platz ${position} von ${total}.`,
    answerPlaceholder: "Ihre Antwort",
    ctrlEnter: "Weiter mit ⌘/Strg + Enter",
    addCustomLabel: "Fehlt eine Gruppe? Fügen Sie sie hinzu.",
    addCustomPlaceholder: "z. B. Hotels, Hausverwaltungen",
    addCustomButton: "Hinzufügen",
    removeEntry: (label) => `${label} entfernen`,
    customAdded: (label, position) => `${label} hinzugefügt, Platz ${position}.`,
    customRemoved: (label) => `${label} entfernt.`,
    customLimit: (max) => `Sie können bis zu ${max} eigene Einträge hinzufügen.`,
    notFoundTitle: "Dieser Fragebogen existiert nicht",
    notFoundBody: "Bitte prüfen Sie den Link, den wir Ihnen geschickt haben, oder schreiben Sie uns an info@nüll.com.",
    errors: {
      selectOne: "Bitte wählen Sie eine Antwort aus.",
      selectAtLeastOne: "Bitte wählen Sie mindestens eine Antwort aus.",
      selectAtMost: (max) => `Bitte wählen Sie höchstens ${max} Antworten aus.`,
      scale: (min, max) => `Bitte wählen Sie einen Wert zwischen ${min} und ${max}.`,
      required: "Bitte füllen Sie dieses Feld aus.",
      name: "Bitte geben Sie Ihren Namen an.",
      email: "Bitte geben Sie Ihre E-Mail-Adresse an.",
      emailInvalid: "Bitte prüfen Sie die E-Mail-Adresse.",
    },
  },
  tr: {
    clientOnboardingFor: (client) => `${client} için Client Onboarding`,
    start: "Formu başlat",
    resume: "Devam et",
    restart: "Baştan başla",
    autosaveNote: (duration) => `${duration}. İlerlemeniz otomatik olarak kaydedilir.`,
    welcomeBack: "Tekrar hoş geldiniz. Önceki yanıtlarınız kaydedildi.",
    questionsCount: (n) => `${n} soru`,
    beforeStart: "Başlamadan önce",
    optionalSuffix: "(isteğe bağlı)",
    optional: "İsteğe bağlı",
    company: "Şirket",
    questionOf: (n, total) => `Soru ${n} / ${total}`,
    sectionDone: (title, n) => `${title}: ${n} sorunun tümü yanıtlandı`,
    upNext: "Sıradaki",
    lastStep: "Son adım",
    openDrive: "Google Drive klasörünü aç",
    driveLater: "Google Drive klasörünün linkini size ayrıca göndereceğiz.",
    submitFailed: "Form gönderilemedi.",
    submitRetry: "Yanıtlarınız kaydedildi. Lütfen birazdan tekrar deneyin.",
    submitOffline: "İnternet bağlantınız yok gibi görünüyor. Yanıtlarınız kaydedildi – bağlantı geri geldiğinde formu gönderin.",
    submittedBy: (name) => `, gönderen: ${name}`,
    next: "İleri",
    back: "Geri",
    sending: "Gönderiliyor",
    saved: "Kaydedildi",
    saving: "Kaydediliyor…",
    orPress: "tuşuna basın",
    navLabel: "Form navigasyonu",
    progressLabel: "İlerleme",
    progressText: (answered, total) => `${total} sorudan ${answered} tanesi yanıtlandı`,
    languageLabel: "Dil",
    selectUpTo: (max) => `En fazla ${max} seçim`,
    selectedOf: (count, max) => `${count} / ${max} seçildi`,
    otherPlaceholder: "Lütfen kısaca belirtin (isteğe bağlı)",
    otherSrLabel: (option) => `${option}: lütfen belirtin (isteğe bağlı)`,
    rankingHint: "Öğeleri noktalardan tutup sürükleyin veya okları kullanın.",
    rankPlace: (n) => `${n}. sıra: `,
    moveUp: (label) => `${label} yukarı taşı`,
    moveDown: (label) => `${label} aşağı taşı`,
    rankAnnounce: (label, position, total) => `${label} artık ${total} içinde ${position}. sırada.`,
    answerPlaceholder: "Yanıtınız",
    ctrlEnter: "⌘/Ctrl + Enter ile devam edin",
    addCustomLabel: "Listede olmayan bir grup mu var? Ekleyin.",
    addCustomPlaceholder: "örn. Oteller, Site yönetimleri",
    addCustomButton: "Ekle",
    removeEntry: (label) => `${label} kaldır`,
    customAdded: (label, position) => `${label} eklendi, ${position}. sırada.`,
    customRemoved: (label) => `${label} kaldırıldı.`,
    customLimit: (max) => `En fazla ${max} kendi girişinizi ekleyebilirsiniz.`,
    notFoundTitle: "Bu form bulunamadı",
    notFoundBody: "Lütfen size gönderdiğimiz linki kontrol edin veya info@nüll.com adresine yazın.",
    errors: {
      selectOne: "Lütfen bir yanıt seçin.",
      selectAtLeastOne: "Lütfen en az bir yanıt seçin.",
      selectAtMost: (max) => `Lütfen en fazla ${max} yanıt seçin.`,
      scale: (min, max) => `Lütfen ${min} ile ${max} arasında bir değer seçin.`,
      required: "Lütfen bu alanı doldurun.",
      name: "Lütfen adınızı girin.",
      email: "Lütfen e-posta adresinizi girin.",
      emailInvalid: "Lütfen e-posta adresini kontrol edin.",
    },
  },
};

export const UiTextContext = createContext<UiText>(UI.de);
export const useUiText = () => useContext(UiTextContext);

function localizeField<F extends FieldDef>(field: F, t?: FieldTranslation): F {
  if (!t) return field;
  const next: Record<string, unknown> = { ...field, label: t.label ?? field.label, help: t.help ?? field.help };
  if ("group" in field && t.group) next.group = t.group;
  if ("options" in field && t.options) {
    next.options = field.options.map((o, i) => ({ ...o, label: t.options?.[i] ?? o.label }));
  }
  if (field.type === "scale" && t.anchors) next.anchors = { ...field.anchors, ...t.anchors };
  if ((field.type === "text" || field.type === "longtext") && t.placeholder) next.placeholder = t.placeholder;
  return next as F;
}

/** Returns the questionnaire with display text swapped for `lang`. Ids, values and logic are untouched. */
export function localizeQuestionnaire(q: Questionnaire, lang: Lang): Questionnaire {
  const t = lang === "de" ? undefined : q.translations?.[lang];
  if (!t) return q;
  return {
    ...q,
    title: t.title ?? q.title,
    intro: { ...q.intro, ...t.intro },
    contact: {
      ...q.contact,
      title: t.contact?.title ?? q.contact.title,
      help: t.contact?.help ?? q.contact.help,
      fields: q.contact.fields.map((f) => ({ ...f, label: t.contact?.fields?.[f.key] ?? f.label })),
    },
    sections: q.sections.map((section) => {
      const st = t.sections?.[section.key];
      return {
        ...section,
        title: st?.title ?? section.title,
        intro: section.intro && { ...section.intro, ...st?.intro },
        questions: section.questions.map((question) => {
          const qt = t.questions?.[question.id];
          return {
            ...localizeField(question, qt),
            followUps: question.followUps?.map((f) => localizeField(f, qt?.followUps?.[f.key])),
          };
        }),
      };
    }),
    final: { ...q.final, ...t.final },
    success: { ...q.success, ...t.success },
  };
}
