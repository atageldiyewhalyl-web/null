import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import NewLandingSpinnerSection from "../components/NewLandingSpinnerSection";
import { MinimalistHero } from "../components/ui/minimalist-hero";
import hammerForLawyer from "../assets/hammer for lawyer.webp";

export function meta() {
  const title = "Kanzlei-Websites für mehr Mandatsanfragen | nüll.";
  const description =
    "Moderne Kanzlei-Websites mit klarer Struktur, lokaler Sichtbarkeit und starkem Fokus auf Mandantenanfragen.";
  const url = "https://xn--nll-hoa.com/lawyers";
  const image = "https://xn--nll-hoa.com/og-image.png";

  return [
    { title },
    { name: "description", content: description },
    { name: "robots", content: "index, follow, max-image-preview:large" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: "nüll. logo on a minimal branded background" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:image", content: image },
    { name: "twitter:image:alt", content: "nüll. logo on a minimal branded background" },
    { tagName: "link", rel: "canonical", href: url },
  ];
}

export default function LawyersRoute() {
  return (
    <main className="relative isolate bg-white">
      <section className="relative z-0 h-[200vh]">
        <div className="sticky top-0 z-0 h-screen overflow-hidden bg-white">
          <MinimalistHero
            logoText="nüll."
            navLinks={[
              { label: "BLOG", href: "/blog" },
              { label: "CONTACT", href: "#contact" },
              { label: "LEISTUNGEN", href: "#services" },
              { label: "PORTFOLIO", href: "#portfolio" },
            ]}
            mainText="Moderne Kanzlei-Websites, die sichtbar machen und Mandanten überzeugen."
            readMoreLink="#"
            imageSrc={hammerForLawyer}
            imageAlt="Lawyer hammer over a blue circle."
            imageClassName="w-[18.5rem] translate-x-16 translate-y-20 md:w-[34rem] md:translate-x-36 md:translate-y-36 lg:w-[40rem] lg:translate-x-44 lg:translate-y-40"
            overlayText={{
              part1: "gefunden werden.",
              part2: "mandate gewinnen.",
            }}
            overlayTextClassName="text-[clamp(2.65rem,11.5vw,3.9rem)] md:text-[clamp(3.35rem,4.75vw,5.35rem)]"
            socialLinks={[
              { icon: Facebook, href: "#" },
              { icon: Instagram, href: "#" },
              { icon: Twitter, href: "#" },
              { icon: Linkedin, href: "#" },
            ]}
            locationText="Mannheim, DE"
          />
        </div>
      </section>
      <div className="relative z-20 -mt-[100vh] min-h-screen bg-white">
        <NewLandingSpinnerSection
          statsHeading="Sichtbarkeit wird erst wertvoll, wenn daraus Mandatsanfragen entstehen"
          statsItems={[
            {
              customValue: "97%",
              label: "Mehr Klicks",
              description:
                "Durch klare SEO-Struktur und Seiten nach echter Suchintention.",
            },
            {
              customValue: "95%",
              label: "Mehr Impressionen",
              description:
                "Mehr Sichtbarkeit bei relevanten Suchanfragen rund um Rechtsgebiete.",
            },
            {
              customValue: "€6.000+",
              label: "Mandatswert durch eine Seite",
              description:
                "Ein gezielter Entry-Point kann konkrete Anfragen auslösen.",
            },
            {
              customValue: "Klarere Wege",
              label: "Zur Anfrage",
              description:
                "Besucher verstehen schneller, warum sie Kontakt aufnehmen sollten.",
            },
          ]}
        />
      </div>
    </main>
  );
}
