import jsPDF from "jspdf";
import "jspdf-autotable";

// Colors matching Nüll Brand
const COLORS = {
  primary: [0, 122, 255], // #007aff - Nüll Blue
  text: [29, 29, 31],     // #1d1d1f - Deep Black
  subtext: [134, 134, 139], // #86868b - Gray
  bg: [245, 245, 247],    // #f5f5f7 - Soft Gray
  white: [255, 255, 255],
};

interface FormData {
  name: string;
  firm: string;
  email: string;
  phone: string;
  city: string;
  selectedServices: string[];
  selectedAreas: string[];
  customAreas: string[];
  topServices: string[];
  websiteDetails: {
    siteType: string;
    architecture: string[];
    extras: string[];
    hasExistingSite: boolean | null;
    existingSiteUrl: string;
    dislikes: string;
  };
  seoDetails: {
    isMapVisible: boolean | null;
    hadSeoBefore: boolean | null;
    targetCities: string[];
  };
  audienceData: {
    audience: string[];
    trustFactors: string;
    targetLanguages: string[];
  };
  designData: {
    style: string;
    tone: number;
    colors: string;
    references: string;
  };
  logisticsData: {
    deadline: string;
    domainStatus: string;
    domainName: string;
    contentReady: string[];
    extraNotes: string;
  };
}

export async function generateOnboardingPdf(data: FormData, lang: string = "de"): Promise<string> {
  // @ts-ignore - jsPDF types can be finicky in certain environments
  const doc = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let currentY = 25;

  // Helpers
  const addTitle = (text: string, size = 22, color = COLORS.text) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(size);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(text, margin, currentY);
    currentY += size * 0.6;
  };

  const addHeader = (text: string) => {
    currentY += 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.text(text.toUpperCase(), margin, currentY);
    
    // Accent line
    doc.setDrawColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, currentY + 2, margin + 15, currentY + 2);
    
    currentY += 12;
  };

  const addField = (label: string, value: string | string[]) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    doc.text(`${label}:`, margin, currentY);
    
    doc.setFont("helvetica", "normal");
    const displayValue = Array.isArray(value) ? value.join(", ") : String(value);
    
    // Handle text wrapping
    const maxWidth = pageWidth - margin * 2 - 45;
    const lines = doc.splitTextToSize(displayValue, maxWidth);
    doc.text(lines, margin + 45, currentY);
    
    currentY += Math.max(lines.length * 5, 7);

    // Page break check
    if (currentY > 270) {
      doc.addPage();
      currentY = 25;
    }
  };

  // 1. Logo & Branding
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  doc.text("nüll", margin, currentY);
  const nullWidth = doc.getTextWidth("nüll");
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text(".", margin + nullWidth, currentY);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(COLORS.subtext[0], COLORS.subtext[1], COLORS.subtext[2]);
  doc.text("Project Kick-off Brief", pageWidth - margin, currentY, { align: "right" });
  currentY += 25;

  // 2. Report Details
  addTitle("Project Strategy Brief");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(COLORS.subtext[0], COLORS.subtext[1], COLORS.subtext[2]);
  doc.text(`Generated: ${new Date().toLocaleDateString(lang === 'tr' ? 'tr-TR' : lang === 'de' ? 'de-DE' : 'en-US')}`, margin, currentY);
  currentY += 15;

  // --- CHAPTER 1: CLIENT IDENTITY ---
  addHeader(lang === 'tr' ? "Müşteri Bilgileri" : lang === 'de' ? "Mandantenprofil" : "Client Profile");
  addField(lang === 'tr' ? "İsim" : lang === 'de' ? "Name" : "Name", data.name);
  addField(lang === 'tr' ? "Hukuk Bürosu" : lang === 'de' ? "Kanzlei" : "Law Firm", data.firm);
  addField(lang === 'tr' ? "E-posta" : lang === 'de' ? "E-Mail" : "Email", data.email);
  addField(lang === 'tr' ? "Telefon" : lang === 'de' ? "Telefon" : "Phone", data.phone);
  addField(lang === 'tr' ? "Şehir" : lang === 'de' ? "Stadt" : "City", data.city);

  // --- CHAPTER 2: STRATEGY & SCOPE ---
  addHeader(lang === 'tr' ? "Strateji ve Kapsam" : lang === 'de' ? "Strategie & Umfang" : "Strategy & Scope");
  const services = data.selectedServices.map(s => {
      if (s === 'website') return lang === 'tr' ? 'Web Sitesi' : 'Website';
      if (s === 'seo') return 'SEO';
      if (s === 'ads') return 'Ads';
      if (s === 'both') return lang === 'tr' ? 'Tam Paket' : 'Full Package';
      return (s || "").toUpperCase();
  });
  addField(lang === 'tr' ? "Hizmetler" : lang === 'de' ? "Leistungen" : "Services", services);
  addField(lang === 'tr' ? "Hukuk Alanları" : lang === 'de' ? "Rechtsgebiete" : "Law Areas", [...data.selectedAreas, ...data.customAreas]);
  addField(lang === 'tr' ? "Önemli Hizmetler" : lang === 'de' ? "Top-Leistungen" : "Top Services", data.topServices);

  // --- CHAPTER 3: WEBSITE DESIGN ---
  if (data.selectedServices.includes('website') || data.selectedServices.includes('both')) {
    addHeader(lang === 'tr' ? "Web Sitesi Vizyonu" : lang === 'de' ? "Website-Vision" : "Website Vision");
    addField(lang === 'tr' ? "Site Tipi" : lang === 'de' ? "Webseite-Typ" : "Site Type", data.websiteDetails.siteType);
    addField(lang === 'tr' ? "Sayfalar" : lang === 'de' ? "Architektur" : "Architecture", data.websiteDetails.architecture);
    addField(lang === 'tr' ? "Ekstralar" : lang === 'de' ? "Extras" : "Extras", data.websiteDetails.extras);
    if (data.websiteDetails.existingSiteUrl) {
      addField(lang === 'tr' ? "Mevcut Site" : lang === 'de' ? "Aktuelle Seite" : "Current Site", data.websiteDetails.existingSiteUrl);
      addField(lang === 'tr' ? "Sorunlar" : lang === 'de' ? "Probleme" : "Issues", data.websiteDetails.dislikes);
    }
  }

  // --- CHAPTER 4: SEO & AUDIENCE ---
  if (data.selectedServices.includes('seo') || data.selectedServices.includes('both')) {
      addHeader(lang === 'tr' ? "SEO ve Hedef Kitle" : lang === 'de' ? "SEO & Zielgruppe" : "SEO & Audience");
      addField(lang === 'tr' ? "Hedef Şehirler" : lang === 'de' ? "Fokus-Städte" : "Target Cities", data.seoDetails.targetCities);
      addField(lang === 'tr' ? "Hedef Kitle" : lang === 'de' ? "Zielgruppe" : "Audience", data.audienceData.audience);
      addField(lang === 'tr' ? "Güven Faktörleri" : lang === 'de' ? "Vertrauensfaktoren" : "Trust Factors", data.audienceData.trustFactors);
      addField(lang === 'tr' ? "Diller" : lang === 'de' ? "Sprachen" : "Languages", data.audienceData.targetLanguages);
  }

  // --- CHAPTER 5: DESIGN PREFERENCES ---
  if (data.selectedServices.includes('website') || data.selectedServices.includes('both')) {
    addHeader(lang === 'tr' ? "Tasarım Tercihleri" : lang === 'de' ? "Design-Präferenzen" : "Design Preferences");
    addField(lang === 'tr' ? "Stil" : lang === 'de' ? "Stil" : "Style", data.designData.style.replace('image', 'Variant '));
    addField(lang === 'tr' ? "Ton (1-100)" : lang === 'de' ? "Tonalität (1-100)" : "Tone (1-100)", String(data.designData.tone));
    addField(lang === 'tr' ? "Renkler" : lang === 'de' ? "Farben" : "Colors", data.designData.colors);
    addField(lang === 'tr' ? "Referanslar" : lang === 'de' ? "Referenzen" : "References", data.designData.references);
  }

  // --- CHAPTER 6: LOGISTICS ---
  addHeader(lang === 'tr' ? "Lojistik" : lang === 'de' ? "Logistik" : "Logistics");
  addField(lang === 'tr' ? "Teslim Tarihi" : lang === 'de' ? "Deadline" : "Deadline", data.logisticsData.deadline);
  addField(lang === 'tr' ? "Domain Durumu" : lang === 'de' ? "Domain-Status" : "Domain Status", data.logisticsData.domainStatus);
  addField(lang === 'tr' ? "Hazır Varlıklar" : lang === 'de' ? "Vorhandene Assets" : "Ready Assets", data.logisticsData.contentReady);
  if (data.logisticsData.extraNotes) {
    addField(lang === 'tr' ? "Ek Notlar" : lang === 'de' ? "Anmerkungen" : "Notes", data.logisticsData.extraNotes);
  }

  // Footer on all pages
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(COLORS.subtext[0], COLORS.subtext[1], COLORS.subtext[2]);
    doc.text(`© ${new Date().getFullYear()} Nüll Studio · Confidentially prepared for ${data.firm || data.name}`, margin, 285);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, 285, { align: "right" });
  }

  return doc.output("datauristring");
}

export function stripBase64(dataUri: string): string {
  return dataUri.split(",")[1];
}
